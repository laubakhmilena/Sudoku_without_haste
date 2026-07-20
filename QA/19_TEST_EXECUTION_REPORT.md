# 19 — Test Execution Report

- Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`
- Dates: 2026-07-20
- Environment: `01_TEST_ENVIRONMENT.md`

## Metrics

| Metric | Count |
|---|---:|
| Total test cases | 56 |
| Passed | 18 |
| Failed | 2 |
| Blocked | 13 |
| Not Run | 23 |
| Not Applicable | 0 |
| Pass rate among executed | 90.0% |

Formula: `Passed / (Passed + Failed) × 100`. Blocked and Not Run are intentionally excluded from the pass rate and remain visible.

## Executed coverage

Passed: initial DOM, 200 generator cases, all mode configurations, correct/wrong entry, notes, pause, keyboard arrows, local persistence, setting persistence, victory processing, three responsive boundaries. Failed: Undo visibility and accessible live feedback (represented by one test case; reproduced desktop/mobile).

## Smoke and critical path

Isolated browser smoke: PASS. Victory state transition: PASS using debug solve helper. Natural full manual solve: NOT_RUN. Exact Yandex-host smoke: BLOCKED.

## Defects

- Confirmed: 2.
- S1: 0; S2: 0; S3: 2; S4: 0.
- Priority P1: 2.
- Potential defects: 4.

## Confidence

Moderate for core JavaScript state and responsive Chromium behavior. Low for platform integration, physical mobile/accessibility, long-session stability and release package completeness.

## Recommendations

Fix/review BUG-001 and BUG-002, then run platform preview smoke, corrupt-save tests, English mobile pass, natural manual solve and physical-device session.
