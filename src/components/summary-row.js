/**
 * summary-row.js — Load summary stats below the Gantt chart
 * Shows per-load: name, status (ON/OFF), hours planned, power.
 */
import { LitElement, html, css } from 'lit';

class SummaryRow extends LitElement {
  static properties = {
    loads: { type: Array },
    localize: { type: Object },
  };

  static styles = css`
    :host {
      display: block;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 8px;
      margin-top: 12px;
    }
    .load-summary {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 10px;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.04);
    }
    .load-indicator {
      width: 4px;
      height: 28px;
      border-radius: 2px;
      flex-shrink: 0;
    }
    .load-info {
      flex: 1;
      min-width: 0;
    }
    .load-name {
      font-size: 12px;
      font-weight: 600;
      color: var(--primary-text-color, #fff);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .load-details {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      display: flex;
      gap: 8px;
    }
    .load-status {
      font-weight: 600;
    }
    .load-status.on {
      color: #4caf50;
    }
    .load-status.off {
      color: var(--secondary-text-color, #666);
    }
    .load-cost {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .cost-savings {
      color: #4caf50;
      font-weight: 600;
    }
    .load-actual {
      font-size: 11px;
      color: var(--secondary-text-color, #aaa);
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .compliance-high {
      color: #4caf50;
      font-weight: 600;
    }
    .compliance-mid {
      color: #ff9800;
      font-weight: 600;
    }
    .compliance-low {
      color: #f44336;
      font-weight: 600;
    }
  `;

  constructor() {
    super();
    this.loads = [];
    this.localize = () => '';
  }

  render() {
    if (!this.loads?.length) return html``;

    return html`
      <div class="summary-grid">${this.loads.map(load => this._renderLoadSummary(load))}</div>
    `;
  }

  _renderLoadSummary(load) {
    const isOn = load.currentPower > 0.1;
    const statusText = isOn ? this.localize('summary.on') : this.localize('summary.off');
    const statusClass = isOn ? 'on' : 'off';
    const hoursText = `${load.summary.hoursPlanned}h ${this.localize('summary.planned')}`;
    const powerText = isOn ? `${Math.round(load.currentPower)}W` : '';

    const cost = load.cost;
    const costLine = cost
      ? html`
          <div class="load-cost">
            <span>${cost.kWh.toFixed(2)} ${this.localize('summary.kwh')}</span>
            <span>·</span>
            <span>${cost.costOptimized.toFixed(2)}€</span>
            ${cost.savings > 0.005
              ? html`<span>·</span><span class="cost-savings">+${cost.savings.toFixed(2)}€</span>`
              : ''}
          </div>
        `
      : '';

    const actualSlots = load.actualSlots;
    const plannedHours = load.summary.hoursPlanned;
    let actualLine = '';
    if (actualSlots !== null && plannedHours > 0) {
      const actualHours =
        (actualSlots.filter(s => s.active).length * (load.slotDuration || 30)) / 60;
      const compliance = Math.round((actualHours / plannedHours) * 100);
      const complianceClass =
        compliance >= 90
          ? 'compliance-high'
          : compliance >= 50
            ? 'compliance-mid'
            : 'compliance-low';
      actualLine = html`
        <div class="load-actual">
          <span>${this.localize('summary.actual')}: ${actualHours.toFixed(1)}h</span>
          <span>${this.localize('summary.of')}</span>
          <span>${plannedHours.toFixed(1)}h</span>
          <span class="${complianceClass}">(${compliance}%)</span>
        </div>
      `;
    }

    return html`
      <div class="load-summary">
        <div class="load-indicator" style="background: ${load.color}"></div>
        <div class="load-info">
          <div class="load-name">${load.name}</div>
          <div class="load-details">
            <span class="load-status ${statusClass}">${statusText}</span>
            <span>${hoursText}</span>
            ${powerText ? html`<span>${powerText}</span>` : ''}
          </div>
          ${costLine} ${actualLine}
        </div>
      </div>
    `;
  }
}

customElements.define('summary-row', SummaryRow);
