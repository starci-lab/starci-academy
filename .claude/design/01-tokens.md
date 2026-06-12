# 01 — Design Tokens

Nguồn: `src/app/globals.css` (CSS vars, oklch) + HeroUI theme. **Luôn dùng token semantic, KHÔNG hardcode hex.**

## Màu
| Token | Light | Dark | Dùng cho |
|-------|-------|------|----------|
| `--accent` | `oklch(62.04% 0.1950 185.90)` | (giống light) | Brand teal-green: link active, chip nhấn, nút chính, "Save %" |
| `--accent-foreground` | `oklch(99.11% 0 0)` | | Chữ trên nền accent |
| `--background` | `oklch(97.02% 0.0033 185.90)` (off-white ngả teal) | `oklch(12% …)` | Nền trang |
| `--foreground` | `oklch(21.03% …)` | `oklch(99.11% …)` | Chữ chính |
| `--muted` | `oklch(55.17% …)` | | Chữ phụ — class `text-muted` (⚠️ KHÔNG có `text-foreground-500`) |
| `--default` | `oklch(94% …)` | `oklch(27.40% …)` | Nền card/chip mềm (`bg-default`, `bg-default/40`) |
| `--success` | `oklch(73.29% 0.1948 142.66)` | | Trạng thái xanh |
| `--danger` | `oklch(65.32% 0.2343 17.59)` | | Lỗi/disabled chip |
| `--warning` | `oklch(78.19% 0.1595 64.18)` | | Callout "Yêu cầu đầu vào" |

- Neutral dùng chung trục hue **185.90** (teal) → cả app ngả teal tinh tế.
- Logo `public/logo.svg`: `#00a898` (StarC teal) + `#6c8aa3` (slate "academy"). `--accent` ≈ teal logo.

### Màu chữ (StarCi — RULE)
- **Chữ chính → `text-foreground`** (token tên là `foreground`).
- **Chữ phụ / title phụ / subtitle / description → `text-muted`** (KHÔNG `text-foreground-500`).

## Typography → xem [05-typography.md](05-typography.md) (chi tiết + canonical)
- Font thực tế **Open Sans** (load qua `next/font` ở `layout.tsx`). ⚠️ `globals.css` để `--font-sans: var(--font-inter)` nhưng `--font-inter` chưa định nghĩa → token font rỗng, cần fix (C-1 trong 05).
- Thang chuẩn: page hero `text-4xl font-bold` · title phụ/modal `text-2xl font-bold` · section `text-lg font-semibold` · card `text-base font-semibold` · body `text-sm` · description `text-sm text-muted` · eyebrow `text-xs font-semibold uppercase tracking-wide text-muted`.

## Radius (StarCi — RULE)
- **Form / modal (container chung) → `rounded-3xl`** (bo góc form chuẩn của StarCi).
- Block list gộp nhiều row: bo ở **viền ngoài** = radius của button (`rounded-medium`), row trong `rounded-none` + `Separator` (xem [07](07-modals.md)).
- Card nội dung `rounded-xl`; code block `rounded-xl`; chip/pill `rounded-full`.
- Token gốc: `--radius: 0.5rem`, `--field-radius: 0.75rem`.

## Spacing rhythm (StarCi — RULE)
Chọn gap theo **QUAN HỆ ngữ nghĩa** giữa 2 element, KHÔNG theo cảm tính kích thước. 3 mức chuẩn:
- **`gap-1.5` — coupled / dính nhau:** 2 phần tử gắn chặt thành 1 đơn vị — **label ↔ input/control**, 2 item của cùng 1 list (vd 2 listbox-item), chip ↔ chú thích kế bên.
- **`gap-3` — CÙNG chức năng:** 2 element cùng vai (vd heading ↔ paragraph mô tả 1 nhóm; các nav-item với nhau; các field cùng 1 form).
- **`gap-6` — KHÁC chức năng:** 2 element khác vai/tách biệt (vd khối text ↔ nút CTA, section ↔ section, brand ↔ nhóm link).
> Minh hoạ: `<main gap-6>` (nhóm-text ↔ Button) bọc `<div gap-3>` (Heading ↔ Paragraph). Gần = liên quan, xa = tách biệt.
- **Page shell padding mặc định: `p-3`** (KHÔNG `p-6`). Shell trang/section: `min-h-screen bg-background p-3` — `bg-background` để nền theo theme, `p-3` là padding chuẩn (vd Sandbox lesson shell).
- globals.css set padding mặc định: `.card` p-3, `.chip` gap-1 px-2. Container trang `max-w-[1280px]` + grid (xem [03](03-layout-archetypes.md)).

## Difficulty palette (`src/components/pallettes/difficulty.ts`)
Easy = cyan-500 · Medium = yellow-500 · Hard = red-500 · Insane = purple-500.

## Theme
- `next-themes`, default **dark** + `enableSystem` (`InnerLayout.tsx`). KHÔNG có route nào ép light/dark (không `forcedTheme`) — chênh lệch light/dark giữa các trang là do system preference lúc chạy, không phải code ép.
