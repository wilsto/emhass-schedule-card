# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-04

### Added
- Gantt-style timeline for EMHASS deferrable load schedules
- PV forecast overlay (Solcast 24h golden area)
- EMHASS MPC forecast overlay (dashed amber line, future only)
- Actual PV production overlay (solid white line, past only, via HA history API)
- Past schedule ghost opacity (0.35) with actual consumption bar per load lane
- HP/HC tariff cost computation per load (kWh, optimized cost, baseline, savings)
- Compliance tracking: actual vs planned hours with color-coded indicator (≥90% green, ≥50% orange, <50% red)
- Visual config editor (HA GUI) with entity pickers, tariff section, load management
- EN/FR localization
