# Atom `Chip` — audit tổng hợp (B1 props · B2 states · B3 deps)

> **Lane READ-ONLY.** Không sửa file nào, không chạy `git`, không chạy `tsc`.
> Canon: `.claude/fe/principles.md` §12a · §12b · §12c · §12d · §12f · §12g · §5.0 · §5.0a.
> Ca mẫu đối chiếu: `atoms/buttons/Button/` (đã tách `button-tokens.ts` · `ButtonBase.tsx` ·
> `ButtonGroup.tsx` · `Button.tsx`) + `stories/atoms/buttons/Button/Button.Base.stories.tsx`.

---

## 0. TRẠNG THÁI NGUỒN — ba báo cáo KHÔNG cùng một bản code

Tôi đã **tự đọc lại** file component + hai file story trước khi tổng hợp. Ba báo cáo con
đang mô tả **ba ảnh chụp khác nhau**, phải chốt cái này trước khi đọc phần dưới:

| Nguồn | Bản mà báo cáo đó đọc | Còn đúng? |
|---|---|---|
| **B1 (props)** | `Chip.tsx` **208 dòng**, `variant` pill/bare ĐÃ XOÁ | ✅ đúng bản hiện tại |
| **B2 (states)** | bản CŨ, còn `variant="pill" \| "bare"` | ❌ **STALE toàn bộ trục `variant`** |
| **B3 (deps)** | `Chip.tsx` **237 dòng**, còn nhánh `bare` + `HeroTypography` | ❌ **STALE** phần code |

### Ba điểm MÂU THUẪN — nói thẳng, không chọn bừa

| # | Mâu thuẫn | Sự thật đã verify |
|---|---|---|
| **M1** | B2 dựng cả một bộ leaf quanh `variant` (`Chip.Dot/Variants`, hàng `bare`, `DOT_PX {pill:6,bare:12}`, skeleton 2-gạch cho bare); B3 cũng lên `splitPlan` cho nhánh `bare` | **`variant` KHÔNG CÒN TỒN TẠI.** `Chip.tsx` hiện tại (208 dòng) không có chữ `variant` nào ngoài `variant="soft"` của HeroUI. `grep variant={"bare"\|"pill"}` toàn `.storybook` = **0 hit**. ⇒ **Bỏ hết** phần `bare`/`DOT_PX`/skeleton-2-gạch trong B2 và B3. |
| **M2** | B1 báo "STORY MỒ CÔI / tsc đỏ: `Chip.Dot.stories.tsx` leaf `Variants` dòng 49-76 còn truyền `variant`"; B3 liệt kê **9 leaf** trong đó có `Variants` | **SAI cả hai.** `Chip.Dot.stories.tsx` hiện có đúng **4 export**: `Default · Colors · Removable · Loading`. Không có `Variants`. **Không có story mồ côi, không có tsc đỏ.** Tổng bộ leaf hiện tại = **8**, không phải 9. |
| **M3** | B1 báo "import CHẾT `Typography as HeroTypography` dòng 2" | **SAI.** Dòng 2 hiện tại là `import { Chip as HeroChip, Skeleton as HeroSkeleton, cn } from "@heroui/react"` — không còn `HeroTypography`. Người xoá `bare` đã dọn luôn. |

> ⇒ Ba "lỗi" nặng nhất trong nhóm `khác` của B1 (story mồ côi · tsc đỏ · import chết) **đều
> đã được sửa rồi**. Đừng giao agent đi sửa chúng.

### Bộ leaf HIỆN TẠI (verify tay, 8 leaf / 2 file)

| File | export | prop đang trưng |
|---|---|---|
| `Chip.stories.tsx` (`Atoms/Chips/Chip/Chip.Base`) | `Base` | (trần) |
| " | `WithIcon` | `icon` |
| " | `Removable` | `onRemove` |
| " | `Loading` | `isSkeleton` |
| `Chip.Dot.stories.tsx` (`Atoms/Chips/Chip/Chip.Dot`) | `Default` | (trần) |
| " | `Colors` | `dotClassName` |
| " | `Removable` | `onRemove` |
| " | `Loading` | `isSkeleton` |

---

