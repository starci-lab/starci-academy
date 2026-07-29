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
| `domain/` | Nghiệp vụ StarCi rút từ entity backend + `src/` FE: thực thể · trạng thái · màn phục vụ · state phải vẽ | workflow rút lại khi code đổi |
| `feedback/` | Phiên feedback dài, mỗi phiên một thư mục (`session.md` · `baseline.json` · `round-N.md`) | `starci-fe-story-feedback-start` |

## Luật

- Skills đọc/ghi trong `.artifacts/` — **KHÔNG GHI `.claude/`** trong vòng lặp.
- 🧭 **Phép phân định canon với artifact: file này có HẠN SỬ DỤNG không?** Rút từ code nên code
  đổi là lạc hậu ⇒ **artifact**, ghi vào đây. Thầy QUYẾT nên code đổi vẫn đúng ⇒ **canon**, ghi
  vào `.claude/`. Neo 2026-07-29: `domain/` từng bị ghi nhầm vào `.claude/fe/domain/`, thầy bắt
  được vì chính nó tự khai "code đổi thì file này lạc hậu" — canon không có câu đó.
- Storybook = nguồn sự thật UI; `states/` chỉ là ảnh chụp để khỏi rescan cả `src/`.
- Brainstorm ground từ `states/` + `concepts/` — **KHÔNG search web**; thiếu dữ kiện → DỪNG hỏi thầy.
- BUILD/APPLY đẩy story `tags: ['news']` + caption "Chờ duyệt" lên Storybook — KHÔNG tự ghi `states/`.
