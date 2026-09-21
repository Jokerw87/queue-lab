# 排队实验室 / Queue Lab

A small, independently implemented offline experiment comparing one shared FCFS queue with shortest-headcount separate queues. Both policies receive the exact same synthetic arrivals and per-customer service durations. No real customer data, APIs, dependencies, telemetry or persistence.

## Three steps

1. Open `index.html` in a desktop browser. Adjust arrivals, service duration, windows and seed.
2. Press “比较两种排法”. Read mean/P95 waits, queue peak, opening-period utilization and clearance time.
3. Export per-customer CSV, full JSON or chart PNG. Parameter changes disable export until recomputation.

## Model contract

Time is measured in seconds internally. Arrivals occur strictly before the horizon. All admitted customers are served, including after closing. Fixed intervals or exponential inter-arrivals; fixed or exponential service durations. Seeded independent streams produce arrivals and service durations. No abandonment, priority, breaks or worker variation. Equal-length separate queues choose the lowest-numbered server and never switch. Queue count excludes customers in service. P95 uses nearest rank; utilization uses only the opening interval. The chart continues through clearance.

This is an educational model, not a calibrated store forecast or staffing recommendation. Nominal load >=100% is a warning, not a crash. Individual random realizations can differ from long-run theory. No claim of universal superiority or income impact.

## Prior art checked 2026-09-22

- [QueueForge](https://github.com/ettoremessina/QueueForge): a richer React/TypeScript educational simulator with M/M/c and finite-capacity models. Prefer it for classical queue-theory teaching.
- [NetLogo supermarket model](https://github.com/tant2002/NetLogo-Supermarket-Queue-Model): supports more detailed, potentially historical-data-driven retail scenarios.

We did not copy their source. This experiment's narrow choice is a zero-install paired-policy comparison and auditable per-person export, not a new market category. No validated paid demand. Initial publication does not choose a reuse license.

## Verification

`node test-engine.cjs` uses only Node. Browser checks additionally require an existing Playwright installation: set `PLAYWRIGHT_MODULE` to its module path, then `node test-browser.cjs`. Generated test artifacts are excluded. See TEST_RESULTS.md for actual run status and limits.