## 1. BỘ LEAF ĐỀ XUẤT

Bộ leaf phụ thuộc câu hỏi **Q1** ở §4 (gộp `Chip.Dot` vào `Chip.Base` hay không). Tôi ghi
**cả hai kịch bản**, không tự chốt — vì §12a của canon **đang neo đích danh** `Chip {Base, Dot}`
là hình thái thật (principles.md dòng 462).

### 1A. Kịch bản GIỮ HAI MEMBER (không đụng canon) — **8 → 10 leaf**

#### `Chip.Base` — 4 → 5 leaf

| # | Leaf đề xuất | prop | Render những gì | Δ so với hiện tại |
|---|---|---|---|---|
| 1 | `Default` | — (trần) | 1 ô `<Chip.Base text="Draft" />`. Mốc: mọi leaf dưới chỉ khác nó ĐÚNG một prop. Anatomy chỉ có `Label`. | **ĐỔI TÊN** `Base` → `Default` (khuôn `Button.Base/Default`) |
| 2 | `Tones` | `tone` | **Hàng 1** — đủ union 5 giá trị text-only: `neutral · success · warning · danger · accent`. **Hàng 2** — cùng 5 giá trị nhưng bật kèm `icon` + `onRemove`, để thấy tone nhuộm CẢ glyph (ăn `currentColor`) lẫn nút × (`hover:bg-current/15`), không chỉ nền. | **THÊM** ⚠️ đang thiếu hẳn — 5 giá trị union không có chỗ tra; `success`/`accent` đang nằm lạc trong `WithIcon`/`Removable` (đúng bẫy §12g dòng 521-523) |
| 3 | `Icon` | `icon` | **Hàng 1** — đổi HÌNH, 4 ô cùng tone: `CheckCircleIcon · XCircleIcon · ClockIcon · LockIcon` (README: chỉ icon PHỔ QUÁT, outline, story KHÔNG truyền `weight`). **Hàng 2** — cùng glyph, đổi `tone` 3 ô. **Hàng 3** — ca kèm `onRemove` (icon + label + ×, đủ 3 part). | **ĐỔI TÊN** `WithIcon` → `Icon` (leaf gọi theo tên prop) + **làm dày**: hiện chỉ 1 ô, 1 glyph |
| 4 | `Removable` | `onRemove` | **Hàng 1** — 3 ô: text + × · icon + text + × · `tone="danger"` + × (× ăn tone). **Hàng 2** — 2 ô skeleton đối chiếu `w-16` (trần) cạnh `w-20` (removable), vì `onRemove` đổi cả hộp shimmer. KHÔNG đẻ ô cho `removeLabel` (chỉ `aria-label`, không có hình). | **GIỮ** + làm dày (hiện 1 ô) |
| 5 | `Skeleton` | `isSkeleton` | Sau khi sửa lỗi A2 (xem §2): đủ tổ hợp footprint **trần / +glyph / +× / +cả hai**. Nếu chưa sửa atom thì chỉ ra được 2 ô (`w-16`/`w-20`) — và **đó chính là bằng chứng lỗi**, không phải cớ bớt ô (§12g dòng 532). | **ĐỔI TÊN** `Loading` → `Skeleton` + làm dày; **bỏ** `text="Verified"` thừa (nhánh skeleton xét trước, không đọc `text`) |

#### `Chip.Dot` — 4 → 5 leaf

