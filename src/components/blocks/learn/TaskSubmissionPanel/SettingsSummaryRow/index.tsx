import React from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import { CodeIcon, GearSixIcon, GitBranchIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { InlineIconLabel } from "@/components/composites/text/InlineIconLabel"
import { StackH } from "@/components/frames/Stack"
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
        identity={{ tier: "block", component: "SettingsSummaryRow" }}
        gap={3}
        principle="flex-action"
        explain="Groups action controls on one horizontal peer row so they share a single hit baseline."
        align="center"
        justify="between"
        isSkeleton={isSkeleton}

        items={[
            ({ isSkeleton }: SkeletonProps) => (
                <StackH
                    gap={3}
                    principle="chip-row"
                    explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
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
