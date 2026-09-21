# Actual verification — 2026-09-22

Node syntax checks passed. Seven engine check groups and six real Chromium 151.0.7922.34 browser groups passed.

Engine: hand-calculated wait/P95/peak/busy-time cases; post-closing drain; simultaneous completion/arrival; seed repeatability; invalid bounds and chronology; 128 policy runs matched a separately written event-driven oracle; one-window equivalence, high-load bounds and numeric-only CSV.

Browser: offline startup; stale exports disabled after edits; zero arrivals; invalid form and reset; actual JSON/CSV downloads checked against rendered metrics and shared inputs; PNG downloaded and reopened at 1100×460, byte-equal to preview canvas; overload warning; 390px layout; no application HTTP requests, browser storage or page errors.

Desktop and narrow screenshots visually inspected. Export chart legend and fictional-data label were added after the first passing run; only the affected browser suite and syntax were rerun, both passed. Engine unchanged. Raw evidence is generated under ignored `test-output/`.

Method: deterministic checks, a separate reference algorithm and same-agent visual/source inspection. Not cross-model review. No external code or real customer data used. No runtime dependencies to audit. No configured linter/type checker; those were not run.

Not verified: Android/iOS hardware, Firefox/Safari, screen-reader user study, real retail calibration, real staffing or revenue outcomes. Small-screen chart labels are compact; open the exported PNG for detail. This is a teaching experiment, not a production queue optimizer.
