import { cn, Snippet, SnippetProps } from "@heroui/react"
import React from "react"

export const StarCiSnippet = (props: SnippetProps) => {
    return <Snippet {...props} classNames={{
        ...props.classNames,
        pre: cn(props.classNames?.pre, "font-normal"),
        base: cn(props.classNames?.base, "bg-inherit"),
    }}/>
}