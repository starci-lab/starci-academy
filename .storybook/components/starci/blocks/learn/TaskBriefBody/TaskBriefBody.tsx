import React from "react"
import { WarningIcon } from "@phosphor-icons/react"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { SurfaceCardAccordion, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { ContentRelatedList, type ContentRelatedItem } from "@sb-components/starci/blocks/learn/ContentRelatedList/ContentRelatedList"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `TaskBriefBody` — the reading column of a personal-project milestone task. A task
 * resolves into exactly one of two shapes depending on whether it carries a Schema
 * V2 brief: `SchemaV2Brief` (modern per-language markdown instructions) or
 * `LegacySchemaV1` (the older public criteria accordion + code guides). A task is
 * never both, so these are two leaves; `Skeleton` is a third (the block guesses
 * Schema V2 while loading). Within each schema shape, `isLocked` toggling the notice
 * is a plain data state.
 */

/** One pass criterion of a SCHEMA V1 (legacy) task — `src`'s `MilestoneTaskCriteriaEntity`. */
export interface TaskBriefCriteriaItem {
    /** Stable React key, also the accordion item id. */
    key: string
    /** Criterion trigger text. */
    text: string
    /** Grading hint, markdown. Blank → the row shows a plain "no hint yet" line instead. */
    hint?: string
    /** Points this criterion is worth — rides as a trailing chip on the trigger. */
    score: number
}

/** One per-language implementation guide of a SCHEMA V1 (legacy) task — `src`'s `CodeImplementationEntity`. */
export interface TaskBriefCodeImplementationItem {
    /** Stable React key, also the accordion item id. */
    key: string
    /** Language label (typescript / java / csharp / go). */
    lang: string
    /** Mapping guide, markdown. */
    guide: string
    /** Example code, markdown. */
    example: string
}

/** Props for {@link TaskBriefBody}. */
export interface TaskBriefBodyProps {
    /** Task title. */
    title: string
    /** Task description. Omitted when the task carries none. */
    description?: string
    /**
     * `true` → the learner is previewing a task ahead of their current progress:
     * the reading stays visible but a warning notice replaces the graded panel
     * (out of scope here) with a way back to the unlocked task.
     */
    isLocked: boolean
    /** Fired from the locked notice's "go to current task" button. */
    onGoToCurrentTask: () => void
    /**
     * SCHEMA V2 per-language brief, already resolved to the active locale by
     * the backend (`src`'s `TaskBrief`). Blank/absent ⇒ this is a SCHEMA V1
     * task and the legacy fallback below takes over instead.
     */
    briefBody?: string
    /** SCHEMA V1 fallback: public pass criteria. Read only when `briefBody` is blank. */
    legacyCriteria?: ReadonlyArray<TaskBriefCriteriaItem>
    /** SCHEMA V1 fallback: per-language implementation guides. Read only when `briefBody` is blank. */
    legacyCodeImplementations?: ReadonlyArray<TaskBriefCodeImplementationItem>
    /** Related lessons worth reading before this task. Empty → `ContentRelatedList` renders nothing. */
    relatedItems: Array<ContentRelatedItem>
    /** Section label for the related list, localized by the caller. */
    relatedLabel: string
    /** `true` → title/description and the brief-body guess switch to their own shimmer. */
    isSkeleton?: boolean
}

/** Fixed copy for the locked-preview notice — this block owns its own wording (§14d.1). */
const LOCKED_ALERT_TITLE = "Finish the previous task first"
const LOCKED_ALERT_DESCRIPTION = "You can still read this task's criteria. AI evaluation, feedback, history and the GitHub section unlock once you finish the previous step."
const LOCKED_ALERT_BUTTON_LABEL = "Back to current task"

/** Fixed copy for the SCHEMA V1 fallback card's two sub-labels. */
const CRITERIA_LABEL = "Grading criteria"
const CRITERIA_EMPTY_TITLE = "This task has no grading criteria yet."
const CRITERIA_NO_HINT = "No guidance for this criterion yet."
const IMPLEMENTATION_GUIDE_HEADING = "Guide"
const IMPLEMENTATION_EXAMPLE_HEADING = "Example"

/** `SurfaceCardAccordion.emptyState` for the SCHEMA V1 criteria fallback — a component reference (COMPOSITE-4), not a built element. */
const CriteriaEmptyState = () => <EmptyState title={CRITERIA_EMPTY_TITLE} />

/** How many shimmer paragraph lines `BriefMarkdown` guesses while `isSkeleton` — see file header. */
const BRIEF_SKELETON_LINE_WIDTHS = ["w-full", "w-full", "w-3/4", "w-2/3"] as const

/**
 * The personal-project task reading column. See the file header for the full
 * schema-generation contract and every judgement call.
 *
 * @param props - {@link TaskBriefBodyProps}
 */
const TaskBriefBody = ({
    title,
    description,
    isLocked,
    onGoToCurrentTask,
    briefBody,
    legacyCriteria,
    legacyCodeImplementations,
    relatedItems,
    relatedLabel,
    isSkeleton = false,
}: TaskBriefBodyProps) => {
    const trimmedBrief = briefBody?.trim() ?? ""
    // Schema-generation test, identical to `src`'s `(displayTask?.briefs?.length ?? 0) === 0`:
    // a brief present ⇒ SCHEMA V2, this task's rubric stays internal to the brief text.
    // While isSkeleton the generation isn't known yet — guessed SCHEMA V2, see file header.
    const showBrief = isSkeleton || trimmedBrief.length > 0
    const showLegacy = !isSkeleton && trimmedBrief.length === 0

    const criteriaItems: Array<SurfaceCardAccordionItem> = (legacyCriteria ?? []).map((item, index) => ({
        id: item.key,
        title: `${index + 1}. ${item.text}`,
        titleEnd: () => <Chip tone="accent" text={`${item.score} pts`} />,
        body: () => (
            item.hint?.trim() ? (
                <MarkdownContent source={item.hint} measure="compact" />
            ) : (
                <Typography size="sm" color="muted" isItalic text={CRITERIA_NO_HINT} />
            )
        ),
    }))

    const implementationBody = (item: TaskBriefCodeImplementationItem) => (
        <StackV
            gap={2}
            items={[
                () => <Typography size="xs" weight="semibold" color="muted" text={IMPLEMENTATION_GUIDE_HEADING} />,
                () => <MarkdownContent source={item.guide} measure="compact" />,
                () => <Typography size="xs" weight="semibold" color="muted" text={IMPLEMENTATION_EXAMPLE_HEADING} />,
                () => <MarkdownContent source={item.example} measure="compact" />,
            ]}
        />
    )

    const implementationItems: Array<SurfaceCardAccordionItem> = (legacyCodeImplementations ?? []).map((item) => ({
        id: item.key,
        title: item.lang,
        body: () => implementationBody(item),
    }))

    const readingColumn = (
        <>
            {/* TitleDesc — always present; both lines fall back to their own shimmer bar. */}
            <StackV
                gap={2}
                isSkeleton={isSkeleton}

                items={[
                    () => <Typography size="h3" weight="bold" isSkeleton={isSkeleton} classNames={isSkeleton ? ["w-1/2"] : undefined} text={title} />,
                    ...(isSkeleton
                        ? [() => <Typography size="sm" color="muted" isSkeleton classNames={["w-2/3"]} />]
                        : description != null && description.trim().length > 0
                            ? [() => <Typography size="sm" color="muted" text={description} />]
                            : []),
                ]}
            />

            {/* LockedAlert — self-hides when unlocked; honored regardless of `isSkeleton` since
                `isLocked` is already-resolved data the caller holds, same call as
                `ContentArticle`'s own `isLocked`. */}
            {isLocked ? (
                <Callout
                    status="warning"
                    icon={WarningIcon}
                    title={LOCKED_ALERT_TITLE}
                    description={LOCKED_ALERT_DESCRIPTION}
                    actionLabel={LOCKED_ALERT_BUTTON_LABEL}
                    onAction={onGoToCurrentTask}

                />
            ) : null}

            {/* BriefMarkdown — SCHEMA V2. Skeleton guesses a plain shimmer paragraph rather
                than calling `MarkdownContent` with no source, mirroring `ChallengeBrief`'s
                own list-skeleton judgement call (a viewer needs a real payload; a guessed
                loading state cannot fabricate one). */}
            {showBrief ? (
                isSkeleton ? (
                    <StackV
                        gap={2}
                        isSkeleton={isSkeleton}

                        items={BRIEF_SKELETON_LINE_WIDTHS.map((width) => () => (
                            <Typography size="base" isSkeleton classNames={[width]} />
                        ))}
                    />
                ) : (
                    <MarkdownContent source={trimmedBrief} measure="reading" />
                )
            ) : null}

            {/* LegacyCriteriaCard — SCHEMA V1 fallback ONLY, never while isSkeleton (see file header). */}
            {showLegacy ? (
                <StackV
                    gap={4}
                    isSkeleton={isSkeleton}

                    items={[
                        () => <Typography size="sm" weight="semibold" text={CRITERIA_LABEL} />,
                        () => (
                            <SurfaceCardAccordion
                                items={criteriaItems}
                                allowsMultipleExpanded
                                emptyState={CriteriaEmptyState}


                            />
                        ),
                        ...(implementationItems.length > 0 ? [() => (
                            <SurfaceCardAccordion
                                items={implementationItems}
                                allowsMultipleExpanded


                            />
                        )] : []),
                    ]}
                />
            ) : null}

            {/* RelatedList — the block never gates it; `ContentRelatedList` already self-hides. */}
            <ContentRelatedList
                items={relatedItems}
                label={relatedLabel}
                isSkeleton={isSkeleton}


            />
        </>
    )

    return (
        <StackV gap={6} isSkeleton={isSkeleton} items={[() => readingColumn]} />
    )
}

export { TaskBriefBody }
