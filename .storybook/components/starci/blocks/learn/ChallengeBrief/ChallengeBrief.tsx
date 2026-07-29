import React from "react"
import type { ReactNode } from "react"
import { CheckCircleIcon, LightbulbIcon } from "@phosphor-icons/react"
import {
    SurfaceCardList,
    SurfaceCardAccordion,
    type SurfaceCardListItem,
    type SurfaceCardAccordionItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ScoreValue } from "@sb-components/composites/text/ScoreValue/ScoreValue"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ChallengeBrief`: the READING column of a challenge — everything a
 * learner reads before they submit, ported from `src`'s `ChallengeView` reading
 * sections (`.storybook/components/README.md` §"app-folder split" — this file
 * owns none of the submit/score aside, only the brief).
 *
 * FIVE CONDITIONAL SECTIONS, not five leaves. `src/.../ChallengeView/index.tsx`
 * gates each section on `items.length > 0` (`prerequisites.length > 0 ? … : null`,
 * same for requirements/steps/outputs, `hint.length > 0 ? … : null`) and so does
 * this block — but which sections are present is DATA, not structure: a
 * challenge with no prerequisites is still the same shape of thing as one with
 * three, so this stays ONE leaf (`ChallengeBrief`) with a "some sections empty"
 * STATE, per `feedback-anatomy-tree-granularity-rule.md` / §14d.2. Losing a
 * whole DIFFERENT shape (the whole block replaced by something else) would be a
 * leaf; losing one of its own five sections is not.
 *
 * REUSE, NOT REBUILD (per this run's mandate). `src`'s five sections are three
 * shapes, already ported into `SurfaceCard`:
 *   - prerequisites / expected outputs → `SurfaceCardList` free-form rows
 *     (was `CheckListCard`/`CheckListItem` — `showCheck=false` for prerequisites,
 *     `showCheck=true` for outputs). `SurfaceCardList`'s FIXED row shape has no
 *     "leading check icon" slot, so both sections go through `item.content`
 *     (free-form) and this block builds the row body itself: prerequisites =
 *     bare markdown, outputs = a leading `CheckCircleIcon` + markdown.
 *   - requirements / guided steps → `SurfaceCardAccordion` (was
 *     `LabeledAccordionCard`), `titleEnd` carrying the per-requirement
 *     `ScoreValue` (accent text, never a chip — §2a: a point count is a
 *     free-form scalar, not an enum/status/badge), steps numbered `"1. …"` by
 *     this block (the caller never hands over
 *     a pre-numbered string, per §14d.1 — it hands `title?` and an index, this
 *     block composes the sentence).
 *   - hint → `SurfaceCardAccordion` with exactly one item, bare (no `label`,
 *     matching `src`'s un-labelled hint accordion with its own lightbulb icon
 *     inside the trigger).
 *
 * ⚠️ SKELETON GOTCHA THAT SHAPED THIS FILE. `SurfaceCardList`'s `isSkeleton`
 * flag only reaches the FIXED row shape (`ListRow`) — its free-form path
 * (`ListFreeRow`, what `item.content` renders through) ignores the flag
 * entirely (see `SurfaceCard.tsx`'s `List` body: `isSkeleton` is passed to
 * `ListRow` only). Since prerequisites/outputs must go through `item.content`
 * (no leading-check slot on the fixed row), this block cannot lean on that
 * built-in mirror for those two sections — it builds its OWN placeholder rows
 * (`skeletonRows`) instead, each a bare `Typography isSkeleton` bar. The
 * `SurfaceCardAccordion` sections (requirements/steps/hint) do NOT have this
 * problem — their real row shape (title + optional subtitle) already flows
 * through the composite's own mirror, so this block just forwards `isSkeleton`
 * for those three.
 *
 * ⭐ SKELETON SHAPE IS A JUDGEMENT CALL, spelled out in case it needs revisiting:
 * while `isSkeleton`, every section renders (the caller has not told us which
 * sections a challenge will end up having), each with a fixed placeholder row
 * count — 2 for the two list sections, and exactly 1 for hint (never the
 * accordion composite's own 3-row default, since a hint section is always
 * exactly one collapsible row, real or not). Once real data lands and
 * `isSkeleton` drops, a section disappears entirely if its array/string came
 * back empty — the loading guess and the settled truth are allowed to disagree
 * in COUNT, never in which five things could appear.
 *
 * ⭐ THE OUTPUTS SKELETON ROW HAS NO CHECK ICON, on purpose. The check icon
 * asserts "this is met" — showing it before any data has confirmed that would
 * be a promise this block cannot back up yet. A plain shimmer bar makes no such
 * claim; the icon only appears once the real row does.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One "before you start" line — plain, unchecked (needed, not achieved). */
export interface ChallengeBriefPrerequisiteItem {
    /** Stable React key. */
    key: string
    /** Row body, markdown. */
    body: string
}

/** One graded requirement — its point value rides as a trailing chip on the trigger row. */
export interface ChallengeBriefRequirementItem {
    /** Stable React key, also the accordion item id. */
    key: string
    /** Trigger headline. */
    title: string
    /** Points this requirement is worth. Omit the chip entirely when not scored. */
    points?: number
    /** Panel body, markdown. */
    body: string
}

/** One guided step — numbered by this block, never by the caller. */
export interface ChallengeBriefStepItem {
    /** Stable React key, also the accordion item id. */
    key: string
    /** Optional step headline; falls back to a plain "Bước N" when absent. */
    title?: string
    /** Panel body, markdown. */
    body: string
}

/** One expected-output line — checked (an achievement the solution must produce). */
export interface ChallengeBriefOutputItem {
    /** Stable React key. */
    key: string
    /** Row body, markdown. */
    body: string
}

/** Props for {@link ChallengeBrief}. */
export interface ChallengeBriefProps {
    /** "Before you start" lines. Section is omitted entirely when empty/absent. */
    prerequisites?: ReadonlyArray<ChallengeBriefPrerequisiteItem>
    /** Graded requirements, each collapsible with its points on the trigger. */
    requirements?: ReadonlyArray<ChallengeBriefRequirementItem>
    /** Guided steps, numbered by this block in order. */
    steps?: ReadonlyArray<ChallengeBriefStepItem>
    /** Expected-output lines, each with a leading check. */
    outputs?: ReadonlyArray<ChallengeBriefOutputItem>
    /** A single hint, collapsed by default. Section is omitted when blank. */
    hint?: string
    /** `true` → every present-or-guessed section renders its own shimmer mirror. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Placeholder row count while `isSkeleton` and the real section count isn't known yet. */
const PREREQUISITE_SKELETON_ROWS = 2
const OUTPUT_SKELETON_ROWS = 2

/** One markdown body, at the `compact` measure every section of this reading column uses. */
const markdownBody = (body: string, showAnatomy: boolean): ReactNode => (
    <MarkdownContent source={body} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />
)

/**
 * N shimmer rows for a free-form `SurfaceCardList` — see the file header on why that
 * composite's own `isSkeleton` cannot draw these for us.
 */
const skeletonListRows = (count: number, keyPrefix: string): Array<SurfaceCardListItem> =>
    Array.from({ length: count }, (_unused, index) => ({
        key: `${keyPrefix}-${index}`,
        content: <Typography size="sm" isSkeleton className="w-3/4" />,
    }))

/**
 * The challenge reading column. See the file header for why this stays one leaf across
 * five optional sections, and how each section's skeleton mirror is built.
 *
 * @param props - {@link ChallengeBriefProps}
 */
const ChallengeBrief = ({
    prerequisites,
    requirements,
    steps,
    outputs,
    hint,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ChallengeBriefProps) => {
    const trimmedHint = hint?.trim() ?? ""

    // Each section renders when it has real content — OR while `isSkeleton`, since the
    // caller has not told us yet which of the five this challenge will end up having.
    const showPrerequisites = isSkeleton || (prerequisites?.length ?? 0) > 0
    const showRequirements = isSkeleton || (requirements?.length ?? 0) > 0
    const showSteps = isSkeleton || (steps?.length ?? 0) > 0
    const showOutputs = isSkeleton || (outputs?.length ?? 0) > 0
    const showHint = isSkeleton || trimmedHint.length > 0

    const prerequisiteItems: Array<SurfaceCardListItem> = isSkeleton
        ? skeletonListRows(PREREQUISITE_SKELETON_ROWS, "prereq-skeleton")
        : (prerequisites ?? []).map((item) => ({
            key: item.key,
            content: markdownBody(item.body, showAnatomy),
        }))

    const outputItems: Array<SurfaceCardListItem> = isSkeleton
        ? skeletonListRows(OUTPUT_SKELETON_ROWS, "output-skeleton")
        : (outputs ?? []).map((item) => ({
            key: item.key,
            content: (
                <StackH gap="tight" align="start">
                    <CheckCircleIcon
                        aria-hidden
                        focusable="false"
                        data-anat-part={showAnatomy ? "CheckCircleIcon" : undefined}
                        className="size-5 shrink-0 text-success-soft-foreground"
                    />
                    {markdownBody(item.body, showAnatomy)}
                </StackH>
            ),
        }))

    const requirementItems: Array<SurfaceCardAccordionItem> = (requirements ?? []).map((item) => ({
        id: item.key,
        title: item.title,
        titleEnd: item.points != null
            ? <ScoreValue points={item.points} anatPart={showAnatomy ? "ScoreValue" : undefined} />
            : undefined,
        body: markdownBody(item.body, showAnatomy),
    }))

    const stepItems: Array<SurfaceCardAccordionItem> = (steps ?? []).map((item, index) => ({
        id: item.key,
        // The block owns this sentence (§14d.1) — the caller hands an optional headline
        // plus its position via array order, never a pre-numbered string.
        title: `${index + 1}. ${item.title || `Bước ${index + 1}`}`,
        body: markdownBody(item.body, showAnatomy),
    }))

    // A hint is always exactly one collapsible row, real or guessed — so the skeleton
    // fallback is ONE placeholder item, not the accordion composite's generic 3-row default.
    const hintItems: Array<SurfaceCardAccordionItem> = trimmedHint.length > 0
        ? [{
            id: "hint",
            titleStart: (
                <LightbulbIcon
                    aria-hidden
                    focusable="false"
                    weight="bold"
                    data-anat-part={showAnatomy ? "LightbulbIcon" : undefined}
                    className="size-5 text-warning-soft-foreground"
                />
            ),
            title: "Gợi ý",
            body: markdownBody(trimmedHint, showAnatomy),
        }]
        : isSkeleton
            ? [{ id: "hint-skeleton", title: "", body: null }]
            : []

    return (
        <StackV gap="section" anatPart={anatPart} showAnatomy={showAnatomy}>
            {showPrerequisites ? (
                <SurfaceCardList
                    label="Điều kiện tiên quyết"
                    items={prerequisiteItems}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            {showRequirements ? (
                <SurfaceCardAccordion
                    label="Yêu cầu"
                    items={requirementItems}
                    allowsMultipleExpanded
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            {showSteps ? (
                <SurfaceCardAccordion
                    label="Các bước hướng dẫn"
                    items={stepItems}
                    allowsMultipleExpanded
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            {showOutputs ? (
                <SurfaceCardList
                    label="Đầu ra mong đợi"
                    items={outputItems}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            {showHint ? (
                <SurfaceCardAccordion
                    items={hintItems}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}
        </StackV>
    )
}

export { ChallengeBrief }
