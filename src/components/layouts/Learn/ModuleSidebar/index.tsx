import React from "react"
import { ModuleEntity } from "@/modules/types"

export interface ModuleSidebarProps {
    modules?: Array<ModuleEntity>
}

export const ModuleSidebar = ({ modules }: ModuleSidebarProps) => {
    return (
        <div>
            <div>
                {modules?.map((module) => (
                    <div key={module.id}>
                        {module.title}
                    </div>
                ))}
            </div>
        </div>
    )
}