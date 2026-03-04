import { describe, it, expect } from 'vitest';

// Test config validation logic (without LitElement DOM)

describe('config validation', () => {
  function validateConfig(config) {
    if (!config.loads || !Array.isArray(config.loads) || config.loads.length === 0) {
      throw new Error('Please define at least one load');
    }
    return {
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

  it('throws error when no loads defined', () => {
    expect(() => validateConfig({})).toThrow('Please define at least one load');
  });

  it('throws error when loads is empty array', () => {
    expect(() => validateConfig({ loads: [] })).toThrow('Please define at least one load');
  });

  it('applies defaults for missing options', () => {
    const config = validateConfig({
      loads: [{ entity: 'sensor.p_deferrable0', name: 'Test' }],
    });
    expect(config.show_pv).toBe(true);
    expect(config.show_summary).toBe(true);
    expect(config.hours).toBe(24);
    expect(config.language).toBe('auto');
  });

  it('preserves user-provided values', () => {
    const config = validateConfig({
      title: 'My Schedule',
      show_pv: false,
      hours: 6,
      loads: [{ entity: 'sensor.p_deferrable0', name: 'Pump' }],
    });
    expect(config.title).toBe('My Schedule');
    expect(config.show_pv).toBe(false);
    expect(config.hours).toBe(6);
  });

  it('accepts multiple loads', () => {
    const config = validateConfig({
      loads: [
        { entity: 'sensor.p_deferrable0', name: 'Pump' },
        { entity: 'sensor.p_deferrable1', name: 'PAC' },
        { entity: 'sensor.p_deferrable2', name: 'EV' },
      ],
    });
    expect(config.loads).toHaveLength(3);
  });
});
