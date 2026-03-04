/**
 * Parse EMHASS deferrables_schedule attribute into structured slot data.
 *
 * @param {Array|null} schedule - Raw schedule array from entity attributes
 * @param {string} fieldName - Field key (e.g., "p_deferrable0" or "sensor.p_deferrable0")
 * @param {number} [threshold=0.1] - Power threshold for active detection
 * @returns {Array<{timestamp: number, power: number, active: boolean}>}
 */
export function parseSchedule(schedule, fieldName, threshold = 0.1) {
  if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
    return [];
  }

  // Strip "sensor." prefix if present (auto-detect from entity_id)
  const key = fieldName.replace(/^sensor\./, '');

  return schedule.map(entry => {
    const power = parseFloat(entry[key]) || 0;
    return {
      timestamp: new Date(entry.date).getTime(),
      power,
      active: power > threshold,
    };
  });
}

/**
 * Detect slot duration in minutes from consecutive timestamps.
 *
 * @param {Array<{timestamp: number}>} slots - Parsed slots
 * @returns {number} Duration in minutes (default 30)
 */
export function detectSlotDuration(slots) {
  if (!slots || slots.length < 2) return 30;
  const diff = slots[1].timestamp - slots[0].timestamp;
  return Math.round(diff / 60000);
}

/**
 * Compute summary statistics for a load's schedule.
 *
 * @param {Array<{timestamp: number, power: number, active: boolean}>} slots
 * @param {number} slotDurationMin - Slot duration in minutes
 * @returns {{hoursPlanned: number, activeSlots: number, totalSlots: number, maxPower: number}}
 */
export function computeLoadSummary(slots, slotDurationMin) {
  if (!slots || slots.length === 0) {
    return { hoursPlanned: 0, activeSlots: 0, totalSlots: 0, maxPower: 0 };
  }

  const activeSlots = slots.filter(s => s.active).length;
  const maxPower = Math.max(0, ...slots.map(s => s.power));

  return {
    hoursPlanned: (activeSlots * slotDurationMin) / 60,
    activeSlots,
    totalSlots: slots.length,
    maxPower,
  };
}

/**
 * Parse Solcast PV forecast into timestamp/power pairs.
 *
 * @param {Array|null} forecast - Raw forecast array (detailedForecast attribute)
 * @param {string} [field='pv_estimate'] - Field name for PV estimate (kW)
 * @returns {Array<{timestamp: number, power: number}>} Power in watts
 */
export function parsePvForecast(
  forecast,
  field = 'pv_estimate',
  dateField = 'period_start',
  scale = 1000,
) {
  if (!forecast || !Array.isArray(forecast) || forecast.length === 0) {
    return [];
  }

  return forecast.map(entry => ({
    timestamp: new Date(entry[dateField]).getTime(),
    power: Math.round((parseFloat(entry[field]) || 0) * scale),
  }));
}
