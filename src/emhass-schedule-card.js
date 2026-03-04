/**
 * emhass-schedule-card.js — Main LitElement component
 * Custom Lovelace card for Home Assistant
 * Gantt-style timeline for EMHASS deferrable load schedules
 */
import { LitElement, html, css } from 'lit';
import {
  parseSchedule,
  detectSlotDuration,
  computeLoadSummary,
  parsePvForecast,
} from './models/schedule-parser.js';
import './components/gantt-canvas.js';
import './components/summary-row.js';
import './editor/config-editor.js';
import en from './localize/en.json';
import fr from './localize/fr.json';

const LOCALES = { en, fr };
const CARD_VERSION = typeof __BUILD_VERSION__ !== 'undefined' ? __BUILD_VERSION__ : '0.0.0-dev';

console.info(
  `%c emhass-schedule-card %c v${CARD_VERSION} `,
  'color: #fff; background: #4CAF50; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;',
  'color: #4CAF50; background: #e8f5e9; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;',
);

class EmhassScheduleCard extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
    _historyCache: { state: true },
    _pvActualData: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }
    ha-card {
      padding: 16px;
      overflow: hidden;
    }
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
    }
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
    }
    .card-subtitle {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
    }
    .no-data {
      text-align: center;
      padding: 24px;
      color: var(--secondary-text-color, #aaa);
      font-size: 14px;
    }
    .no-data ha-icon {
      display: block;
      margin: 0 auto 8px;
      --mdc-icon-size: 40px;
      opacity: 0.4;
    }
  `;

  // ── HA integration ──

  static getConfigElement() {
    return document.createElement('emhass-schedule-card-editor');
  }

  static getStubConfig() {
    return {
      title: 'EMHASS Schedule',
      show_pv: true,
      show_summary: true,
      hours: 24,
      pv_entity: 'sensor.solcast_pv_forecast_forecast_today',
      pv_attribute: 'detailedForecast',
      pv_field: 'pv_estimate',
      loads: [
        {
          entity: 'sensor.p_deferrable0',
          name: 'Load 0',
          icon: 'mdi:flash',
          color: '#2196F3',
          nominal_power: 0,
        },
      ],
    };
  }

  setConfig(config) {
    if (!config.loads || !Array.isArray(config.loads) || config.loads.length === 0) {
      throw new Error('Please define at least one load');
    }
    this._config = {
      title: 'EMHASS Schedule',
      show_pv: true,
      show_summary: true,
      hours: 24,
      pv_entity: '',
      pv_attribute: 'detailedForecast',
      pv_field: 'pv_estimate',
      language: 'auto',
      ...config,
    };
  }

  getCardSize() {
    const numLoads = this._config?.loads?.length || 1;
    const base = 3 + numLoads; // header + lanes
    return this._config?.show_summary ? base + 2 : base;
  }

  // ── Localization ──

  get _lang() {
    const cfgLang = this._config?.language;
    if (cfgLang && cfgLang !== 'auto') return cfgLang;
    const haLang = this.hass?.language || 'en';
    return LOCALES[haLang] ? haLang : 'en';
  }

  _localize(key) {
    const parts = key.split('.');
    let obj = LOCALES[this._lang] || LOCALES.en;
    for (const p of parts) {
      obj = obj?.[p];
    }
    return obj || key;
  }

  // ── History fetch (actual consumption) ──

  updated(changedProperties) {
    if (changedProperties.has('hass') && this.hass && this._config) {
      const today = new Date().toDateString();
      if (today !== this._historyDay) {
        this._historyDay = today;
        this._historyCache = null;
        this._fetchHistory();
      }
    }
  }

  async _fetchHistory() {
    if (!this._config?.loads) return;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const todayIso = start.toISOString();
    const newCache = new Map();
    const tasks = this._config.loads.map(async loadCfg => {
      try {
        const result = await this.hass.callApi(
          'GET',
          `history/period/${todayIso}?filter_entity_id=${loadCfg.entity}&minimal_response=true&no_attributes=true`,
        );
        newCache.set(loadCfg.entity, this._parseHistory(result?.[0] || []));
      } catch (_e) {
        // history unavailable — silently ignore
      }
    });

    if (this._config.pv_actual_entity) {
      tasks.push(
        (async () => {
          try {
            const result = await this.hass.callApi(
              'GET',
              `history/period/${todayIso}?filter_entity_id=${this._config.pv_actual_entity}&minimal_response=true&no_attributes=true`,
            );
            this._pvActualData = this._parsePvHistory(result?.[0] || []);
          } catch (_e) {
            // ignore
          }
        })(),
      );
    }

    await Promise.all(tasks);
    this._historyCache = newCache;
  }

  _parsePvHistory(states) {
    if (!states?.length) return [];
    return states
      .map(s => ({
        timestamp: new Date(s.last_changed).getTime(),
        power: parseFloat(s.state) || 0,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  _parseHistory(states) {
    if (!states || states.length === 0) return [];
    const THRESHOLD = 50; // W — ignore parasitic readings
    const SLOT_MS = 30 * 60000;
    const slotMap = new Map();

    for (let i = 0; i < states.length; i++) {
      const power = parseFloat(states[i].state) || 0;
      if (power <= THRESHOLD) continue;
      const t = new Date(states[i].last_changed).getTime();
      const end =
        i < states.length - 1 ? new Date(states[i + 1].last_changed).getTime() : Date.now();

      let slotStart = Math.floor(t / SLOT_MS) * SLOT_MS;
      while (slotStart < end) {
        slotMap.set(slotStart, true);
        slotStart += SLOT_MS;
      }
    }

    return Array.from(slotMap.entries())
      .map(([timestamp, active]) => ({ timestamp, active }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  // ── Theme detection ──

  get _isDark() {
    return this.hass?.themes?.darkMode !== false;
  }

  // ── Tariff helpers ──

  _getTariffRate(peakOrOffpeak) {
    const cfg = this._config?.tariff;
    if (!cfg) return null;
    const entityKey = peakOrOffpeak === 'peak' ? 'peak_entity' : 'offpeak_entity';
    const staticKey = peakOrOffpeak === 'peak' ? 'peak' : 'offpeak';
    if (cfg[entityKey]) {
      return parseFloat(this.hass?.states?.[cfg[entityKey]]?.state) || null;
    }
    return cfg[staticKey] ?? null;
  }

  _computeCost(slots, slotDuration, nominalPower) {
    const cfg = this._config?.tariff;
    if (!cfg) return null;

    const tariffPeak = this._getTariffRate('peak');
    const tariffOffpeak = this._getTariffRate('offpeak');
    if (tariffPeak === null) return null;

    const peakHours = cfg.peak_hours ?? [6, 22];
    const slotDurationH = slotDuration / 60;

    let kWh = 0;
    let costOptimized = 0;

    for (const slot of slots) {
      if (slot.power <= 0.1) continue;
      const powerKW = slot.power / 1000;
      const slotKWh = powerKW * slotDurationH;
      kWh += slotKWh;

      const date = new Date(slot.timestamp);
      const hour = date.getHours();
      const isPeak = hour >= peakHours[0] && hour < peakHours[1];
      const rate = isPeak ? tariffPeak : (tariffOffpeak ?? tariffPeak);
      costOptimized += slotKWh * rate;
    }

    const nominalKW = nominalPower / 1000;
    const hoursPlanned = kWh / (nominalKW || 1);
    const costBaseline = hoursPlanned * nominalKW * tariffPeak;
    const savings = costBaseline - costOptimized;

    return { kWh, costOptimized, costBaseline, savings };
  }

  // ── Compute load data ──

  get _loadsData() {
    if (!this.hass || !this._config?.loads) return [];

    return this._config.loads.map(loadCfg => {
      const entity = this.hass.states[loadCfg.entity];
      if (!entity) {
        return {
          ...loadCfg,
          entityId: loadCfg.entity,
          slots: [],
          slotDuration: 30,
          summary: { hoursPlanned: 0, activeSlots: 0, totalSlots: 0, maxPower: 0 },
          currentPower: 0,
          cost: null,
          actualSlots: null,
        };
      }

      const schedule = entity.attributes?.deferrables_schedule;
      const fieldName = loadCfg.entity; // parseSchedule strips "sensor." prefix
      const slots = parseSchedule(schedule, fieldName);
      const slotDuration = detectSlotDuration(slots);
      const summary = computeLoadSummary(slots, slotDuration);
      const currentPower = parseFloat(entity.state) || 0;
      const cost = this._computeCost(slots, slotDuration, loadCfg.nominal_power || 0);
      const actualSlots = this._historyCache?.get(loadCfg.entity) ?? null;

      return {
        ...loadCfg,
        entityId: loadCfg.entity,
        slots,
        slotDuration,
        summary,
        currentPower,
        cost,
        actualSlots,
      };
    });
  }

  // ── PV data ──

  get _pvMpcData() {
    const entityId = this._config?.pv_mpc_entity;
    if (!entityId) return [];
    const forecasts = this.hass?.states?.[entityId]?.attributes?.forecasts;
    return parsePvForecast(forecasts || [], 'p_pv_forecast', 'date', 1);
  }

  get _pvData() {
    if (!this._config?.show_pv || !this._config?.pv_entity) return { data: [], max: 0 };

    const entity = this.hass?.states?.[this._config.pv_entity];
    if (!entity) return { data: [], max: 0 };

    const forecast = entity.attributes?.[this._config.pv_attribute || 'detailedForecast'];
    const data = parsePvForecast(forecast, this._config.pv_field || 'pv_estimate');

    const solcastMax = data.reduce((m, d) => Math.max(m, d.power), 0);
    const mpcMax = this._pvMpcData.reduce((m, d) => Math.max(m, d.power), 0);
    const actualMax = (this._pvActualData || []).reduce((m, d) => Math.max(m, d.power), 0);
    return { data, max: Math.max(solcastMax, mpcMax, actualMax) };
  }

  // ── Render ──

  render() {
    if (!this._config) return html``;

    const loads = this._loadsData;
    const hasData = loads.some(l => l.slots.length > 0);
    const pv = this._pvData;
    const title = this._config.title || this._localize('card.title');

    return html`
      <ha-card>
        <div class="card-header">
          <div>
            <div class="card-title">${title}</div>
          </div>
        </div>

        ${hasData
          ? html`
              <gantt-canvas
                .loads=${loads}
                .pvData=${pv.data}
                .pvMax=${pv.max}
                .pvMpcData=${this._pvMpcData}
                .pvActualData=${this._pvActualData || []}
                .showPv=${this._config.show_pv !== false}
                .isDark=${this._isDark}
              ></gantt-canvas>

              ${this._config.show_summary !== false
                ? html`
                    <summary-row
                      .loads=${loads}
                      .localize=${key => this._localize(key)}
                    ></summary-row>
                  `
                : ''}
            `
          : html`
              <div class="no-data">
                <ha-icon icon="mdi:calendar-blank-outline"></ha-icon>
                ${this._localize('card.no_data')}
              </div>
            `}
      </ha-card>
    `;
  }
}

customElements.define('emhass-schedule-card', EmhassScheduleCard);

// Register in HA's custom card registry
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'emhass-schedule-card',
  name: 'EMHASS Schedule Card',
  description: 'Gantt-style timeline for EMHASS deferrable load schedules with PV forecast overlay',
  preview: true,
  documentationURL: 'https://github.com/wilsto/emhass-schedule-card',
});
