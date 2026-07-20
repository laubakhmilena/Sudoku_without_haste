# 24 — Open Questions

| ID | Question | Why important | Component | Current assumption | Risk | Recommended resolution |
|---|---|---|---|---|---|---|
| Q-001 | Undo intentionally hidden? | Determines BUG-001/design | Gameplay UI | Assume unintended | May close valid feature bug | Decide and document; expose or remove code/text |
| Q-002 | What is complete release archive? | Missing icon/manifest | Packaging | Only 3 source files supplied | False package defect or failed release | Provide archive/repository |
| Q-003 | Exact target browsers/devices? | Compatibility scope | Platform | Modern web/Yandex | Unsupported device issues | Define minimum matrix |
| Q-004 | Required accessibility target? | Release criteria | Accessibility | Best-effort WCAG 2.2/XAG | Under/over-testing | Choose target and AT matrix |
| Q-005 | Cloud conflict policy? | Data loss risk | Save | Latest updatedAt wins | Clock skew can overwrite | Define deterministic conflict policy |
| Q-006 | Can old v1 fixtures be provided? | Migration verification | Save | Migration intended | Legacy users may lose active game | Supply anonymized fixtures |
| Q-007 | Is rewarded ad mandatory for hints? | Offline behavior | Ads | No SDK gives no extra hints | Poor offline experience | Confirm fallback design |
