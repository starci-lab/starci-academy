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
 * already owns a "Nộp bài" card with a URL field + submit + graded result, but it
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
    /** Fired when the learner presses "Chấm điểm". */
    onEvaluate: () => void
    /** `true` → the evaluate button shows busy and locks (react-aria doesn't draw this itself). */
    isEvaluating?: boolean
    /** A short line naming what the AI is doing / last did, e.g. "Đang phân tích commit mới nhất". Omit → no status line. */
    aiStatusText?: string
    /** The most recent evaluation. Omit → no evaluation has run yet for this project. */
    latestResult?: TaskSubmissionResult
    /** Bindings for the settings drawer's form fields. */
    settingsFormProps: GithubGradingSettingsFormProps
    /** `true` → every part this block renders itself mirrors as shimmer. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    saving: "Đang lưu…",
    saved: "Đã lưu",
    error: "Chưa lưu được, thử lại",
}

/** Default token hint — overridable per {@link GithubGradingSettingsFormProps.tokenHint}. */
const DEFAULT_TOKEN_HINT = "Chỉ cần khi repo ở chế độ riêng tư — token không hiển thị lại sau khi lưu."

/** Props for the local {@link GithubUrlField} leaf. */
interface GithubUrlFieldProps {
    githubUrl: string
    onGithubUrlChange: (value: string) => void
    urlError?: string
    autosaveStatus: TaskSubmissionAutosaveStatus
    isSkeleton: boolean
    showAnatomy: boolean
}

/**
 * The repo-URL field + its autosave line. One `StackV`: the field is a MARK
 * attached to its status line below (`gap="tight"`), never two peers.
 */
const GithubUrlField = ({
    githubUrl,
    onGithubUrlChange,
    urlError,
    autosaveStatus,
    isSkeleton,
    showAnatomy,
}: GithubUrlFieldProps) => {
    const AutosaveIcon = autosaveStatus === "idle" ? null : AUTOSAVE_ICON[autosaveStatus]
    return (
        <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
            <InputText
                label="Repo GitHub"
                value={githubUrl}
                onValueChange={onGithubUrlChange}
                errorMessage={urlError}
                placeholder="https://github.com/ten-nhom/du-an"
                ariaLabel="URL repo GitHub"
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            {!isSkeleton && AutosaveIcon != null ? (
                <InlineIconLabel
                    icon={<AutosaveIcon aria-hidden focusable="false" />}
                    tone={AUTOSAVE_TONE[autosaveStatus as Exclude<TaskSubmissionAutosaveStatus, "idle">]}
                    size="xs"
                    anatPart={showAnatomy ? "InlineIconLabel" : undefined}
                >
                    {AUTOSAVE_LABEL[autosaveStatus as Exclude<TaskSubmissionAutosaveStatus, "idle">]}
                </InlineIconLabel>
            ) : null}
        </StackV>
    )
}

/** Props for the local {@link SettingsSummaryRow} leaf. */
interface SettingsSummaryRowProps {
    settingsSummary: TaskSubmissionSettingsSummary
    onOpenSettings: () => void
    isSkeleton: boolean
    showAnatomy: boolean
}

/** Compact "what am I grading against" line + the gear that opens the settings drawer. */
const SettingsSummaryRow = ({ settingsSummary, onOpenSettings, isSkeleton, showAnatomy }: SettingsSummaryRowProps) => (
    <StackH gap="related" align="center" justify="between" anatPart={showAnatomy ? "StackH" : undefined}>
        <StackH gap="related" align="center" wrap anatPart={showAnatomy ? "StackH" : undefined}>
            <InlineIconLabel
                icon={<CodeIcon aria-hidden focusable="false" />}
                tone="default"
                size="xs"
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "InlineIconLabel" : undefined}
            >
                {settingsSummary.langLabel}
            </InlineIconLabel>
            <InlineIconLabel
                icon={<GitBranchIcon aria-hidden focusable="false" />}
                tone="default"
                size="xs"
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "InlineIconLabel" : undefined}
            >
                {settingsSummary.branch}
            </InlineIconLabel>
        </StackH>
        <Button
            isIconOnly
            prefixIcon={GearSixIcon}
            ariaLabel="Cài đặt chấm điểm"
            variant="tertiary"
            size="sm"
            onPress={onOpenSettings}
            isSkeleton={isSkeleton}
            anatPart={showAnatomy ? "Button" : undefined}
        />
    </StackH>
)

/** Props for the local {@link EvaluateActionRow} leaf. */
interface EvaluateActionRowProps {
    onEvaluate: () => void
    isEvaluating: boolean
    aiStatusText?: string
    isSkeleton: boolean
    showAnatomy: boolean
}

