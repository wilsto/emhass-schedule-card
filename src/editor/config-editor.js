/**
 * config-editor.js — Visual GUI config editor for HA
 * Uses HA built-in components (ha-textfield, ha-entity-picker, ha-switch).
 */
import { LitElement, html, css } from 'lit';

const DEFAULT_COLORS = ['#2196F3', '#00BCD4', '#4CAF50', '#FF9800', '#9C27B0', '#F44336'];

class EmhassScheduleCardEditor extends LitElement {
  static properties = {
    hass: { type: Object },
    _config: { state: true },
  };

  static styles = css`
    :host {
      display: block;
    }
    .editor-section {
      margin-bottom: 16px;
    }
    .editor-section h3 {
      font-size: 14px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
      margin: 0 0 8px 0;
    }
    .load-item {
      background: rgba(255, 255, 255, 0.04);
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 8px;
    }
    .load-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }
    .load-header span {
      font-weight: 600;
      font-size: 13px;
      color: var(--primary-text-color, #fff);
    }
    .remove-btn {
      cursor: pointer;
      color: var(--error-color, #f44336);
      background: none;
      border: none;
      font-size: 18px;
      padding: 4px;
    }
    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }
    .add-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 4px;
      width: 100%;
      padding: 8px;
      border: 1px dashed var(--divider-color, #444);
      border-radius: 8px;
      background: none;
      color: var(--primary-color, #3b82f6);
      cursor: pointer;
      font-size: 13px;
    }
    .add-btn:hover {
      background: rgba(255, 255, 255, 0.04);
    }
    ha-textfield,
    ha-entity-picker {
      display: block;
      width: 100%;
    }
    .color-picker {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .color-swatch {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid var(--divider-color, #444);
      cursor: pointer;
    }
    input[type='color'] {
      width: 0;
      height: 0;
      opacity: 0;
      position: absolute;
    }
  `;

  setConfig(config) {
    this._config = { ...config };
  }

