/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FRAME TIER — the SHARED spacing/alignment vocabulary of the khung namespaces
 * (`Stack` · `Split` · `Cluster` · `Grid`). Internal module (`_`-prefixed): it is
 * a type + class table, NOT a component, and never leaves this folder.
 *
 * ⭐ WHY THIS FILE EXISTS (principles §10c): the spacing scale is
 * `flush(0) · tight(1) · related(2) · grouped(3) · section(6) · page(8)` — SIX
 * values, nothing else. A khung that took `gap: number` would let `gap-4`/`gap-5`
 * back in through the front door, so every khung types its `gap` as
 * {@link SpaceScale} — a UNION LITERAL. Off-scale is then a TYPE ERROR at the
 * call site, not a lint finding after the fact. This is the reason the frame
 * tier owns gap at all: it is the enforcement point of §10.
 *
 * §10a also decides WHO owns the seam: `gap` belongs to the PARENT (the khung),
 * never to the child — so children of these frames must not carry `margin`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * The ONLY spacing steps a frame khung accepts (§10c):
 * `0` flush · `1` tight · `2` related · `3` grouped · `6` section · `8` page.
 */
export type SpaceScale = 0 | 1 | 2 | 3 | 6 | 8

/**
 * Scale step → literal Tailwind class. Written out because Tailwind never emits
 * an interpolated `gap-${n}`; a table is the only way the class ships in CSS.
 */
export const GAP_CLASS: Record<SpaceScale, string> = {
    0: "gap-0",
    1: "gap-1",
    2: "gap-2",
    3: "gap-3",
    6: "gap-6",
    8: "gap-8",
}

/** Cross-axis alignment of a flex track. */
/**
 * Canh theo TRỤC NGANG của một track.
 *
 * ⭐ `baseline` thêm 2026-07-27: hàng có chữ NHIỀU CỠ (giá `h4` cạnh giá gạch `sm` cạnh
 * chip `xs`) phải canh theo CHÂN CHỮ, không phải theo tâm hộp — `center` làm ba con số
 * lệch chân nhau. Trước đó khung KHÔNG diễn đạt được việc này, nên `PriceTag` phải gõ tay
 * `items-baseline`; chuyển sang khung mà thiếu nấc này thì migration làm HỎNG hình.
 * Thêm một giá trị vào union là ADDITIVE — không call-site nào đang chạy bị đổi, và
 * compiler bắt mọi bảng `Record<LayoutAlign, …>` phải khai đủ.
 */
export type LayoutAlign = "start" | "center" | "end" | "stretch" | "baseline"

/** Main-axis distribution of a flex track. */
export type LayoutJustify = "start" | "center" | "end" | "between"

/** {@link LayoutAlign} → literal class. */
export const ALIGN_CLASS: Record<LayoutAlign, string> = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
    baseline: "items-baseline",
}

/** {@link LayoutJustify} → literal class. */
export const JUSTIFY_CLASS: Record<LayoutJustify, string> = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
}

/**
 * Scale step → literal `p-*` Tailwind class. Same §10c scale as {@link GAP_CLASS},
 * written out for the same reason (Tailwind never emits an interpolated `p-${n}`).
 *
 * 2026-07-26 (thầy): SSOT chuyển về ĐÂY từ `layout/Container/Container.tsx` — nó
 * khai `PADDING_CLASS` cục bộ trước, `cards/SurfaceCard/SurfaceCard.tsx` cần bảng
 * y hệt cho trục `padding` (đổi từ `flushContent?: boolean`) nên gộp về một nguồn
 * thay vì đẻ bản sao thứ hai. `Container.tsx` giờ import từ đây thay vì giữ bảng
 * cục bộ.
 */
export const PADDING_CLASS: Record<SpaceScale, string> = {
    0: "p-0",
    1: "p-1",
    2: "p-2",
    3: "p-3",
    6: "p-6",
    8: "p-8",
}
