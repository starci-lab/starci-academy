import React, { useState } from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — the target `Disclosure`. Authored in Storybook
 * (not `src`); synced to `src` later. NO `@/components` imports.
 *
 * Ground truth: MockInterviewSession's "Tùy chỉnh phiên" green-room row — a
 * hand-rolled `<button aria-expanded>` with a leading `CaretDownIcon` that
 * rotates 180° on the local `configOpen` boolean, `text-muted
 * hover:text-foreground`, `w-fit` (hug-content) trigger; the config content
 * (a `LabeledCard`) is rendered below only while open. NOT built on HeroUI's
 * headless `Disclosure` compound — that compound's default indicator/trigger
 * slots assume a trailing, `justify-between` row (see the existing
 * `Skeleton.Disclosure` mirror), a different shape than this leading-caret,
 * hug-width trigger; this port generalises the SAME hand-roll instead of
 * fighting that layout. `TaskSubmissionPanel`'s settings summary row is the
 * sibling shape (icon + label, trailing `CaretRightIcon` that does NOT
 * rotate) — that one opens an external Drawer, not an inline region, so it
 * is a different control, not this primitive.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for the {@link Disclosure} primitive. */
export interface DisclosureProps {
    /**
     * Trigger label, rendered next to the caret. Bare `ReactNode` — the
     * trigger owns the `text-sm` sizing and the muted → foreground hover
     * color (§4); pass plain text/inline content, not a styled block.
     */
    title: ReactNode
    /** Content revealed under the trigger while expanded. */
    children: ReactNode
    /**
     * Controlled expanded state. Omit to run uncontrolled (see
     * {@link DisclosureProps.defaultOpen}) — same dual mode as `Switch`.
     */
    isOpen?: boolean
    /** Called with the next expanded state — fires whether controlled or not. */
    onOpenChange?: (isOpen: boolean) => void
    /** Uncontrolled initial state; ignored once `isOpen` is provided. Default `false`. */
    defaultOpen?: boolean
    /** Disables the trigger — no toggle, dimmed, not focusable. */
    isDisabled?: boolean
    /** `true` → render the `Skeleton.Disclosure` trigger-row mirror instead. */
    isSkeleton?: boolean
    /** Extra classes on the root. */
    className?: string
}

/**
 * Generic collapsible: a trigger row (leading caret + title) that toggles a
 * `children` content region below it. Works controlled
 * (`isOpen`+`onOpenChange`) or uncontrolled (`defaultOpen`, tracks its own
 * state internally) — pass either, never both. The caret is a phosphor
 * `CaretDownIcon` that rotates 180° when expanded (§5 rotate); the content
 * region is only mounted while open (no exit animation, matching the
 * ground-truth green room).
 *
 * @param props - {@link DisclosureProps}
 */
export const Disclosure = ({
    title,
    children,
    isOpen,
    onOpenChange,
    defaultOpen = false,
    isDisabled = false,
    isSkeleton = false,
    className,
}: DisclosureProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
    const isControlled = isOpen !== undefined
    const open = isControlled ? isOpen : uncontrolledOpen

    if (isSkeleton) {
        return <Skeleton.Disclosure className={className} />
    }

    const toggle = () => {
        if (isDisabled) return
        const next = !open
        if (!isControlled) setUncontrolledOpen(next)
        onOpenChange?.(next)
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
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
                <CaretDownIcon
                    className={cn("size-4 shrink-0 transition-transform", open && "rotate-180")}
                    weight="bold"
                    aria-hidden
                    focusable="false"
                />
                <span className="text-sm">{title}</span>
            </button>
            {open ? <div className="flex flex-col gap-3">{children}</div> : null}
        </div>
    )
}