  _fireConfigChanged() {
    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: this._config },
      }),
    );
  }

  _updateConfig(key, value) {
    this._config = { ...this._config, [key]: value };
    this._fireConfigChanged();
  }

  _updateLoad(index, key, value) {
    const loads = [...(this._config.loads || [])];
    loads[index] = { ...loads[index], [key]: value };
    this._config = { ...this._config, loads };
    this._fireConfigChanged();
  }

  _addLoad() {
    const loads = [...(this._config.loads || [])];
    const idx = loads.length;
    loads.push({
      entity: '',
      name: `Load ${idx}`,
      icon: 'mdi:flash',
      color: DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
      nominal_power: 0,
    });
    this._config = { ...this._config, loads };
    this._fireConfigChanged();
  }

  _updateTariff(key, value) {
    const tariff = { ...(this._config.tariff || {}) };
    if (value === undefined || value === '') {
      delete tariff[key];
    } else {
      tariff[key] = value;
    }
    this._config = { ...this._config, tariff: Object.keys(tariff).length ? tariff : undefined };
    this._fireConfigChanged();
  }

  _updatePeakHours(index, value) {
    const current = this._config.tariff?.peak_hours ?? [6, 22];
    const updated = [...current];
    updated[index] = value;
    this._updateTariff('peak_hours', updated);
  }

  _removeLoad(index) {
    const loads = [...(this._config.loads || [])];
    loads.splice(index, 1);
    this._config = { ...this._config, loads };
    this._fireConfigChanged();
  }

  render() {
    if (!this._config) return html``;

    return html`
      <div class="editor-section">
        <ha-textfield
          label="Title"
          .value=${this._config.title || ''}
          @input=${e => this._updateConfig('title', e.target.value)}
        ></ha-textfield>
      </div>

      <div class="editor-section">
        <div class="field-row">
          <ha-textfield
            label="Time horizon (hours)"
            type="number"
            .value=${String(this._config.hours || 24)}
            @input=${e => this._updateConfig('hours', parseInt(e.target.value) || 24)}
          ></ha-textfield>
        </div>
        <ha-switch
          .checked=${this._config.show_pv !== false}
          @change=${e => this._updateConfig('show_pv', e.target.checked)}
          >Show PV forecast</ha-switch
        >
        <ha-switch
          .checked=${this._config.show_summary !== false}
          @change=${e => this._updateConfig('show_summary', e.target.checked)}
          >Show load summary</ha-switch
        >
      </div>

      <div class="editor-section">
        <h3>PV Forecast</h3>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.pv_entity || ''}
          label="PV entity"
          @value-changed=${e => this._updateConfig('pv_entity', e.detail.value)}
        ></ha-entity-picker>
        <div class="field-row" style="margin-top: 8px">
          <ha-textfield
            label="Attribute"
            .value=${this._config.pv_attribute || 'detailedForecast'}
            @input=${e => this._updateConfig('pv_attribute', e.target.value)}
          ></ha-textfield>
          <ha-textfield
            label="Field"
            .value=${this._config.pv_field || 'pv_estimate'}
            @input=${e => this._updateConfig('pv_field', e.target.value)}
          ></ha-textfield>
        </div>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.pv_mpc_entity || ''}
          label="MPC EMHASS forecast entity (optional)"
          style="display:block;margin-top:8px"
          @value-changed=${e => this._updateConfig('pv_mpc_entity', e.detail.value)}
        ></ha-entity-picker>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${this._config.pv_actual_entity || ''}
          label="Actual PV production entity (optional)"
          style="display:block;margin-top:8px"
          @value-changed=${e => this._updateConfig('pv_actual_entity', e.detail.value)}
        ></ha-entity-picker>
      </div>

      <div class="editor-section">
        <h3>Tariff (optional)</h3>
        <div class="field-row">
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.tariff?.peak_entity || ''}
            label="Peak rate entity (€/kWh)"
            @value-changed=${e => this._updateTariff('peak_entity', e.detail.value)}
          ></ha-entity-picker>
          <ha-entity-picker
            .hass=${this.hass}
            .value=${this._config.tariff?.offpeak_entity || ''}
            label="Off-peak rate entity (€/kWh)"
            @value-changed=${e => this._updateTariff('offpeak_entity', e.detail.value)}
          ></ha-entity-picker>
        </div>
        <div class="field-row">
          <ha-textfield
            label="Peak rate €/kWh (fallback)"
            type="number"
            .value=${String(this._config.tariff?.peak || '')}
            @input=${e => this._updateTariff('peak', parseFloat(e.target.value) || undefined)}
          ></ha-textfield>
          <ha-textfield
            label="Off-peak rate €/kWh (fallback)"
            type="number"
            .value=${String(this._config.tariff?.offpeak || '')}
            @input=${e => this._updateTariff('offpeak', parseFloat(e.target.value) || undefined)}
          ></ha-textfield>
        </div>
        <ha-textfield
          label="Peak hours start (default 6)"
          type="number"
          .value=${String(this._config.tariff?.peak_hours?.[0] ?? 6)}
          @input=${e => this._updatePeakHours(0, parseInt(e.target.value) || 6)}
        ></ha-textfield>
        <ha-textfield
          label="Peak hours end (default 22)"
          type="number"
          .value=${String(this._config.tariff?.peak_hours?.[1] ?? 22)}
          @input=${e => this._updatePeakHours(1, parseInt(e.target.value) || 22)}
          style="margin-top: 8px"
        ></ha-textfield>
      </div>

      <div class="editor-section">
        <h3>Loads</h3>
        ${(this._config.loads || []).map((load, i) => this._renderLoadEditor(load, i))}
        <button class="add-btn" @click=${this._addLoad}>+ Add load</button>
      </div>
    `;
  }

  _renderLoadEditor(load, index) {
    return html`
      <div class="load-item">
        <div class="load-header">
          <span>${load.name || `Load ${index}`}</span>
          <button class="remove-btn" @click=${() => this._removeLoad(index)}>×</button>
        </div>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${load.entity || ''}
          label="Entity"
          @value-changed=${e => this._updateLoad(index, 'entity', e.detail.value)}
        ></ha-entity-picker>
        <div class="field-row" style="margin-top: 8px">
          <ha-textfield
            label="Name"
            .value=${load.name || ''}
            @input=${e => this._updateLoad(index, 'name', e.target.value)}
          ></ha-textfield>
          <ha-textfield
            label="Nominal power (W)"
            type="number"
            .value=${String(load.nominal_power || 0)}
            @input=${e => this._updateLoad(index, 'nominal_power', parseInt(e.target.value) || 0)}
          ></ha-textfield>
        </div>
        <div class="field-row">
          <ha-textfield
            label="Icon"
            .value=${load.icon || 'mdi:flash'}
            @input=${e => this._updateLoad(index, 'icon', e.target.value)}
          ></ha-textfield>
          <div class="color-picker">
            <div
              class="color-swatch"
              style="background: ${load.color || '#4CAF50'}"
              @click=${() => this.renderRoot.querySelector(`#color-${index}`)?.click()}
            ></div>
            <input
              type="color"
              id="color-${index}"
              .value=${load.color || '#4CAF50'}
              @input=${e => this._updateLoad(index, 'color', e.target.value)}
            />
            <span style="font-size: 12px; color: var(--secondary-text-color)"
              >${load.color || '#4CAF50'}</span
            >
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('emhass-schedule-card-editor', EmhassScheduleCardEditor);
