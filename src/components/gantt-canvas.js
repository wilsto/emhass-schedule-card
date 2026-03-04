/**
 * gantt-canvas.js — Canvas-based Gantt timeline renderer
 * Renders deferrable load schedules as horizontal swim lanes
 * with PV forecast area overlay in background.
 */
import { LitElement, html, css } from 'lit';

const LANE_HEIGHT = 48;
const LABEL_WIDTH = 90;
const HEADER_HEIGHT = 20;
const PADDING = { top: 4, right: 50, bottom: 24, left: 8 };
const PV_COLOR = 'rgba(255, 193, 7, 0.25)';
const PV_STROKE_COLOR = 'rgba(255, 193, 7, 0.6)';
const NOW_COLOR = 'rgba(244, 67, 54, 0.8)';
const GRID_COLOR = 'rgba(255, 255, 255, 0.08)';
const TEXT_COLOR = 'rgba(255, 255, 255, 0.7)';
const BLOCK_RADIUS = 4;

class GanttCanvas extends LitElement {
  static properties = {
    loads: { type: Array },
    pvData: { type: Array },
    pvMax: { type: Number },
    pvMpcData: { type: Array },
    pvActualData: { type: Array },
    showPv: { type: Boolean },
    isDark: { type: Boolean },
  };

  static styles = css`
    :host {
      display: block;
      position: relative;
    }
    .gantt-container {
      position: relative;
      width: 100%;
    }
    canvas {
      display: block;
      width: 100%;
      cursor: pointer;
    }
    .tooltip {
      position: absolute;
      background: var(--card-background-color, #1e1e1e);
      border: 1px solid var(--divider-color, #333);
      border-radius: 8px;
      padding: 8px 12px;
      font-size: 12px;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.15s;
      z-index: 10;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
    .tooltip.visible {
      opacity: 1;
    }
    .tooltip-name {
      font-weight: 600;
      color: var(--primary-text-color, #fff);
    }
    .tooltip-time {
      color: var(--secondary-text-color, #aaa);
      margin-top: 2px;
    }
    .tooltip-power {
      color: var(--primary-text-color, #fff);
      margin-top: 2px;
    }
  `;

  constructor() {
    super();
    this.loads = [];
    this.pvData = [];
    this.pvMax = 0;
    this.pvMpcData = [];
    this.pvActualData = [];
    this.showPv = true;
    this.isDark = true;
    this._resizeObserver = null;
    this._tooltipData = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this._resizeObserver = new ResizeObserver(() => this._draw());
    this._resizeObserver.observe(this);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._resizeObserver?.disconnect();
  }

  updated() {
    this._draw();
  }

  get _timeRange() {
    let min = Infinity;
    let max = -Infinity;
    for (const load of this.loads) {
      for (const slot of load.slots) {
        if (slot.timestamp < min) min = slot.timestamp;
        if (slot.timestamp > max) max = slot.timestamp;
      }
    }
    if (this.pvData?.length) {
      for (const pt of this.pvData) {
        if (pt.timestamp < min) min = pt.timestamp;
        if (pt.timestamp > max) max = pt.timestamp;
      }
    }
    if (min === Infinity) {
      const now = Date.now();
      return { min: now, max: now + 6 * 3600000 };
    }
    // Add one slot duration to max for visual completeness
    const slotDur = this.loads[0]?.slotDuration || 30;
    return { min, max: max + slotDur * 60000 };
  }

  _xPos(timestamp, chartLeft, chartWidth, timeRange) {
    const ratio = (timestamp - timeRange.min) / (timeRange.max - timeRange.min);
    return chartLeft + ratio * chartWidth;
  }

  _draw() {
    const canvas = this.renderRoot?.querySelector('canvas');
    if (!canvas || !this.loads.length) return;

    const container = this.renderRoot.querySelector('.gantt-container');
    const containerWidth = container?.offsetWidth || 400;
    const dpr = window.devicePixelRatio || 1;

    const numLanes = this.loads.length;
    const canvasHeight = PADDING.top + HEADER_HEIGHT + numLanes * LANE_HEIGHT + PADDING.bottom;

    canvas.width = containerWidth * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.height = `${canvasHeight}px`;

    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, containerWidth, canvasHeight);

    const chartLeft = PADDING.left + LABEL_WIDTH;
    const chartRight = containerWidth - PADDING.right;
    const chartWidth = chartRight - chartLeft;
    const chartTop = PADDING.top + HEADER_HEIGHT;
    const timeRange = this._timeRange;

