"use client"

import React from "react"
import type { ModuleEntity, WithClassNames } from "@/modules/types"
import { Typography, cn, Separator } from "@heroui/react"

/**
 * Props for {@link ModuleIndexStrip}.
 */
export interface ModuleIndexStripProps extends WithClassNames<undefined> {
    /** Modules to render, already ordered. */
    modules: Array<ModuleEntity>
    /** Currently active module id (highlights its number). */
    activeModuleId?: string
    /** Fired with the chosen module id when a number is pressed. */
    onSelectModule: (moduleId?: string) => void
}

/**
 * Slim numbered index of course modules (collapsed module-outline rail).
 *
 * Presentational: maps each module to a circular number button (its 1-based
 * order) and forwards the press as the module id; the active module is
 * highlighted. `"use client"` for the press handlers.
 * @param props - modules, active id, and select callback
 */
export const ModuleIndexStrip = ({
    modules,
    activeModuleId,
    onSelectModule,
    className,
}: ModuleIndexStripProps) => {
    return (
        // centered vertical stack of number chips; padded to clear the collapse bar
        <div className={cn("flex flex-col items-center gap-2 px-0 py-3", className)}>
            {modules.map((module) => {
                return (
                    <React.Fragment key={String(module.id)}>
                        <Typography
                            type="body"
                            className={
                                cn(
                                    "font-semibold cursor-pointer items-center justify-center transition-colors p-2",
                                    String(module.id) === String(activeModuleId)
                                        ? "text-accent"
                                        : "text-muted hover:text-accent"
                                )
                            }
                            onClick={
                                () => onSelectModule(String(module.id))
                            }
                        >
                            {module.sortIndex}
                        </Typography>
                        <Separator
                            className="w-full"
                        />
                    </React.Fragment>
                )
            })}
        </div>
    )
}
