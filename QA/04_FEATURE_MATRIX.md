# 04 — Feature Matrix

| Feature ID | Название | Источник | Статус | Критичность | Зависимости | Позитивный сценарий | Негативный | Границы | Риск | Regression | Tests |
|---|---|---|---|---|---|---|---|---|---|---|---|
| FEAT-CORE-001 | Puzzle generation and uniqueness | game.js createPuzzle/countSolutions | CONFIRMED | Critical | mode data | unique solvable puzzle | generation failure | seed/givens | High | Yes | TC-GEN-001 |
| FEAT-CORE-002 | Number entry and validation | enterValue/checkWin | CONFIRMED | Critical | board, settings | correct/wrong input | given cell, duplicate | 1..size | High | Yes | TC-CORE-001, TC-CORE-002 |
| FEAT-CORE-003 | Notes | toggleNotesMode/notes | CONFIRMED | Medium | board | add/remove candidates | invalid candidates | 1..size | Medium | Yes | TC-CORE-003 |
| FEAT-CORE-004 | Hints and rewarded hint | requestHint/showRewardedVideo | CONFIRMED | High | SDK/board | apply free hint | no SDK/ad error | 0/99 hints | High | Yes | TC-HINT-001, TC-HINT-002, TC-HINT-003 |
| FEAT-CORE-005 | Undo | undo/history + hidden CSS | CONFIRMED | Medium | history/UI | restore previous state | empty history | 80 states | Medium | Yes | TC-CORE-UNDO |
| FEAT-CORE-006 | Completion/statistics | checkWin/updateCompletionStats | CONFIRMED | Critical | save/stats | victory | full incorrect board | time/mistakes | High | Yes | TC-WIN-001 |
| FEAT-UI-001 | Menu/mode navigation/tutorial | HTML/renderMenu/tutorial | CONFIRMED | High | translations | normal navigation | rapid clicks/back | 4 modes | Medium | Yes | TC-UI-001..004 |
| FEAT-UI-002 | Statistics/achievements | showStats/showAchievements | CONFIRMED | Medium | persistence | display values | empty data | large counts | Medium | Yes | TC-UI-STAT-001 |
| FEAT-INPUT-001 | Mouse/touch/keyboard | bindEvents/handleKey | CONFIRMED | High | DOM focus | all mapped input | simultaneous/focus loss | 1..9 | High | Yes | TC-INPUT-001, TC-INPUT-002, TC-INPUT-003, TC-INPUT-004 |
| FEAT-STATE-001 | Pause and lifecycle | pausedReasons/listeners | CONFIRMED | High | timer/save/audio | pause/resume | nested reasons | blur/hidden/ad | High | Yes | TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004 |
| FEAT-SAVE-001 | Local persistence/migration | localStorage/sanitize | CONFIRMED | Critical | browser storage | save/reload | corrupt/old save | v1/v2 | High | Yes | TC-SAVE-001, TC-SAVE-002, TC-SAVE-003, TC-SAVE-004, TC-SAVE-005 |
| FEAT-SAVE-002 | Cloud save | Player getData/setData | CONFIRMED | High | Yandex SDK | sync newer data | offline/conflict | timestamps | High | Yes | TC-CLOUD-001..004 |
| FEAT-SET-001 | Settings/reset | settings functions | CONFIRMED | Medium | save/UI/audio | persist toggles | bad config/reset cancel | booleans | Medium | Yes | TC-SET-001..004 |
| FEAT-AUDIO-001 | Sound cues | WebAudio playTone | CONFIRMED | Low | browser audio | tap/warn/win | blocked audio | on/off | Low | Yes | TC-AUDIO-001, TC-AUDIO-002, TC-AUDIO-003 |
| FEAT-LOC-001 | RU/EN localization | translations/applyLanguage | CONFIRMED | Medium | SDK lang | RU/EN texts | unsupported lang | long strings | Medium | Yes | TC-LOC-001, TC-LOC-002, TC-LOC-003 |
| FEAT-PLAT-001 | Yandex SDK lifecycle | initSdk/ready/gameplay | CONFIRMED | High | SDK host | ready/start/stop | SDK absent/error | pause/resume | High | Yes | TC-PLAT-001, TC-PLAT-002, TC-PLAT-003, TC-PLAT-004 |
| FEAT-ACC-001 | Accessibility semantics/focus | ARIA/inert/focus trap | CONFIRMED | High | DOM/CSS | keyboard/focus | hidden live feedback | responsive | High | Yes | TC-ACC-001..006 |
| FEAT-COMPAT-001 | Responsive layout | CSS media queries | CONFIRMED | High | viewport | desktop/mobile | small/landscape | 320..1440 | High | Yes | TC-COMPAT-001, TC-COMPAT-002, TC-COMPAT-003 |
