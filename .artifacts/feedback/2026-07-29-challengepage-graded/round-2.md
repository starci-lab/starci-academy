# Vòng 2 — 2026-07-30

Thầy đưa ảnh khoanh 7 điểm trên `--graded`. Dịch sang component thật, xác nhận lại 2 điểm có
blast radius rộng trước khi động (đúng luật B1), thầy chốt cả hai. Đã áp 5/7 điểm; 2 điểm (#5
vàng, "gợi ý" đỏ) **chưa áp — còn chờ xác nhận nội dung**, xem mục "Còn treo".

## Bảy điểm, kết quả

| # | Màu | Việc | Trạng thái |
|---|---|---|---|
| 1 | 🔴 đỏ | bỏ `TrophyIcon` khỏi "N điểm" | ✅ áp |
| 2 | ⬛ đen | status trước difficulty, cụm chuyển phải (`justify="between"` + StackH lồng) | ✅ áp |
| 3 | (đen) | icon circle-cross cho chip "Trượt" | ✅ áp |
| 4 | 🟩 xanh lá | bỏ `parseInlineCode` khỏi title accordion — đảo quyết định 2026-07-29 | ✅ áp, cả 8 consumer |
| 5 | 🟨 vàng | outputs "GET /tasks…" tương tự lệch #4 | ⏸️ **CHƯA rõ nghĩa, chưa áp** |
| 6 | 🟪 tím | icon circle-cross cho chip "Chưa đạt" | ✅ áp |
| 7 | 🟦 xanh dương | feedback → accordion surface-in-surface (`variant="nested"`) | ✅ áp |

## Hai xác nhận trước khi áp #3/#4/#6

**#4 — đảo quyết định 2026-07-29** (`SurfaceCard.tsx:1552`, tự ghi "thầy chốt... goes through
`parseInlineCode`"). Hỏi lại: đảo hẳn (áp cả 8 consumer) hay chỉ sửa content? **Thầy chọn: đảo
hẳn.** Đã bỏ `parseInlineCode` khỏi `Typography` trong `.Accordion` trigger, cập nhật JSDoc, và
dọn 4 chỗ content trong story fixture còn backtick thật (`title: "...cho `Task`"` → bỏ backtick,
2 file: `ChallengePage.stories.tsx` ×3, `ChallengeBrief.stories.tsx` ×1) — nếu không dọn, sau
khi bỏ cơ chế parse thì backtick sẽ hiện THÔ trên màn.

**#3/#6 — mở API `EnumChip` cho icon, ảnh hưởng 14 consumer.** Lần đầu em viết
`icon?: IconComponent` (nhận thẳng component Phosphor) — **thầy bác đúng**: *"trò phải thêm
option kiểu iconString: 'x, check,...' chứ làm vậy hơi chung"*. Sửa lại theo đúng tiền lệ có sẵn
trong cùng file (`ListMark = "check"|"cross"|"pending"|"none"` + `markIcon()` ở
`SurfaceCard.tsx`): `EnumChipIcon = "check" | "cross"` (union đóng), map nội bộ
`ENUM_CHIP_ICON_MAP` sang component thật. `STATUS_MAP.failed` và `VERDICT_MAP.fail` chỉ khai
`icon: "cross"`, không import Phosphor trực tiếp ở call-site nữa.

## File đã đụng

| File | Fix |
|---|---|
| `composites/chips/EnumChip/EnumChip.tsx` | thêm `EnumChipIcon` union đóng + `icon` field, additive |
| `starci/blocks/learn/ChallengeHeader/ChallengeHeader.tsx` | bỏ trophy · đổi thứ tự+vị trí meta · `STATUS_MAP.failed` icon |
| `starci/blocks/learn/ChallengeDeliverableList/ChallengeDeliverableList.tsx` | `VERDICT_MAP.fail` icon · feedback → `SurfaceCardAccordion variant="nested"` |
| `composites/cards/SurfaceCard/SurfaceCard.tsx` | bỏ `parseInlineCode` khỏi `.Accordion` title (8 consumer) |
| `stories/.../ChallengePage.stories.tsx`, `ChallengeBrief.stories.tsx` | dọn backtick trong title fixture |

## Verify

- `tsc --noEmit`: 0 lỗi (chạy lại 3 lần qua từng cụm fix)
- 10/10 cổng xanh, 0 orphan-parts
- eslint sạch trên mọi file mới đụng (4 lỗi cũ ở `SurfaceCard.tsx` không đổi số, xác nhận không do lượt này)
- Đo DOM thật: icon trophy đã mất · thứ tự chip `["Trượt","Trung bình",...]` đúng · chip status có `<svg>` · title accordion = `"Dựng API CRUD cho Task"` không còn code-pill · 4 node `SurfaceCardAccordion` xuất hiện (xác nhận feedback đã thành accordion)

## #5 và "Gợi ý" — ĐÃ ĐÓNG, không sửa gì, xác minh bằng `src` thật

**#5 (vàng) — KHÔNG PHẢI BUG.** Đọc `src/components/features/learn/Challenge/ChallengeView/
index.tsx:275-284` (real app): outputs render qua `CheckListCard`/`CheckListItem` +
`<MarkdownContent markdown={item.body} .../>`, và code có **comment tự giải thích**:
*"shared check-list card: tick-led rows, markdown body keeps inline code"* — inline-code style
cho `` `GET /tasks` `` là **CỐ Ý**, không phải lỗi. `ChallengeBrief.tsx` hiện đã khớp y hệt cơ
chế đó. Giả thuyết ban đầu của em (tier sai, nên downgrade sang `RichText`) — **sai**, neo thật
đã bác trước khi kịp sửa. Không đụng code.

**Đỏ "Gợi ý" — KHÔNG CÓ NỘI DUNG THẬT ĐỂ CHÉP.** `ChallengeView/index.tsx:154`:
`const hint = challenge?.hint?.trim() ?? ""` — field đọc từ **backend/DB** (giống `title`/
`description`), không hardcode trong FE. Không có "câu đúng" nào để đối chiếu — mock nào cũng
hợp lệ, cùng loại với mọi field DB-driven khác. Cơ chế render khớp thật (`MarkdownContent`, dòng
309 real source). Không đụng content.