    const textColor = this.isDark ? TEXT_COLOR : 'rgba(0, 0, 0, 0.6)';
    const gridColor = this.isDark ? GRID_COLOR : 'rgba(0, 0, 0, 0.08)';

    // ── PV forecast background ──
    if (this.showPv && this.pvData?.length > 1 && this.pvMax > 0) {
      this._drawPvOverlay(ctx, chartLeft, chartWidth, chartTop, numLanes, timeRange);
    }

    // ── MPC PV line (dashed amber, future only) ──
    if (this.showPv && this.pvMpcData?.length > 0 && this.pvMax > 0) {
      this._drawPvLine(
        ctx,
        this.pvMpcData,
        '#FFA000',
        1.5,
        [4, 3],
        chartLeft,
        chartWidth,
        chartTop,
        numLanes,
        timeRange,
        false,
      );
    }

    // ── Actual PV line (solid white, past only) ──
    if (this.showPv && this.pvActualData?.length > 0 && this.pvMax > 0) {
      this._drawPvLine(
        ctx,
        this.pvActualData,
        'rgba(255,255,255,0.85)',
        2,
        [],
        chartLeft,
        chartWidth,
        chartTop,
        numLanes,
        timeRange,
        true,
      );
    }

    // ── Grid lines (hourly) ──
    this._drawGrid(ctx, chartLeft, chartWidth, chartTop, numLanes, timeRange, textColor, gridColor);

    // ── Swim lanes ──
    this.loads.forEach((load, laneIdx) => {
      const laneTop = chartTop + laneIdx * LANE_HEIGHT;
      this._drawLane(ctx, load, laneIdx, laneTop, chartLeft, chartWidth, timeRange, textColor);
    });

    // ── Current time marker ──
    this._drawNowMarker(ctx, chartLeft, chartWidth, chartTop, numLanes, timeRange);

