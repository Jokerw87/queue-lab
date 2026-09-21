# V1.4 verification — 2026-09-22

Actual Node: five groups PASS in test-sweep.cjs. All 16 scenarios equal the original simulator using the same immutable jobs; seed reproducibility, empty/invalid inputs and CSV structure checked. A four-customer hand fixture has 90-second average wait with one server and zero with two. Original engine hash unchanged from V1.3.

Actual desktop Chromium: five groups PASS in test-sweep-browser.cjs. Explicit run only; 16 table rows; actual CSV download byte-for-byte equal to engine output including UTF8 BOM; old comparison invalidated by input, recompute, reset and successful project import; blank rejection and zero-customer output; offline 1360/390 layouts with zero external HTTP requests and page errors.

Same-agent visual review found narrow table headings wrapped excessively. A scoped horizontal table width adjustment was made and checked separately. No cross-model review. Earlier TEST_RESULTS.md documents inherited tests, not a new full regression run. Android/iOS hardware, Safari/Firefox, real store calibration and commercial usefulness were not tested. All fixtures are fictional. Publication is separately verified after upload.
