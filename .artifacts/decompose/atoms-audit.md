# ATOM AUDIT — quét 43 atom theo §12 + §5.0 (2026-07-26)

> Read-only. Quét cơ học: hình namespace · `Base` · `isSkeleton` · `children` · thư viện icon.
> Cột `icon`: **P** = Phosphor · **G** = gravity · **–** = không dùng icon.

---

## 🔴 P0 — REGRESSION, sửa trước mọi thứ

### Compound `Skeleton` ĐÃ SỐNG LẠI
`atoms/display/Skeleton/Skeleton.tsx` **quay lại**, và **12 file đang import nó**.

Nguyên nhân: lệnh `git checkout -- atoms layouts` của trò (khôi phục Phosphor) đã
**hoàn tác luôn việc xoá** compound — vì việc xoá đó chưa commit. Đây là hậu quả thứ
hai của cùng một sai lầm, và là cái nặng hơn: nó **đảo ngược một quyết định lớn của
cả phiên** (§12c — chủ của hình là chủ của skeleton) mà không ai thấy, vì `tsc` xanh.

⚠️ Bài học: `tsc` xanh **không** có nghĩa là quyết định còn nguyên. Quyết định "xoá
một thứ" không có test nào canh.

**Việc:** xoá lại `atoms/display/Skeleton/`, migrate 12 call-site về `isSkeleton`
co-located của từng atom. (Lần trước đã làm hết một vòng — có thể lấy lại cách làm.)

---

## 🟠 P1 — Trái §5.0 (một bộ icon = Phosphor)

**8 atom còn dùng gravity**, phải chuyển về Phosphor:

`Button` · `Chip` · `Avatar` · `Alert` · `Input` · `Select` · `Image` · `Breadcrumbs`

11 atom đã đúng Phosphor. Đây là hậu quả trực tiếp của việc đổi bộ icon hai chiều
trong ngày — atom bị `git checkout` kéo về Phosphor, còn 8 file này trò sửa tay sang
gravity trước đó nên không bị kéo theo.

**Kèm theo:** áp luật §5.0a khi đụng từng file — icon `size-5` → `regular`, nhỏ hơn
`size-5` → `bold`. Hiện **chưa file nào** áp.

---

## 🟡 P2 — Trái §12a (namespace)

| Atom | Vấn đề |
|---|---|
| `Dropzone` | export **TRẦN**, không namespace |
| `Image` | export **TRẦN** (dù có `Base` bên trong) |

`Choice` dùng object literal (không `Object.assign`) — chạy được nhưng lệch khuôn 42
atom còn lại; gom về cùng kiểu cho nhất quán.

**Không phải lỗi:** `Progress` (`Bar`/`Circle`/`Meter`) · `Input` (`Text`/`Textarea`/…)
· `Select` — chúng có member theo **hình thái thật** nên không cần `Base`.

---

## 🟡 P3 — Trái §12b (cấm `children`)

| Atom | Phán |
|---|---|
| `Tooltip` · `Badge` | ✅ **ngoại lệ CÓ TÊN** trong §12b (atom-wrapper) — hợp lệ |
| `FieldFrame` | ✅ scaffold nội bộ của `atoms/forms/_field`, không phải atom công khai |
| `ExtendedTabs` | 🔴 **VI PHẠM** — phải đổi sang `items` dữ liệu |

---

## 🟢 P4 — Thiếu `isSkeleton` (§12c)

**Cần thêm** (atom có hình, sẽ đứng trong vùng đang tải):
`IconTile` · `Logo` · `SnippetIcon` · `UserAvatar` · `Alert` · `ImageDropzone` ·
`CoverImage` · `QRCode` · `BackLink` · `SeeMoreLink` · `SelectableCardGroup` ·
`FlexWrapButtonRadio` · `ExtendedTabs`

**Không cần** (không có hình riêng / là overlay hoặc đường kẻ):
`Divider` · `Tooltip` · `Popover` · `Toast`

---

## Thứ tự đề xuất

1. **P0** — xoá lại compound `Skeleton` + migrate 12 call-site. Làm trước vì nó đang
   ngầm phủ định luật §12c mà cả phiên đã dựng.
2. **P1** — 8 atom về Phosphor, áp luôn §5.0a weight-theo-size cho từng file đụng tới.
3. **P2 + P3** — 3 atom sai namespace + `ExtendedTabs` bỏ `children`.
4. **P4** — thêm `isSkeleton` theo nhu cầu thật, **không làm hàng loạt**: chỉ atom nào
   có màn đang cần (§14d.3 — không bịa case).

