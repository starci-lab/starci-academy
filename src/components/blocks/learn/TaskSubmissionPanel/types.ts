import { type SelectOption } from "@/components/atoms/forms/Select"

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

/**
 * Already-resolved display strings this block cannot invent itself — it is a
 * `starci/blocks/**` presentational block, so it never calls `useTranslations`;
 * the connected caller resolves these with `t()` and passes them down.
 */
export interface TaskSubmissionPanelLabels {
    /** Label above the grading-language select in the settings drawer. */
    languageLabel: string
    /** Label above the branch field in the settings drawer. */
    branchLabel: string
    /** Placeholder for the branch field, e.g. "main". */
    branchPlaceholder: string
    /** Label above the GitHub token field in the settings drawer. */
    tokenLabel: string
    /** Default hint below the token field, used when `settingsFormProps.tokenHint` is not set. */
    tokenHintDefault: string
    /** Accessible name for the token field's reveal toggle when it would SHOW the token. */
    tokenRevealLabel: string
    /** Accessible name for the token field's reveal toggle when it would HIDE the token. */
    tokenHideLabel: string
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
    /** Already-resolved display strings for the settings drawer's form — see {@link TaskSubmissionPanelLabels}. */
    labels: TaskSubmissionPanelLabels
    /** `true` → every part this block renders itself mirrors as shimmer. */
    isSkeleton?: boolean
}

/** Default token hint — overridable per {@link GithubGradingSettingsFormProps.tokenHint}. */
export const DEFAULT_TOKEN_HINT = "Only needed when the repo is private — the token is not shown again after saving."
