"use client"

import type { PropsWithChildren } from "react"
import { Sidebar } from "@/components/layouts"

/**
 * Course shell with sidebar for headhunting company routes (outside `/learn`).
 */
export const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="grid grid-cols-4 items-start">
            <Sidebar />
            <div className="col-span-3 min-h-0 min-w-0">
                {children}
            </div>
        </div>
    )
}

export default Layout