| # | Leaf đề xuất | prop | Render những gì | Δ |
|---|---|---|---|---|
| 1 | `Default` | — | 1 ô `<Chip.Dot text="Đang hoạt động" dotClassName="text-success" />`. Anatomy `Dot` + `Label`. | **GIỮ** |
| 2 | `DotColor` | `dotColor` **+** `dotClassName` (GỘP một leaf) | **Hàng 1** — token Tailwind qua `dotClassName`: `text-success · text-warning · text-danger · text-accent · text-muted`. **Hàng 2** — hex NGOÀI bảng token qua `dotColor`: `#3178c6` · `#f7df1e` · `#e34c26` (ca dùng thật = GitHub language colours, `_legacy/LanguageChip`). | **GỘP + ĐỔI TÊN** `Colors` → `DotColor`; **THÊM hàng `dotColor`** (prop này hiện KHÔNG có chỗ tra nào) |
| 3 | `Removable` | `onRemove` | **Hàng 1** — 2 ô pill: text + × · chấm màu khác + × (chứng minh × luôn foreground vì body trung tính — **KHÁC** `Chip.Base` nơi × ăn tone). **Hàng 2** — 2 ô skeleton `w-16` / `w-20`. | **GIỮ** + làm dày |
| 4 | `Skeleton` | `isSkeleton` | 2 ô: `w-16` / `w-20`. Ghi note: shimmer của `Chip.Dot` và `Chip.Base` là **hai bản copy cùng chuỗi class** ⇒ phải hạ xuống `chip-tokens.ts`. | **ĐỔI TÊN** `Loading` → `Skeleton`; **bỏ** `text` thừa (sau khi sửa A5 thì `text` mới optional được) |
| 5 | `Tones` | `tone` | Chỉ tồn tại **nếu** thầy duyệt A4 (mở `tone` cho Dot). Nếu không mở → **KHÔNG có leaf này**. | **THÊM (chờ Q2)** |

> ⛔ **KHÔNG dựng** (theo B2, đã lọc lại theo code hiện tại): ô `bare`, ô `bare + onRemove`,
> ô skeleton-2-gạch, leaf `Variants` — **`variant` không còn tồn tại**.

### 1B. Kịch bản GỘP `Chip.Dot` vào `Chip.Base` — **8 → 6 leaf**

`Chip.Base`: `Default · Tones · Icon · Dot · Removable · Skeleton`
(leaf `Dot` = ô glyph dẫn đầu ở dạng chấm; `Chip.Dot.stories.tsx` **XOÁ** cả file).
Chi tiết + rào cản kỹ thuật: xem **Q1** ở §4.

### Tổ hợp CỐ Ý bỏ (ghi vào `note` của leaf, không đẻ ô)

| Tổ hợp | Vì sao bỏ |
|---|---|
| `isSkeleton` × `tone` (5 ô) | `HeroSkeleton` không mang tone ⇒ 5 ô y hệt. **Cố ý**: shimmer trung tính là đúng — chưa có nội dung thì chưa có nghĩa để tô màu. Render 1 ô + note. |
| `isSkeleton` × `text` | Nhánh `isSkeleton` xét TRƯỚC, không đọc `text` ⇒ hai ô y hệt. Đúng thiết kế §12c. |
| `dotColor` hex TRÙNG token | `#17c964` và `text-success` ra cùng một chấm. `dotColor` chỉ có nghĩa khi màu NGOÀI bảng token. |
| `dotColor` + `dotClassName` cùng lúc | `style.color` inline luôn thắng class ⇒ hình y hệt ô chỉ-`dotColor`. Luật ưu tiên là thông tin API → viết vào `note`, không đẻ ô. |
| leaf riêng cho `dotColor` tách khỏi `dotClassName` | Hai CỬA vào **một kênh hình** (`currentColor`). Tách ra thành hai leaf trùng dạng. Đây là **ngoại lệ có lý do** của §12g — phải ghi vào `reason` của leaf để lần sau không ai tách lại. |

---

## 2. LỖI ATOM PHẢI SỬA

Cột **Chắc?** = mức bằng chứng: ✅ đã verify tận file · ⚠️ cần thầy chốt hoặc verify bằng mắt.

