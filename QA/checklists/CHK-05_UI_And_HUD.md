# CHK-05 UI And HUD

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-05-001 | Timer/mistakes/hints/progress visible | Game | Correct labels/values | P0 | UI | PASS |  |  | evidence/TC-CORE-mini_mobile.png |
| CHK-05-002 | Progress uses correct cells | Correct/wrong input | Only correct increases | P1 | UI | PASS | Observed correct calculation via code/runtime |  |  |
| CHK-05-003 | Large numbers/text do not overflow | Injected boundaries | Readable HUD | P2 | Boundary | NOT_RUN |  |  |  |
| CHK-05-004 | Focus indicator visible | Keyboard | Visible outline | P1 | Accessibility | PASS | CSS focus-visible and runtime keyboard |  |  |
| CHK-05-005 | Status feedback accessible | Wrong move | aria-live announced | P1 | Accessibility | FAIL | display:none removes live region | BUG-002 | logs/tests.log |
