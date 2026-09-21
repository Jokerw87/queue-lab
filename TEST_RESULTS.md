# V1.1 actual verification — 2026-09-22

V1.1: syntax checks passed; nine new distribution groups plus six affected existing browser groups passed in real local Chromium. The unchanged engine SHA-256 is `404f3c31363be2d2650f943fcc0e89545ed4984dca8e33c15c87be81ccdf5655`; its seven passing V1 engine groups are inherited evidence, not rerun or counted as new checks.

New checks: hand-calculated histogram boundaries, strict threshold and paired direction; empty/singleton/equality cases; malformed/mismatched records and invalid thresholds; 40 synthetic seeded comparisons using separate counting logic; exact downloaded CSV comparison against downloaded source JSON; invalid threshold isolation; stale distribution clearing; empty run/reset; offline 390px layout with zero application HTTP/storage/page errors. During test review the nonmutation snapshot was moved before analysis so the assertion actually checks the intended invariant; affected suite rerun.

Engine: hand-calculated wait/P95/peak/busy-time cases; post-closing drain; simultaneous completion/arrival; seed repeatability; invalid bounds and chronology; 128 policy runs matched a separately written event-driven oracle; one-window equivalence, high-load bounds and numeric-only CSV.

Browser: offline startup; stale exports disabled after edits; zero arrivals; invalid form and reset; actual JSON/CSV downloads checked against rendered metrics and shared inputs; PNG downloaded and reopened at 1100×460, byte-equal to preview canvas; overload warning; 390px layout; no application HTTP requests, browser storage or page errors.

V1.1 desktop screenshot visually inspected. Narrow viewport was browser-tested for overflow; no claim of physical mobile verification. Original chart-export behavior was regression-tested, including reopening the downloaded PNG. Engine unchanged. Raw evidence is generated under ignored `test-output/`.

Method: deterministic checks, a separate reference algorithm and same-agent visual/source inspection. Not cross-model review. No external code or real customer data used. No runtime dependencies to audit. No configured linter/type checker; those were not run.

Not verified: Android/iOS hardware, Firefox/Safari, screen-reader user study, real retail calibration, real staffing or revenue outcomes. Small-screen chart labels are compact; open the exported PNG for detail. This is a teaching experiment, not a production queue optimizer.