| # | Lỗi | Bằng chứng | Cách sửa | Chắc? |
|---|---|---|---|---|
| **A1** | **Bảng token bị rơi — không có `chip-tokens.ts`** | Họ `Chip` chỉ có `chip-tone.ts` (16 dòng, mỗi bảng màu). Mọi số đo nằm CỨNG inline **và nhân đôi**: skeleton `h-7`+`w-20/w-16` (dòng 79 **và** 162) · nút × className ~250 ký tự **copy nguyên văn** (dòng 100 **và** 190 — **và bản thứ 3** ở `atoms/chips/StatusChip/StatusChip.tsx:125`) · `[&_svg]:size-3` · icon `size-3.5`+`weight="bold"` (dòng 90) · chấm `width={6} height={6}` (dòng 177) · `variant="soft" size="md"` (dòng 85, 181). | Tách `chip-tokens.ts` theo khuôn `button-tokens.ts` (file **chỉ export bảng/type** ⇒ không lọt vào deps tree): `IconComponent` · `ICON_CLS` · `ICON_WEIGHT` · `DOT_PX` · `SKELETON_H` · `SKELETON_W` · `REMOVE_BTN_CLS`. Nút × thì **ưu tiên dựng lại một chỗ** hơn là token-hoá bản sao (xem A6). | ✅ |
| **A2** | **`SKELETON_W` không tính ô glyph** — footprint SAI | `cn("h-7 rounded-full", onRemove ? "w-20" : "w-16")` ở CẢ hai member. Chip có `icon` (hoặc chấm) rộng hơn chip trần ~20px nhưng shimmer vẫn `w-16` ⇒ layout **nhảy** khi dữ liệu về. Đúng neo `w-24` của `Button` (§12g dòng 532-536). | `SKELETON_W` là **bảng theo tổ hợp** (có-glyph × có-×), 4 ô. Tính theo padding thật: `.chip` = `px-2 py-0.5 gap-0.5`, `.chip__label` = `px-0.5`. **Sửa ATOM, không sửa story cho đỡ lộ.** | ✅ |
| **A3** | ⭐ **Icon size SAI THANG so với font của chip** *(lỗi B1/B2/B3 đều không bắt)* | `node_modules/@heroui/styles/dist/components/chip.css:3` → `.chip { text-xs leading-5 }`, và `.chip--md { text-xs }`. Chip md = **12px**. Nhưng atom render icon `size-3.5` = **14px** (dòng 90). Canon icon-scale của `button-tokens.ts:56-59` ghi rõ **"ICON SCALE = FONT SCALE"**. ⇒ đúng thang phải là **`size-3`**. Và **doc header dòng 18 ghi `size-3`** trong khi JSDoc dòng 39 + code dòng 90 ghi `size-3.5` — **ba chỗ, hai con số**, header là chỗ ĐÚNG. | Đưa về `ICON_CLS = "[&_svg]:size-3"` (12px, khớp `text-xs`), hoặc — nếu thầy muốn giữ 14px — thì phải **giải thích tại sao chip phá luật font-scale**. Sau đó doc chỉ trỏ sang token, đừng chép số vào prose. | ⚠️ cần thầy chốt hướng (Q4) |
| **A4** | **`Chip.Dot` TRÔI khỏi `Chip.Base`** | `ChipDotProps` (dòng 111-134) **không có `tone`** (Base có 5), **không dùng union §12c** cho `text`/`isSkeleton` (Base làm đúng ở dòng 54-58), **không có `anatPart`**. Hai member cùng họ mà API lệch ba chỗ. | Tối thiểu: áp union §12c cho `text` + thêm `anatPart`. `tone` thì chờ Q2. | ✅ |
| **A5** | **`ChipDotProps.text` bắt buộc kể cả khi skeleton** | Dòng 113 `text: ReactNode` không optional ⇒ caller phải **bịa nhãn giả** cho ô shimmer — chính cái story `Loading` đang làm (`<Chip.Dot isSkeleton text="Đang hoạt động" />`, dòng 99). | `ChipDotOwnProps & ({isSkeleton: true; text?: ReactNode} \| {isSkeleton?: false; text: ReactNode})`. Tự biến mất nếu gộp Dot vào Base. | ✅ |
| **A6** | **Nút × nhân bản 3 chỗ** | `Chip.tsx:100` · `Chip.tsx:190` · `StatusChip.tsx:125` — **cùng một chuỗi class, từng ký tự**. Sửa một luật (hit-area, focus ring, opacity) phải sửa 3 chỗ. | Sau khi `ChipDot` **dựng lại** `ChipBase` (§3) thì × chỉ còn 1 chỗ trong họ `Chip`. `StatusChip` là atom KHÁC — hoặc cho nó cũng dựng lại `ChipBase`, hoặc hạ chuỗi class xuống `chip-tokens.ts` cấp **thư mục `atoms/chips/`** (cạnh `chip-tone.ts`), không phải cấp `Chip/`. | ✅ |
| **A7** | **THIẾU prop `anatPart`** ở cả hai member | `ButtonBase` có (`ButtonGroup.tsx` truyền `anatPart="ButtonBase"` xuống). Vì Chip thiếu, design `VariantChip.Difficulty` phải **tự bọc thêm một `<span data-anat-part>`** bên ngoài (`designs/chips/VariantChip/VariantChip.tsx:98-102`) — đúng cái bẫy "cây dựng từ DOM nên không có nhãn thì 0 part". `_legacy/AiCategoryChip.tsx:74` cũng ghi chú thán rằng atom không mở `anatPart`. | Thêm `anatPart?: string`, gắn ở GỐC chip: `data-anat-part={anatPart ?? (showAnatomy ? "Chip" : undefined)}`. Sau đó gỡ span bọc thừa ở `VariantChip`. | ✅ |
| **A8** | **`dotClassName` vs `dotColor` — hai prop một việc, tên không đối xứng** | Cùng đổ vào `currentColor` của `CircleIcon weight="fill"`. Tên `-ClassName` vs `-Color` không đối xứng; luật ưu tiên (`dotColor` thắng) chỉ nằm trong JSDoc dòng 120-124, **không ép được ở type** ⇒ truyền cả hai thì im lặng mất một cái. | Còn **MỘT** trục: `dotColor?: ChipTone \| (string & {})` — token semantic map qua bảng, hoặc hex thô; nội bộ tự chọn `className` vs `style.color`. Xoá `dotClassName`. **Blast radius:** `designs/chips/VariantChip/VariantChip.tsx:82` (live) + `_legacy/{DifficultyChip:59, AiCategoryChip:68}`; `_legacy/LanguageChip:75` đã dùng `dotColor`. | ⚠️ chờ Q3 |
| **A9** | **`icon` lệch từ vựng với `Button`** | `Button` đã đổi `icon` → `prefixIcon`/`suffixIcon` (2026-07-26, `Button.Base.stories.tsx:113-168`). Chip cũng là bố cục hai đầu (glyph dẫn đầu + nút × đuôi); nếu gộp Dot thì ô dẫn đầu còn có HAI nguồn (icon \| dot) ⇒ tên `icon` trần càng mơ hồ. | Đổi `icon` → `prefixIcon`, giữ đuôi là `onRemove` (glyph khoá cứng, không mở prop). ⚠️ Codemod **phải giới hạn theo thẻ JSX `<Chip.Base`/`<Chip`** — KHÔNG regex `icon:` trần (đụng `Tabs`/`Menu`/`SurfaceCard`, SKILL bước 4.2 cảnh báo). | ⚠️ chờ Q5 |
| **A10** | **Trục ý nghĩa tên `tone`, `Button` tên `variant`** | Canon §12d gọi trục ý nghĩa là `variant`. Chip dùng `tone` (đã lan sang `chip-tone.ts`, `StatusChip`, `VariantChip`). | Chốt MỘT từ vựng cho tầng atom rồi **ghi ruling**. Đừng để hai từ song song mà không có luật. | ⚠️ chờ Q6 |
| **A11** | **Khoá cứng `size="md"` mà HeroUI CÓ trục size thật** | `chip.css:51-61`: `.chip--sm {px-1 py-0 text-xs}` · `.chip--md {text-xs}` · `.chip--lg {px-3 py-1 text-sm}` — **khác nhau thật**. README chốt "chip 1 size" là **cố ý**, nhưng vì không có bảng token theo size nên mọi số đo (icon, chấm 6px, `h-7`) là hằng số rải rác; ngày mở `size` phải sửa 6 chỗ. | Giữ 1 size (đúng chủ ý) **NHƯNG** khai token dạng `Record<ChipSize, …>` với đúng một khoá `md` — y như `ICON_WEIGHT` của Button giữ map dù cả 3 bậc đều `bold`. Mở size sau chỉ là thêm dòng. Và **ghi rõ "1 size là CỐ Ý"** vào doc header (hiện không ghi ⇒ đọc ra như thiếu sót). | ✅ |

