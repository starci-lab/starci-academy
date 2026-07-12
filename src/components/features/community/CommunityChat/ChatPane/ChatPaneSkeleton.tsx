import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"

/** Props for {@link ChatPaneSkeleton}. */
export interface ChatPaneSkeletonProps {
    /**
     * Mirror the composer too — ON for {@link import("..").CommunityChat}'s
     * wait (the whole pane, composer included, hasn't mounted yet), OFF inside
     * `ChatPane`'s own `AsyncContent` (its real composer already renders
     * alongside, so a second skeletoned one would duplicate it).
     */
    withComposer?: boolean
}

/**
 * Loading placeholder mirroring {@link import(".").ChatPane}'s message-list
 * layout (a few alternating bubbles) — shared by `ChatPane`'s own
 * `AsyncContent` and by {@link import("..").CommunityChat} while it's still
 * waiting on the active conversation id to resolve, so both waits render the
 * same shape instead of a bare "loading…" caption.
 */
export const ChatPaneSkeleton = ({ withComposer = false }: ChatPaneSkeletonProps) => {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex max-h-[60vh] flex-col gap-3 overflow-y-auto">
                {[0, 1, 2].map((row) => (
                    <div key={row} className="flex flex-col gap-1" style={row % 2 === 1 ? { alignItems: "flex-end" } : undefined}>
                        <Skeleton className="h-14 w-2/3 rounded-2xl" />
                    </div>
                ))}
            </div>
            {withComposer ? (
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-14 w-full rounded-xl" />
                    <div className="flex justify-end">
                        <Skeleton.Button width="w-20" />
                    </div>
                </div>
            ) : null}
        </div>
    )
}
