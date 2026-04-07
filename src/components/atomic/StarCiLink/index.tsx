import { Link, LinkProps } from "@heroui/react"
import React from "react"
import { cn } from "@heroui/react"
export const StarCiLink = (props: LinkProps) => {
    return <Link {...props} className={cn("cursor-pointer gap-1", props.className)} />
}