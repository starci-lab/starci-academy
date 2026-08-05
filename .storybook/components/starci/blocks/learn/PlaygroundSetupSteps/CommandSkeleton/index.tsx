import React from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Divider } from "@sb-components/atoms/display/Divider/Divider"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"

/** Props for the local {@link CommandSkeleton} mirror. */
interface CommandSkeletonProps {
    /** How many placeholder code lines to draw. Defaults to 1. */
    lines?: number
}

/**
 * Placeholder mirror of the code-block chrome `MarkdownContent`'s `pre` renderer
 * draws (border, header divider, lang label) — see file header for why this
 * block owns it instead of `MarkdownContent` shipping an `isSkeleton`.
 */
export const CommandSkeleton = ({ lines = 1 }: CommandSkeletonProps) => (
    <div className="overflow-hidden rounded-2xl border border-default bg-default/30">
        <StackH
            gap={1}
            align="center"
            justify="between"
            padding={{ x: 4, y: 3 }}
            principle="control-pad"
            body={() => <Typography size="xs" isSkeleton />}
        />
        <Divider />
        <StackV
            gap={1}
            padding={4}
            principle="cell-pad"
            items={[() => (
                <StackV
                    gap={3}
                    principle="sibling-stack"
                    items={Array.from({ length: lines }, () => () => (
                        <Typography size="xs" isSkeleton />
                    ))}
                />
            )]}
        />
    </div>
)
