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
 * REUSE, NOT REBUILD (per this run's mandate). `src`'s five sections are two
 * shapes, already ported into `SurfaceCard`:
 *   - prerequisites / expected outputs / hint → `SurfaceCardList` free-form rows
 *     (was `CheckListCard`/`CheckListItem` — `showCheck=false` for prerequisites,
 *     `showCheck=true` for outputs). `SurfaceCardList`'s FIXED row shape has no
 *     "leading check icon" slot, so these sections go through `item.content`
 *     (free-form) and this block builds the row body itself: prerequisites =
 *     plain stripped text, outputs = a leading `CheckCircleIcon` + text, hint =
 *     one markdown paragraph.
 *   - requirements / guided steps → `SurfaceCardAccordion` (was
 *     `LabeledAccordionCard`), `titleEnd` carrying the per-requirement
 *     `ScoreValue` (accent text, never a chip — §2a: a point count is a
 *     free-form scalar, not an enum/status/badge), steps numbered `"1. …"` by
 *     this block (the caller never hands over
 *     a pre-numbered string, per §14d.1 — it hands `title?` and an index, this
 *     block composes the sentence).
 *
 * ⭐ HINT WAS THE THIRD SHAPE, until round-12 collapsed it into the first. It
 * used to be a bare `SurfaceCardAccordion` (no `label`, one item titled "Hint"
 * with a lightbulb in `titleStart`), a faithful port of `src`'s un-labelled hint
 * accordion. The teacher finalized (2026-07-30): a labelled card like its four siblings, no
 * icon, content always visible — see the `hintItems` comment for the full why.
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
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
        body={
            <>
                <CheckCircleIcon
                    aria-hidden
                    focusable="false"

                    className="size-5 shrink-0 text-success-soft-foreground"
                />
                <Typography size="sm" text={stripMarkdown(body)} />
            </>
        }
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

    // AUDIT 2026-07-30 (feedback ChallengePage/Graded round-3, teacher's final call): prerequisites/
    // outputs render PLAIN TEXT, not through markdown — this reverses the round-2 decision (which
    // once matched `src/ChallengeView` to keep inline-code). The backend content-authoring schema
    // (`.claude/docs/rules/fullstack/challenges.md` §3: "outputs/prerequisites are lang+TEXT only")
    // names its field quite differently from requirements/steps (lang+title+BODY, which allows
    // markdown/callout `:::muted`) — "text" vs "body" is a DELIBERATE boundary at the content
    // tier, not an arbitrary one. `.storybook` is the blueprint, and gets to lead `src` whenever
    // the teacher finalizes a revised decision. `stripMarkdown` guards at the render boundary:
    // content authors may still habitually type backtick/bold, but the rendered text must come
    // out completely clean — not just a different render mechanism, but the literal characters too.
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
            ? <ScoreValue points={item.points} />
            : undefined,
        body: markdownBody(item.body),
    }))

    const stepItems: Array<SurfaceCardAccordionItem> = (steps ?? []).map((item, index) => ({
        id: item.key,
        // The block owns this sentence (§14d.1) — the caller hands an optional headline
        // plus its position via array order, never a pre-numbered string.
        title: `${index + 1}. ${item.title || `Step ${index + 1}`}`,
        body: markdownBody(item.body),
    }))

    // AUDIT 2026-07-30 (feedback ChallengePage/Graded round-12, teacher's final call: "the hint should
    // render as a SurfaceCard with a label, drop the lightbulb icon" then "why is this a
    // SurfaceCardList instead of rendering a SurfaceCard and just putting the text in? it doesn't
    // need to be a list"): SHAPE CHANGED ENTIRELY, in two passes.
    //
    // Before: bare `SurfaceCardAccordion` (no `label`), a single item carrying the title "Hint" +
    // a lightbulb icon in `titleStart` — a straight port of `src`'s un-labelled hint accordion.
    // Now: a BARE `SurfaceCard`, `label="Hint"`, with content as ONE markdown paragraph as `children`.
    //
    // Why NOT an accordion: keeping the accordion and adding `label="Hint"` would show the word
    // "Hint" TWICE (the card's header + the sole item's trigger) — an accordion item is forced
    // to carry a title, it can't be left blank. The outer label already states what this is, so
    // the show/hide behaviour loses its reason to exist.
    //
    // Why NOT `SurfaceCardList` (the second fix pass, caught by the teacher): a hint is ONE
    // paragraph, not a list — an `items` array whose length is always 1 gets the data shape
    // wrong from the start, dragging along a meaningless row-divider and `key`. A bare
    // `SurfaceCard` takes `children` directly, matching the real amount of content.
    //
    // The lightbulb icon was dropped per the teacher's direction: `label` is now a card header
    // just like "Requirements"/"Expected outputs" — peer labels where only one carries an icon
    // is an inconsistent rhythm, and the word "Hint" alone already carries enough meaning
    // (icon §2a: only a universally recognised symbol earns its own glyph, not a plain-prose label).

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
        <StackV gap={6} body={sections} />
    )
}

export { ChallengeBrief }
