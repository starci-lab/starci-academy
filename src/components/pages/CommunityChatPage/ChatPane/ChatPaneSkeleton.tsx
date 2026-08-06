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
        <StackV gap={4} principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            items={[
                () => (
                    <Box className="max-h-[60vh] overflow-y-auto">
                        <StackV gap={4} principle="content-row"
                            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                            items={[0, 1, 2].map((row) => () => (
                                <StackV key={row} gap={2} principle="title-subtitle"
                                    explain="Title over supporting line — not label-field, because neither line is a form control label."
                                    align={row % 2 === 1 ? "end" : "stretch"} items={[
                                        () => <Skeleton className="h-14 w-2/3 rounded-2xl" />,
                                    ]} />
                            ))} />
                    </Box>
                ),
                ...(withComposer ? [
                    () => (
                        <StackV gap={3} principle="sibling-stack"
                            explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                            items={[
                                () => <Skeleton className="h-14 w-full rounded-xl" />,
                                () => (
                                    <StackH gap={1} principle="name-handle"
                                        explain="Display name with handle — not title-subtitle, because the second line is an identity handle rather than a subtitle."
                                        justify="end" items={[
                                            () => <Skeleton.Button width="w-20" />,
                                        ]} />
                                ),
                            ]} />
                    )
                ] : []),
            ]} />
    )
}
