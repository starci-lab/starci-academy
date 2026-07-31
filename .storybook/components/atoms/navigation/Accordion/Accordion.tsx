import React from "react"
import type { ReactNode } from "react"
import { Disclosure as HeroDisclosure, DisclosureGroup as HeroDisclosureGroup, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `Accordion` — the single accordion atom wrapping HeroUI `DisclosureGroup` +
 * `Disclosure`.
 *
 * Data-driven: pass `items` (id + title + content); the atom renders the full
 * `DisclosureGroup > Disclosure` compound (`Heading > Trigger (+ Indicator)`
 * and `Content > Body`). `allowsMultiple` switches single-open vs multi-open;
 * `defaultExpandedKeys` seeds an initially-open panel.
 *
 * Only `Accordion` is exported — no bare component. `items`/`title`/`content`
 * are data props, not `children`. The atom owns the trigger row, rotating
 * indicator, and expand/collapse animation. `isSkeleton` renders a co-located
 * collapsed-row skeleton.
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
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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
    classNames,
}: AccordionBaseProps) => {
    if (isSkeleton) {
        // One collapsed trigger row per item. Only the HeroSkeleton elements get
        // data-anat-part — the wrapping div isn't a real component, tagging it
        // would be a made-up name.
        return (
            <div className={cn("flex flex-col gap-2", className, classNames)}>
                {items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                        <HeroSkeleton className="h-4 w-1/2 rounded-md" data-anat-part={showAnatomy ? "Skeleton" : undefined} />
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
            className={cn(className, classNames)}
            data-anat-part={showAnatomy ? "DisclosureGroup" : undefined}
        >
            {items.map((item) => (
                <HeroDisclosure key={item.key} id={item.key} isDisabled={item.isDisabled} data-anat-part={showAnatomy ? "Disclosure" : undefined}>
                    <HeroDisclosure.Heading>
                        <HeroDisclosure.Trigger data-anat-part={showAnatomy ? "Disclosure.Trigger" : undefined}>
                            {item.title}
                            <HeroDisclosure.Indicator data-anat-part={showAnatomy ? "Disclosure.Indicator" : undefined}>
                                {/* Left empty, HeroUI renders its own chevron instead — pass an icon
                                    here to keep a single icon set. The vendor clones this element,
                                    preserving data-expanded/data-slot and applying its own
                                    rotate-on-open class, so no className is needed here. */}
                                <CaretDownIcon aria-hidden weight="bold" />
                            </HeroDisclosure.Indicator>
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
 * `Accordion.*` — the accordion ATOM namespace. `Accordion` is the single
 * constrained accordion (single/multi-open, default-open are LEAVES of it,
 * prop-driven).
 */
export { AccordionBase as Accordion }
