import { describe, it, expect } from 'vitest';
import {
  parseSchedule,
  detectSlotDuration,
  computeLoadSummary,
  parsePvForecast,
} from '../src/models/schedule-parser.js';

// ── Test data ──────────────────────────────────────────────────────

const MOCK_SCHEDULE = [
  { date: '2026-03-04T08:00:00+01:00', p_deferrable0: '350.0' },
  { date: '2026-03-04T08:30:00+01:00', p_deferrable0: '350.0' },
  { date: '2026-03-04T09:00:00+01:00', p_deferrable0: '350.0' },
  { date: '2026-03-04T09:30:00+01:00', p_deferrable0: '0.0' },
  { date: '2026-03-04T10:00:00+01:00', p_deferrable0: '350.0' },
  { date: '2026-03-04T10:30:00+01:00', p_deferrable0: '0.0' },
];

const MOCK_HASS_ENTITY = {
  entity_id: 'sensor.p_deferrable0',
  state: '350',
  attributes: {
    deferrables_schedule: MOCK_SCHEDULE,
    friendly_name: 'EMHASS Schedule',
  },
};

const MOCK_PV_FORECAST = [
  { period_start: '2026-03-04T07:00:00+01:00', pv_estimate: 0.1 },
  { period_start: '2026-03-04T07:30:00+01:00', pv_estimate: 0.5 },
  { period_start: '2026-03-04T08:00:00+01:00', pv_estimate: 1.2 },
  { period_start: '2026-03-04T08:30:00+01:00', pv_estimate: 2.5 },
  { period_start: '2026-03-04T09:00:00+01:00', pv_estimate: 3.8 },
  { period_start: '2026-03-04T09:30:00+01:00', pv_estimate: 4.2 },
  { period_start: '2026-03-04T10:00:00+01:00', pv_estimate: 3.5 },
  { period_start: '2026-03-04T10:30:00+01:00', pv_estimate: 2.0 },
];

// ── parseSchedule ──────────────────────────────────────────────────

describe('parseSchedule', () => {
  it('extracts active slots from schedule array', () => {
    const result = parseSchedule(MOCK_SCHEDULE, 'p_deferrable0');
    expect(result).toHaveLength(6);
    expect(result[0]).toEqual({
      timestamp: new Date('2026-03-04T08:00:00+01:00').getTime(),
      power: 350,
      active: true,
    });
    expect(result[3]).toEqual({
      timestamp: new Date('2026-03-04T09:30:00+01:00').getTime(),
      power: 0,
      active: false,
    });
  });

  it('returns empty array for null/undefined schedule', () => {
    expect(parseSchedule(null, 'p_deferrable0')).toEqual([]);
    expect(parseSchedule(undefined, 'p_deferrable0')).toEqual([]);
  });

  it('returns empty array for empty schedule', () => {
    expect(parseSchedule([], 'p_deferrable0')).toEqual([]);
  });

  it('handles missing field name gracefully', () => {
    const result = parseSchedule(MOCK_SCHEDULE, 'p_deferrable5');
    expect(result).toHaveLength(6);
    result.forEach(slot => {
      expect(slot.power).toBe(0);
      expect(slot.active).toBe(false);
    });
  });

  it('uses threshold of 0.1 for active detection', () => {
    const schedule = [
      { date: '2026-03-04T08:00:00+01:00', p_deferrable0: '0.05' },
      { date: '2026-03-04T08:30:00+01:00', p_deferrable0: '0.1' },
      { date: '2026-03-04T09:00:00+01:00', p_deferrable0: '0.11' },
    ];
    const result = parseSchedule(schedule, 'p_deferrable0');
    expect(result[0].active).toBe(false);
    expect(result[1].active).toBe(false);
    expect(result[2].active).toBe(true);
  });

  it('auto-detects field name from entity_id', () => {
    const result = parseSchedule(MOCK_SCHEDULE, 'sensor.p_deferrable0');
    expect(result[0].power).toBe(350);
    expect(result[0].active).toBe(true);
  });
});

