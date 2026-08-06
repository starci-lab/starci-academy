import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Box } from "@/components/frames/Box"
import { StackH, StackV } from "@/components/frames/Stack"

/** Props for {@link ChatPaneSkeleton}. */
export interface ChatPaneSkeletonProps {
    /**
     * Mirror the composer too — ON for {@link import("..").CommunityChatPage}'s
     * wait (the whole pane, composer included, hasn't mounted yet), OFF inside
     * `ChatPane`'s own `AsyncContent` (its real composer already renders
     * alongside, so a second skeletoned one would duplicate it).
     */
    withComposer?: boolean
}

/**
 * Loading placeholder mirroring {@link import(".").ChatPane}'s message-list
 * layout (a few alternating bubbles) — shared by `ChatPane`'s own
 * `AsyncContent` and by {@link import("..").CommunityChatPage} while it's still
 * waiting on the active conversation id to resolve, so both waits render the
 * same shape instead of a bare "loading…" caption.
 */
export const ChatPaneSkeleton = ({ withComposer = false }: ChatPaneSkeletonProps) => {
    return (
        <StackV gap={4} principle="content-row" items={[
            () => (
                <Box className="max-h-[60vh] overflow-y-auto">
                    <StackV gap={4} principle="content-row" items={[0, 1, 2].map((row) => () => (
                        <StackV key={row} gap={2} principle="title-subtitle" align={row % 2 === 1 ? "end" : "stretch"} items={[
                            () => <Skeleton className="h-14 w-2/3 rounded-2xl" />,
                        ]} />
                    ))} />
                </Box>
            ),
            ...(withComposer ? [
                () => (
                    <StackV gap={3} principle="sibling-stack" items={[
                        () => <Skeleton className="h-14 w-full rounded-xl" />,
                        () => (
                            <StackH gap={1} principle="name-handle" justify="end" items={[
                                () => <Skeleton.Button width="w-20" />,
                            ]} />
                        ),
                    ]} />
                )
            ] : []),
        ]} />
    )
}