    // ── PV Y-axis labels (right side) ──
    if (this.showPv && this.pvMax > 0) {
      this._drawPvAxis(ctx, chartRight, chartTop, numLanes, textColor);
    }
  }

  _drawPvOverlay(ctx, chartLeft, chartWidth, chartTop, numLanes, timeRange) {
    const laneAreaHeight = numLanes * LANE_HEIGHT;
    const pvBottom = chartTop + laneAreaHeight;

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(this._xPos(this.pvData[0].timestamp, chartLeft, chartWidth, timeRange), pvBottom);

    for (const pt of this.pvData) {
      const x = this._xPos(pt.timestamp, chartLeft, chartWidth, timeRange);
      const yRatio = pt.power / this.pvMax;
      const y = pvBottom - yRatio * laneAreaHeight;
      ctx.lineTo(x, y);
    }

    const lastPt = this.pvData[this.pvData.length - 1];
    ctx.lineTo(this._xPos(lastPt.timestamp, chartLeft, chartWidth, timeRange), pvBottom);
    ctx.closePath();

    ctx.fillStyle = PV_COLOR;
    ctx.fill();

    // Stroke the top edge
    ctx.beginPath();
    for (let i = 0; i < this.pvData.length; i++) {
      const pt = this.pvData[i];
      const x = this._xPos(pt.timestamp, chartLeft, chartWidth, timeRange);
      const yRatio = pt.power / this.pvMax;
      const y = pvBottom - yRatio * laneAreaHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = PV_STROKE_COLOR;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();
  }

  _drawPvLine(
    ctx,
    data,
    color,
    lineWidth,
    dash,
    chartLeft,
    chartWidth,
    chartTop,
    numLanes,
    timeRange,
    pastOnly,
  ) {
    const laneAreaHeight = numLanes * LANE_HEIGHT;
    const pvBottom = chartTop + laneAreaHeight;
    const now = Date.now();

    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.setLineDash(dash);
    ctx.beginPath();
    let started = false;

    for (const pt of data) {
      if (pastOnly && pt.timestamp > now) continue;
      if (!pastOnly && pt.timestamp < now - 30 * 60000) continue;
      const x = this._xPos(pt.timestamp, chartLeft, chartWidth, timeRange);
      const yRatio = this.pvMax > 0 ? pt.power / this.pvMax : 0;
      const y = pvBottom - yRatio * laneAreaHeight;
      if (!started) {
        ctx.moveTo(x, y);
        started = true;
      } else ctx.lineTo(x, y);
    }
    if (started) ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  _drawGrid(ctx, chartLeft, chartWidth, chartTop, numLanes, timeRange, textColor, gridColor) {
    const { min, max } = timeRange;
    const startHour = new Date(min);
    startHour.setMinutes(0, 0, 0);

    ctx.save();
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.fillStyle = textColor;
    ctx.font = '11px system-ui, sans-serif';
    ctx.textAlign = 'center';

    const laneAreaBottom = chartTop + numLanes * LANE_HEIGHT;
    let t = startHour.getTime();

    while (t <= max) {
      if (t >= min) {
        const x = this._xPos(t, chartLeft, chartWidth, timeRange);

        // Vertical grid line
        ctx.beginPath();
        ctx.moveTo(x, chartTop);
        ctx.lineTo(x, laneAreaBottom);
        ctx.stroke();

        // Time label
        const d = new Date(t);
        const label = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
        ctx.fillText(label, x, laneAreaBottom + 14);
      }
      t += 3600000; // 1 hour
    }
    ctx.restore();
  }

  _drawLane(ctx, load, laneIdx, laneTop, chartLeft, chartWidth, timeRange, textColor) {
    const slotDurMs = (load.slotDuration || 30) * 60000;

    // ── Lane label (left side) ──
    ctx.save();
    ctx.fillStyle = textColor;
    ctx.font = '12px system-ui, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const labelY = laneTop + LANE_HEIGHT / 2;
    const name = load.name || `Load ${laneIdx}`;

    // Truncate name if too long
    const maxLabelWidth = LABEL_WIDTH - 12;
    let displayName = name;
    while (ctx.measureText(displayName).width > maxLabelWidth && displayName.length > 3) {
      displayName = displayName.slice(0, -1);
    }
    if (displayName !== name) displayName += '…';

    ctx.fillText(displayName, PADDING.left + LABEL_WIDTH - 6, labelY);
    ctx.restore();

    // ── Lane separator ──
    if (laneIdx > 0) {
      ctx.save();
      ctx.strokeStyle = this.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(chartLeft, laneTop);
      ctx.lineTo(chartLeft + chartWidth, laneTop);
      ctx.stroke();
      ctx.restore();
    }

    // ── Active blocks (planned) ──
    ctx.save();
    const blockTop = laneTop + 4;
    const blockHeight = LANE_HEIGHT - 8;
    const color = load.color || '#4CAF50';
    const now = Date.now();

    for (const slot of load.slots) {
      if (!slot.active) continue;

      const slotEnd = slot.timestamp + slotDurMs;
      const isPast = slotEnd < now;

      const x1 = this._xPos(slot.timestamp, chartLeft, chartWidth, timeRange);
      const x2 = this._xPos(slotEnd, chartLeft, chartWidth, timeRange);
      const blockWidth = Math.max(x2 - x1 - 1, 2);

      // Past planned blocks → ghost (reduced opacity)
      ctx.globalAlpha = isPast ? 0.35 : 1.0;
      ctx.fillStyle = color;
      ctx.beginPath();
      this._roundRect(ctx, x1, blockTop, blockWidth, blockHeight, BLOCK_RADIUS);
      ctx.fill();

      // Power label inside block if wide enough
      if (blockWidth > 40) {
        ctx.globalAlpha = isPast ? 0.5 : 1.0;
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 11px system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(slot.power)}W`, x1 + blockWidth / 2, blockTop + blockHeight / 2);
      }
    }

    // ── Actual consumption bar (from HA history) ──
    if (load.actualSlots?.length) {
      const actualBarTop = laneTop + LANE_HEIGHT - 10;
      const actualBarHeight = 6;
      ctx.globalAlpha = 0.9;
      ctx.fillStyle = color;
      for (const slot of load.actualSlots) {
        if (!slot.active) continue;
        const x1 = this._xPos(slot.timestamp, chartLeft, chartWidth, timeRange);
        const x2 = this._xPos(slot.timestamp + slotDurMs, chartLeft, chartWidth, timeRange);
        const w = Math.max(x2 - x1 - 1, 2);
        ctx.fillRect(x1, actualBarTop, w, actualBarHeight);
      }
    }

    ctx.globalAlpha = 1.0;
    ctx.restore();
  }

  _drawNowMarker(ctx, chartLeft, chartWidth, chartTop, numLanes, timeRange) {
    const now = Date.now();
    if (now < timeRange.min || now > timeRange.max) return;

    const x = this._xPos(now, chartLeft, chartWidth, timeRange);
    const laneAreaBottom = chartTop + numLanes * LANE_HEIGHT;

    ctx.save();
    ctx.strokeStyle = NOW_COLOR;
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(x, chartTop - 4);
    ctx.lineTo(x, laneAreaBottom);
    ctx.stroke();

    // "Now" triangle marker at top
    ctx.setLineDash([]);
    ctx.fillStyle = NOW_COLOR;
    ctx.beginPath();
    ctx.moveTo(x - 5, chartTop - 4);
    ctx.lineTo(x + 5, chartTop - 4);
    ctx.lineTo(x, chartTop + 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  _drawPvAxis(ctx, chartRight, chartTop, numLanes, _textColor) {
    const laneAreaHeight = numLanes * LANE_HEIGHT;
    const steps = 3;

    ctx.save();
    ctx.fillStyle = PV_STROKE_COLOR;
    ctx.font = '10px system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps;
      const y = chartTop + laneAreaHeight - ratio * laneAreaHeight;
      const val = Math.round((ratio * this.pvMax) / 100) * 100;
      if (val > 0) {
        ctx.fillText(`${val}W`, chartRight + 4, y);
      }
    }
    ctx.restore();
  }

  _roundRect(ctx, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }

  // ── Tooltip on hover ──
  _handleMouseMove(e) {
    const canvas = this.renderRoot.querySelector('canvas');
    const tooltip = this.renderRoot.querySelector('.tooltip');
    if (!canvas || !tooltip) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const chartLeft = PADDING.left + LABEL_WIDTH;
    const chartTop = PADDING.top + HEADER_HEIGHT;
    const timeRange = this._timeRange;
    const chartWidth = rect.width - chartLeft - PADDING.right;

    // Find which lane
    const laneIdx = Math.floor((y - chartTop) / LANE_HEIGHT);
    if (laneIdx < 0 || laneIdx >= this.loads.length || x < chartLeft) {
      tooltip.classList.remove('visible');
      return;
    }

    // Find timestamp at mouse position
    const ratio = (x - chartLeft) / chartWidth;
    const hoverTime = timeRange.min + ratio * (timeRange.max - timeRange.min);
    const load = this.loads[laneIdx];
    const slotDurMs = (load.slotDuration || 30) * 60000;

    // Find matching slot
    const slot = load.slots.find(
      s => hoverTime >= s.timestamp && hoverTime < s.timestamp + slotDurMs && s.active,
    );

    if (!slot) {
      tooltip.classList.remove('visible');
      return;
    }

    const slotTime = new Date(slot.timestamp);
    const endTime = new Date(slot.timestamp + slotDurMs);
    const fmt = d =>
      `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

    tooltip.querySelector('.tooltip-name').textContent = load.name;
    tooltip.querySelector('.tooltip-time').textContent = `${fmt(slotTime)} – ${fmt(endTime)}`;
    tooltip.querySelector('.tooltip-power').textContent = `${Math.round(slot.power)} W`;

    // Position tooltip
    tooltip.style.left = `${Math.min(e.clientX - rect.left + 12, rect.width - 150)}px`;
    tooltip.style.top = `${e.clientY - rect.top - 60}px`;
    tooltip.classList.add('visible');
  }

  _handleMouseLeave() {
    const tooltip = this.renderRoot.querySelector('.tooltip');
    if (tooltip) tooltip.classList.remove('visible');
  }

  _handleClick(e) {
    const canvas = this.renderRoot.querySelector('canvas');
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const chartTop = PADDING.top + HEADER_HEIGHT;
    const laneIdx = Math.floor((y - chartTop) / LANE_HEIGHT);

    if (laneIdx >= 0 && laneIdx < this.loads.length) {
      const load = this.loads[laneIdx];
      if (load.entityId) {
        const event = new CustomEvent('hass-more-info', {
          bubbles: true,
          composed: true,
          detail: { entityId: load.entityId },
        });
        this.dispatchEvent(event);
      }
    }
  }

  render() {
    return html`
      <div class="gantt-container">
        <canvas
          @mousemove=${this._handleMouseMove}
          @mouseleave=${this._handleMouseLeave}
          @click=${this._handleClick}
        ></canvas>
        <div class="tooltip">
          <div class="tooltip-name"></div>
          <div class="tooltip-time"></div>
          <div class="tooltip-power"></div>
        </div>
      </div>
    `;
  }
}

customElements.define('gantt-canvas', GanttCanvas);