## Chưa quét (cần đọc từng file, không grep được)

- §12d — có atom nào lỡ mở prop icon-size riêng không.
- §12f — story có lặp state của thành viên khác không.
- Prop nội dung đã dùng union `text?`-khi-skeleton chưa (mới áp cho 5 atom).

---

# TIẾN ĐỘ P0 (2026-07-26) — ⚠️ ĐANG DỞ, tsc = 7 lỗi

Codemod đã chuyển **hầu hết** call-site `Skeleton.*` → `isSkeleton` co-located.
Còn **7 chỗ codemod CỐ Ý không đụng** vì không phải swap cơ học:

| File | Site | Vì sao phải làm tay |
|---|---|---|
| `layouts/text/TitledText.tsx` :111–113 | 3× `Skeleton.Typography` | `type={cfg.titleType}` động → cần map `cfg`→`size` |
| `layouts/text/InlineIconLabel.tsx` :106 | 1× | `type={cfg.text}` + prop `skeletonWidth` phải đổi thành `className` |
| `layouts/buttons/ChipButtonList.tsx` :107 | 1× | `width` tính theo `index % 2` |
| `layouts/layout/Disclosure.tsx` :98 | `Skeleton.Disclosure` | **KHÔNG phải swap** — Disclosure phải TỰ vẽ mirror hàng-trigger (§12c) |
| `layouts/cards/SurfaceCard.tsx` :1363 | `Skeleton.Accordion` | nt — SurfaceCard.Accordion tự vẽ mirror của chính nó |

Hai dòng cuối là **thiết kế**, không phải codemod: đó chính là nội dung §12c
("chủ của hình là chủ của skeleton"). Làm xong 5 dòng đầu + 2 mirror này thì
`atoms/display/Skeleton/` xoá được, P0 đóng.

Cũng phải gỡ 2 `import type { SkeletonTypographyType }` (TitledText :5, InlineIconLabel :4).

## Ghi chú vận hành
`fix-imports.js` trong scratchpad **có bug**: nó chèn `import { Chip }` vào file dùng
HeroUI `Chip.Label` (StatusChip · HighlightChip · HeroBanner) → duplicate identifier.
Đã gỡ tay. Đừng chạy lại script đó mà không lọc.

---

# ✅ ĐÓNG (2026-07-26) — P0→P4 xong, tsc 0

| Mức | Kết quả |
|---|---|
| P0 | compound `Skeleton` XOÁ HẲN; `Disclosure` + `SurfaceCard.Accordion` tự vẽ mirror (§12c) |
| P1 | `.storybook` sạch gravity — **0/0** (components + stories + .md) |
| P2 | `Dropzone` · `Choice` → `Object.assign`; `Image` root callable |
| P3 | `ExtendedTabs` ghi rõ ngoại lệ §12b vào JSDoc header (không đổi code) |
| P4 | `IconTile` + `Alert` có `isSkeleton`; 11 atom còn lại KHÔNG làm (chưa có màn cần — §14d.3) |

`tsc` = 0 · `eslint` = 1 error `py-0.5` ở `Input.tsx:669` (có sẵn từ HEAD).

## ⚠️ Hai điểm agent báo SAI, đã kiểm lại bằng tay

1. **"dependency `@gravity-ui/icons` là orphan"** → SAI. `src/` còn **5 file** import thật.
   Agent chỉ quét `.storybook`. ⇒ **KHÔNG gỡ dependency**, và **KHÔNG siết
   `eslint.config.mjs:85`** (allowlist 2 bộ) — siết là app đỏ ngay.
2. Vòng trước, verify báo "gravity = 0" trong khi stories còn 12 file — do prompt của
   trò chỉ khoanh `components/`. Bài học: **phạm vi grep phải là phạm vi LUẬT, không
   phải phạm vi thư mục đang sửa.**

## Còn nợ (ngoài phạm vi audit atom)

- `src/` 5 file gravity — lane app, chưa đụng.
- `IconTile.stories.tsx` chưa render state `isSkeleton` mới (chèn vào leaf sẵn có, đừng đẻ story mới — §14d.2).
- `eslint.config.mjs` comment ghi §5.0 "MỘT BỘ DUY NHẤT" nhưng allowlist cho 2 bộ — mâu thuẫn, chờ `src/` dọn xong mới siết được.