### ❌ HAI "lỗi" của B1 mà tôi BÁC — đã verify là KHÔNG có

| B1 báo | Sự thật |
|---|---|
| "RỦI RO SPECIFICITY: icon chip cần `[&_svg]:!size-3.5` vì HeroUI có rule `.chip svg`" | **KHÔNG có.** `grep svg chip.css` = **0 hit** (trong khi `button.css:62,71` có thật). Chip **không cần `!`**. Đây là suy diễn từ ca `Button`, không phải bằng chứng. |
| "Story mồ côi `Variants` / import chết `HeroTypography` / tsc đỏ 6 dòng" | Đã dọn rồi — xem M2, M3 ở §0. |

### ⚠️ MỘT giả định của B1 mà tôi BÁC — quan trọng cho quyết định gộp

B1 lập luận `Chip.Dot` là "member giả" vì *"body bị ép `bg-default text-foreground` = chính tone
`neutral` của Base"*. **Sai ở tầng token:**

- `tone="neutral"` → `color="default"` + `variant="soft"` → `.chip--default.chip--soft`
  → `--chip-bg: var(--default-soft)` · `--chip-fg: var(--default-soft-foreground)`
- `Chip.Dot` override `bg-default text-foreground`
  → `var(--default)` · `var(--foreground)`

