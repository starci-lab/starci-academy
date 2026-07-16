# .artifacts/ — artifact động của Claude-skills

Artifact động do Claude-skills sinh ra, **sống cạnh code** trong source FE.
`.claude/` là RULE **read-only** — skills chỉ ĐỌC rule, mọi output động ghi vào ĐÂY.

## Cấu trúc

| Thư mục | Nội dung | Ai ghi |
|---|---|---|
| `states/` | Snapshot Storybook/component hiện trạng + diff incremental | `starci-fe-sync` (duy nhất) |
| `concepts/` | Định hướng feature (ý đồ · người dùng · outcome) — nguồn brainstorm thay web | brainstorm skills |
| `prototypes/` | Prototype flow HTML bấm-được (host :8080) | brainstorm/variants skills |
| `proposals/` | Hàng đợi CHỐT → BUILD (`BACKLOG.md`) | brainstorm ghi, apply đánh dấu ✅ |

## Luật

- Skills đọc/ghi trong `.artifacts/` — **KHÔNG GHI `.claude/`** trong vòng lặp.
- Storybook = nguồn sự thật UI; `states/` chỉ là ảnh chụp để khỏi rescan cả `src/`.
- Brainstorm ground từ `states/` + `concepts/` — **KHÔNG search web**; thiếu dữ kiện → DỪNG hỏi thầy.
- BUILD/APPLY đẩy story `tags: ['news']` + caption "Chờ duyệt" lên Storybook — KHÔNG tự ghi `states/`.
