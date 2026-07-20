# CHK-16 Accessibility

Build: `source-artifact-2026-07-20 / game.js sha256 e347f3f65ac2`

| Check ID | Проверка | Предусловие | Ожидаемый результат | Priority | Type | Status | Комментарий | Bug | Evidence |
|---|---|---|---|---|---|---|---|---|---|
| CHK-16-001 | Keyboard cell navigation | Active game | Arrows work | P0 | Keyboard | PASS |  |  |  |
| CHK-16-002 | Visible focus | Keyboard | Focus ring visible | P1 | Focus | PASS |  |  |  |
| CHK-16-003 | Modal focus trap/initial focus | Open pause | Focus contained | P1 | Focus | PASS | Initial focus verified; full trap partially static-reviewed |  |  |
| CHK-16-004 | Live feedback exposed | Trigger message | Screen reader can perceive | P0 | Screen reader | FAIL | display:none | BUG-002 | logs/tests.log |
| CHK-16-005 | Text contrast/size measured | All states | Meets chosen target | P1 | Visual | NOT_RUN |  |  |  |
| CHK-16-006 | Critical info not color-only | Errors/progress | Text/ARIA alternative | P1 | Perceivable | NOT_RUN | Partially reviewed statically; complete check not executed |  |  |
| CHK-16-007 | Screen reader on NVDA/VoiceOver | Physical AT | Playable flow | P0 | AT | BLOCKED | AT unavailable |  |  |
