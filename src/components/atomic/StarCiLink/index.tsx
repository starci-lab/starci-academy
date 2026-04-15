import { Link, cn } from "@heroui/react"
import type { LinkRootProps } from "@heroui/react"
import React from "react"
export const StarCiLink = (props: LinkRootProps) => {
    return <Link {...props} className={cn(
        "cursor-pointer", 
        "hover:opacity-80",
        props.className
    )} />
}
