# 05 — Typography (spec thật + canonical)

Audit grounded từ code. Phần A = **thực trạng**, B = **canonical** (chuẩn để vibe page mới), C = **drift cần sửa** (chỗ đang sai/lệch).

---
## A. Thực trạng

### Font (⚠️ đang mâu thuẫn — bug ưu tiên #1)
- App **load `Open Sans`** (`next/font/google`) ở `src/app/[locale]/layout.tsx` → gán thẳng `body className={font.className}`. Không cấu hình `weight`/`display`/`fallback`.
- Nhưng `globals.css` có `--font-sans: var(--font-inter)` mà **`--font-inter` KHÔNG được định nghĩa ở đâu cả** → component HeroUI đọc `--font-sans` nhận biến rỗng (fallback browser). Doc cũ ghi "Inter" cũng sai.
- `--font-mono` không định nghĩa → `font-mono` (10 chỗ) dùng mono mặc định Tailwind.
- **Kết luận:** title/body/mono đều **Open Sans** (không có display font riêng). Cần chốt 1 font rồi wire `--font-sans` đúng (xem C-1).
- KHÔNG có `tailwind.config`, KHÔNG `@theme`, KHÔNG base style `h1..h6/p/body` → heading chỉ có size do utility class.

### Type scale đang dùng (đếm trên `src/`)
| Size | Count | Vai trò chính |
|------|------|---------------|
| `text-sm` | 213 | **body/description/label mặc định** |
| `text-xs` | 84 | meta, chip, eyebrow uppercase, hint |
| `text-base` | 33 | section heading, card title (Module), modal header |
| `text-lg` | 33 | card title (Learn), section heading (Modules/QnA) |
| `text-2xl` | 38 | title trang phụ / modal |
| `text-4xl` | 5 | title trang chính (Course detail), Score |
| `text-3xl/xl/5xl/6xl` | 8/7/2/1 | hero landing (thường kèm `md:`) |
| arbitrary | — | `text-[9px]`,`text-[10px]`, và `text-md` (KHÔNG hợp lệ) |

Weight: `font-semibold` ×95 (heading phổ biến) · `font-bold` ×61 (title) · `font-medium` ×41 · `font-normal` ×4.
Leading: `leading-relaxed` ×11. Tracking: chỉ trên eyebrow uppercase + hero.

---
## B. Canonical (DÙNG CHO PAGE MỚI)

> Bám đúng thang này khi vibe; chỉ lệch khi có lý do.

| Vai trò | Class chuẩn | Ghi chú |
|--------|-------------|---------|
| **Display / page hero** | `text-4xl font-bold` | Title trang full (Course detail). Mobile có thể `text-3xl md:text-4xl` |
| **Title trang phụ / modal** | `text-2xl font-bold` | Module overview, modal lớn |
| **Section heading** | `text-lg font-semibold` | "Giới thiệu", "Nội dung", "Lộ trình" — **1 spec duy nhất** |
| **Card / sub heading** | `text-base font-semibold text-foreground` | Card title, heading nhỏ trong panel |
| **Body** | `text-sm` | Văn bản mặc định |
| **Description / muted** | `text-sm text-muted` | Đoạn phụ dưới title — token muted **canonical = `text-muted`** (⚠️ `text-foreground-500/400/600` KHÔNG tồn tại trong project → đổi hết về `text-muted`) |
| **Label / eyebrow** | `text-xs text-muted` (**normal case**) | Nhãn nhóm/section. ⚠️ **KHÔNG all-caps** (theo rule nội dung). `uppercase tracking-wide` chỉ khi là **badge nhấn có chủ ý** (vd `text-accent`). Trong modal → divider song song (xem 07) |
| **Meta / hint / chip** | `text-xs text-muted` | "15 phút đọc", hint |

