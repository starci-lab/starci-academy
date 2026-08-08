import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { Avatar } from "@/components/atoms/display/Avatar"
import { Chip } from "@/components/atoms/chips/Chip"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV, StackH } from "@/components/frames/Stack"

/**
 * One placeholder row for the Loading branch — avatar + 2 text bars +
 * chip-pill row + status dot, ported verbatim from the real
 * `CourseQaSkeleton.tsx` shape (*1).
 *
 * `align="start"` on the outer row (instead of the real file's `mt-2` on the
 * dot) top-aligns all three children without a child pushing its own margin
 * (§10a — the padding gate only allows a parent's `gap`/surface `padding` to
 * own a seam).
 */
export const SkeletonQuestionRow = () => {
    return (
        <StackH
            identity={{ tier: "block", component: "SkeletonQuestionRow" }}
            gap={4}
            principle="content-row"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            align="start"
            items={[
                () => (
                    <Avatar isSkeleton size="sm" />
                ),
                () => (
                    <StackV
                        gap={2}
                        classNames={["min-w-0", "flex-1"]}
                        principle="sibling-stack"
                        explain="Same-kind peer stack of asker line, preview, and chip row — not group-boundary, because these are repeating row sections rather than labelled groups."
                        items={[
                            // asker + time line
                            () => <Typography size="xs" isSkeleton />,
                            // two-line preview
                            () => (
                                <StackV
                                    gap={2}
                                    principle="sibling-stack"
                                    explain="Same-kind peer stack of preview shimmer lines — not group-boundary, because both lines are repeating skeleton peers rather than labelled section groups."
                                    items={[
                                        () => <Typography size="sm" isSkeleton />,
                                        () => <Typography size="sm" isSkeleton />,
                                    ]}
                                />
                            ),
                            // chip-pill row — ONE chip (status, the classification axis) + the scope
                            // as a plain shimmer bar, matching the real row's own text-inline treatment
                            // (eslint `starci-fe/no-adjacent-chip`, *7 below).
                            () => (
                                <StackH
                                    gap={3}
                                    principle="chip-row"
                                    explain="Status chip and scope shimmer share one wrapping meta row — not flex-action, because neither peer is a control."
                                    items={[
                                        () => <Typography size="xs" isSkeleton />,
                                        () => <Chip isSkeleton />,
                                    ]}
                                />
                            ),
                        ]}
                    />
                ),
                // status dot — no home atom (*3), same escape hatch `Pagination` uses for its own shimmer squares
                () => <Skeleton className="size-2 shrink-0 rounded-full" />,
            ]}
        />
    )
}
