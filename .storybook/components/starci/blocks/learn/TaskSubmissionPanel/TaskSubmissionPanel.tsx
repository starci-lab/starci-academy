import React from "react"
import {
    CheckCircleIcon,
    CloudArrowUpIcon,
    CodeIcon,
    GearSixIcon,
    GitBranchIcon,
    PlayIcon,
    SparkleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react"
import { Button, type IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { InputPassword, InputText } from "@sb-components/atoms/forms/Input/Input"
import { SelectSingle, type SelectOption } from "@sb-components/atoms/forms/Select/Select"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { InlineIconLabel, type InlineIconLabelTone } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `TaskSubmissionPanel` — the project-level sticky console for a GitHub-graded
 * personal project: point StarCi at the repo, kick off a re-evaluation, and see
 * the last verdict without leaving the task list. Reuses `SurfaceCard`,
 * `Button`, inputs, `SelectSingle`, and `DrawerShell` (settings drawer content
 * is in scope: language/branch/token bindings). A local `TaskResultSummary`
 * (trimmed sibling of `SubmissionScoreCard`) shows score + one feedback line +
 * model badge. Autosave and AI status map each enum value to icon + tone +
 * wording through `InlineIconLabel`; the evaluate button gets a live spinner via
 * `Button`'s `isPending`. `sticky top-4 z-10` is baked in. An omitted
 * `latestResult` and an `idle` `autosaveStatus` each drop their row. Never
 * decides what a locked evaluate means — always forwards `onEvaluate`.
 */

/** Where the repo-URL field's autosave currently stands. */
export type TaskSubmissionAutosaveStatus = "idle" | "saving" | "saved" | "error"

/** The active grading settings, already resolved to display strings by the caller. */
export interface TaskSubmissionSettingsSummary {
    /** Human-readable language name, e.g. "TypeScript". */
    langLabel: string
    /** Git branch graded against, e.g. "main". */
    branch: string
}

/** The most recent evaluation's result, trimmed to what a project-level summary needs. */
export interface TaskSubmissionResult {
    /** Points earned on the last evaluation. */
    score: number
    /** Points the evaluation was scored out of. */
    maxScore: number
    /** One short line of grader feedback, plain text. */
    shortFeedback?: string
    /** The model/lane that produced this grade, shown as a small badge (e.g. "Sonnet"). */
    aiBadge?: string
}

/** Bindings for the settings drawer's language/branch/token form. */
export interface GithubGradingSettingsFormProps {
    /** Flat options for the language dropdown. */
    languageOptions: Array<SelectOption>
    /** Currently selected language value. */
    language: string
    onLanguageChange: (value: string) => void
    /** Branch to grade against. */
    branch: string
    onBranchChange: (value: string) => void
    /** Personal access token, kept masked (`InputPassword`). */
    token: string
    onTokenChange: (value: string) => void
    /** Overrides the token field's hint line. Defaults to a private-repo explainer. */
    tokenHint?: string
    /** Fired when the learner presses Save inside the drawer. */
    onSave: () => void
    /** `true` → the Save button shows busy and locks. */
    isSaving?: boolean
}

/** Props for {@link TaskSubmissionPanel}. */
export interface TaskSubmissionPanelProps {
    /** The project repo URL as typed so far. */
    githubUrl: string
    onGithubUrlChange: (value: string) => void
    /** Validation message for the URL field. Set → the field shows invalid. */
    urlError?: string
    /** Where the URL field's autosave stands right now. */
    autosaveStatus: TaskSubmissionAutosaveStatus
    /** The active language/branch, shown as a compact summary row. */
    settingsSummary: TaskSubmissionSettingsSummary
    /** Whether the settings drawer is open. Controlled. */
    isSettingsOpen: boolean
    onSettingsOpenChange: (open: boolean) => void
    /** Fired when the learner presses "Grade". */
    onEvaluate: () => void
    /** `true` → the evaluate button shows busy and locks (react-aria doesn't draw this itself). */
    isEvaluating?: boolean
    /** A short line naming what the AI is doing / last did, e.g. "Analyzing the latest commit". Omit → no status line. */
    aiStatusText?: string
    /** The most recent evaluation. Omit → no evaluation has run yet for this project. */
    latestResult?: TaskSubmissionResult
    /** Bindings for the settings drawer's form fields. */
    settingsFormProps: GithubGradingSettingsFormProps
    /** `true` → every part this block renders itself mirrors as shimmer. */
    isSkeleton?: boolean
}

/** Autosave state → its own icon/tone/wording. `idle` never renders (see file header). */
const AUTOSAVE_ICON: Record<Exclude<TaskSubmissionAutosaveStatus, "idle">, IconComponent> = {
    saving: CloudArrowUpIcon,
    saved: CheckCircleIcon,
    error: WarningCircleIcon,
}
const AUTOSAVE_TONE: Record<Exclude<TaskSubmissionAutosaveStatus, "idle">, InlineIconLabelTone> = {
    saving: "default",
    saved: "success",
    error: "danger",
}
const AUTOSAVE_LABEL: Record<Exclude<TaskSubmissionAutosaveStatus, "idle">, string> = {
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save, try again",
}

/** Default token hint — overridable per {@link GithubGradingSettingsFormProps.tokenHint}. */
const DEFAULT_TOKEN_HINT = "Only needed when the repo is private — the token is not shown again after saving."

/** Props for the local {@link GithubUrlField} leaf. */
interface GithubUrlFieldProps {
    githubUrl: string
    onGithubUrlChange: (value: string) => void
    urlError?: string
    autosaveStatus: TaskSubmissionAutosaveStatus
    isSkeleton: boolean
}

/**
 * The repo-URL field + its autosave line. One `StackV`: the field is a MARK
 * attached to its status line below (`gap={2}`), never two peers.
 */
const GithubUrlField = ({
    githubUrl,
    onGithubUrlChange,
    urlError,
    autosaveStatus,
    isSkeleton,
}: GithubUrlFieldProps) => {
    const AutosaveIcon = autosaveStatus === "idle" ? null : AUTOSAVE_ICON[autosaveStatus]
    return (
        <StackV
            gap={2}

            items={[
                () => (
                    <InputText
                        label="Repo GitHub"
                        value={githubUrl}
                        onValueChange={onGithubUrlChange}
                        errorMessage={urlError}
                        placeholder="https://github.com/ten-nhom/du-an"
                        ariaLabel="URL repo GitHub"
                        isSkeleton={isSkeleton}

                    />
                ),
                ...(!isSkeleton && AutosaveIcon != null ? [() => (
                    <InlineIconLabel
                        icon={AutosaveIcon}
                        tone={AUTOSAVE_TONE[autosaveStatus as Exclude<TaskSubmissionAutosaveStatus, "idle">]}
                        size="xs"
                        label={AUTOSAVE_LABEL[autosaveStatus as Exclude<TaskSubmissionAutosaveStatus, "idle">]}
                    />
                )] : []),
            ]}
        />
    )
}

/** Props for the local {@link SettingsSummaryRow} leaf. */
interface SettingsSummaryRowProps {
    settingsSummary: TaskSubmissionSettingsSummary
    onOpenSettings: () => void
    isSkeleton: boolean
}

/** Compact "what am I grading against" line + the gear that opens the settings drawer. */
const SettingsSummaryRow = ({ settingsSummary, onOpenSettings, isSkeleton }: SettingsSummaryRowProps) => (
    <StackH
        gap={3}
        align="center"
        justify="between"

        items={[
            () => (
                <StackH
                    gap={3}
                    align="center"
                    wrap

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

/** Props for the local {@link EvaluateActionRow} leaf. */
interface EvaluateActionRowProps {
    onEvaluate: () => void
    isEvaluating: boolean
    aiStatusText?: string
    isSkeleton: boolean
}

/** The evaluate CTA + an optional AI status line beside it. */
const EvaluateActionRow = ({ onEvaluate, isEvaluating, aiStatusText, isSkeleton }: EvaluateActionRowProps) => (
    <StackH
        gap={3}
        align="center"
        justify="between"
        wrap

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

/** Props for the local {@link TaskResultSummary} leaf. */
interface TaskResultSummaryProps {
    result?: TaskSubmissionResult
    isSkeleton: boolean
}

/**
 * TRIMMED sibling of `SubmissionScoreCard` — see file header for exactly what
 * was dropped and why. `result` omitted → a single muted "no evaluation yet"
 * line instead (§2: a real, named state, not a loading stub).
 */
const TaskResultSummary = ({ result, isSkeleton }: TaskResultSummaryProps) => {
    if (result == null) {
        return (
            <Typography
                size="sm"
                color="muted"
                isSkeleton={isSkeleton}
                text="No grading runs yet."

            />
        )
    }
    const scoreRow = (
        <>
            <Typography
                size="h3"
                weight="bold"
                tabularNums
                isSkeleton={isSkeleton}
                text={String(result.score)}

            />
            <Typography
                size="sm"
                color="muted"
                tabularNums
                isSkeleton={isSkeleton}
                text={`/ ${result.maxScore}`}

            />
            {result.aiBadge != null ? (
                <Chip
                    tone="accent"
                    icon={SparkleIcon}
                    text={result.aiBadge}
                    isSkeleton={isSkeleton}

                />
            ) : null}
        </>
    )

    return (
        <StackV
            gap={2}

            items={[
                () => <StackH gap={4} align="baseline" wrap items={[() => scoreRow]} />,
                ...(result.shortFeedback != null ? [() => (
                    <Typography
                        size="sm"
                        isSkeleton={isSkeleton}
                        text={result.shortFeedback}

                    />
                )] : []),
            ]}
        />
    )
}

/** Props for the local {@link GithubGradingSettingsBody} leaf. */
interface GithubGradingSettingsBodyProps {
    form: GithubGradingSettingsFormProps
}

/** The `GithubGradingSettings` form body: language / branch / token, mounted inside {@link DrawerShell}. */
const GithubGradingSettingsBody = ({ form }: GithubGradingSettingsBodyProps) => (
    <StackV
        gap={4}

        items={[
            () => (
                <SelectSingle
                    label="Grading language"
                    options={form.languageOptions}
                    value={form.language}
                    onValueChange={form.onLanguageChange}

                />
            ),
            () => (
                <InputText
                    label="Branch"
                    value={form.branch}
                    onValueChange={form.onBranchChange}
                    placeholder="main"

                />
            ),
            () => (
                <InputPassword
                    label="GitHub token"
                    value={form.token}
                    onValueChange={form.onTokenChange}
                    hint={form.tokenHint ?? DEFAULT_TOKEN_HINT}
                    placeholder="ghp_…"

                />
            ),
        ]}
    />
)

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
            footer={
                <Button
                    label="Save"
                    variant="primary"
                    onPress={settingsFormProps.onSave}
                    isPending={settingsFormProps.isSaving}

                />
            }

            body={<GithubGradingSettingsBody form={settingsFormProps} />}
        />
    </div>
)

export { TaskSubmissionPanel }