⇒ **Hai bề mặt KHÁC NHAU thật** (`default` vs `default-soft`). Gộp Dot vào Base sẽ **đổi hình
Dot** trừ khi thêm một tone mới. Đây là lý do tôi **không tự chốt** Q1.

---

## 3. DEPS + TÁCH FILE

### 3.1 Deps HIỆN TẠI

| Owner | Deps | storyId |
|---|---|---|
| `Chip.Base` | **RỖNG** — bọc thẳng HeroUI Chip | — |
| `Chip.Dot` | **RỖNG** — **không** `import`, không gọi `ChipBase`; nó **dựng lại từ đầu** | — |

Cây báo "0 part" là **đúng với DOM/import hiện tại**, nhưng nó che mất quan hệ đáng-lẽ-phải-có.
Nặng hơn ca `Button`: `Button` chỉ **vô hình quan hệ** (cùng file, có gọi), `Chip` là **nhân bản
code** (không gọi) — bảng nhân bản ở A1/A6.

### 3.2 `parts` KHAI NHẦM — bỏ hết ở cả 8 leaf

Cả 8 leaf hiện tại đều truyền `parts={…}` toàn **span nội bộ**, không cái nào có story để nhảy tới
(§12g dòng 539-541: span nội bộ **không phải** deps).

| File | Hằng | Node khai | Có story riêng? |
|---|---|---|---|
| `Chip.stories.tsx:50` | `LABEL_PARTS` | `Label` | ❌ `HeroChip.Label` |
| `Chip.stories.tsx:53` | `ICON_PARTS` | `Icon`,`Label` | ❌ span + glyph nội bộ |
| `Chip.stories.tsx:57` | `REMOVE_PARTS` | `Label`,`Remove` | ❌ `<button>` nội bộ |
| `Chip.stories.tsx:61` | `SKELETON_PARTS` | `Skeleton` | ❌ `HeroSkeleton` trần |
| `Chip.Dot.stories.tsx:14` | `DOT_PARTS` | `Dot`,`Label` | ❌ |
| `Chip.Dot.stories.tsx:18` | `REMOVE_PARTS` | `Dot`,`Label`,`Remove` | ❌ |
| `Chip.Dot.stories.tsx:23` | `SKELETON_PARTS` | `Skeleton` | ❌ |

⇒ **Bỏ hẳn prop `parts`** ở cả hai file (y như `Button.Base`).
✅ **GIỮ** các `data-anat-part` trong component (`Label`/`Icon`/`Remove`/`Dot`/`Skeleton`) — chúng
nuôi cây DOM (đường `annotate`), khác với `parts` là bảng deps khai tay.

### 3.3 CÓ cần tách file? — **CÓ**, theo đúng khuôn `Button`

