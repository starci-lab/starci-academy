import React from "react"
import { CaretRightIcon, GearSixIcon, SparkleIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Breadcrumbs, type BreadcrumbItem } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import {
    SurfaceCard,
    SurfaceCardAccordion,
    type SurfaceCardAccordionItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { ListRow } from "@sb-components/composites/lists/List/List"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { Container } from "@sb-components/frames/Container/Container"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { SplitWorkspace } from "@sb-components/frames/SplitWorkspace/SplitWorkspace"
import {
    ContentRelatedList,
    type ContentRelatedItem,
} from "@sb-components/starci/blocks/learn/ContentRelatedList/ContentRelatedList"
import {
    SubmissionScoreCard,
    type AiModelCategory,
} from "@sb-components/starci/blocks/learn/SubmissionScoreCard/SubmissionScoreCard"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SCREEN — `PersonalProjectTaskPage`: solve ONE personal-project task.
 *
 * A screen owns a LIST OF FUNCTIONS and nothing else: it calls blocks/composites,
 * places them in frames, and hands each one typed data. Ported from `src`'s
 * `PersonalProjectWorkspace` task branch (`.claude/fe/steps/11-overlays-layouts-
 * brainstorm.md` §6.3 — that file's `page.tsx` is an empty stub, the real split
 * lives in `PersonalProjectWorkspace`'s middle branch: `taskId` present, not the
 * `/result` route) — split into a READING column that swaps per task
 * (`Task`/`TaskBrief`/`TaskCriteriaList`/`TaskCodeImplementations`/
 * `RelatedContentList`) and a PERSISTENT, sticky ACT column
 * (`TaskSubmissionPanel`: `PersonalProjectSubmission` + settings summary +
 * `TaskActions` + `TaskResults`). The dashboard (`taskId` absent) and the graded
 * result page (`/result`) are `PersonalProjectWorkspace`'s OTHER two branches —
 * out of scope here; this screen is only the middle one.
 *
 * ⭐ NO SEPARATE `TaskBriefBody`/`TaskSubmissionPanel` FILES — the task brief lists
 * them as "(new)", but with the reading column and the submission column each
 * being exactly ONE region of this ONE screen (the two LEAVES declared for this
 * run: `ReadingColumn` / `SubmissionPanel(sticky)`), splitting them into their
 * own storied components would invent anatomy nodes with nowhere to point a
 * `storyId` (§11a.1 — a node without a real story is dropped from the tree, not
 * shown unclickable). They are private render helpers below, composed inline;
 * every REAL sub-part they use (`PageHeader`, `Callout`,
 * `SurfaceCard`/`SurfaceCardAccordion`, `ContentRelatedList`, `ListRow`,
 * `InputText`, `Button`, `SubmissionScoreCard`) already has its own story and
 * carries its own `anatPart`, so the DOM structure the anatomy panel reads is
 * unaffected either way.
 *
 * REUSE, NOT REBUILD:
 *   • `PageHeader` (composite) carries the trail + task title/description —
 *     same frame `ChallengeHeader`/`ContentHeader` build on, no meta row here
 *     (a task has no score/difficulty of its own to show next to its title).
 *   • `Callout` (`status="warning"`) is the locked-preview banner — the
 *     ONE thing `src`'s hand-rolled `TaskLockedAlert` draws that isn't already a
 *     composite. Kept to a fixed title/description (the block's own wording,
 *     §14d.1) since `isLocked` is the only signal handed down; the "go to
 *     current task" CTA `TaskLockedAlert` also draws needs a target task id this
 *     screen's prop list does not carry, so it is a deliberate, marked SCOPE CUT
 *     (§B3) rather than a guessed prop.
 *   • The brief itself is `SurfaceCard label="Guide"` around `MarkdownContent`
 *     — the exact shape `ContentArticle` already uses for a lesson body
 *     (`isSkeleton` passed straight to the card, the document itself is not
 *     mirrored — same precedent, not a new skeleton strategy).
 *   • Legacy criteria/code guides (schema-v1 tasks with no authored brief) reuse
 *     `SurfaceCardAccordion` twice, `variant="nested"`, inside ONE outer
 *     `SurfaceCard` — mirrors `src`'s own move (one `LabeledCard` wrapping both
 *     `TaskCriteriaList` + `TaskCodeImplementations`, neither titled on its own)
 *     translated onto this design system's accordion composite instead of a
 *     hand-rolled `LabeledAccordionCard` + raw `ImplementationCard`.
 *   • `relatedItems`/`relatedLabel` go straight into `ContentRelatedList` — same
 *     shape `src`'s `RelatedContentList` fills from a query built off the task's
 *     own title/description; building that query is screen-wiring, out of scope
 *     for a presentational prop list.
 *   • `SubmissionScoreCard` is the graded-result signal in the act column,
 *     reused rather than re-porting `src`'s `TaskResults` (`Score` + AI badge +
 *     short feedback) by hand — same shape, already a block with its own story.
 *
 * ⭐ THE SETTINGS SUMMARY ROW REUSES `ListRow`, not a hand-rolled button. `src`'s
 * `TaskSubmissionPanel` builds this trigger as a bare `<button>` with manual
 * flex/icon/chevron markup — exactly the "raw atom instead of the composite
 * this system already owns" mistake `ContentModeNav`'s file header warns about.
 * `ListRow` already is "leading icon + title + meta + trailing chevron,
 * pressable" — `leading=GearSixIcon`, `title="Grading settings"` (block-owned,
 * §14d.1), `meta="{lang} · {branch}"` (joined by THIS block from two data
 * fields, never a pre-joined string from the caller), `trailing=CaretRightIcon`.
 *
 * ⭐ SCOPE CUT (§B3, inherited from `ChallengeDeliverableList`'s own file header):
 * the grading-settings Drawer's CONTENT (language picker, branch, private-repo
 * token — `src`'s `GithubGradingSettings`) is NOT built. `onOpenSettings` is
 * wired as a chrome trigger only, same discipline as `ChallengePage`'s
 * `onOpenGradingSettings` — leaving the drawer's content as a gap is the honest
 * state, not a stub that renders nothing real.
 *
 * ⭐ EVALUATE CTA WORDING IS OWNED HERE (§14d.1): `hasAttempts` flips
 * "Evaluate" ↔ "Re-evaluate", mirroring `src`'s `TaskActions` — the caller
 * never hands over the label string itself.
 *
 * TWO COLUMNS, COMPOSED WITH `SplitWorkspace` (§ layout khung, 2026-07-29) —
 * same shape `ChallengePage` uses, and the reason the khung was built: real
 * `src`'s `PersonalProjectWorkspace/index.tsx:61` has the EXACT same split CSS
 * as `ChallengeView`'s, byte-for-byte, so both screens now share ONE khung
 * instead of each hand-rolling its own `StackH…wrap` stand-in — the fixed
 * horizontal axis that never actually stacked below desktop (the teacher caught it
 * live on `ChallengePage`, the same bug was here too, just not yet spotted).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One personal-project schema-v1 evaluation criterion — the legacy rubric row. */
export interface PersonalProjectTaskLegacyCriterionItem {
    /** Stable React key, also the accordion item id. */
    key: string
    /** The criterion sentence itself. */
    text: string
    /** Points this criterion is worth. */
    score: number
    /** Optional grading hint, markdown. Omit → the panel shows a plain "no hint" line. */
    hint?: string
}

/** One legacy per-language implementation guide (schema-v1 tasks with no authored brief). */
export interface PersonalProjectTaskLegacyCodeImplementationItem {
    /** Stable React key, also the accordion item id. */
    key: string
    /** Target language label, e.g. "TypeScript". */
    lang: string
    /** How to approach the task in this language, markdown. */
    guide: string
    /** A worked example, markdown. */
    example: string
}

/** The task identity this screen reads about. */
export interface PersonalProjectTaskPageTask {
    /** Task title. */
    title: string
    /** One-paragraph summary of what the task asks for. */
    description?: string
}

/** The schema-v2 authored brief for this task. */
export interface PersonalProjectTaskPageBrief {
    /** The brief itself, markdown, already resolved to the active language/locale. */
    body: string
}

/** Cost/quality tier + model byline data for a graded submission — see {@link SubmissionScoreCard}. */
export interface PersonalProjectSubmissionResult {
    /** Points earned on the latest graded attempt. */
    score: number
    /** Points the attempt was scored out of. */
    maxScore?: number
    /** Whether this score cleared the pass bar. */
    isPassing: boolean
    /** The pass bar itself, in points. */
    passScore?: number
    /** A short line of grader feedback. */
    shortFeedback?: string
    /** The model that produced this grade. */
    gradedByModel?: string
    /** Cost/quality tier of {@link gradedByModel}. */
    modelCategory?: AiModelCategory
    /** Relative time since grading, already localized. */
    timeAgo?: string
}

/** Everything the persistent, sticky act column needs — the project-level submission loop. */
export interface PersonalProjectTaskSubmissionPanelProps {
    /** The GitHub repo URL as typed so far. */
    repoUrl: string
    /** Fired as the learner types the repo URL. */
    onRepoUrlChange: (value: string) => void
    /** Validation message for the repo URL field. Set → the field shows invalid. */
    repoUrlError?: string
    /** Grading language summary shown in the settings row, e.g. "TypeScript". */
    settingsLangLabel: string
    /** Grading branch summary shown in the settings row, e.g. "main". */
    settingsBranch: string
    /** Fired when the settings summary row is pressed — chrome trigger only, see file header. */
    onOpenSettings: () => void
    /** Fired to submit the current repo for AI evaluation. */
    onEvaluate: () => void
    /** `true` → the evaluate CTA shows its own spinner and blocks further presses. */
    isEvaluatePending?: boolean
    /** `true` → the evaluate CTA is disabled (the caller's own combined business rule — locked, syncing, …). */
    isEvaluateDisabled?: boolean
    /** `true` → at least one attempt exists, so the secondary actions unlock and the CTA reads "Re-evaluate". */
    hasAttempts?: boolean
    /** Fired to open the full feedback/result page. */
    onOpenFeedbackDetails: () => void
    /** Fired to open the attempts history drawer. */
    onOpenAttempts: () => void
    /** The latest graded attempt. Present → the score card renders; omit → nothing has been graded yet. */
    result?: PersonalProjectSubmissionResult
}

/** Props for {@link PersonalProjectTaskPage}. */
export interface PersonalProjectTaskPageProps {
    /** Breadcrumb trail as DATA — `PageHeader` builds `Breadcrumbs` itself. */
    breadcrumbItems?: Array<BreadcrumbItem>
    /** The task being read/solved. */
    task: PersonalProjectTaskPageTask
    /**
     * `true` → this task is not yet unlocked for the learner (previewing ahead
     * of their current milestone position). Shows the warning banner; nothing
     * else in the reading column changes shape.
     */
    isLocked?: boolean
    /** The schema-v2 authored brief. */
    brief: PersonalProjectTaskPageBrief
    /** Schema-v1 legacy rubric — only present on tasks with no authored brief. */
    legacyCriteria?: Array<PersonalProjectTaskLegacyCriterionItem>
    /** Schema-v1 legacy per-language implementation guides — only present alongside {@link legacyCriteria}. */
    legacyCodeImplementations?: Array<PersonalProjectTaskLegacyCodeImplementationItem>
    /** Lessons related to this task's subject, auto-derived by the caller from its title/description. */
    relatedItems: Array<ContentRelatedItem>
    /** Section label for {@link relatedItems}, e.g. "You might want to read". */
    relatedLabel: string
    /** Everything the persistent, sticky act column needs. */
    submissionPanelProps: PersonalProjectTaskSubmissionPanelProps
    /**
     * `true` → every part that can mirror itself does. Flows down into the
     * reading column's composed parts and the act column's fields/buttons/score
     * card (§12c) rather than a parallel skeleton tree built here.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/** Skeleton placeholder count for the legacy accordions while real data hasn't landed yet. */
const LEGACY_SKELETON_ROWS = 2

/** `ListRow.leading` for the grading-settings summary row — a gear icon, hidden while skeleton. */
const SettingsLeading = ({ isSkeleton }: { isSkeleton?: boolean }) =>
    isSkeleton ? null : <GearSixIcon aria-hidden focusable="false" className="size-4" />

/** `ListRow.trailing` for the grading-settings summary row — the disclosure chevron. */
const SettingsChevron = () => <CaretRightIcon aria-hidden focusable="false" weight="bold" className="size-4" />

/** One markdown body at the `compact` measure the legacy accordion panels use. */
const legacyMarkdown = (body: string, showAnatomy: boolean) => (
    <MarkdownContent source={body} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />
)

/** One legacy code-implementation accordion panel body: guide, then a worked example. */
const legacyCodeBody = (item: PersonalProjectTaskLegacyCodeImplementationItem, showAnatomy: boolean) => {
    const guideSection = (
        <>
            <Typography size="xs" weight="medium" color="muted" text="Guide" showAnatomy={showAnatomy} />
            {legacyMarkdown(item.guide, showAnatomy)}
        </>
    )
    const exampleSection = (
        <>
            <Typography size="xs" weight="medium" color="muted" text="Example" showAnatomy={showAnatomy} />
            {legacyMarkdown(item.example, showAnatomy)}
        </>
    )
    return (
        <StackV
            gap={4}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    <StackV gap={2} anatPart={showAnatomy ? "StackV" : undefined} body={guideSection} />
                    <StackV gap={2} anatPart={showAnatomy ? "StackV" : undefined} body={exampleSection} />
                </>
            }
        />
    )
}

/**
 * The reading column: task identity (`PageHeader`) + the locked banner + the
 * brief itself + the legacy rubric/implementation guides + related lessons.
 * A private render helper (see file header for why this is not a separate
 * storied component), not an anatomy node of its own.
 */
const readingColumn = (props: {
    breadcrumbItems?: Array<BreadcrumbItem>
    task: PersonalProjectTaskPageTask
    isLocked: boolean
    brief: PersonalProjectTaskPageBrief
    legacyCriteria?: Array<PersonalProjectTaskLegacyCriterionItem>
    legacyCodeImplementations?: Array<PersonalProjectTaskLegacyCodeImplementationItem>
    relatedItems: Array<ContentRelatedItem>
    relatedLabel: string
    isSkeleton: boolean
    showAnatomy: boolean
}) => {
    const {
        breadcrumbItems,
        task,
        isLocked,
        brief,
        legacyCriteria,
        legacyCodeImplementations,
        relatedItems,
        relatedLabel,
        isSkeleton,
        showAnatomy,
    } = props

    const hasLegacyCriteria = (legacyCriteria?.length ?? 0) > 0
    const hasLegacyCode = (legacyCodeImplementations?.length ?? 0) > 0
    const showLegacy = isSkeleton || hasLegacyCriteria || hasLegacyCode
    // Schema-v2 tasks always carry an authored brief; schema-v1 (legacy) tasks
    // hand this screen an empty `body` and rely on the legacy section instead
    // (mirrors `src`'s `TaskBrief` self-hiding when `briefs.length === 0`).
    const showBrief = isSkeleton || brief.body.trim().length > 0

    const criteriaItems: Array<SurfaceCardAccordionItem> = hasLegacyCriteria
        ? (legacyCriteria ?? []).map((item, index) => ({
            id: item.key,
            title: `${index + 1}. ${item.text}`,
            titleEnd: () => <Chip tone="accent" text={`${item.score} points`} showAnatomy={showAnatomy} />,
            body: item.hint
                ? legacyMarkdown(item.hint, showAnatomy)
                : <Typography size="sm" color="muted"
 isItalic text="No grading hint yet" showAnatomy={showAnatomy} />,
        }))
        : isSkeleton
            ? Array.from({ length: LEGACY_SKELETON_ROWS }, (_unused, index) => ({ id: `criteria-skeleton-${index}`, title: "", body: null }))
            : []

    const codeItems: Array<SurfaceCardAccordionItem> = hasLegacyCode
        ? (legacyCodeImplementations ?? []).map((item) => ({
            id: item.key,
            title: item.lang,
            body: legacyCodeBody(item, showAnatomy),
        }))
        : isSkeleton
            ? Array.from({ length: LEGACY_SKELETON_ROWS }, (_unused, index) => ({ id: `code-skeleton-${index}`, title: "", body: null }))
            : []

    const legacyAccordions = (
        <>
            {hasLegacyCriteria || isSkeleton ? (
                <SurfaceCardAccordion
                    variant="nested"
                    items={criteriaItems}
                    allowsMultipleExpanded
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            {hasLegacyCode || isSkeleton ? (
                <SurfaceCardAccordion
                    variant="nested"
                    items={codeItems}
                    allowsMultipleExpanded
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
        </>
    )

    const readingSections = (
        <>
            <PageHeader
                anatPart={showAnatomy ? "PageHeader" : undefined}
                isSkeleton={isSkeleton}
                breadcrumb={() =>
                    isSkeleton || breadcrumbItems?.length ? (
                        <div className="w-fit" data-anat-part={showAnatomy ? "Breadcrumbs" : undefined}>
                            <Breadcrumbs collapseOnMobile collapseFrom={4} items={breadcrumbItems ?? []} isSkeleton={isSkeleton} />
                        </div>
                    ) : undefined
                }
                title={task.title}
                description={task.description}
            />

            {!isSkeleton && isLocked ? (
                <Callout
                    status="warning"
                    title="Preview of a task not yet unlocked"
                    description="You need to finish the current task before you can work on this one."
                    anatPart={showAnatomy ? "Callout" : undefined}
                />
            ) : null}

            {showBrief ? (
                <SurfaceCard
                    label="Guide"
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCard" : undefined}
                    body={() => <MarkdownContent source={brief.body} anatPart={showAnatomy ? "MarkdownContent" : undefined} />}
                />
            ) : null}

            {showLegacy ? (
                <SurfaceCard
                    label="Evaluation criteria (legacy)"
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCard" : undefined}
                    body={() => <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={legacyAccordions} />}
                />
            ) : null}

            <ContentRelatedList
                label={relatedLabel}
                items={relatedItems}
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "ContentRelatedList" : undefined}
            />
        </>
    )

    return <StackV gap={7} anatPart={showAnatomy ? "StackV" : undefined} body={readingSections} />
}

/**
 * The persistent, sticky act column: repo URL + settings summary trigger +
 * evaluate/secondary actions + the latest graded result. A private render
 * helper (see file header), not an anatomy node of its own.
 */
const submissionPanel = (props: {
    panel: PersonalProjectTaskSubmissionPanelProps
    isSkeleton: boolean
    showAnatomy: boolean
}) => {
    const { panel, isSkeleton, showAnatomy } = props
    const hasAttempts = panel.hasAttempts ?? false

    const evaluateActions = (
        <>
            <Button
                label={hasAttempts ? "Re-evaluate" : "Evaluate"}
                prefixIcon={SparkleIcon}
                onPress={panel.onEvaluate}
                isPending={panel.isEvaluatePending}
                isDisabled={panel.isEvaluateDisabled}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <Button
                label="View feedback"
                variant="tertiary"
                onPress={panel.onOpenFeedbackDetails}
                isDisabled={!hasAttempts}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <Button
                label="View submission history"
                variant="tertiary"
                onPress={panel.onOpenAttempts}
                isDisabled={!hasAttempts}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
        </>
    )

    const githubFields = (
        <>
            <InputText
                label="GitHub repo URL"
                value={panel.repoUrl}
                onValueChange={panel.onRepoUrlChange}
                errorMessage={panel.repoUrlError}
                placeholder="https://github.com/…"
                ariaLabel="GitHub repo URL"
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
            />
            <div data-anat-part={showAnatomy ? "ListRow" : undefined}>
                <ListRow
                    leading={SettingsLeading}
                    title="Grading settings"
                    meta={`${panel.settingsLangLabel} · ${panel.settingsBranch}`}
                    trailing={SettingsChevron}
                    onPress={panel.onOpenSettings}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                />
            </div>
            <StackH gap={3} wrap anatPart={showAnatomy ? "StackH" : undefined} body={evaluateActions} />
        </>
    )

    const panelSections = (
        <>
            <SurfaceCard
                label="Project GitHub"
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "SurfaceCard" : undefined}
                body={() => <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={githubFields} />}
            />

            {isSkeleton || panel.result != null ? (
                <SubmissionScoreCard
                    label="Latest grading result"
                    score={panel.result?.score ?? 0}
                    maxScore={panel.result?.maxScore}
                    isPassing={panel.result?.isPassing ?? true}
                    passScore={panel.result?.passScore}
                    shortFeedback={panel.result?.shortFeedback}
                    gradedByModel={panel.result?.gradedByModel}
                    modelCategory={panel.result?.modelCategory}
                    timeAgo={panel.result?.timeAgo}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SubmissionScoreCard" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
        </>
    )

    return <StackV gap={6} anatPart={showAnatomy ? "StackV" : undefined} body={panelSections} />
}

/**
 * The personal-project task solve screen. See the file header for the function
 * list, the reuse map, and the two-column layout's known limits.
 *
 * @param props - {@link PersonalProjectTaskPageProps}
 */
const PersonalProjectTaskPage = ({
    breadcrumbItems,
    task,
    isLocked = false,
    brief,
    legacyCriteria,
    legacyCodeImplementations,
    relatedItems,
    relatedLabel,
    submissionPanelProps,
    isSkeleton = false,
    showAnatomy = false,
}: PersonalProjectTaskPageProps) => (
    <Container
        size="xl"
        padding={6}
        body={
            <SplitWorkspace
                anatPart={showAnatomy ? "SplitWorkspace" : undefined}
                main={readingColumn({
                    breadcrumbItems,
                    task,
                    isLocked,
                    brief,
                    legacyCriteria,
                    legacyCodeImplementations,
                    relatedItems,
                    relatedLabel,
                    isSkeleton,
                    showAnatomy,
                })}
                aside={submissionPanel({ panel: submissionPanelProps, isSkeleton, showAnatomy })}
            />
        }
    />
)

export { PersonalProjectTaskPage }