/** The evaluate CTA + an optional AI status line beside it. */
const EvaluateActionRow = ({ onEvaluate, isEvaluating, aiStatusText, isSkeleton, showAnatomy }: EvaluateActionRowProps) => (
    <StackH gap="related" align="center" justify="between" wrap anatPart={showAnatomy ? "StackH" : undefined}>
        {aiStatusText != null ? (
            <InlineIconLabel
                icon={<SparkleIcon aria-hidden focusable="false" />}
                tone="default"
                size="xs"
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "InlineIconLabel" : undefined}
            >
                {aiStatusText}
            </InlineIconLabel>
        ) : (
            // Keeps the row's justify-between shape even with no status text to show.
            <span />
        )}
        <Button
            label="Chấm điểm"
            variant="primary"
            prefixIcon={PlayIcon}
            onPress={onEvaluate}
            isPending={isEvaluating}
            isSkeleton={isSkeleton}
            anatPart={showAnatomy ? "Button" : undefined}
        />
    </StackH>
)

/** Props for the local {@link TaskResultSummary} leaf. */
interface TaskResultSummaryProps {
    result?: TaskSubmissionResult
    isSkeleton: boolean
    showAnatomy: boolean
}

/**
 * TRIMMED sibling of `SubmissionScoreCard` — see file header for exactly what
 * was dropped and why. `result` omitted → a single muted "no evaluation yet"
 * line instead (§2: a real, named state, not a loading stub).
 */
const TaskResultSummary = ({ result, isSkeleton, showAnatomy }: TaskResultSummaryProps) => {
    if (result == null) {
        return (
            <Typography
                size="sm"
                color="muted"
                isSkeleton={isSkeleton}
                text="Chưa có lần chấm điểm nào."
                anatPart={showAnatomy ? "Typography" : undefined}
            />
        )
    }
    return (
        <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
            <StackH gap="grouped" align="baseline" wrap anatPart={showAnatomy ? "StackH" : undefined}>
                <Typography
                    size="h3"
                    weight="bold"
                    tabularNums
                    isSkeleton={isSkeleton}
                    text={String(result.score)}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
                <Typography
                    size="sm"
                    color="muted"
                    tabularNums
                    isSkeleton={isSkeleton}
                    text={`/ ${result.maxScore}`}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
                {result.aiBadge != null ? (
                    <Chip
                        tone="accent"
                        icon={SparkleIcon}
                        text={result.aiBadge}
                        isSkeleton={isSkeleton}
                        anatPart={showAnatomy ? "Chip" : undefined}
                    />
                ) : null}
            </StackH>
            {result.shortFeedback != null ? (
                <Typography
                    size="sm"
                    isSkeleton={isSkeleton}
                    text={result.shortFeedback}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ) : null}
        </StackV>
    )
}

/** Props for the local {@link GithubGradingSettingsBody} leaf. */
interface GithubGradingSettingsBodyProps {
    form: GithubGradingSettingsFormProps
    showAnatomy: boolean
}

/** The `GithubGradingSettings` form body: language / branch / token, mounted inside {@link DrawerShell}. */
const GithubGradingSettingsBody = ({ form, showAnatomy }: GithubGradingSettingsBodyProps) => (
    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
        <SelectSingle
            label="Ngôn ngữ chấm điểm"
            options={form.languageOptions}
            value={form.language}
            onValueChange={form.onLanguageChange}
            showAnatomy={showAnatomy}
        />
        <InputText
            label="Nhánh (branch)"
            value={form.branch}
            onValueChange={form.onBranchChange}
            placeholder="main"
            showAnatomy={showAnatomy}
        />
        <InputPassword
            label="GitHub token"
            value={form.token}
            onValueChange={form.onTokenChange}
            hint={form.tokenHint ?? DEFAULT_TOKEN_HINT}
            placeholder="ghp_…"
            showAnatomy={showAnatomy}
        />
    </StackV>
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
    showAnatomy = false,
    anatPart,
}: TaskSubmissionPanelProps) => (
    <div data-anat-part={anatPart} className="sticky top-4 z-10">
        <SurfaceCard
            label="Nộp bài dự án"
            isSkeleton={isSkeleton}
            anatPart={showAnatomy ? "SurfaceCard" : undefined}
        >
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                <GithubUrlField
                    githubUrl={githubUrl}
                    onGithubUrlChange={onGithubUrlChange}
                    urlError={urlError}
                    autosaveStatus={autosaveStatus}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
                <SettingsSummaryRow
                    settingsSummary={settingsSummary}
                    onOpenSettings={() => onSettingsOpenChange(true)}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
                <EvaluateActionRow
                    onEvaluate={onEvaluate}
                    isEvaluating={isEvaluating}
                    aiStatusText={aiStatusText}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
                <TaskResultSummary result={latestResult} isSkeleton={isSkeleton} showAnatomy={showAnatomy} />
            </StackV>
        </SurfaceCard>

        <DrawerShell
            isOpen={isSettingsOpen}
            onOpenChange={onSettingsOpenChange}
            title="Cài đặt chấm điểm"
            description="Ngôn ngữ, nhánh và token dùng để StarCi đọc và chấm repo của bạn."
            footer={
                <Button
                    label="Lưu"
                    variant="primary"
                    onPress={settingsFormProps.onSave}
                    isPending={settingsFormProps.isSaving}
                    anatPart={showAnatomy ? "Button" : undefined}
                />
            }
            showAnatomy={showAnatomy}
        >
            <GithubGradingSettingsBody form={settingsFormProps} showAnatomy={showAnatomy} />
        </DrawerShell>
    </div>
)

export { TaskSubmissionPanel }