```
atoms/chips/
  chip-tone.ts          ← GIỮ NGUYÊN CHỖ CŨ (dùng chung ngoài họ: StatusChip/EnumChip)
  Chip/
    chip-tokens.ts      ← MỚI: bảng/type của HỌ Chip (KHÔNG export component ⇒ không vào deps tree)
    ChipBase.tsx        ← MỚI: cắt dòng 26-108
    ChipDot.tsx         ← MỚI: cắt dòng 110-198 + `import { ChipBase } from "./ChipBase"` ⇒ DEPS THẬT
    Chip.tsx            ← GIỮ ĐƯỜNG IMPORT CŨ, rút còn Object.assign + re-export type (khuôn Button.tsx)
    README.md           ← giữ nguyên
```

Call-site ngoài **không đổi** (mọi nơi vẫn `import { Chip } from "@sb-components/atoms/chips/Chip/Chip"`).

**`chip-tokens.ts` chứa:** `IconComponent` (đang khai giữa `Chip.tsx:33`) · `ICON_CLS` ·
`ICON_WEIGHT` · `DOT_PX` (thay `width={6} height={6}` inline) · `SKELETON_H` ·
`SKELETON_W` (bảng theo tổ hợp, A2) · `REMOVE_BTN_CLS` (nếu `StatusChip` vẫn tự dựng ×).

**`ChipDot.tsx` sau tách:** `return <ChipBase … anatPart="ChipBase" className={cn("bg-default text-foreground", className)} />`,
truyền chấm qua ô glyph dẫn đầu; nhánh `isSkeleton` (xét TRƯỚC, §12c) uỷ thẳng cho `ChipBase isSkeleton`.

### 3.4 Deps SAU khi tách (kịch bản 1A)

| Owner | Deps | storyId |
|---|---|---|
| `Chip.Base` | RỖNG | — |
| `Chip.Dot` | `Chip.Base` | `atoms-chips-chip-chip-base--default` (sau khi đổi tên leaf) |

⚠️ **HAI việc BẮT BUỘC kèm theo**, thiếu thì cây vẫn "0 part" dù đã có `import`:
1. `ChipBase` phải có prop **`anatPart`** (A7) — cây dựng từ DOM, không có nhãn thì không leo lên được.
2. `ChipBase` phải mở **một ô nhận chấm** — xem **Q1**.

> ❌ Nhánh `bare` trong `splitPlan` của B3 (`Typography.Base` làm deps thứ hai,
> `DOT_PX {pill:6, bare:12}`, skeleton 2-gạch) — **bỏ hết**, `bare` không còn tồn tại.

---

## 4. CÂU HỎI CẦN THẦY QUYẾT

> Tôi **không tự chốt** mấy cái này. Mỗi câu ghi rõ vì sao tôi không dám quyết.

**Q1 — `Chip.Dot` có phải "member GIẢ" không? Gộp vào `Chip.Base` hay giữ riêng?**
Hai phía đều có bằng chứng thật, nên đây là quyết định của thầy:
- **Gộp**: sau khi bỏ `bare`, Dot render **cùng khung** với Base (`HeroChip variant="soft" size="md"` +
  `Label` + cùng nút ×). Khác biệt duy nhất = ô glyph dẫn đầu là chấm. Đúng neo `Button.Icon` → `isIconOnly`.
  Đang trả giá: × trùng 3 chỗ, skeleton trùng 2 chỗ, Dot đã trôi khỏi Base (A4).
- **Giữ riêng**: (a) **canon §12a dòng 462 neo đích danh** `Chip {Base, Dot}` là hình thái thật —
  gộp là **sửa canon**, không phải sửa code; (b) bề mặt Dot **thật sự khác** (`--default` vs
  `--default-soft`, xem cuối §2) nên gộp sẽ đổi hình trừ khi thêm tone mới.
- Nếu **gộp**: API đề xuất = union loại trừ `{ prefixIcon?: IconComponent; dot?: never } | { dot: string; prefixIcon?: never }`.
  Blast radius: `designs/chips/VariantChip/VariantChip.tsx:81` + 3 file `_legacy/designs/chips/*`.

