import React from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import { CodeIcon, GearSixIcon, GitBranchIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InlineIconLabel } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { type TaskSubmissionSettingsSummary } from "../types"

/** Props for the local {@link SettingsSummaryRow} leaf. */
interface SettingsSummaryRowProps {
    settingsSummary: TaskSubmissionSettingsSummary
    onOpenSettings: () => void
    isSkeleton: boolean
}

/** Compact "what am I grading against" line + the gear that opens the settings drawer. */
export const SettingsSummaryRow = ({ settingsSummary, onOpenSettings, isSkeleton }: SettingsSummaryRowProps) => (
    <StackH
        gap={3}
        principles="flex-action"
        align="center"
        justify="between"
        isSkeleton={isSkeleton}

        items={[
            ({ isSkeleton }: SkeletonProps) => (
                <StackH
                    gap={3}
                    principles="chip-row"
                    align="center"
                    at="sm"
                    isSkeleton={isSkeleton}

                    items={[
                        () => (
                            <InlineIconLabel
                                icon={CodeIcon}
                                tone="default"
                                size="xs"
                                isSkeleton={isSkeleton}
                                label={settingsSummary.langLabel}
                            />
                        ),
                        () => (
                            <InlineIconLabel
                                icon={GitBranchIcon}
                                tone="default"
                                size="xs"
                                isSkeleton={isSkeleton}
                                label={settingsSummary.branch}
                            />
                        ),
                    ]}
                />
            ),
            () => (
                <Button
                    isIconOnly
                    prefixIcon={GearSixIcon}
                    ariaLabel="Grading settings"
                    variant="tertiary"
                    size="sm"
                    onPress={onOpenSettings}
                    isSkeleton={isSkeleton}

                />
            ),
        ]}
    />
)
