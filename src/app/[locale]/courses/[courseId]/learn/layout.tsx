import React from "react"
import { Sidebar } from "./Sidebar"

export const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="grid grid-cols-4 items-start">
            <Sidebar />
            <div className="col-span-3 p-6">
                {children}
            </div>
        </div>
    )
}

export default Layout