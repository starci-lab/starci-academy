import React from "react"
import { Accordion, AccordionItem, cn } from "@heroui/react"
import type { AccordionProps } from "@heroui/react"

export const StarCiAccordion = (props: AccordionProps) => {
    return <Accordion {...props} className={cn(props.className)} />
}

export const StarCiAccordionItem = AccordionItem