import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    TaskSubmissionPanel,
    type GithubGradingSettingsFormProps,
} from "@sb-components/starci/blocks/learn/TaskSubmissionPanel/TaskSubmissionPanel"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `TaskSubmissionPanel`: the PROJECT-level (not per-task) sticky console
 * for a GitHub-graded personal project — repo URL, evaluate action + AI status,
 * latest result summary, and a settings drawer for language/branch/token.
 *
 * SIBLING OF `ChallengeDeliverableList`, NOT A COPY — see the component file's
 * header for the reuse ledger (ONE repo URL for the whole project vs. one row
 * per requirement; the settings drawer's CONTENT is in scope here, where the
 * sibling scope-cuts it to a bare trigger).
 *
 * 📐 LEAF by STRUCTURE (§14d.2): autosave wording, the AI status line, and the
 * evaluate button's busy state never change which NODES the panel composes —
 * they are DATA, so `Default` carries all of them as states. Losing the whole
 * `TaskResultSummary` score subtree (`latestResult` omitted) and mounting the
 * settings drawer's form (closed → open) each change the tree shape, so those
 * get their own leaf.
 */
const meta: Meta<typeof TaskSubmissionPanel> = {
    title: "StarCi/Blocks/Learn/TaskSubmissionPanel/TaskSubmissionPanel",
    component: TaskSubmissionPanel,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof TaskSubmissionPanel>

const SETTINGS_SUMMARY = { langLabel: "TypeScript", branch: "main" }

const SETTINGS_FORM: GithubGradingSettingsFormProps = {
    languageOptions: [
        { value: "typescript", label: "TypeScript" },
        { value: "python", label: "Python" },
        { value: "go", label: "Go" },
    ],
    language: "typescript",
    onLanguageChange: () => {},
    branch: "main",
    onBranchChange: () => {},
    token: "",
    onTokenChange: () => {},
    onSave: () => {},
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the labeled card face holding every row: the repo field, the settings summary, the evaluate row and the result summary", storyId: "composites-cards-surfacecard-surfacecard--with-label" },
    "StackV": { tier: "frame", role: "the vertical frame stacking the panel's rows, owning the seam between them", storyId: "frames-stack-stackv--default" },
    "StackH": { tier: "frame", role: "a horizontal frame putting two peers on one baseline (a summary line and its gear, or the AI status and the evaluate button)", storyId: "frames-stack-stackh--default" },
    "InputText": { tier: "atom", role: "the bare repo-URL field this block owns the label/error text for", storyId: "atoms-forms-input-inputtext--default" },
    "InlineIconLabel": { tier: "composite", role: "an icon+text status unit — the autosave line, the language/branch summary, or the AI status line", storyId: "composites-texts-inlineiconlabel--overview" },
    "Button": { tier: "atom", role: "the settings gear or the Evaluate action, real or its own skeleton mirror", storyId: "atoms-buttons-button-button--default" },
    "Typography": { tier: "atom", role: "the panel's own text — the result's hero score, its `/ maxScore`, its feedback line, or the no-evaluation-yet hint", storyId: "atoms-text-typography-typography--plain" },
    "Chip": { tier: "atom", role: "the AI model badge next to the last score, present only when the grade carried one", storyId: "atoms-chips-chip-chip--icon" },
    "SelectSingle": { tier: "atom", role: "the settings drawer's language dropdown", storyId: "atoms-forms-select-selectsingle--default" },
    "InputPassword": { tier: "atom", role: "the settings drawer's masked token field", storyId: "atoms-forms-input-inputpassword--default" },
    "DrawerShell": { tier: "composite", role: "the sliding panel scaffold the settings form mounts inside", storyId: "composites-layout-drawershell-drawershell--default" },
}

/** LEAF — the steady state: repo field, settings summary, evaluate row, latest result — settings drawer closed. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TaskSubmissionPanel"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "autosaveStatus = \"saved\", latestResult set, aiStatusText set",
                        why: "The everyday steady state: the URL field reports its last autosave, the AI status line names what happened most recently, and the result summary shows the last real score with its model badge. Every row is present at once, which is the shape a returning learner sees most often.",
                        code: `<TaskSubmissionPanel
    githubUrl="https://github.com/hocvien/de-tai-tot-nghiep"
    onGithubUrlChange={setUrl}
    autosaveStatus="saved"
    settingsSummary={{ langLabel: "TypeScript", branch: "main" }}
    isSettingsOpen={false}
    onSettingsOpenChange={setSettingsOpen}
    onEvaluate={evaluate}
    aiStatusText="Graded the latest commit"
    latestResult={{ score: 82, maxScore: 100, shortFeedback: "Missing network error handling at the service layer.", aiBadge: "Sonnet" }}
    settingsFormProps={settingsForm}
/>`,
                        render: (
                            <TaskSubmissionPanel

                               
                                githubUrl="https://github.com/hocvien/de-tai-tot-nghiep"
                                onGithubUrlChange={() => {}}
                                autosaveStatus="saved"
                                settingsSummary={SETTINGS_SUMMARY}
                                isSettingsOpen={false}
                                onSettingsOpenChange={() => {}}
                                onEvaluate={() => {}}
                                aiStatusText="Graded the latest commit"
                                latestResult={{
                                    score: 82,
                                    maxScore: 100,
                                    shortFeedback: "Missing network error handling at the service layer.",
                                    aiBadge: "Sonnet",
                                }}
                                settingsFormProps={SETTINGS_FORM}
                            />
                        ),
                    },
                    {
                        name: "autosaveStatus = \"saving\"",
                        why: "The learner just edited the URL — the same InlineIconLabel row swaps to its `saving` wording and a muted cloud icon instead of the success check, without adding or removing a node.",
                        code: "<TaskSubmissionPanel autosaveStatus=\"saving\" … />",
                        render: (
                            <TaskSubmissionPanel
                                githubUrl="https://github.com/hocvien/de-tai-tot-nghiep"
                                onGithubUrlChange={() => {}}
                                autosaveStatus="saving"
                                settingsSummary={SETTINGS_SUMMARY}
                                isSettingsOpen={false}
                                onSettingsOpenChange={() => {}}
                                onEvaluate={() => {}}
                                settingsFormProps={SETTINGS_FORM}
                            />
                        ),
                    },
                    {
                        name: "autosaveStatus = \"error\", urlError set",
                        why: "A bad URL fails validation AND the autosave that just tried to persist it — the field itself shows its own invalid border via `urlError`, and the status row below turns danger-toned instead of dropping, so the learner sees both signals at once.",
                        code: `<TaskSubmissionPanel
    githubUrl="not-a-url"
    urlError="URL must start with https://"
    autosaveStatus="error"
    …
/>`,
                        render: (
                            <TaskSubmissionPanel
                                githubUrl="not-a-url"
                                onGithubUrlChange={() => {}}
                                urlError="URL must start with https://"
                                autosaveStatus="error"
                                settingsSummary={SETTINGS_SUMMARY}
                                isSettingsOpen={false}
                                onSettingsOpenChange={() => {}}
                                onEvaluate={() => {}}
                                settingsFormProps={SETTINGS_FORM}
                            />
                        ),
                    },
                    {
                        name: "isEvaluating = true",
                        why: "The evaluate press is in flight — `Button`'s own `isPending` swaps its leading icon for a real `Spinner` and locks the press, the same busy contract every other button in this system uses, so no second spinner is hand-rolled here.",
                        code: "<TaskSubmissionPanel isEvaluating aiStatusText=\"Analyzing the latest commit\" … />",
                        render: (
                            <TaskSubmissionPanel
                                githubUrl="https://github.com/hocvien/de-tai-tot-nghiep"
                                onGithubUrlChange={() => {}}
                                autosaveStatus="idle"
                                settingsSummary={SETTINGS_SUMMARY}
                                isSettingsOpen={false}
                                onSettingsOpenChange={() => {}}
                                onEvaluate={() => {}}
                                isEvaluating
                                aiStatusText="Analyzing the latest commit"
                                settingsFormProps={SETTINGS_FORM}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `latestResult` omitted ⇒ **loses** the whole score/badge subtree, replaced by one muted line. */
export const NoResult: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TaskSubmissionPanel"
                tier="block"
                leaf="No result yet"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "latestResult = undefined",
                        why: "A first-time project has nothing to summarize, so the hero score, its badge chip and the feedback line never mount — a single muted sentence takes their place instead of an empty card claiming a result exists.",
                        code: `<TaskSubmissionPanel
    githubUrl=""
    autosaveStatus="idle"
    latestResult={undefined}
    …
/>`,
                        render: (
                            <TaskSubmissionPanel

                               
                                githubUrl=""
                                onGithubUrlChange={() => {}}
                                autosaveStatus="idle"
                                settingsSummary={SETTINGS_SUMMARY}
                                isSettingsOpen={false}
                                onSettingsOpenChange={() => {}}
                                onEvaluate={() => {}}
                                settingsFormProps={SETTINGS_FORM}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Controlled wrapper — the settings drawer opens on mount so the anatomy panel can show its mounted tree. */
const SettingsOpenDemo = () => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <TaskSubmissionPanel

           
            githubUrl="https://github.com/hocvien/de-tai-tot-nghiep"
            onGithubUrlChange={() => {}}
            autosaveStatus="saved"
            settingsSummary={SETTINGS_SUMMARY}
            isSettingsOpen={isOpen}
            onSettingsOpenChange={setIsOpen}
            onEvaluate={() => {}}
            latestResult={{ score: 82, maxScore: 100, aiBadge: "Sonnet" }}
            settingsFormProps={SETTINGS_FORM}
        />
    )
}

