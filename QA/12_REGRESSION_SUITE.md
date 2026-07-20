# 12 — Regression Suite

## Critical Regression

Run after any gameplay, generator, save or release change: BVT-001, TC-GEN-001, TC-MODE-DIAGONAL, TC-MODE-IRREGULAR, TC-MODE-CLASSIC, TC-MODE-MINI, TC-CORE-001, TC-CORE-002, TC-SAVE-001, TC-WIN-001. Estimated effort: small (minutes) in automated QA runtime, plus one natural manual solve before release.

## Core Regression

Critical + notes, hints, pause, input, settings, mode replacement, reset. Run before every test build or after shared-state changes.

## Extended Regression

Core + responsive viewports, localization, accessibility, audio, corrupt save and SDK failure paths. Run before release candidate.

## Full Regression

All test cases, platform preview, browser/device matrix, long-session charter and all known-bug retests. Run before public release or major refactor.

Criteria: no failed critical tests; failures have accepted risk; all blocked platform tests resolved for public release.
