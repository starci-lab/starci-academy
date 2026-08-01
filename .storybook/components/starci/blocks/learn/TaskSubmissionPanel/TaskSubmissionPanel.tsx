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
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `TaskSubmissionPanel`: the PROJECT-level (not per-task) sticky console
 * for a GitHub-graded personal project — where the learner points StarCi at
 * their repo, kicks off a re-evaluation, and sees the last verdict, all without
 * leaving the task list underneath it.
 *
 * ⭐ REUSE-FIRST CHECK (this run's mandated read): `ChallengeDeliverableList`
 * already owns a "Submit work" card with a URL field + submit + graded result, but it
 * is PER-REQUIREMENT (one accordion row per deliverable, keyed off `items`) and
 * its settings affordance is a SCOPE-CUT chrome trigger only (`onOpenGradingSettings`
 * fires, content is a declared gap). This block is the opposite shape on both
 * axes: ONE repo URL for the whole project (no accordion, no `items`), and the
 * settings drawer's CONTENT is in scope this pass (`settingsFormProps` hands over
 * real language/branch/token bindings) — so it is a sibling worth its own file,
 * not a bad copy of the same card. `SurfaceCard` (labeled), `Button`, `InputText`/
 * `InputPassword`, `SelectSingle`, and `DrawerShell` are all REUSED as-is; nothing
 * here reaches past them to a bare HeroUI primitive.
 *
 * ⭐ `TaskResultSummary` (below, NOT exported) is a TRIMMED sibling of
 * `SubmissionScoreCard`, kept local because it is one call site. It borrows that
 * block's "hero number + muted `/ maxScore`" idiom but drops everything a
 * project-level summary doesn't need: no `isPassing` tinting (a project isn't a
 * pass/fail gate the way a challenge requirement is), no pass-bar subtraction
 * line, no submission link (the repo URL above IS the submission), no full
 * model-tier byline — just the score, one line of feedback, and a single model
 * badge chip (`aiBadge`) so the learner knows which lane graded them.
 *
 * ⭐ AUTOSAVE + AI STATUS SHARE ONE VOCABULARY SHAPE, mirroring
 * `PlaygroundConnectSheet`'s `STATUS_*` tables and `ChallengeDeliverableList`'s
 * `STATUS_ICON`: each enum value maps to its OWN icon + tone + wording, composed
 * through the existing `InlineIconLabel` composite rather than a new "StatusText"
 * file — the brief's "Spinner/StatusText(new small)" is satisfied by REUSING
 * `InlineIconLabel` (already the icon+text-as-one-unit composite this design
 * system owns) instead of adding a sixth leaf that draws the same shape again.
 * The busy state a caller actually needs a live spinner for — the evaluate
 * action itself — already gets one for free: `Button`'s own `isPending` renders
 * a real `Spinner` atom in place of its icon (see `ButtonBase.tsx`), so no
 * second spinner is hand-rolled here.
 *
 * ⭐ STICKY IS BAKED IN, NOT A PROP. `Navbar` sets the precedent for a block
 * owning its own `sticky` position class rather than exposing it as a prop the
 * caller must remember to add — this panel's whole reason to exist ("stays
 * visible while the task list scrolls underneath it") is not optional per
 * call-site, so `sticky top-4 z-10` lives on the root here.
 *
 * ⭐ `latestResult` OMITTED IS A REAL, NAMED STATE (§2), not a loading placeholder:
 * a project with no evaluation yet (first visit) has nothing to summarize, so
 * `TaskResultSummary`'s subtree drops entirely and a single muted line takes its
 * place — the same "whole node lost" treatment `ContentHeader` gives a lesson
 * with no `outcomes`.
 *
 * ⭐ `autosaveStatus` GATES ON `"idle"`, mirroring `gradedByModel` in
 * `SubmissionScoreCard`: with nothing worth reporting yet (the URL hasn't
 * changed since the last save, or saving hasn't started) the whole status row
 * drops rather than sitting there blank.
 *
 * ⛔ THIS BLOCK NEVER DECIDES WHAT A LOCKED/DISABLED EVALUATE MEANS (§7). It
 * always renders the button pressable and forwards `onPress` to `onEvaluate` —
 * whether an empty/invalid URL should actually block the press is the caller's
 * call, made through `urlError`/`isEvaluating`, not a business rule baked in here.
 * ─────────────────────────────────────────────────────────────────────────────
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

            body={
                <>
                    <InputText
                        label="Repo GitHub"
                        value={githubUrl}
                        onValueChange={onGithubUrlChange}
                        errorMessage={urlError}
                        placeholder="https://github.com/ten-nhom/du-an"
                        ariaLabel="URL repo GitHub"
                        isSkeleton={isSkeleton}

                    />
                    {!isSkeleton && AutosaveIcon != null ? (
                        <InlineIconLabel
                            icon={AutosaveIcon}
                            tone={AUTOSAVE_TONE[autosaveStatus as Exclude<TaskSubmissionAutosaveStatus, "idle">]}
                            size="xs"

                        >
                            {AUTOSAVE_LABEL[autosaveStatus as Exclude<TaskSubmissionAutosaveStatus, "idle">]}
                        </InlineIconLabel>
                    ) : null}
                </>
            }
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

        body={
            <>
                <StackH
                    gap={3}
                    align="center"
                    wrap

                    body={
                        <>
                            <InlineIconLabel
                                icon={CodeIcon}
                                tone="default"
                                size="xs"
                                isSkeleton={isSkeleton}

                            >
                                {settingsSummary.langLabel}
                            </InlineIconLabel>
                            <InlineIconLabel
                                icon={GitBranchIcon}
                                tone="default"
                                size="xs"
                                isSkeleton={isSkeleton}

                            >
                                {settingsSummary.branch}
                            </InlineIconLabel>
                        </>
                    }
                />
                <Button
                    isIconOnly
                    prefixIcon={GearSixIcon}
                    ariaLabel="Grading settings"
                    variant="tertiary"
                    size="sm"
                    onPress={onOpenSettings}
                    isSkeleton={isSkeleton}

                />
            </>
        }
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

        body={
            <>
                {aiStatusText != null ? (
                    <InlineIconLabel
                        icon={SparkleIcon}
                        tone="default"
                        size="xs"
                        isSkeleton={isSkeleton}

                    >
                        {aiStatusText}
                    </InlineIconLabel>
                ) : (
                    // Keeps the row's justify-between shape even with no status text to show.
                    <span />
                )}
                <Button
                    label="Grade"
                    variant="primary"
                    prefixIcon={PlayIcon}
                    onPress={onEvaluate}
                    isPending={isEvaluating}
                    isSkeleton={isSkeleton}

                />
            </>
        }
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

            body={
                <>
                    <StackH gap={4} align="baseline" wrap body={scoreRow} />
                    {result.shortFeedback != null ? (
                        <Typography
                            size="sm"
                            isSkeleton={isSkeleton}
                            text={result.shortFeedback}

                        />
                    ) : null}
                </>
            }
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

        body={
            <>
                <SelectSingle
                    label="Grading language"
                    options={form.languageOptions}
                    value={form.language}
                    onValueChange={form.onLanguageChange}

                />
                <InputText
                    label="Branch"
                    value={form.branch}
                    onValueChange={form.onBranchChange}
                    placeholder="main"

                />
                <InputPassword
                    label="GitHub token"
                    value={form.token}
                    onValueChange={form.onTokenChange}
                    hint={form.tokenHint ?? DEFAULT_TOKEN_HINT}
                    placeholder="ghp_…"

                />
            </>
        }
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

                    body={
                        <>
                            <GithubUrlField
                                githubUrl={githubUrl}
                                onGithubUrlChange={onGithubUrlChange}
                                urlError={urlError}
                                autosaveStatus={autosaveStatus}
                                isSkeleton={isSkeleton}

                            />
                            <SettingsSummaryRow
                                settingsSummary={settingsSummary}
                                onOpenSettings={() => onSettingsOpenChange(true)}
                                isSkeleton={isSkeleton}

                            />
                            <EvaluateActionRow
                                onEvaluate={onEvaluate}
                                isEvaluating={isEvaluating}
                                aiStatusText={aiStatusText}
                                isSkeleton={isSkeleton}

                            />
                            <TaskResultSummary result={latestResult} isSkeleton={isSkeleton} />
                        </>
                    }
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

        >
            <GithubGradingSettingsBody form={settingsFormProps} />
        </DrawerShell>
    </div>
)

export { TaskSubmissionPanel }
