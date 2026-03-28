import { Checkbox, CheckboxProps, cn } from "@heroui/react"
import React from "react"
export const StarCiCheckbox = (props: CheckboxProps) => {
    return <Checkbox {...props} className={cn("pr-0", props.className)} />
}