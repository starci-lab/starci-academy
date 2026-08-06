import React from "react"
import { PlayIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { InlineIconLabel } from "@/components/composites/text/InlineIconLabel"
import { StackH } from "@/components/frames/Stack"

/** Props for the local {@link EvaluateActionRow} leaf. */
interface EvaluateActionRowProps {
    onEvaluate: () => void
    isEvaluating: boolean
    aiStatusText?: string
    isSkeleton: boolean
}

/** The evaluate CTA + an optional AI status line beside it. */
export const EvaluateActionRow = ({ onEvaluate, isEvaluating, aiStatusText, isSkeleton }: EvaluateActionRowProps) => (
    <StackH
        gap={3}
        principle="flex-action"
        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
        align="center"
        justify="between"
        at="sm"
        isSkeleton={isSkeleton}

        items={[
            () =>
                aiStatusText != null ? (
                    <InlineIconLabel
                        icon={SparkleIcon}
                        tone="default"
                        size="xs"
                        isSkeleton={isSkeleton}
                        label={aiStatusText}
                    />
                ) : (
                    // Keeps the row's justify-between shape even with no status text to show.
                    <span />
                ),
            () => (
                <Button
                    label="Grade"
                    variant="primary"
                    prefixIcon={PlayIcon}
                    onPress={onEvaluate}
                    isPending={isEvaluating}
                    isSkeleton={isSkeleton}

                />
            ),
        ]}
    />
)