**Q2 — `Chip.Dot` có mở `tone` không?**
Hiện Dot ép cứng body trung tính, "nghĩa nằm ở CHẤM" (đúng chủ ý ghi trong doc). Mở `tone` sẽ có
hai kênh màu cùng lúc (nền + chấm) — dễ loạn. Không mở thì Dot vĩnh viễn lệch API với Base.
**Quyết định này chốt luôn có leaf `Chip.Dot/Tones` hay không.**

**Q3 — Xoá `dotClassName`, chỉ giữ `dotColor`?** (A8)
Gọn API nhưng đụng 1 call-site live + 3 file `_legacy`. Hay giữ cả hai và chỉ **ép luật ưu tiên
bằng type** (union `never`)?

**Q4 — Icon chip: `size-3` (khớp `text-xs` của HeroUI) hay giữ `size-3.5`?** (A3)
Luật "icon scale = font scale" của `button-tokens.ts` nói `size-3`; JSDoc hiện tại lại viện
"khớp text-sm của chip" — **mà `.chip--md` là `text-xs`, không phải `text-sm`**. Đổi sang `size-3`
là **đổi hình mọi chip có icon toàn app**, nên tôi không tự sửa.

**Q5 — Đổi `icon` → `prefixIcon` cho khớp `Button`/`Typography`?** (A9)
Đúng từ vựng nhưng cần codemod có giới hạn phạm vi JSX.

**Q6 — Trục ý nghĩa của tầng atom gọi là `tone` hay `variant`?** (A10)
Đề xuất: giữ `tone` cho họ chip/status (đã lan rộng) **và ghi ruling vào §12d** rằng `tone` là tên
hợp lệ ở chip — nhưng đây là **sửa canon**, phải thầy duyệt.

**Q7 — `StatusChip` có nằm trong lane này không?**
Nó là atom RIÊNG nhưng giữ **bản sao thứ 3** của nút × (`StatusChip.tsx:125`). Sửa họ `Chip` mà
không đụng nó thì A6 chỉ giải quyết 2/3.

---

## 5. CỐ Ý KHÔNG LÀM

| Việc | Vì sao |
|---|---|
| Không sửa **bất kỳ file nào** | Lane read-only; §12g yêu cầu chốt PROPS·STATES·DEPS **rồi mới** dựng. |
| Không chạy `git`, không chạy `tsc`/`eslint` | Luật cứng của lane. Vì thế "tsc đỏ/xanh" trong báo cáo con là **suy luận**, không phải kết quả chạy — và tôi đã bác nó bằng cách đọc file (M2). |
| Không mở Storybook :6006 để soi mắt | Windows watcher kẹt + chậm/treo; để thầy tự xem (memory `feedback-skip-storybook-browser-verify`). |
| Không tự chốt Q1-Q7 | Q1/Q6 là **sửa CANON**, không phải sửa code — ngoài quyền của lane audit. |
| Không đề xuất mở trục `size` cho chip | README đã chốt "chip 1 size (md)" là **cố ý**. Tôi chỉ đề xuất **khai token dạng `Record<ChipSize,…>` một khoá** để ngày mở chỉ là thêm dòng (A11). |
| Không đụng `_legacy/designs/chips/*` | Cây `_legacy`; chỉ liệt kê làm blast radius cho Q1/Q3. |
| Không giữ phần `variant`/`bare` của B2 & B3 | Đã verify là code chết — giữ lại sẽ khiến agent bước 4 dựng leaf cho prop không tồn tại. |

---

## 6. GỢI Ý THỨ TỰ THI CÔNG (khi thầy duyệt)

1. **Chốt Q1** trước mọi thứ — nó quyết định bộ leaf là 10 (1A) hay 6 (1B).
2. Sửa **A1 + A2 + A7** (tokens · skeleton width · anatPart) — không phụ thuộc câu hỏi nào.
3. Tách file (§3.3) ⇒ deps thành `import` thật.
4. Bỏ `parts` ở cả 8 leaf, đổi tên + làm dày leaf theo §1.
5. Codemod A9 (nếu duyệt Q5) — **một agent, script ra file, giới hạn theo thẻ JSX**.
6. MỘT agent chạy `tsc` + `eslint`; restart Storybook rồi đọc `index.json` xác nhận bộ leaf.
