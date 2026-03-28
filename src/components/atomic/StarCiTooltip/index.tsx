import React from "react"
import { Tooltip, TooltipProps } from "@heroui/react"

export const StarCiTooltip = (props: TooltipProps) => {
    return <Tooltip classNames={
        {
            base: "max-w-[300px]",
        }
    } {...props} />
}
