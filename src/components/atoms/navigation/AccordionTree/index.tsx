/** @noSkeleton disclosure chrome assembled one panel at a time — content is handed in. */
import type { ComponentProps, ReactNode } from "react"
import { Accordion as HeroAccordion } from "@heroui/react"

/** Props for {@link AccordionTree}. */
export type AccordionTreeProps = Omit<ComponentProps<typeof HeroAccordion>, "className" | "classNames"> & {
    /** Panel compound tree. */
    children?: ReactNode
}

/** House wrap over HeroUI `Accordion` compound (markdown / incremental panels). */
export const AccordionTree = ({ children, ...props }: AccordionTreeProps) => (
    <HeroAccordion data-tier="atom" data-component="AccordionTree" {...props}>{children}</HeroAccordion>
)

export const AccordionTreeItem = HeroAccordion.Item
export const AccordionTreeHeading = HeroAccordion.Heading
export const AccordionTreeTrigger = HeroAccordion.Trigger
export const AccordionTreeIndicator = HeroAccordion.Indicator
export const AccordionTreePanel = HeroAccordion.Panel
export const AccordionTreeBody = HeroAccordion.Body

export const meta = { tier: "atom", name: "AccordionTree" } as const
