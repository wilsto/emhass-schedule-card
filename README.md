# EMHASS Schedule Card

[![Release](https://img.shields.io/github/v/release/wilsto/emhass-schedule-card)](https://github.com/wilsto/emhass-schedule-card/releases)
[![hacs_badge](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

A Home Assistant Lovelace card displaying EMHASS deferrable load schedules as a **Gantt-style timeline** with PV forecast overlay.

![Card preview](docs/preview.png)

## Features

- **Gantt timeline** — per-load lanes with scheduled slots and current power indicator
- **Triple PV overlay** — Solcast 24h (golden area) + EMHASS MPC forecast (dashed amber) + actual production (solid white)
- **Past ghost opacity** — past planned slots shown at 35% opacity with actual consumption bar
- **HP/HC tariff cost** — per-load kWh, optimized cost, baseline cost (all peak), and savings
- **Compliance tracking** — actual vs planned hours with color-coded indicator
- **Visual config editor** — GUI editor with entity pickers, tariff section, load management
- **EN/FR localization**

## Installation via HACS

1. In HACS → **Frontend** → top-right menu → **Custom repositories**
2. Add `https://github.com/wilsto/emhass-schedule-card` as **Lovelace** type
3. Install **EMHASS Schedule Card**
4. Restart Home Assistant

## Configuration

```yaml
type: custom:emhass-schedule-card
title: "EMHASS — Planning MPC"
show_pv: true
show_summary: true
hours: 24

# PV forecast layers (all optional)
pv_entity: sensor.solcast_pv_forecast_forecast_today
pv_attribute: detailedForecast
pv_field: pv_estimate
pv_mpc_entity: sensor.p_pv_forecast          # EMHASS MPC forecast
pv_actual_entity: sensor.solar_production_power  # actual production (history)

# HP/HC tariff (optional)
tariff:
  peak: 0.2516         # €/kWh (or use peak_entity)
  offpeak: 0.1328      # €/kWh (or use offpeak_entity)
  peak_hours: [6, 22]  # peak from 06:00 to 22:00

# Deferrable loads
loads:
  - entity: sensor.p_deferrable0
    name: "Pool Pump"
    icon: "mdi:pump"
    color: "#2196F3"
    nominal_power: 350
  - entity: sensor.p_deferrable1
    name: "Heat Pump"
    icon: "mdi:heat-pump"
    color: "#00BCD4"
    nominal_power: 2000
  - entity: sensor.p_deferrable2
    name: "EV Charger"
    icon: "mdi:ev-station"
    color: "#4CAF50"
    nominal_power: 2300
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `EMHASS Schedule` | Card title |
| `hours` | number | `24` | Time horizon in hours |
| `show_pv` | boolean | `true` | Show PV forecast overlay |
| `show_summary` | boolean | `true` | Show load summary below chart |
| `pv_entity` | string | — | Solcast entity ID |
| `pv_attribute` | string | `detailedForecast` | Solcast attribute name |
| `pv_field` | string | `pv_estimate` | Field inside the forecast array |
| `pv_mpc_entity` | string | — | EMHASS MPC forecast entity |
| `pv_actual_entity` | string | — | Actual PV production entity |
| `tariff.peak` | number | — | Peak rate €/kWh |
| `tariff.offpeak` | number | — | Off-peak rate €/kWh |
| `tariff.peak_entity` | string | — | Entity providing peak rate |
| `tariff.offpeak_entity` | string | — | Entity providing off-peak rate |
| `tariff.peak_hours` | [start, end] | `[6, 22]` | Peak hours range |
| `loads[].entity` | string | **required** | EMHASS deferrable sensor entity ID |
| `loads[].name` | string | — | Display name |
| `loads[].icon` | string | `mdi:flash` | MDI icon |
| `loads[].color` | string | auto | Hex color for the lane |
| `loads[].nominal_power` | number | `0` | Rated power in watts (for cost baseline) |

## Requirements

- [EMHASS](https://github.com/davidusb-geek/emhass) add-on configured with deferrable loads
- Each `sensor.p_deferrableN` must expose a `deferrables_schedule` attribute
- (Optional) [Solcast](https://github.com/BJReplay/ha-solcast-solar) integration for PV forecast

## License

MIT
