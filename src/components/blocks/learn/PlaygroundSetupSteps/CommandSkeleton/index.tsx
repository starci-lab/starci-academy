import React from "react"
import { Typography } from "@/components/atoms/text/Typography"
import { Divider } from "@/components/atoms/display/Divider"
import { StackV, StackH } from "@/components/frames/Stack"

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
            explain="Control hit-area inset — not row-pad, because this pads a single interactive control rather than a full content row."
            body={() => <Typography size="xs" isSkeleton classNames={["w-1/4"]} />}
        />
        <Divider />
        <StackV
            gap={3}
            padding={4}
            principle="cell-pad"
            explain="Tight cell inset — not card-padding, because this sits inside a dense table or list cell rather than a card body."
            body={() => (
                <StackV
                    gap={3}
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    items={Array.from({ length: lines }, (_unused, index) => () => (
                        <Typography size="xs" isSkeleton classNames={[index === lines - 1 ? "w-1/2" : "w-3/4"]} />
                    ))}
                />
            )}
        />
    </div>
)
