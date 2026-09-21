# Queue project format V1

This is a parameter-only project, distinct from the existing full simulation JSON report.

Root keys must be exactly format, version, config. format is queue-lab-project; version is numeric1. Config keys are exactly minutes, rate, service, servers, seed, arrivals, services, with existing simulator bounds and strict numeric types. File limit8192UTF-8 bytes. Unknown properties and computed result payloads are rejected. JSON is data only.

Import must validate before replacing any controls, ask confirmation before replacing the current scenario, and recompute all results locally. It must not restore jobs, metrics or bar coordinates from a file. Reading must not race another import. Failure or cancellation must preserve the current scenario. Saving should use the current successfully computed result.config, disabling save after settings edits. Neutral export name queue-project.json.

Implementation verified: four unit groups, four browser roundtrip/failure/cancellation/read-delay groups and three example/empty/layout groups pass. Read-in-progress disables duplicate import and project saving; other parameter editing remains possible, and the subsequent confirmation explicitly authorizes replacement of the then-current controls. Imported simulation is preflighted before confirmation, then recomputed after replacement. These are deterministic desktop tests, not a production certification.
