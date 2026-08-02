import React from "react"
import { type SkeletonProps } from "@sb-components/composites/_slot"
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
 * `PersonalProjectTaskPage` — the screen for solving one personal-project task. It
 * composes blocks/composites in frames and hands each typed data.
 *
 * Two columns via `SplitWorkspace`: a reading column that swaps per task (task brief,
 * criteria, code implementations, related content) beside a persistent sticky act
 * column (submission field, grading-settings summary row, actions, results). The
 * locked-preview banner is a `warning` `Callout`; the brief is a `SurfaceCard` around
 * `MarkdownContent`; the settings summary reuses `ListRow`. The grading-settings
 * drawer content is out of scope (`onOpenSettings` is a chrome trigger). The
 * Evaluate ↔ Re-evaluate label is owned here, flipped by `hasAttempts`.
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
}

/** Skeleton placeholder count for the legacy accordions while real data hasn't landed yet. */
const LEGACY_SKELETON_ROWS = 2

/** `ListRow.leading` for the grading-settings summary row — a gear icon, hidden while skeleton. */
const SettingsLeading = ({ isSkeleton }: SkeletonProps) =>
    isSkeleton ? null : <GearSixIcon aria-hidden focusable="false" className="size-4" />

/** `ListRow.trailing` for the grading-settings summary row — the disclosure chevron. */
const SettingsChevron = () => <CaretRightIcon aria-hidden focusable="false" weight="bold" className="size-4" />

/** One markdown body at the `compact` measure the legacy accordion panels use. */
const legacyMarkdown = (body: string) => (
    <MarkdownContent source={body} measure="compact" />
)

/** One legacy code-implementation accordion panel body: guide, then a worked example. */
const legacyCodeBody = (item: PersonalProjectTaskLegacyCodeImplementationItem) => {
    const guideSection = (
        <>
            <Typography size="xs" weight="medium" color="muted" text="Guide" />
            {legacyMarkdown(item.guide)}
        </>
    )
    const exampleSection = (
        <>
            <Typography size="xs" weight="medium" color="muted" text="Example" />
            {legacyMarkdown(item.example)}
        </>
    )
    return (
        <StackV
            gap={4}

            items={[
                () => <StackV gap={2} items={[() => guideSection]} />,
                () => <StackV gap={2} items={[() => exampleSection]} />,
            ]}
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
            titleEnd: () => <Chip tone="accent" text={`${item.score} points`} />,
            body: () => (
                item.hint
                    ? legacyMarkdown(item.hint)
                    : <Typography size="sm" color="muted"
                        isItalic text="No grading hint yet" />
            ),
        }))
        : isSkeleton
            ? Array.from({ length: LEGACY_SKELETON_ROWS }, (_unused, index) => ({ id: `criteria-skeleton-${index}`, title: "", body: () => null }))
            : []

    const codeItems: Array<SurfaceCardAccordionItem> = hasLegacyCode
        ? (legacyCodeImplementations ?? []).map((item) => ({
            id: item.key,
            title: item.lang,
            body: () => legacyCodeBody(item),
        }))
        : isSkeleton
            ? Array.from({ length: LEGACY_SKELETON_ROWS }, (_unused, index) => ({ id: `code-skeleton-${index}`, title: "", body: () => null }))
            : []

    const legacyAccordions = (
        <>
            {hasLegacyCriteria || isSkeleton ? (
                <SurfaceCardAccordion
                    variant="nested"
                    items={criteriaItems}
                    allowsMultipleExpanded
                    isSkeleton={isSkeleton}


                />
            ) : null}
            {hasLegacyCode || isSkeleton ? (
                <SurfaceCardAccordion
                    variant="nested"
                    items={codeItems}
                    allowsMultipleExpanded
                    isSkeleton={isSkeleton}


                />
            ) : null}
        </>
    )

    const readingSections = (
        <>
            <PageHeader

                isSkeleton={isSkeleton}
                breadcrumb={() =>
                    isSkeleton || breadcrumbItems?.length ? (
                        <div className="w-fit">
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

                />
            ) : null}

            {showBrief ? (
                <SurfaceCard
                    label="Guide"
                    isSkeleton={isSkeleton}

                    body={() => <MarkdownContent source={brief.body} />}
                />
            ) : null}

            {showLegacy ? (
                <SurfaceCard
                    label="Evaluation criteria (legacy)"
                    isSkeleton={isSkeleton}

                    body={() => <StackV gap={6} items={[() => legacyAccordions]} />}
                />
            ) : null}

            <ContentRelatedList
                label={relatedLabel}
                items={relatedItems}
                isSkeleton={isSkeleton}

            />
        </>
    )

    return <StackV gap={7} isSkeleton={isSkeleton} items={[() => readingSections]} />
}

/**
 * The persistent, sticky act column: repo URL + settings summary trigger +
 * evaluate/secondary actions + the latest graded result. A private render
 * helper (see file header), not an anatomy node of its own.
 */
const submissionPanel = (props: {
    panel: PersonalProjectTaskSubmissionPanelProps
    isSkeleton: boolean
}) => {
    const { panel, isSkeleton } = props
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

            />
            <Button
                label="View feedback"
                variant="tertiary"
                onPress={panel.onOpenFeedbackDetails}
                isDisabled={!hasAttempts}
                isSkeleton={isSkeleton}

            />
            <Button
                label="View submission history"
                variant="tertiary"
                onPress={panel.onOpenAttempts}
                isDisabled={!hasAttempts}
                isSkeleton={isSkeleton}

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

            />
            <div>
                <ListRow
                    leading={SettingsLeading}
                    title="Grading settings"
                    meta={() => <Typography size="sm" color="muted" text={`${panel.settingsLangLabel} · ${panel.settingsBranch}`} />}
                    trailing={SettingsChevron}
                    onPress={panel.onOpenSettings}
                    isSkeleton={isSkeleton}

                />
            </div>
            <StackH gap={3} at="sm" isSkeleton={isSkeleton} items={[() => evaluateActions]} />
        </>
    )

    const panelSections = (
        <>
            <SurfaceCard
                label="Project GitHub"
                isSkeleton={isSkeleton}

                body={() => <StackV gap={6} isSkeleton={isSkeleton} items={[() => githubFields]} />}
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


                />
            ) : null}
        </>
    )

    return <StackV gap={6} isSkeleton={isSkeleton} items={[() => panelSections]} />
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
}: PersonalProjectTaskPageProps) => (
    <Container
        size="xl"
        padding={6}
        body={() => (
            <SplitWorkspace

                main={() => readingColumn({
                    breadcrumbItems,
                    task,
                    isLocked,
                    brief,
                    legacyCriteria,
                    legacyCodeImplementations,
                    relatedItems,
                    relatedLabel,
                    isSkeleton,
                })}
                aside={() => submissionPanel({ panel: submissionPanelProps, isSkeleton })}
            />
        )}
    />
)

export { PersonalProjectTaskPage }
