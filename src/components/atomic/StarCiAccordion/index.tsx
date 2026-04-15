import React from "react"
import { Accordion, AccordionItem, cn } from "@heroui/react"
import type { AccordionRootProps } from "@heroui/react"

export const StarCiAccordion = (props: AccordionRootProps) => {
    return <Accordion {...props} className={cn(props.className)} />
}

export const StarCiAccordionItem = AccordionItem
