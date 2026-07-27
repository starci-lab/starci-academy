import React from "react"
import type { ReactNode } from "react"
import { Disclosure as HeroDisclosure, DisclosureGroup as HeroDisclosureGroup, Skeleton as HeroSkeleton, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Accordion.Base`: the ONE constrained accordion atom over HeroUI
 * `DisclosureGroup` + `Disclosure`.
 *
 * Data-driven: the caller passes `items` (id + title + content), and the atom
 * renders `HeroDisclosureGroup > HeroDisclosure` with the full compound
 * (`Heading > Trigger (+ Indicator)` and `Content > Body`). Single-open vs
 * multi-open is a LEAF driven by the `allowsMultiple` prop (§6 granularity), not
 * a separate component; `defaultExpandedKeys` seeds an initially-open panel.
 *
 * Rules (Chip/Input):
 *   • NAMESPACE bắt buộc — chỉ export `Accordion = { Base }`, không export
 *     component trần (thầy chốt 2026-07-25).
 *   • KHÔNG `children` — panel truyền qua `items` dữ liệu; `title`/`content` là
 *     prop `ReactNode` (thân nội dung, được phép), không phải children.
 *   • Bọc HeroUI TỐI ĐA (`DisclosureGroup`, `Disclosure`), alias `Hero*`.
 *   • STRICT §4: `items` + `allowsMultiple` + `defaultExpandedKeys` TRẦN — the
 *     atom owns the trigger row, rotating indicator, expand/collapse animation;
 *     the consumer never touches the compound structure.
 *   • `isSkeleton` → collapsed-row skeleton co-located (HeroSkeleton, hybrid C).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One panel in an {@link AccordionBase}. */
export interface AccordionItem {
    /** Stable id — also the key used by `defaultExpandedKeys`. */
    key: string
    /** Trigger-row title. */
    title: ReactNode
    /** Content revealed when the panel expands. */
    content: ReactNode
    /** Render the panel but block toggling. */
    isDisabled?: boolean
}

/** Props for {@link AccordionBase}. */
export interface AccordionBaseProps {
    /** Panels in display order. */
    items: Array<AccordionItem>
    /**
     * `false` (default) = single-open — expanding one panel collapses the others.
     * `true` = multi-open — panels expand independently.
     */
    allowsMultiple?: boolean
    /** Panel ids expanded on first render (uncontrolled). */
    defaultExpandedKeys?: Array<string>
    /** Render the collapsed-row skeleton (stacked trigger bars) instead of the panels. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/**
 * The accordion atom. See file header for the strict data-driven contract.
 *
 * @param props - {@link AccordionBaseProps}
 */
const AccordionBase = ({
    items,
    allowsMultiple = false,
    defaultExpandedKeys,
    isSkeleton = false,
    showAnatomy = false,
    className,
}: AccordionBaseProps) => {
    if (isSkeleton) {
        // Leaf skeleton OWNED by the atom (hybrid C) — one collapsed trigger row per item.
        // Real heroui renders are the two `HeroSkeleton` (`Skeleton`) elements themselves,
        // NOT the plain wrapping `<div>` — tagging the div would be a made-up name (2026-07-27).
        return (
            <div className={cn("flex flex-col gap-2", className)}>
                {items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                        <HeroSkeleton className="h-4 w-40 rounded-md" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                        <HeroSkeleton className="size-4 rounded-md" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <HeroDisclosureGroup
            allowsMultipleExpanded={allowsMultiple}
            defaultExpandedKeys={defaultExpandedKeys}
            className={className}
            data-anat-part={showAnatomy ? "DisclosureGroup" : undefined}
        >
            {items.map((item) => (
                <HeroDisclosure key={item.key} id={item.key} isDisabled={item.isDisabled} data-anat-part={showAnatomy ? "Disclosure" : undefined}>
                    <HeroDisclosure.Heading>
                        <HeroDisclosure.Trigger data-anat-part={showAnatomy ? "Disclosure.Trigger" : undefined}>
                            {item.title}
                            <HeroDisclosure.Indicator data-anat-part={showAnatomy ? "Disclosure.Indicator" : undefined} />
                        </HeroDisclosure.Trigger>
                    </HeroDisclosure.Heading>
                    <HeroDisclosure.Content data-anat-part={showAnatomy ? "Disclosure.Content" : undefined}>
                        <HeroDisclosure.Body>{item.content}</HeroDisclosure.Body>
                    </HeroDisclosure.Content>
                </HeroDisclosure>
            ))}
        </HeroDisclosureGroup>
    )
}

/**
 * `Accordion.*` — the accordion ATOM namespace. `Accordion.Base` is the single
 * constrained accordion (single/multi-open, default-open are LEAVES of it,
 * prop-driven).
 */
export const Accordion = Object.assign(AccordionBase, {
    Base: AccordionBase,
})
