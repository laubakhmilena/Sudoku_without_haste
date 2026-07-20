# 07 — Risk Register

| Risk ID | Component | Risk | Cause | Impact | Probability | Impact level | Detectability | Test priority | Features | Tests | Action | Status |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| RISK-001 | Startup | Игра не запускается | syntax/resource/SDK | no play | Low | Critical | High | P0 | FEAT-UI-001 | BVT-001 | Keep BVT | Open |
| RISK-002 | Generator | Задача не создаётся/неуникальна | algorithm regression | mode blocked | Low | Critical | High | P0 | FEAT-CORE-001 | TC-GEN-001 | Run 200 seeds per change | Mitigated |
| RISK-003 | Stability | Crash/hang | uncaught error/heavy recursion | session lost | Low | Critical | Medium | P0 | All | Long session | Add error logging | Open |
| RISK-004 | Save | Потеря active game | storage/cloud failure | progress loss | Medium | Critical | Medium | P0 | FEAT-SAVE-001, FEAT-SAVE-002 | TC-SAVE-001, TC-SAVE-002, TC-SAVE-003, TC-SAVE-004, TC-SAVE-005, TC-CLOUD-001, TC-CLOUD-002, TC-CLOUD-003, TC-CLOUD-004 | Platform tests | Open |
| RISK-005 | Save | Corrupt/old save | schema/migration | cannot continue | Medium | High | Medium | P1 | FEAT-SAVE-001 | TC-SAVE-003, TC-SAVE-004 | Corrupt matrix | Open |
| RISK-006 | Core | Невозможно завершить puzzle | wrong solution/state | soft lock | Low | Critical | Low | P0 | FEAT-CORE-006 | TC-WIN-001, TC-WIN-002 | Full manual solve | Open |
| RISK-007 | Core | Wrong win/incorrect board accepted | check regression | invalid completion | Low | High | High | P1 | FEAT-CORE-006 | TC-WIN-002 | Full wrong board | Open |
| RISK-008 | Input | Input ignored/double fired | rapid clicks/focus | wrong board | Medium | High | Medium | P1 | FEAT-INPUT-001 | TC-INPUT-001, TC-INPUT-002, TC-INPUT-003, TC-INPUT-004 | Chaos charter | Open |
| RISK-009 | State | Pause/timer incorrect | nested pauses | record unfair | Medium | Medium | Medium | P2 | FEAT-STATE-001 | TC-STATE-001, TC-STATE-002, TC-STATE-003, TC-STATE-004 | Lifecycle matrix | Open |
| RISK-010 | Core | Undo недоступен | CSS hides control | cannot recover move | High | Medium | High | P1 | FEAT-CORE-005 | TC-CORE-UNDO | Fix/confirm design | Confirmed |
| RISK-011 | Core | Wrong notes cleanup | peer rules | misleading candidates | Medium | Medium | Medium | P2 | FEAT-CORE-003 | TC-CORE-003 | Per-mode tests | Open |
| RISK-012 | Hints | Hints exhausted/ad failure | SDK callbacks | feature unavailable | Medium | Medium | Medium | P2 | FEAT-CORE-004 | TC-HINT-001, TC-HINT-002, TC-HINT-003 | Preview test | Blocked |
| RISK-013 | UI | HUD values overflow/negative | long session/corrupt data | unreadable | Low | Medium | High | P2 | FEAT-UI-002 | TC-UI-HUD-001 | Boundary data | Open |
| RISK-014 | Compatibility | Small viewport clipping | responsive rules | actions hidden | Medium | High | High | P1 | FEAT-COMPAT-001 | TC-COMPAT-001, TC-COMPAT-002, TC-COMPAT-003 | Physical devices | Mitigated |
| RISK-015 | Accessibility | Critical feedback only visual/hidden | CSS/ARIA | screen reader user blocked | High | High | High | P1 | FEAT-ACC-001 | TC-ACC-001 | Expose live region | Confirmed |
| RISK-016 | Accessibility | Color/contrast insufficient | palette | low vision difficulty | Medium | Medium | Medium | P2 | FEAT-ACC-001 | Contrast audit | Measure states | Open |
| RISK-017 | Performance | Generator/loading slow | pathological seed/device | abandonment | Low | High | Medium | P1 | FEAT-CORE-001 | TC-PERF-001 | Low-end device | Open |
| RISK-018 | Performance | Memory growth long session | timers/audio/history | degradation | Medium | Medium | Low | P2 | All | TC-PERF-002 | 60m session | Open |
| RISK-019 | Platform | SDK ready/gameplay signals incorrect | API change | moderation/metrics | Medium | High | Low | P1 | FEAT-PLAT-001 | TC-PLAT-001, TC-PLAT-002, TC-PLAT-003, TC-PLAT-004 | Platform preview | Blocked |
| RISK-020 | Cloud | Clock conflict overwrites newer progress | updatedAt strategy | data loss | Medium | High | Low | P1 | FEAT-SAVE-002 | TC-CLOUD-004 | Conflict tests | Open |
| RISK-021 | Audio | AudioContext blocked/silent | browser policy | no feedback | Medium | Low | Medium | P3 | FEAT-AUDIO-001 | TC-AUDIO-001, TC-AUDIO-002, TC-AUDIO-003 | Physical browser | Open |
| RISK-022 | Localization | Mixed/trimmed text | fallback/viewport | confusion | Medium | Medium | High | P2 | FEAT-LOC-001 | TC-LOC-001, TC-LOC-002, TC-LOC-003 | EN runtime | Open |
| RISK-023 | Security | Secrets/PII leak | SDK/data fields | privacy issue | Low | Critical | Medium | P0 | FEAT-SAVE-002 | Static review | No secrets found | Mitigated |
| RISK-024 | Package | Missing referenced icon | incomplete archive | 404/cosmetic | Medium | Low | High | P2 | FEAT-UI-001 | Asset check | Confirm release package | Potential |
| RISK-025 | Physics/Collisions | Не применимо | no physics | none | Low | Low | High | P3 | N/A | N/A | N/A | N/A |
| RISK-026 | Resources | Negative/overflow counters | corrupt data/long play | bad HUD/stats | Low | Medium | Medium | P2 | FEAT-UI-002 | Boundary tests | Sanitize more fields | Open |
| RISK-027 | Window | Alt+Tab/focus state race | blur+visibility order | timer/audio state | Medium | Medium | Medium | P2 | FEAT-STATE-001 | TC-STATE-003 | Real browser | Open |
| RISK-028 | Progress | Mode replacement without intent | modal/rapid input | active game loss | Low | High | High | P1 | FEAT-UI-001 | TC-UI-REPLACE | Rapid click test | Open |
| RISK-029 | Save | Close during save | async cloud pending | cloud stale | Medium | High | Low | P1 | FEAT-SAVE-002 | TC-CLOUD-003 | Throttle/network tests | Blocked |
| RISK-030 | External services | SDK/ad unavailable | network/platform outage | degraded hints/cloud | High | Medium | High | P2 | FEAT-PLAT-001 | TC-PLAT-003 | Graceful fallback | Open |
