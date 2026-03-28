import { Link, LinkProps } from "@heroui/react"
import { ArrowSquareOutIcon } from "@phosphor-icons/react"
import React from "react"
import { cn } from "@heroui/react"
export const StarCiLink = (props: LinkProps) => {
    return <Link anchorIcon={<ArrowSquareOutIcon className="ml-1" />} {...props} className={cn("cursor-pointer", props.className)} />
}