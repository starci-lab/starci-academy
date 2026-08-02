import React from "react"
import type { ReactNode } from "react"
import { Disclosure as HeroDisclosure, DisclosureGroup as HeroDisclosureGroup, Skeleton as HeroSkeleton, cn } from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `Accordion` wraps HeroUI `DisclosureGroup` + `Disclosure` directly; it composes no
 * atom of ours with a story. Every sub-part is a real `@heroui/react` import, so each node
 * declares `tier: "heroui"` in `ANNOTATE` with the name matching the import identifier
 * exactly (`DisclosureGroup`/`Disclosure`/`Disclosure.Trigger`/`Disclosure.Indicator`/
 * `Disclosure.Content`/`Skeleton`), with no `storyId`.
 * 
 * Leaf set = `Default` (bare, prop `items`) + `Single`/`Multiple` (prop `allowsMultiple`,
 * each cell uses `defaultExpandedKeys` to open a panel up front, since `allowsMultiple` only
 * changes behavior on interaction) + `Skeleton` (prop `isSkeleton`).
 * 
 * `Skeleton` carries the prop's name (`isSkeleton`). The atom has no other size/variant axis
 * for the skeleton, so one rendering is enough.
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
    classNames,
}: AccordionBaseProps) => {
    if (isSkeleton) {
        // One collapsed trigger row per item.
        return (
            <div data-tier="atom" data-component="Accordion" className={cn("flex flex-col gap-2", classNames)}>
                {items.map((item) => (
                    <div key={item.key} className="flex items-center justify-between rounded-xl border border-default-200 px-4 py-3">
                        <HeroSkeleton
                            className="h-4 w-1/2 rounded-md"

                        />
                        <HeroSkeleton
                            className="size-4 rounded-md"

                        />
                    </div>
                ))}
            </div>
        )
    }

    return (
        <HeroDisclosureGroup
            data-tier="atom"
            data-component="Accordion"
            allowsMultipleExpanded={allowsMultiple}
            defaultExpandedKeys={defaultExpandedKeys}
            className={cn(classNames)}

        >
            {items.map((item) => (
                <HeroDisclosure
                    key={item.key}
                    id={item.key}
                    isDisabled={item.isDisabled}

                >
                    <HeroDisclosure.Heading>
                        <HeroDisclosure.Trigger

                        >
                            {item.title}
                            <HeroDisclosure.Indicator

                            >
                                {/* Left empty, HeroUI renders its own chevron instead — pass an icon
                                    here to keep a single icon set. The vendor clones this element,
                                    preserving data-expanded/data-slot and applying its own
                                    rotate-on-open class, so no className is needed here. */}
                                <CaretDownIcon aria-hidden weight="bold" />
                            </HeroDisclosure.Indicator>
                        </HeroDisclosure.Trigger>
                    </HeroDisclosure.Heading>
                    <HeroDisclosure.Content

                    >
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

export const meta = { tier: "atom", name: "Accordion" } as const
