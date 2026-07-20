# Story-driven component migrations

Hàng đợi các thay đổi COMPONENT do lane `starci-fe-story` phát hiện khi sửa story. Lane story chỉ CHỐT + ghi
vào đây, KHÔNG sửa production code — build là việc của `starci-fe-build`.

---

## 2026-07-16 — DailyQuest: surface-in-surface, bỏ khung ngoài về "card surface list"

**Trạng thái:** ⏳ PENDING (thầy đã chốt bằng prototype 2026-07-16)

**Story nào lộ ra:** không phải story sai — **story ĐÚNG, call-site chép sai**.
`Core/Card/SurfaceListCard` story `RowVariants/Bordered`
(`.storybook/stories/blocks/cards/SurfaceListCard/SurfaceListCard.stories.tsx:78-85`) demo `bordered` bằng cách
bọc card lồng trong một surface cha THẬT (`rounded-3xl bg-surface p-3 shadow-surface`) rồi mới bật `bordered`.
`Core/Card/LabeledCard` còn nói thẳng trong `usage`: *"Surface-in-surface THẬT: 1 list surface lồng trong
surface CHA nhìn thấy được (thân modal/panel)"*. Hai story này dạy đúng luật; DailyQuest lấy `bordered` nhưng
bỏ mất điều kiện đi kèm.

*(Đường dẫn story theo cây MỚI sau `9db6f33` — story đã tách khỏi `src/` sang `.storybook/stories/<REL>/`.)*

### Vấn đề

`src/components/features/dashboard/OverviewTab/index.tsx:63-67` bọc `<DailyQuest />` trong `<LabeledCard>`
**không** `frameless` → LabeledCard dựng khung `<Card>` (`bg-surface` + `shadow-surface`) = **surface 1**.
Bên trong, `src/components/features/dashboard/DailyQuest/index.tsx:103` render `<SurfaceListCard bordered>` =
**surface 2**. Hai lớp fill chồng nhau — vi phạm axis-1 §Elevation (*"KHÔNG BAO GIỜ 2 lớp fill chồng"*).

Điểm mấu chốt (thầy 2026-07-16): surface lồng chỉ hợp lệ khi nó là **một phần NHỎ** trong surface cha. Ở đây
`SurfaceListCard` chiếm gần trọn thân card → khung ngoài thành thừa, không phải phân tầng.

Ngay trên nó trong CÙNG file, `ContinueLearning` (`OverviewTab/index.tsx:57-62`) đã dùng đúng `frameless` —
tức pattern đúng có sẵn cách 5 dòng, DailyQuest chỉ là quên.

### Đề xuất — pattern canonical axis-2 §Anatomy

*"labeled list card = `LabeledCard frameless` → `SurfaceListCard` → `Row/Item` (1 surface bounded liền)"*.

| File | Dòng | Đổi |
|---|---|---|
| `features/dashboard/OverviewTab/index.tsx` | 63-65 | thêm prop `frameless` vào `<LabeledCard>` bọc `<DailyQuest />` |
| `features/dashboard/DailyQuest/index.tsx` | 103 | `<SurfaceListCard bordered>` → `<SurfaceListCard>` (top-level đọc bằng `shadow-surface`) |
| `features/dashboard/DailyQuest/index.tsx` | 86 | như trên, nhánh **skeleton** — phải đổi cùng, nếu không skeleton mirror sai layout thật |
| `features/dashboard/DailyQuest/index.tsx` | 102 | wrapper `flex flex-col gap-3` → `gap-2` (dòng `completePrompt` dưới card, neo trái — thầy 2026-07-16) |
| `features/dashboard/DailyQuest/index.tsx` | 85 | wrapper skeleton `gap-3` → `gap-2` cho khớp |

`completePrompt` (`DailyQuest/index.tsx:146-148`) đã `self-start` + đã nằm ngoài `SurfaceListCard` → giữ
nguyên, chỉ khoảng cách đổi theo wrapper.

**Prototype đã chốt:** `.artifacts/prototypes/story-DailyQuest/index.html` (hiện tại vs đề xuất).

### Blast radius

`<SurfaceListCard bordered>` có **19 call-site**. Phần lớn nằm trong modal/drawer (`PaymentModal`,
`MiniCartDrawer`, `AiQuotaModal`, `FlashcardReviewModeModal`, …) = **hợp lệ**, không đụng.

Đã soi 2 thẻ dashboard anh em bằng phép thử "một phần nhỏ":

- ✅ **`WeeklyChallengeCard/index.tsx:160`** — HỢP LỆ. Card còn chứa `passedCount` + nội dung khác, list chỉ là
  một phần nhỏ. Đúng ca ngoại lệ, **không đụng**.
- ⏳ **`UpcomingLivestreamCard/index.tsx:102,122`** — **DÍNH y hệt DailyQuest**: `SurfaceListCard bordered`
  chiếm trọn thân card (cả nhánh content lẫn skeleton). Nặng hơn 1 bậc: nó bọc bằng **`SectionCard`** —
  block LEGACY mà `LabeledCard` đã thay (JSDoc LabeledCard: *"Replaces the legacy in-card header
  (SectionCard)"*). Cần 1 lượt riêng: `SectionCard` → `LabeledCard frameless` + bỏ `bordered`. Chưa đụng lượt
  này (lane story không tự sweep); thầy quyết gộp hay tách.

### Trục

- **axis-1 §Elevation & border** — gốc luật: dark shadow vô hình → nested phải border; cấm 2 lớp fill chồng.
- **axis-2 §Anatomy** — pattern canonical `LabeledCard frameless` → `SurfaceListCard` → `Row/Item`.

### ⚠ Rule gap cho `/starci-fe-feedback` (lane story KHÔNG được ghi `.claude/`)

axis-1 §Elevation hiện định nghĩa `bordered` theo **NƠI CHỐN**: *"true = list trong modal/drawer nền tối"*.
Phép thử thầy 2026-07-16 sắc hơn — theo **TỈ LỆ**: *surface lồng chỉ hợp lệ khi nó là một phần NHỎ trong
surface cha*. Chính vì canon viết theo nơi-chốn nên DailyQuest lách qua được: nó không ở trong modal, nhưng
cũng không có dòng nào bảo nó sai. `UpcomingLivestreamCard` là bằng chứng lỗi này đã tái sinh lần thứ hai →
đây là lỗi RULE, không phải lỗi code lẻ. Cần bake vào axis-1 §Elevation + đối chiếu dòng `SurfaceListCard prop
bordered`, nếu không lần thứ ba sẽ tới.

### Verify plan (cho `starci-fe-build`)

- `npx tsc --noEmit` + `npx eslint` sạch trên 2 file đổi.
- Dashboard tab Tổng quan: card "Nhiệm vụ hôm nay" chỉ còn **1** lớp surface, đọc bằng shadow, không viền lồng.
- Dòng "Hoàn thành cả 3 để nhận N điểm" nằm NGOÀI card, neo trái, cách card `gap-2`.
- **State loading**: skeleton mirror đúng hình mới (không còn viền lồng) — vào bằng throttle/refresh.
- **State claimed / allDone**: chip "Đã nhận" và nút claim vẫn `self-start`, khoảng cách `gap-2` như caption.
- Đối chiếu mắt với `ContinueLearning` ngay trên — 2 section phải cùng một ngôn ngữ surface.
