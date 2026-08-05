import React from "react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { EvaluateActionRow } from "./EvaluateActionRow"
import { GithubGradingSettingsBody } from "./GithubGradingSettingsBody"
import { GithubUrlField } from "./GithubUrlField"
import { SettingsSummaryRow } from "./SettingsSummaryRow"
import { TaskResultSummary } from "./TaskResultSummary"
import { type TaskSubmissionPanelProps } from "./types"

export type {
    TaskSubmissionAutosaveStatus,
    TaskSubmissionSettingsSummary,
    TaskSubmissionResult,
    GithubGradingSettingsFormProps,
    TaskSubmissionPanelProps,
} from "./types"

/**
 * `TaskSubmissionPanel` — the project-level (not per-task) sticky console for a
 * GitHub-graded personal project: repo URL, an evaluate action + AI status, the
 * latest result summary, and a settings drawer for language/branch/token. Sibling of
 * `ChallengeDeliverableList` (one repo URL for the whole project vs. one row per
 * requirement; the settings drawer's content is in scope here). Autosave wording,
 * the AI status line, and the evaluate button's busy state are states of `Default`;
 * losing the `TaskResultSummary` subtree (no `latestResult`) and opening the settings
 * drawer each get their own leaf.
 */

/**
 * The project-level submission console. See the file header for the full
 * reuse ledger and the judgement calls (trimmed result summary, shared
 * status-line vocabulary, baked-in sticky position).
 *
 * @param props - {@link TaskSubmissionPanelProps}
 */
const TaskSubmissionPanel = ({
    githubUrl,
    onGithubUrlChange,
    urlError,
    autosaveStatus,
    settingsSummary,
    isSettingsOpen,
    onSettingsOpenChange,
    onEvaluate,
    isEvaluating = false,
    aiStatusText,
    latestResult,
    settingsFormProps,
    isSkeleton = false,
}: TaskSubmissionPanelProps) => (
    <div className="sticky top-4 z-10">
        <SurfaceCard
            label="Submit project"
            isSkeleton={isSkeleton}

            body={() => (
                <StackV
                    gap={4}
                    isSkeleton={isSkeleton}

                    items={[
                        () => (
                            <GithubUrlField
                                githubUrl={githubUrl}
                                onGithubUrlChange={onGithubUrlChange}
                                urlError={urlError}
                                autosaveStatus={autosaveStatus}
                                isSkeleton={isSkeleton}

                            />
                        ),
                        () => (
                            <SettingsSummaryRow
                                settingsSummary={settingsSummary}
                                onOpenSettings={() => onSettingsOpenChange(true)}
                                isSkeleton={isSkeleton}

                            />
                        ),
                        () => (
                            <EvaluateActionRow
                                onEvaluate={onEvaluate}
                                isEvaluating={isEvaluating}
                                aiStatusText={aiStatusText}
                                isSkeleton={isSkeleton}

                            />
                        ),
                        () => <TaskResultSummary result={latestResult} isSkeleton={isSkeleton} />,
                    ]}
                />
            )}
        />

        <DrawerShell
            isOpen={isSettingsOpen}
            onOpenChange={onSettingsOpenChange}
            title="Grading settings"
            description="The language, branch and token StarCi uses to read and grade your repo."
            footer={() => (
                <Button
                    label="Save"
                    variant="primary"
                    onPress={settingsFormProps.onSave}
                    isPending={settingsFormProps.isSaving}

                />
            )}

            body={() => <GithubGradingSettingsBody form={settingsFormProps} />}
        />
    </div>
)

export { TaskSubmissionPanel }