// ── detectSlotDuration ─────────────────────────────────────────────

describe('detectSlotDuration', () => {
  it('detects 30-minute slots', () => {
    const slots = parseSchedule(MOCK_SCHEDULE, 'p_deferrable0');
    expect(detectSlotDuration(slots)).toBe(30);
  });

  it('returns 30 as default for insufficient data', () => {
    expect(detectSlotDuration([])).toBe(30);
    expect(detectSlotDuration([{ timestamp: 1000 }])).toBe(30);
  });

  it('detects 15-minute slots', () => {
    const slots = [
      { timestamp: new Date('2026-03-04T08:00:00Z').getTime() },
      { timestamp: new Date('2026-03-04T08:15:00Z').getTime() },
      { timestamp: new Date('2026-03-04T08:30:00Z').getTime() },
    ];
    expect(detectSlotDuration(slots)).toBe(15);
  });

  it('detects 60-minute slots', () => {
    const slots = [
      { timestamp: new Date('2026-03-04T08:00:00Z').getTime() },
      { timestamp: new Date('2026-03-04T09:00:00Z').getTime() },
    ];
    expect(detectSlotDuration(slots)).toBe(60);
  });
});

// ── computeLoadSummary ─────────────────────────────────────────────

describe('computeLoadSummary', () => {
  it('computes hours planned from active slots', () => {
    const slots = parseSchedule(MOCK_SCHEDULE, 'p_deferrable0');
    const summary = computeLoadSummary(slots, 30);
    // 4 active slots × 30 min = 2h
    expect(summary.hoursPlanned).toBe(2);
    expect(summary.activeSlots).toBe(4);
    expect(summary.totalSlots).toBe(6);
  });

  it('detects current state from latest active slot', () => {
    const slots = parseSchedule(MOCK_SCHEDULE, 'p_deferrable0');
    const summary = computeLoadSummary(slots, 30);
    expect(summary.maxPower).toBe(350);
  });

  it('handles all-zero schedule', () => {
    const schedule = [
      { date: '2026-03-04T08:00:00+01:00', p_deferrable1: '0.0' },
      { date: '2026-03-04T08:30:00+01:00', p_deferrable1: '0.0' },
    ];
    const slots = parseSchedule(schedule, 'p_deferrable1');
    const summary = computeLoadSummary(slots, 30);
    expect(summary.hoursPlanned).toBe(0);
    expect(summary.activeSlots).toBe(0);
    expect(summary.maxPower).toBe(0);
  });

  it('handles empty slots array', () => {
    const summary = computeLoadSummary([], 30);
    expect(summary.hoursPlanned).toBe(0);
    expect(summary.activeSlots).toBe(0);
    expect(summary.totalSlots).toBe(0);
    expect(summary.maxPower).toBe(0);
  });
});

// ── parsePvForecast ────────────────────────────────────────────────

describe('parsePvForecast', () => {
  it('converts kW to watts', () => {
    const result = parsePvForecast(MOCK_PV_FORECAST);
    expect(result[0]).toEqual({
      timestamp: new Date('2026-03-04T07:00:00+01:00').getTime(),
      power: 100,
    });
    expect(result[2]).toEqual({
      timestamp: new Date('2026-03-04T08:00:00+01:00').getTime(),
      power: 1200,
    });
  });

  it('returns empty array for null/undefined', () => {
    expect(parsePvForecast(null)).toEqual([]);
    expect(parsePvForecast(undefined)).toEqual([]);
  });

  it('handles custom field name', () => {
    const forecast = [
      { period_start: '2026-03-04T08:00:00+01:00', pv_estimate10: 1.5 },
    ];
    const result = parsePvForecast(forecast, 'pv_estimate10');
    expect(result[0].power).toBe(1500);
  });

  it('rounds power values to integers', () => {
    const forecast = [
      { period_start: '2026-03-04T08:00:00+01:00', pv_estimate: 1.234 },
    ];
    const result = parsePvForecast(forecast);
    expect(result[0].power).toBe(1234);
  });
});
