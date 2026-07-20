# 21 — Solo Developer QA Workflow

## Before each commit

Test changed function, inspect console/state, then one neighbor feature. Run `node --check` and generator self-test for logic changes.

## Before a test build

BVT → smoke → critical path → save/continue → known-issue retests → update changelog.

## Before release

Clean package, platform preview, full smoke, Critical + Core regression, one exploratory charter, natural solve, 30–60 minute session, device/accessibility pass, readiness report and known issues.

## After a bug fix

Reproduce old failure → confirm expected result → local regression → neighboring systems → update bug/status/evidence.

## Minimal impact suites

| Change | Minimum checks |
|---|---|
| UI/CSS | affected view + 320/390/800/1440 + keyboard focus + modal |
| Input | mouse, keyboard, touch emulation, rapid input, pause |
| Generator/rules | 200-seed self-test + each mode + win/wrong board |
| Save | create/load/corrupt/migrate/reset + cloud preview |
| Settings | default/change/restart/reset + dependent behavior |
| Balance/givens/hints | all modes + boundary hints + achievement impact |
| SDK/dependency | local no-SDK + Yandex preview ready/gameplay/cloud/ad |
| Crash fix | exact repro + 20 repetition + neighboring state/save |
| Release | RC checklist + Critical/Core regression + platform/device |

Keep the default daily suite under 10–15 minutes; reserve full regression for release candidates.
