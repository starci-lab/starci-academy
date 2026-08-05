import React, { useState } from "react"
import { cn } from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { ComponentTypeWithSkeleton , SkeletonProps } from "@sb-components/frames/_slot"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `Disclosure` — the generic collapsible frame: a trigger row (leading caret + title) toggling
 * one content region below it (caret rotates 180° on open, `w-fit` trigger). A multi-panel
 * accordion is a different frame (`SurfaceCardAccordion`). `body`/`children` take a component
 * reference, not a built node, so the composite can forward `isSkeleton`.
 */

/** Source-level tier metadata — see `.claude/design/storybook/architecture/elements/*.md`. */
export const meta = { tier: "composite", name: "Disclosure" } as const

/** Props for {@link Disclosure}. */
export interface DisclosureBaseProps {
    /**
     * Trigger label, rendered next to the caret. The composite renders it
     * through the `Typography` atom itself (§4: `text-sm`, muted → foreground
     * on hover) and forwards `isSkeleton`, so this is plain text, not a
     * pre-built node — see COMPOSITE-8.
     */
    title: string
    /**
     * Content revealed under the trigger while expanded, as a COMPONENT
     * reference (COMPOSITE-8) — the composite calls it itself so it can
     * forward `isSkeleton`, never an already-built node.
     */
    body?: ComponentTypeWithSkeleton
    /** Shorthand for {@link DisclosureBaseProps.body} — same component-reference contract. */
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
     * `true` → the real collapsed trigger row renders as-is (§12c: the owner
     * of the shape is the owner of the skeleton) — same `w-fit`, same `gap-1`
     * (icon-text), same real `CaretDownIcon` (a caret is SHAPE, not content)
     * — and only `title` is handed to `Typography` with `isSkeleton`, which
     * draws its own shimmer bar. The trigger is non-interactive and the body
     * region stays unmounted, exactly like the collapsed real state.
     */
    isSkeleton?: boolean
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
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
    isOpen,
    onOpenChange,
    defaultOpen = false,
    isDisabled = false,
    isSkeleton = false,
    classNames,
}: DisclosureBaseProps) => {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
    const isControlled = isOpen !== undefined
    const open = isControlled ? isOpen : uncontrolledOpen
    const Content = body

    const toggle = () => {
        if (isDisabled || isSkeleton) return
        const next = !open
        if (!isControlled) setUncontrolledOpen(next)
        onOpenChange?.(next)
    }

    // ONE render path (§12c: the owner of the shape is the owner of the skeleton)
    // — the real trigger row renders always; a loading caller only flips
    // `isSkeleton` on the `Typography` title, which draws its own shimmer sized to
    // `text-sm`. The caret stays real (it is SHAPE, not content) and the body
    // region stays unmounted while loading, exactly like the collapsed real state.
    return (
        <StackV
            gap={4}
            isSkeleton={isSkeleton}
            classNames={classNames}
            items={[
                () => (
                    <button
                        type="button"
                        onClick={toggle}
                        aria-expanded={open}
                        disabled={isDisabled}
                        data-principles="icon-text"
                        className={cn(
                            "group flex w-fit items-center gap-1 text-muted outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent",
                            isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                        )}
                    >
                        {/* TEXT position (icon): BARE beside the `text-sm` label, no box/control
                            of its own — trigger is `w-fit`, hugs content like running text. Size =
                            font-size 1:1 of `text-sm` → `size-3.5`. Weight stays `bold` —
                            `size-3.5` < `size-5`. */}
                        <CaretDownIcon
                            className={cn("size-3.5 shrink-0 transition-transform", open && !isSkeleton && "rotate-180")}
                            weight="bold"
                            aria-hidden
                            focusable="false"
                        />
                        <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={title} />
                    </button>
                ),
                ...(open && !isSkeleton && Content ? [({ isSkeleton }: SkeletonProps) => (
                    <StackV gap={4} isSkeleton={isSkeleton} items={[() => <Content isSkeleton={isSkeleton} />]} />
                )] : []),
            ]}
        />
    )
}

/**
 * The collapsible frame namespace — one member:
 *
 * | Member | Content channel |
 * |---|---|
 * | `.Base` | `title` (trigger) + `body` slot |
 */
export { Base as Disclosure }
