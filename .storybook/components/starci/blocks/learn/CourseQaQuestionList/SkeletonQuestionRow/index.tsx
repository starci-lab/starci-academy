import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"

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
        <StackH identity={{ tier: "block", component: "SkeletonQuestionRow" }}
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
                        items={[
                            // asker + time line
                            () => <Typography size="xs" isSkeleton />,
                            // two-line preview
                            () => (
                                <StackV
                                    gap={2}
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
                () => <HeroSkeleton className="size-2 shrink-0 rounded-full" />,
            ]}
        />
    )
}
