import { cn } from "@heroui/react"
import React from "react"

interface SnippetProps extends React.ComponentPropsWithRef<"div"> {
    symbol?: string
    children?: React.ReactNode
    classNames?: {
        pre?: string
        base?: string
    }
}

export const StarCiSnippet = ({ children, symbol = "$", classNames, className, ...props }: SnippetProps) => {
    return (
        <div {...props} className={cn("inline-flex items-center gap-2 rounded-medium px-3 py-1.5 font-mono text-sm", classNames?.base, "bg-inherit", className)}>
            {symbol && <span className="text-foreground-500">{symbol}</span>}
            <pre className={cn("font-normal", classNames?.pre)}>{children}</pre>
        </div>
    )
}
