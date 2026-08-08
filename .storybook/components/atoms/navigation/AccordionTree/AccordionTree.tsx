/** @noSkeleton disclosure chrome assembled one panel at a time — content is handed in. */
import type { CSSProperties, ReactNode } from "react"
import { Accordion as HeroAccordion } from "@heroui/react"

/** Props for {@link AccordionTree}. */
export interface AccordionTreeProps {
    /** Panel compound tree. */
    children?: ReactNode
    /** Finite house surface treatment. */
    variant?: "default" | "surface"
    /** Finite separator treatment for nested surfaces. */
    separatorTone?: "subtle"
}

/** House wrap over HeroUI `Accordion` compound (markdown / incremental panels). */
export const AccordionTree = ({ children, variant, separatorTone }: AccordionTreeProps) => (
    <HeroAccordion
        data-tier="atom"
        data-component="AccordionTree"
        variant={variant}
        style={separatorTone === "subtle"
            ? { "--separator": "color-mix(in oklab, var(--surface-foreground) 6%, transparent)" } as CSSProperties
            : undefined}
    >
        {children}
    </HeroAccordion>
)

/** House accordion tree item over HeroUI `Accordion.Item`. */
export const AccordionTreeItem = HeroAccordion.Item
/** House accordion tree heading over HeroUI `Accordion.Heading`. */
export const AccordionTreeHeading = HeroAccordion.Heading
/** House accordion tree trigger over HeroUI `Accordion.Trigger`. */
export const AccordionTreeTrigger = HeroAccordion.Trigger
/** House accordion tree indicator over HeroUI `Accordion.Indicator`. */
export const AccordionTreeIndicator = HeroAccordion.Indicator
/** House accordion tree panel over HeroUI `Accordion.Panel`. */
export const AccordionTreePanel = HeroAccordion.Panel
/** House accordion tree body over HeroUI `Accordion.Body`. */
export const AccordionTreeBody = HeroAccordion.Body

/** Tier metadata for `AccordionTree`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "AccordionTree" } as const