Weight: title=`bold`, heading/card=`semibold`, sub-label/price=`medium`. KHÔNG dùng thin/light/extrabold.
Radius (gợi ý hội tụ): card `rounded-xl`, control nhỏ `rounded-medium`, pill `rounded-full`. Token `--radius:0.5rem`.

---
## C. Drift cần sửa (file:ref)

**C-1. Font (bug gốc).** Chốt font → nếu giữ Open Sans: đổi `globals.css:55` `--font-sans: var(--font-open-sans)` + gán `variable` ở layout. Nếu muốn Inter: load Inter qua `next/font` + định nghĩa `--font-inter`. Bỏ "Inter" sai trong doc (đã sửa). (`layout.tsx:7` ↔ `globals.css:55`)

**C-2. Title size loạn** → đưa về B:
- `Module/index.tsx:79` `text-2xl` (ok — title phụ), `CourseHeader:32` `text-4xl` (ok — page hero), nhưng `ChallengeModal:77` title chỉ `text-base font-semibold` → nên `text-2xl font-bold` (hoặc giữ nhỏ có chủ đích, nhưng cần thống nhất).

**C-3. Section heading 3 spec** → gộp về `text-lg font-semibold`:
- `Modules:64` `text-lg font-semibold` ✅ chuẩn.
- `QnA:30` `text-lg font-medium text-foreground-500` → bỏ `font-medium`+màu.
- `Module:96,113` & `ChallengeModal:111,119` & `ChallengeRequirements:41` `text-base font-semibold` → nâng lên `text-lg`.

**C-4. Card title 2 size** → chọn `text-base font-semibold`:
- `Learn/.../ContentCard:41` `text-lg` vs `Module/ContentCard:22` `text-base` → thống nhất.

**C-5. Màu muted loạn** → canonical = **`text-muted`** (chốt). ⚠️ `text-foreground-500` (×48), `text-foreground-400` (×5), `text-foreground-600` (×1), `text-default-500` (×1) **KHÔNG tồn tại** trong project (render rỗng) → đổi **tất cả** về `text-muted`. (`text-muted` là token muted thật, đang dùng ×144.)

**C-6. Eyebrow uppercase loạn** (4 weight × 3 tracking × 3 màu) → 1 spec ở B. Sửa: `SepayCheckout/DetailRow:46`, `LanguageModal/LanguageCard:35`, `MobileNavbar:105,121`, `ModelCard:54`, `CVCard:70`, `PersonalProjectAttemptCard:48`, `PaymentModal:174`.

**C-7. Class chết / sai** (sửa ngay, low-risk):
- `text-md` (`SepayCheckout/DetailRow:55`) — không hợp lệ → `text-sm`/`text-base`.
- `w-ful` typo (`ChallengeModal:76`) → `w-full`.
- ~~`card--default`~~ → ĐÃ xác minh là **HeroUI variant thật** (`@heroui/styles` `.card--default { @apply bg-surface }`) → giữ nguyên, KHÔNG xoá.
- `.accordion__trigger` định nghĩa trùng trong `globals.css` (`:101` p-3 và `:127` pb-1.5) → gộp.

**C-8. Vertical rhythm** dùng `<div className="h-2/h-3/h-6/h-12/h-4.5">` rải rác mỗi file khác nhau → nên dùng `space-y-*`/`gap-*` thống nhất (vd block trong section `gap-6`).

---
## Layout metrics (thật)
- Page wrapper Course detail: `p-3 max-w-[1280px] mx-auto`. (max-w khác trong repo: `4xl`×10, `2xl`×4, `7xl`×2…)
- Grid: Course detail `grid grid-cols-1 md:grid-cols-5 gap-12` (3/2); Module cards `grid-cols-1 gap-3 md:grid-cols-2`; ChallengeModal body `grid-cols-1 lg:grid-cols-5` (2/3), cao `lg:h-[calc(100vh-80px)]`.
- Card padding: `.card { p-3 }` (globals.css); panel lớn `p-6/p-4`.
