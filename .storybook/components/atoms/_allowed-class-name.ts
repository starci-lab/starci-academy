/**
 * Positioning-only Tailwind classes an atom's caller may pass via `classNames`.
 * Each member describes where the element sits or how much of its parent's box
 * it takes — flex-child behavior, cross-axis alignment, sizing relative to the
 * parent, grid footprint, order — never how it looks.
 *
 * The union is closed: no `${string}` template, no arbitrary values like
 * `w-[123px]`. A template branch would let `tsc` accept any string, including
 * a hand-measured `top-[13px]` or a stray `bg-red-500` — the enumeration is
 * what makes the type checkable at all.
 *
 * Excluded on purpose: margins (the parent's decision about the gap around a
 * child, not the child's own), fixed sizes (an atom's resting size is either
 * hard-coded or a typed `size` prop, never a free-form width string),
 * `flex-col` / `flex-row` / `gap-*` (a container's own child-layout, not how
 * a leaf sits in someone else's container), and `absolute` / `relative` /
 * `fixed` / `sticky` (positioning scheme is the parent composite's call).
 */

export type AllowedClassName =
    | "flex-1" | "flex-auto" | "flex-none" | "grow" | "grow-0" | "shrink" | "shrink-0"
    | "min-w-0" | "min-h-0"
    | "self-start" | "self-center" | "self-end" | "self-stretch"
    | "w-full" | "w-fit" | "w-auto" | "h-full" | "h-fit" | "h-auto"
    | "w-1/2" | "w-1/3" | "w-2/3" | "w-1/4" | "w-3/4"
    | `col-span-${1 | 2 | 3 | 4 | 5 | 6}` | `row-span-${1 | 2 | 3}`
    | "order-first" | "order-last" | `order-${1 | 2 | 3}`

/**
 * Widths a skeleton placeholder may take: fractions of its container, never a
 * fixed length. A skeleton stands in for text that has not arrived yet, and
 * text reflows with the box that holds it — a fixed `w-24` would overflow a
 * narrow column and look stranded in a wide one. `w-full` is excluded because
 * real text rarely fills its line.
 *
 * A sibling union, not a member of `AllowedClassName` — the atom picks its
 * own width, the caller does not pass it in via `classNames`. There is no
 * height variant: the line box is fixed by the atom, not chosen per call.
 */
export type SkeletonWidth = "w-1/4" | "w-1/3" | "w-1/2" | "w-2/3" | "w-3/4"
