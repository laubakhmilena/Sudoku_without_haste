# CHK-15 Compatibility

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-15-001 | Chromium 144 desktop 1440x900 | QA runtime | Critical UI works | P0 | Browser | PASS |  |  |  |
| CHK-15-002 | 390x844 touch emulation | Mobile emulation | No overflow | P1 | Responsive | PASS |  |  | evidence/mobile-390x844.png |
| CHK-15-003 | 320x568 boundary | Small emulation | No overflow | P1 | Responsive | PASS |  |  | evidence/small-320x568.png |
| CHK-15-004 | 800x600 | Tablet viewport | No overflow | P1 | Responsive | PASS |  |  | evidence/tablet-800x600.png |
| CHK-15-005 | Firefox/Safari/Edge | Physical browsers | Critical path works | P1 | Browser | NOT_RUN |  |  |  |
| CHK-15-006 | Fullscreen/resize/OS scaling | Real browser | Stable layout | P2 | Window | NOT_RUN |  |  |  |
