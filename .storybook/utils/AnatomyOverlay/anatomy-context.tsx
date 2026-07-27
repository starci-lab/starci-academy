import React from "react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL — shared anatomy types + the panel context.
 *
 * When a {@link BlockAnatomy} panel wraps a block, it provides this context. Every
 * {@link AnatomyOverlay} inside then switches from the heavy dashed-box + full tag
 * to a tiny NUMBERED anchor (the panel owns the legend/tree that decodes the
 * numbers) — so labels never overlap the component's content. Outside a panel the
 * overlay keeps its legacy look, so blocks not yet migrated are unaffected.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Which tier the annotated part is — drives dot/badge colour across the anatomy tools. */
/**
 * The six tiers of the drawing, lowest first.
 *
 * `frame` + `composite` replaced the single `primitive` tier on 2026-07-27: what used to be
 * one folder was measurably two natures — 7 slot-agnostic frames (`Container`, `Grid`,
 * `Cluster`, `Split`, `Stack`, `DragScrollArea`, `ResizableRail`) versus 37 components that
 * own content roles. `Section`/`Page`/`ModalShell` moved to `composite` because they own a
 * TITLE; the discriminator is "slot-agnostic vs owns content", not the import count.
 *
 * `screen` was added that same day (teacher's call: "the 5 layers are identical in form"):
 * before that the union only had four non-atom tiers, so a screen had to masquerade as
 * `block` — the panel then printed the wrong badge on the very node that anchors the whole
 * tree. Note: this merges what used to be two stale, unmerged JSDoc blocks here — an older
 * one still claimed "five tiers" and "`primitive` is the OLD name of the `layout` tier",
 * both superseded by the six-tier split above.
 */
/**
 * ⭐ `heroui` thêm 2026-07-27. Node đến thẳng từ `@heroui/react` không có story của TA để
 * bấm sang, nên danh sách trắng cũ loại nó ra và cây NÓI DỐI BẰNG CÁCH BỎ SÓT: `PriceTag`
 * render một `Popover` thật, mở được, mà cây không hiện gì.
 *
 * Gọi đúng tên tầng thư viện thì trung thực hơn là giấu. Nó còn làm DRIFT hiện ra: một node
 * tầng design ngồi trên `heroui` nghĩa là atom layer đã bị bỏ qua — đúng thứ §12 sinh ra để
 * chặn, và giờ NHÌN THẤY được thay vì phải grep import.
 */
export type AnatomyTier = "heroui" | "atom" | "frame" | "composite" | "design" | "block" | "screen"

/** Value provided by {@link BlockAnatomy} to the overlays nested under it. */
export interface AnatomyPanelValue {
    /** Ordinal for a part `name` (matches the overlay `label`), or `undefined` when not in the spec. */
    numberOf: (name: string) => number | undefined
}

/** Present only while inside a {@link BlockAnatomy} panel (else `null` → legacy overlay). */
export const AnatomyPanelContext = React.createContext<AnatomyPanelValue | null>(null)

/** Read the enclosing {@link BlockAnatomy} panel, if any. */
export const useAnatomyPanel = (): AnatomyPanelValue | null => React.useContext(AnatomyPanelContext)