/** LEAF — the settings drawer open ⇒ mounts the `GithubGradingSettings` form (language/branch/token) that does not exist in the DOM while closed. */
export const SettingsOpen: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TaskSubmissionPanel"
                tier="block"
                leaf="Settings drawer open"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "isSettingsOpen = true",
                        why: "The gear press mounts `DrawerShell` with the language dropdown, the branch field and the masked token field inside — none of this exists in the tree while the drawer is closed, which is why it is a leaf of its own rather than a state of `Default`.",
                        code: "<TaskSubmissionPanel isSettingsOpen onSettingsOpenChange={setOpen} settingsFormProps={settingsForm} … />",
                        render: <SettingsOpenDemo />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so every atom the panel composes swaps to its own mirror. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="TaskSubmissionPanel"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-sm"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the panel composes — the URL field, the summary line, the gear and evaluate buttons, the result's hero number — swaps to its own shimmer at the exact box it will hand back, so nothing jumps once the project's real data lands.",
                        code: "<TaskSubmissionPanel isSkeleton githubUrl=\"\" autosaveStatus=\"idle\" … />",
                        render: (
                            <TaskSubmissionPanel

                               
                                githubUrl=""
                                onGithubUrlChange={() => {}}
                                autosaveStatus="idle"
                                settingsSummary={SETTINGS_SUMMARY}
                                isSettingsOpen={false}
                                onSettingsOpenChange={() => {}}
                                onEvaluate={() => {}}
                                settingsFormProps={SETTINGS_FORM}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
