# 排队实验室 V1.1 / Queue Lab

A small, independently implemented offline experiment comparing one shared FCFS queue with shortest-headcount separate queues. Both policies receive the exact same synthetic arrivals and per-customer service durations. No real customer data, APIs, dependencies, telemetry or persistence.

## Three steps

1. Open `index.html` in a desktop browser. Adjust arrivals, service duration, windows and seed.
2. Press “比较两种排法”. Read mean/P95 waits, queue peak, opening-period utilization and clearance time.
3. Read the new wait-distribution table and paired comparison; optionally adjust the long-wait threshold. Export per-customer CSV, full source JSON, chart PNG or separate distribution CSV. Model parameter changes disable exports until recomputation.

## V1.1 distribution interpretation

The new table uses bins 0, (0,30], (30,60], (60,120], (120,300], >300 seconds. Long waits are strictly greater than the chosen integer threshold (0–3600 seconds); median uses nearest rank, not the average of two middle values. Empty runs show zero counts and percentages, not evidence of good service. Rounded percentages may not sum to exactly 100%.

Paired counts compare the same customer under both policies: `shorter/equal/longer` means shared-queue wait compared with separate-queue wait. `maxReduction/maxIncrease` are individual extremes, not average benefits. A lower overall mean does not imply every customer waits less. Threshold edits reuse the current simulation and do not rerun random inputs. Invalid or blank thresholds disable only distribution export. The original JSON remains the full source simulation; distribution export is separate. CSV `eq/gt/le` mean equal/greater than/less than or equal; wait boundaries are seconds.

## Model contract

Time is measured in seconds internally. Arrivals occur strictly before the horizon. All admitted customers are served, including after closing. Fixed intervals or exponential inter-arrivals; fixed or exponential service durations. Seeded independent streams produce arrivals and service durations. No abandonment, priority, breaks or worker variation. Equal-length separate queues choose the lowest-numbered server and never switch. Queue count excludes customers in service. P95 uses nearest rank; utilization uses only the opening interval. The chart continues through clearance.

This is an educational model, not a calibrated store forecast or staffing recommendation. Nominal load >=100% is a warning, not a crash. Individual random realizations can differ from long-run theory. No claim of universal superiority or income impact.

## Prior art checked 2026-09-22

- [QueueForge](https://github.com/ettoremessina/QueueForge): a richer React/TypeScript educational simulator with M/M/c and finite-capacity models. Prefer it for classical queue-theory teaching.
- [NetLogo supermarket model](https://github.com/tant2002/NetLogo-Supermarket-Queue-Model): supports more detailed, potentially historical-data-driven retail scenarios.

We did not copy their source. This experiment's narrow choice is a zero-install paired-policy comparison and auditable per-person export, not a new market category. No validated paid demand. Initial publication does not choose a reuse license.

## Verification

`node test-engine.cjs` uses only Node. Browser checks additionally require an existing Playwright installation: set `PLAYWRIGHT_MODULE` to its module path, then `node test-browser.cjs` and `node test-distribution.cjs`. Generated test artifacts are excluded. See TEST_RESULTS.md for actual run status and limits.
