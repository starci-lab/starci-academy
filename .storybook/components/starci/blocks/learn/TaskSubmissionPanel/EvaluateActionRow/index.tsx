import React from "react"
import { PlayIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { StackH } from "@sb-components/frames/Stack/Stack"

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
        principles={["flex-action"]}
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
