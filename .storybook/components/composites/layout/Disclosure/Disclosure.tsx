import React, { useState } from "react"
import type { ReactNode } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import { SKELETON_TEXT_BAR_SM } from "@sb-components/atoms/_skeleton-bar"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Disclosure.*`, the collapsible KHUNG namespace
 * (thầy 2026-07-25, canon §13a). Authored in Storybook (not `src`); synced to
 * `src` later. NO `@/components` imports.
 *
 * KHUNG API LAW (§13b): `.Base` is a WRAPPER frame → `title` names the trigger
 * slot and `body` names the revealed region, with `children` kept as shorthand
 * for `body`. It reveals ONE region, not a repeating list, so the `items` rule
 * does NOT apply here — a multi-panel accordion is a DIFFERENT frame and lives
 * as `SurfaceCardAccordion` (items-driven), not as a member of this family.
 * Namespace only — no bare component export.
 *
 * Ground truth: MockInterviewSession's "Tùy chỉnh phiên" green-room row — a
 * hand-rolled `<button aria-expanded>` with a leading `CaretDownIcon` that
 * rotates 180° on the local `configOpen` boolean, `text-muted
 * hover:text-foreground`, `w-fit` (hug-content) trigger; the config content
 * (a `LabeledCard`) is rendered below only while open. NOT built on HeroUI's
 * headless `Disclosure` compound — that compound's default indicator/trigger
 * slots assume a trailing, `justify-between` row, a different shape than this
 * leading-caret, hug-width trigger; this port generalises the SAME hand-roll
 * instead of fighting that layout. `TaskSubmissionPanel`'s settings summary row is the
 * sibling shape (icon + label, trailing `CaretRightIcon` that does NOT
 * rotate) — that one opens an external Drawer, not an inline region, so it
 * is a different control, not this frame.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link Disclosure}. */
export interface DisclosureBaseProps {
    /**
     * Trigger label, rendered next to the caret. Bare `ReactNode` — the
     * trigger owns the `text-sm` sizing and the muted → foreground hover
     * color (§4); pass plain text/inline content, not a styled block.
     */
    title: ReactNode
    /** Content revealed under the trigger while expanded. Equivalent to `children`; wins over it when both are passed. */
    body?: ReactNode
    /** Shorthand for {@link DisclosureBaseProps.body} — a wrapper frame wraps anything. */
    children?: ReactNode
    /**
     * Controlled expanded state. Omit to run uncontrolled (see
     * {@link DisclosureBaseProps.defaultOpen}) — same dual mode as `Switch`.
     */
    isOpen?: boolean
    /** Called with the next expanded state — fires whether controlled or not. */
    onOpenChange?: (isOpen: boolean) => void
    /** Uncontrolled initial state; ignored once `isOpen` is provided. Default `false`. */
    defaultOpen?: boolean
    /** Disables the trigger — no toggle, dimmed, not focusable. */
    isDisabled?: boolean
    /**
     * `true` → render this frame's OWN collapsed trigger-row mirror (§12c: chủ
     * của hình là chủ của skeleton). The row keeps its real box — same `w-fit`,
     * same `gap-2`, same real `CaretDownIcon` (a caret is SHAPE, not content) —
     * and only the title turns into a shimmer bar. The body region stays
     * unmounted, exactly like the collapsed real state.
     */
    isSkeleton?: boolean
    /** Extra classes on the root. */
    className?: string
    /**
     * Storybook-only: when true, each composed part (`Trigger` / `Content` /
     * loading `Skeleton`) emits a `data-anat-part` so the anatomy panel can
     * anchor badges. No visual effect.
     */
    showAnatomy?: boolean
}

/**
 * Generic collapsible: a trigger row (leading caret + title) that toggles a
 * content region below it. Works controlled (`isOpen`+`onOpenChange`) or
 * uncontrolled (`defaultOpen`, tracks its own state internally) — pass either,
 * never both. The caret is a phosphor `CaretDownIcon` that rotates 180° when
 * expanded (§5 rotate); the content region is only mounted while open (no exit
 * animation, matching the ground-truth green room).
 *
 * @param props - {@link DisclosureBaseProps}
 */
const Base = ({
    title,
    body,
    children,
    isOpen,
    onOpenChange,
    defaultOpen = false,
    isDisabled = false,
    isSkeleton = false,
    className,
    showAnatomy = false,
}: DisclosureBaseProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
    const isControlled = isOpen !== undefined
    const open = isControlled ? isOpen : uncontrolledOpen
    const content = body ?? children

    if (isSkeleton) {
        // Mirror of the collapsed trigger row: SAME frame as the real branch
        // (`flex flex-col gap-3` root + `w-fit items-center gap-2 text-muted` row),
        // real caret kept, only the `text-sm` title swapped for a bar.
        // text-sm = 14/20 → h-[14px] my-[3px] keeps the 20px line box, so
        // toggling isSkeleton does not shift layout (§8).
        return (
            <StackV
                gap="grouped"
                className={className}
                body={
                    <StackH
                        gap="related"
                        classNames={["w-fit"]}
                        className="text-muted"
                        body={
                            <>
                                {/* Caret is TRẦN cạnh nhãn `text-sm` (icon/§1c TEXT position — the
                                    trigger `<button>` is `w-fit`, no padding of its own, so it hugs
                                    the icon+label pair exactly like running text): size = font-size
                                    1:1 of `text-sm` → `size-3.5`, not the flat `size-4` this used to
                                    be (thầy chốt 2026-07-29, canon icon §4.2). */}
                                <CaretDownIcon className="size-3.5 shrink-0" weight="bold" aria-hidden focusable="false" />
                                <HeroSkeleton className={cn(SKELETON_TEXT_BAR_SM, "w-24")} />
                            </>
                        }
                    />
                }
            />
        )
    }

    const toggle = () => {
        if (isDisabled) return
        const next = !open
        if (!isControlled) setUncontrolledOpen(next)
        onOpenChange?.(next)
    }

    return (
        <StackV
            gap="grouped"
            className={className}
            body={
                <>
                    <button
                        type="button"
                        onClick={toggle}
                        aria-expanded={open}
                        disabled={isDisabled}
                        className={cn(
                            "group flex w-fit items-center gap-2 text-muted outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent",
                            isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                        )}
                    >
                        {/* TEXT position (icon §1c/§4.2): TRẦN cạnh nhãn `text-sm`, no Ô/control
                            bọc riêng — trigger is `w-fit`, hugs content like running text. Size =
                            font-size 1:1 of `text-sm` → `size-3.5` (was flat `size-4`, thầy chốt
                            2026-07-29). Weight stays `bold` — `size-3.5` < `size-5` (§3.2). */}
                        <CaretDownIcon
                            className={cn("size-3.5 shrink-0 transition-transform", open && "rotate-180")}
                            weight="bold"
                            aria-hidden
                            focusable="false"
                        />
                        <span className="text-sm">{title}</span>
                    </button>
                    {open ? (
                        <StackV gap="grouped" body={content} />
                    ) : null}
                </>
            }
        />
    )
}

/**
 * The collapsible KHUNG namespace — one member:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `title` (trigger) + `body` slot (+ `children` = body) |
 */
export { Base as Disclosure }
