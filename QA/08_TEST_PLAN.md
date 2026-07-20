# 08 — Test Plan

- Document ID: TP-LS-001
- Version: 1.0
- Date: 2026-07-20
- Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

## Objectives and scope

Validate critical user journey, puzzle integrity, state/persistence and presentation. Platform functions are in scope but blocked until Yandex preview. Controller, purchases, multiplayer and physics are out of scope because absent.

## Test objects

HTML structure, CSS responsive rules, game state, four generators, input, persistence v2/migration, SDK adapters, accessibility semantics.

## Platforms/environments

Current: Chromium headless Debian at 1440x900, 800x600, 390x844, 320x568. Future matrix: Chrome/Edge/Firefox desktop; Android Chrome; iOS Safari; Yandex embedded preview.

## Test data

Fresh storage; active saves for each mode; correct/wrong values; 0/max hints; corrupt/missing save; v1 save; large stats; SDK callback sequences; deterministic seeds.

## Execution order

1. BVT.
2. Smoke.
3. Critical path.
4. Functional and negative.
5. Exploratory.
6. Save/state.
7. UI/UX and accessibility.
8. Performance/compatibility.
9. Regression.
10. Release Candidate.

## Entry/exit/suspension

See `06_TEST_STRATEGY.md`. Public-release exit additionally requires Yandex preview smoke, real reload, cloud/ad checks, and no open S1/S2.

## Defect/reporting rules

Confirmed issue requires reproducible observation or deterministic static contradiction (for example control forced hidden despite active implementation). Suspicions go to Potential Defects. Retest fixes plus local regression. Evidence saved by ID.

## Smoke plan

Initial menu; mode list; Classic start; correct/wrong entry; pause/resume; persistence; completion transition; close. Platform smoke separately.

## Regression plan

- Critical: startup/generator/save/win.
- Core: all modes/input/settings/pause.
- Extended: localization/accessibility/responsive/platform.
- Full: all test cases and charters.

## Open questions

Undo intent, full package contents, browser support, platform requirements, accessibility target, telemetry policy.
