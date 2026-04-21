"use client"
import React, { PropsWithChildren } from "react"
import { Sidebar } from "@/components/layouts"

export const Layout = ({ children }: PropsWithChildren) => {
    return (
        <div className="grid grid-cols-4 items-start">
            <Sidebar />
            <div className="col-span-3">
                {children}
            </div>
        </div>
    )
}

export default Layout