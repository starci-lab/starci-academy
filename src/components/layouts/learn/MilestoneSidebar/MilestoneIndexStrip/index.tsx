"use client"

import React from "react"
import type { MilestoneEntity, WithClassNames } from "@/modules/types"
import { cn, Separator } from "@heroui/react"

/**
 * Props for {@link MilestoneIndexStrip}.
 */
export interface MilestoneIndexStripProps extends WithClassNames<undefined> {
    /** Milestones to render, already ordered. */
    milestones: Array<MilestoneEntity>
    /** Currently active milestone id (highlights its number). */
    activeMilestoneId?: string
    /** Fired with the chosen milestone id when a number is pressed. */
    onSelectMilestone: (milestoneId: string) => void
}

/**
 * Slim numbered index of project milestones (collapsed milestone-outline rail).
 *
 * Presentational mirror of `ModuleIndexStrip`: maps each milestone to a circular
 * number button (its display order) and forwards the press as the milestone id;
 * the active milestone is highlighted. `"use client"` for the press handlers.
 * @param props - milestones, active id, and select callback
 */
export const MilestoneIndexStrip = ({
    milestones,
    activeMilestoneId,
    onSelectMilestone,
    className,
}: MilestoneIndexStripProps) => {
    return (
        // centered vertical stack of number chips; padded to clear the collapse bar
        <div className={cn("flex flex-col items-center gap-1.5 px-0 py-3", className)}>
            {milestones.map((milestone) => {
                return (
                    <React.Fragment key={String(milestone.id)}>
                        <div
                            className={
                                cn(
                                    "font-semibold text-lg cursor-pointer items-center justify-center text-sm transition-colors p-2",
                                    String(milestone.id) === String(activeMilestoneId)
                                        ? "text-accent"
                                        : "text-muted hover:text-accent"
                                )
                            }
                            onClick={
                                () => onSelectMilestone(String(milestone.id))
                            }
                        >
                            {milestone.sortIndex}
                        </div>
                        <Separator
                            className="w-full"
                        />
                    </React.Fragment>
                )
            })}
        </div>
    )
}
