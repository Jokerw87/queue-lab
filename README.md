# 排队实验室 V1.4 / Queue Lab

## V1.4 same-job server-count comparison

Scroll to “同一批客流，1–8个服务台” and explicitly run the comparison. It generates one set of synthetic arrivals and service times, then compares 1–8 servers under both queue policies (16 scenarios). The upper server-count field controls only the original single comparison. Export a separate CSV with full numeric precision; displayed numbers are rounded. Editing parameters, recomputing, resetting or successfully importing a project clears old sweep results. Nothing auto-runs this sweep.

This is not a staffing recommendation, cost optimizer or revenue forecast. Separate-queue results need not improve monotonically. No customers means zero measured waits, not proven good service. Original simulator unchanged. See SWEEP_RESULTS.md for actual checks and limits.

## Save and reopen an experiment

After computing, use“保存参数项目 JSON”to download queue-project.json. Reopen using the project import field, confirm replacement, and all results are recalculated locally. Only seven simulation parameters are saved. Timeline selection resets to customer1; the wait-distribution threshold stays at its current value. Parameter edits disable saving until recomputation. No automatic persistence.

Project files are limited to8KiB and strict versioned JSON. Unknown fields, computed results, incorrect types and invalid ranges are rejected without replacing current state. The old“完整 JSON”export remains a results report and cannot be imported as a parameter project. See PROJECT_FORMAT.md. example-project.json is a fictional regular-arrival scenario, not customer evidence. Try it through the import button.

Additional development checks: node test-project.cjs, node test-project-browser.cjs and node test-project-layout.cjs with existing Playwright. No dependency installation is needed to use the tool.

## V1.2 customer timeline

Choose a customer number to see arrival, waiting, service and assigned window under both policies on one common time axis. Orange is waiting; green is service. Numeric details show seconds to three decimals. The selected customer's later completion sets the axis extent; changing customers rescales the image, so do not compare raw bar lengths across exports. Zero waiting has no orange bar. These are synthetic records, not observed customer behavior.

Export the selected1100x300 PNG for readable detail. Invalid IDs and empty runs clear the timeline and disable its export. Parameter edits invalidate it until recomputation. Customer selection does not regenerate arrivals or service times. This version leaves the simulator unchanged. Additional checks: test-timeline.cjs and test-timeline-pixels.cjs, using existing Playwright as described below.

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
