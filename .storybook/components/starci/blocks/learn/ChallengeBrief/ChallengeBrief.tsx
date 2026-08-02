import React from "react"
import type { ReactNode } from "react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import {
    SurfaceCard,
    SurfaceCardList,
    SurfaceCardAccordion,
    type SurfaceCardListItem,
    type SurfaceCardAccordionItem,
} from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ScoreValue } from "@sb-components/composites/text/ScoreValue/ScoreValue"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { stripMarkdown } from "@sb-components/atoms/text/_markdown"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `ChallengeBrief` — the reading column of a challenge: prerequisites,
 * requirements (points-per-row), guided steps, expected outputs, and a hint,
 * each present only when the challenge carries it. One leaf: which of the five
 * sections show up is data. States: every section present, some genuinely
 * absent, and the loading mirror.
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
    /** Optional step headline; falls back to a plain "Step N" when absent. */
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
}

/** Placeholder row count while `isSkeleton` and the real section count isn't known yet. */
const PREREQUISITE_SKELETON_ROWS = 2
const OUTPUT_SKELETON_ROWS = 2

/** One markdown body, at the `compact` measure every section of this reading column uses. */
const markdownBody = (body: string): ReactNode => (
    <MarkdownContent source={body} measure="compact" />
)

/**
 * N shimmer rows for a free-form `SurfaceCardList` — see the file header on why that
 * composite's own `isSkeleton` cannot draw these for us.
 */
const skeletonListRows = (count: number, keyPrefix: string): Array<SurfaceCardListItem> =>
    Array.from({ length: count }, (_unused, index) => ({
        key: `${keyPrefix}-${index}`,
        content: () => <Typography size="sm" isSkeleton classNames={["w-3/4"]} />,
    }))

/** One expected-output row: a leading check plus the stripped output text. */
const outputRow = (body: string) => (
    <StackH
        gap={2}
        align="start"
        items={[
            () => (
                <CheckCircleIcon
                    aria-hidden
                    focusable="false"

                    className="size-5 shrink-0 text-success-soft-foreground"
                />
            ),
            () => <Typography size="sm" text={stripMarkdown(body)} />,
        ]}
    />
)

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
}: ChallengeBriefProps) => {
    const trimmedHint = hint?.trim() ?? ""

    // Each section renders when it has real content — OR while `isSkeleton`, since the
    // caller has not told us yet which of the five this challenge will end up having.
    const showPrerequisites = isSkeleton || (prerequisites?.length ?? 0) > 0
    const showRequirements = isSkeleton || (requirements?.length ?? 0) > 0
    const showSteps = isSkeleton || (steps?.length ?? 0) > 0
    const showOutputs = isSkeleton || (outputs?.length ?? 0) > 0
    const showHint = isSkeleton || trimmedHint.length > 0

    // prerequisites/outputs render PLAIN TEXT, not through markdown. The backend
    // content-authoring schema (`.claude/docs/rules/fullstack/challenges.md`:
    // outputs/prerequisites are lang+TEXT only) names its field quite differently
    // from requirements/steps (lang+title+BODY, which allows markdown/callout
    // `:::muted`) — "text" vs "body" is a DELIBERATE boundary at the content tier,
    // not an arbitrary one. `stripMarkdown` guards at the render boundary: content
    // authors may still habitually type backtick/bold, but the rendered text must
    // come out completely clean — not just a different render mechanism, but the
    // literal characters too.
    const prerequisiteItems: Array<SurfaceCardListItem> = isSkeleton
        ? skeletonListRows(PREREQUISITE_SKELETON_ROWS, "prereq-skeleton")
        : (prerequisites ?? []).map((item) => ({
            key: item.key,
            content: () => <Typography size="sm" text={stripMarkdown(item.body)} />,
        }))

    const outputItems: Array<SurfaceCardListItem> = isSkeleton
        ? skeletonListRows(OUTPUT_SKELETON_ROWS, "output-skeleton")
        : (outputs ?? []).map((item) => ({
            key: item.key,
            content: () => outputRow(item.body),
        }))

    const requirementItems: Array<SurfaceCardAccordionItem> = (requirements ?? []).map((item) => ({
        id: item.key,
        title: item.title,
        titleEnd: item.points != null
            ? () => <ScoreValue points={item.points ?? 0} />
            : undefined,
        body: () => markdownBody(item.body),
    }))

    const stepItems: Array<SurfaceCardAccordionItem> = (steps ?? []).map((item, index) => ({
        id: item.key,
        // The block owns this sentence (§14d.1) — the caller hands an optional headline
        // plus its position via array order, never a pre-numbered string.
        title: `${index + 1}. ${item.title || `Step ${index + 1}`}`,
        body: () => markdownBody(item.body),
    }))

    // A BARE `SurfaceCard`, `label="Hint"`, with content as ONE markdown paragraph
    // as `children`.
    //
    // Why NOT an accordion: adding `label="Hint"` to an accordion would show the
    // word "Hint" TWICE (the card's header + the sole item's trigger) — an accordion
    // item is forced to carry a title, it can't be left blank. The outer label
    // already states what this is, so the show/hide behaviour loses its reason to
    // exist.
    //
    // Why NOT `SurfaceCardList`: a hint is ONE paragraph, not a list — an `items`
    // array whose length is always 1 gets the data shape wrong from the start,
    // dragging along a meaningless row-divider and `key`. A bare `SurfaceCard` takes
    // `children` directly, matching the real amount of content.
    //
    // No lightbulb icon: `label` is a card header just like "Requirements"/"Expected
    // outputs" — peer labels where only one carries an icon is an inconsistent
    // rhythm, and the word "Hint" alone already carries enough meaning (only a
    // universally recognised symbol earns its own glyph, not a plain-prose label).

    const sections = (
        <>
            {showPrerequisites ? (
                <SurfaceCardList
                    label="Prerequisites"
                    items={prerequisiteItems}
                    isSkeleton={isSkeleton}


                />
            ) : null}
            {showRequirements ? (
                <SurfaceCardAccordion
                    label="Requirements"
                    items={requirementItems}
                    allowsMultipleExpanded
                    isSkeleton={isSkeleton}


                />
            ) : null}
            {showSteps ? (
                <SurfaceCardAccordion
                    label="Guided steps"
                    items={stepItems}
                    allowsMultipleExpanded
                    isSkeleton={isSkeleton}


                />
            ) : null}
            {showOutputs ? (
                <SurfaceCardList
                    label="Expected outputs"
                    items={outputItems}
                    isSkeleton={isSkeleton}


                />
            ) : null}
            {showHint ? (
                <SurfaceCard
                    label="Hint"
                    isSkeleton={isSkeleton}


                    body={() =>
                        isSkeleton
                            ? <Typography size="sm" isSkeleton classNames={["w-3/4"]} />
                            : markdownBody(trimmedHint)
                    }
                />
            ) : null}
        </>
    )

    return (
        <StackV gap={6} isSkeleton={isSkeleton} items={[() => sections]} />
    )
}

export { ChallengeBrief }
