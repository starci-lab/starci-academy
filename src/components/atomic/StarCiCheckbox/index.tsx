import { Checkbox, cn } from "@heroui/react"
import type { CheckboxRootProps } from "@heroui/react"
import React from "react"
export const StarCiCheckbox = (props: CheckboxRootProps) => {
    return <Checkbox {...props} className={cn("pr-0", props.className)} />
}
