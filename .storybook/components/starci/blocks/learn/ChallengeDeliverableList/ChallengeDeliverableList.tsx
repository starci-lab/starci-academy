import React from "react"
import { GearSixIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { SurfaceCardAccordion, markIcon, type ListMark, type MarkTone, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Callout, type CalloutStatus } from "@sb-components/composites/feedback/Callout/Callout"
import { Disclosure } from "@sb-components/composites/layout/Disclosure/Disclosure"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ScoreValue } from "@sb-components/composites/text/ScoreValue/ScoreValue"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ChallengeDeliverableList`: the "Submit" card — one accordion row per
 * challenge requirement, each row's trigger a live status, and its panel the
 * submission form plus, once graded, the verdict and the reasons behind it.
 *
 * ⭐ THIS RUN EXISTS BECAUSE A SIBLING BLOCK REBUILT A COMPOSITE FROM A BARE ATOM
 * (see `ContentModeNav`'s own file header). The lesson here: `src`'s
 * `ChallengeSubmissionPanel` hand-rolls its accordion straight on HeroUI's
 * `Accordion` — three separate files (`ChallengeSubmissionPanel` /
 * `SubmissionRow` / `LastAttemptResult`) reconstructing a shell this design
 * system already owns as `SurfaceCard.Accordion`. This block reaches for that
 * composite instead, and folds all three `src` files into ONE component, because
 * none of them draws its own outer card face — they all share the single
 * "deliverable row" shape.
 *
 * ⭐ ONE COMPONENT, NOT TWO. `src` splits the ungraded form (`SubmissionRow`) from
 * the graded result (`LastAttemptResult`) into sibling files that always render
 * together. `QuizQuestion` already answers this exact shape with ONE component
 * toggling on `verdict` — a deliverable toggles the same way on `graded`, so it
 * gets the same treatment: the graded block is a STATE inside this leaf, not a
 * second leaf and not a second component.
 *
 * ⭐ THE STATUS ICON RIDES `titleStart`, `title` STAYS PLAIN TEXT (teacher's call
 * 2026-07-29, markdown-tier-rules.html: a title is never richtext). The icon
 * needs its OWN status colour (muted/success/danger) independent of the title
 * text — `Typography`'s `prefixIcon` would force it to the text's `currentColor`,
 * recolouring "1. Write API" red along with the icon on a failed row — so it goes
 * through `titleStart` (a leading slot beside `titleEnd`, both OUTSIDE
 * `Typography`) instead of composing custom JSX into `title` itself.
 *
 * ⭐ POINTS BECOMES SCORE, NEVER BOTH. Before an attempt the trailing slot reads
 * "N points" — what the row is worth. Once `graded` lands it switches to
 * "earned/required" — what was actually scored. Showing both at once would ask
 * the learner to do the subtraction themselves; the row already knows the
 * answer.
 *
 * ⭐ SCOPE CUT (§B3, deliberate this pass): `onOpenGradingSettings` is CHROME
 * ONLY — a trigger in the card header. `src`'s `GradeModelDropdown` +
 * `GradeCreditCaption` (the grading-lane picker, quota caption, premium
 * upsell) are a whole settings surface of their own and do not fit this pass;
 * wiring only the open affordance and leaving the drawer's content as a gap is
 * the honest state here, not a stub panel that renders nothing real.
 *
 * ⭐ AUTO-EXPAND MIRRORS THE REAL SCREEN: the first requirement that has not
 * PASSED opens by default (`status !== "done"`), so a returning learner lands
 * on the thing they still owe rather than requirement #1 every time.
 *
 * ⛔ NO EMPTY-STATE LEAF. `items` is always at least one requirement in every
 * real screen this feeds — a challenge with zero deliverables is not a shape
 * the domain produces, so no `emptyState` is wired into `SurfaceCard.Accordion`
 * here (§14d.3: building a case no screen asks for).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Where one requirement stands. */
export type ChallengeDeliverableStatus = "todo" | "done" | "failed"

/** How the last graded attempt on a requirement came out. */
export type ChallengeDeliverableVerdict = "pass" | "fail"

/**
 * The last graded attempt's result for one requirement.
 *
 * ⭐ NO ITEMIZED FINDINGS HERE (teacher's call 2026-07-30, round-13: "here only
 * shortFeedback is enough"). This type used to carry
 * `feedback?: Array<ChallengeDeliverableFeedbackItem>` — message + severity +
 * location + suggestion per finding — and the panel rendered every one of them
 * inline. Measured against the real DB (`docker exec starci-postgres psql`): an
 * attempt can carry up to EIGHT findings × 3 text fields, so rendering them here
 * buried the submission form under two dozen lines. The itemized list belongs to
 * the dedicated result surface (`src`'s `SubmissionResult`, reachable from the
 * "View History" action right above); this panel keeps only the one-line summary.
 */
export interface ChallengeDeliverableGrade {
    /** Pass/fail for this requirement's last attempt. */
    verdict: ChallengeDeliverableVerdict
    /** Score actually earned. */
    earnedScore: number
    /** Score needed to pass. */
    requiredScore: number
    /**
     * Which numbered attempt this grade came from (1-based) — the learner may
     * have submitted more than once. GROUND TRUTH: backend
     * `UserChallengeSubmissionAttemptEntity.attemptNumber` (AUDIT 2026-07-30,
     * feedback ChallengePage/Graded round-11 — real field, not rendered yet).
     */
    attemptNumber?: number
    /**
     * When this attempt was graded, PRE-FORMATTED for display — this block
     * does not own date/locale formatting, the caller does (§14d.1, same
     * boundary as every other display string in this file). GROUND TRUTH:
     * `UserChallengeSubmissionAttemptEntity.processedAt`.
     */
    processedAt?: string
    /**
     * One-line take on the WHOLE attempt — the ONLY feedback this panel shows
     * (see the type doc above on why the itemized findings live elsewhere).
     * GROUND TRUTH: backend `UserChallengeSubmissionAttemptEntity.shortFeedback`
     * (AUDIT 2026-07-30, round-9). Measured on 111 real attempt rows: this
     * column is filled on ALL of them, never null — so in practice the panel
     * always has something to reveal. Still optional in the type: a grading run
     * that failed mid-way could leave it empty, and the panel must not break.
     */
    shortFeedback?: string
}

/**
 * Where this row's GRADING JOB stands. Grading runs in the BACKGROUND (the submit
 * mutation returns a `jobId`, the screen subscribes to a socket), so a row must be
 * able to say "queued / grading / done / failed" while nothing else about it
 * changed yet.
 *
 * GROUND TRUTH: backend `JobStatus` (`src/modules/types/enums/job-status.ts`) —
 * all four members, spelled the same. Omit the prop when no job is in flight.
 * AUDIT 2026-07-30 (round-15): before this version the block only had `isPending`
 * (boolean), enough to lock the input field but UNABLE to express three of the
 * four branches — `.artifacts/domain/challenge-and-milestone.md` §3 lists both
 * "grading in progress" and "grading failed" as states that MUST BE DRAWN, and
 * the drawing was missing them.
 */
export type ChallengeDeliverableJobStatus = "queued" | "processing" | "completed" | "failed"

/** One challenge requirement and its submission form. */
export interface ChallengeDeliverableItem {
    /** Stable id — also the accordion's expand key. */
    id: string
    /** Requirement title. */
    title: string
    /** Max score this requirement is worth. */
    points: number
    /** Where this requirement stands right now. */
    status: ChallengeDeliverableStatus
    /** What the requirement is asking for, as markdown. */
    description?: string
    /** The submission URL as typed so far. */
    url: string
    /** Validation message for the URL field. Set → the field shows invalid. */
    urlError?: string
    /** Fired as the learner types the submission URL. */
    onUrlChange: (value: string) => void
    /** Fired to submit this requirement's URL for grading. */
    onSubmit: () => void
    /** `true` → this requirement's grading job is in flight. */
    isPending?: boolean
    /**
     * Where this row's background grading job stands — drives the status callout
     * between the URL field and the action row. Omit when no job is running.
     */
    jobStatus?: ChallengeDeliverableJobStatus
    /**
     * Raw server error for a `failed` job, shown as a third line under the
     * callout's description. GROUND TRUTH: `activeJobError` in `src`'s
     * `ChallengeSubmissionPanel` is a plain UNTRANSLATED string straight off
     * `jobStatusByJobId[id].data.error` — so the block prints it as-is and never
     * pretends to localise it. Ignored unless `jobStatus` is `"failed"`.
     */
    jobError?: string
    /** Fired to open this requirement's attempt history. */
    onViewHistory: () => void
    /** The last graded attempt. Present → the panel shows the verdict + feedback. */
    graded?: ChallengeDeliverableGrade
}

/**
 * Where the URL autosave stands — a PANEL-WIDE fact, not a per-row one.
 *
 * GROUND TRUTH: `src`'s `ChallengeSubmissionPanel` (`AutosaveStatus` in
 * `hooks/rhf/useEditSubmissionForm.ts`) debounces every row's URL into ONE batch
 * sync, so one status covers the whole panel and the line renders ABOVE the
 * accordion, not inside a row. `"idle"` is deliberately NOT a member here: the
 * real panel renders nothing at all in that case, so "no line" is expressed by
 * omitting the prop rather than by a member that means "draw nothing".
 */
export type ChallengeDeliverableAutosaveStatus = "saving" | "saved" | "failed"

/** Props for {@link ChallengeDeliverableList}. */
export interface ChallengeDeliverableListProps {
    /** The challenge's requirements, in display order. */
    items: Array<ChallengeDeliverableItem>
    /**
     * Autosave state of the URL fields, shown as one quiet line above the list.
     * Omit while idle — see {@link ChallengeDeliverableAutosaveStatus}.
     */
    autosaveStatus?: ChallengeDeliverableAutosaveStatus
    /**
     * Fired when the learner opens the grading-lane settings from the card
     * header. Chrome trigger only this pass — see the file header's scope cut.
     */
    onOpenGradingSettings: () => void
    /** `true` → the card draws its own mirror while the requirements load. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * Status → the SAME icon-per-status mapping `SurfaceCard.CrossList` already owns
 * (teacher's call 2026-07-29): a "not decided yet / passed / failed" row is the same
 * shape as that composite's check/cross mark, missing only the neutral pending
 * case — extended there (`ListMark`/`MarkTone` gained `"pending"`/`"neutral"`)
 * rather than hand-rolled a second time here. `failed` passes `tone="danger"`
 * explicitly because `markIcon`'s own default for `cross` is `"muted"` (an
 * EXCLUDED row, not a FAILED one) — this block's `cross` always means failed.
 */
const STATUS_MARK: Record<ChallengeDeliverableStatus, ListMark> = {
    todo: "pending",
    done: "check",
    failed: "cross",
}
const STATUS_TONE: Record<ChallengeDeliverableStatus, MarkTone | undefined> = {
    todo: undefined,
    done: undefined,
    failed: "danger",
}

/**
 * Verdict wording — the block's own (§4: a caller passes `"pass" | "fail"`, never a string).
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-2): `fail` gets a leading
 * icon (`EnumChipIcon`'s closed "check"/"cross" set, not a raw component — same
 * fix as `ChallengeHeader.STATUS_MAP.failed`). `pass` stays text-only for now.
 */
const VERDICT_MAP: Partial<Record<ChallengeDeliverableVerdict, EnumChipEntry>> = {
    pass: { color: "success", label: "Passed" },
    fail: { color: "danger", label: "Not yet passed", icon: "cross" },
}

/**
 * Job status → content of the grading-status strip (`Callout`).
 *
 * Wording matches the `aiProcessing.submitChallenge.*` set in
 * `src/messages/vi.json` EXACTLY — never recomposed, since this is the exact
 * copy the learner already reads in the real app.
 *
 * `status` follows the same tone `AIProcessingText` uses: both in-flight
 * branches are WARNING (nothing wrong yet, just not done), `completed` is
 * SUCCESS, `failed` is DANGER. `accent` is not used for any branch — accent is
 * the brand's active-state pink, not a status tone (`matrix.md` §11).
 *
 * ⭐ DELIBERATELY DOES NOT port `AIProcessingText`'s rotating conic-gradient
 * border. That is `src`'s own IMPLEMENTATION detail (a `motion.div` gradient
 * spinning over 2.8s), not a shape this system has a slot for — porting it
 * would be exactly Trap 3 of `.claude/fe/boundary.md` (copying behaviour/
 * structure is fine, copying raw values/effects is not). This system's own
 * face for "a note with a tone living inside a face" is `Callout`, and that is
 * what is used here.
 */
const JOB_STATUS_CALLOUT: Record<
    ChallengeDeliverableJobStatus,
    { status: CalloutStatus, title: string, description: string }
> = {
    queued: {
        status: "warning",
        title: "Queued for processing",
        description: "Your submission is in the queue and will be processed shortly.",
    },
    processing: {
        status: "warning",
        title: "StarCI AI is grading your submission",
        description: "StarCI AI is analyzing your submission. Please wait a moment.",
    },
    completed: {
        status: "success",
        title: "Grading complete",
        description: "Your submission has been graded. You can view the result now.",
    },
    failed: {
        status: "danger",
        title: "Grading failed",
        description: "An error occurred while grading. Please try again.",
    },
}

/**
 * Autosave status → one quiet line above the list.
 *
 * Wording matches `autosave.*` in `src/messages/vi.json` exactly. Colour:
 * `failed` is DANGER, the other two are MUTED — `src` uses `text-default-500`
 * for the ordinary branch, i.e. a raw Tailwind class; here it goes through the
 * `Typography` atom's `color` (`muted`) instead of porting the raw class,
 * per Trap 3 of `boundary.md`.
 */
const AUTOSAVE_LABEL: Record<ChallengeDeliverableAutosaveStatus, string> = {
    saving: "Saving…",
    saved: "Saved",
    failed: "Save failed",
}

/**
 * Trailing trigger slot: points before an attempt, earned/required once
 * graded — never both.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1): removed
 * `color="muted"` from the graded branch — same reasoning as `ScoreValue.tsx`:
 * a number sitting right on an active `Accordion.Trigger` and carrying real
 * information ⇒ `default`, not `muted`. See `.artifacts/feedback/
 * 2026-07-29-challengepage-graded/round-1.md`.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-7, "why don't these
 * 4 green ones share the same size"): added `weight="medium"` — without it
 * this branch falls back to the atom's default `font-normal`, while
 * `ScoreValue` (the branch below it, AND the same info-type "score" in
 * `ChallengeBrief`'s Requirements) is always `weight="medium"`. Same
 * `size="xs"` but a different weight reads as a different font size —
 * resynced so the same info-type shares one typeface treatment (§2d).
 */
const scoreEnd = (item: ChallengeDeliverableItem, showAnatomy: boolean) =>
    item.graded != null ? (
        <Typography
            size="xs"
            weight="medium"
            tabularNums
            text={`${item.graded.earnedScore}/${item.graded.requiredScore}`}
            showAnatomy={showAnatomy}
        />
    ) : (
        <ScoreValue points={item.points} anatPart={showAnatomy ? "ScoreValue" : undefined} />
    )

/**
 * Leading trigger icon: status icon, its OWN colour, independent of the title
 * text — rides `titleStart`, not composed into `title` itself (see file header).
 * Delegates the actual icon+tone to `SurfaceCard`'s `markIcon` (see `STATUS_MARK`).
 */
const triggerIcon = (item: ChallengeDeliverableItem, showAnatomy: boolean) =>
    markIcon(STATUS_MARK[item.status], STATUS_TONE[item.status], showAnatomy ? "StatusIcon" : undefined)

/** One requirement's panel: description → URL field → actions → the graded result once it exists. */
const deliverableBody = (item: ChallengeDeliverableItem, showAnatomy: boolean) => {
    // AUDIT 2026-07-30 round-14 (teacher's call after a pushback): dropped `justify="end"` —
    // everything else in the panel (description, URL field, verdict chip, "Latest feedback"
    // trigger) hugs the left edge, only this button row drifted right so it read like it
    // belonged to a different block. NOT using `flex-1`: the `src` anchor (`SubmissionRow`:
    // primary `shrink-0` + secondary `min-w-0 flex-1`) makes the SECONDARY button wider than
    // the PRIMARY one — inverted visual weight, teacher's call to drop it. Both buttons hug
    // their own text, neither stretches.
    const actions = (
        <>
            <Button
                label="Submit"
                variant="primary"
                onPress={item.onSubmit}
                isDisabled={item.url.trim().length === 0}
                isPending={item.isPending}
                showAnatomy={showAnatomy}
            />
            <Button
                label="View History"
                variant="secondary"
                onPress={item.onViewHistory}
                showAnatomy={showAnatomy}
            />
        </>
    )

    // Graded is a STATE of this same leaf (mirrors QuizQuestion's `verdict` toggle),
    // never a second component — see file header.
    //
    // SHAPE SETTLED 2026-07-30 (feedback ChallengePage/Graded, rounds 8→13). Two lines
    // only, and the trimming is the whole story:
    // · ONE meta row always shows — verdict Chip + "attempt #N · HH:mm dd/MM"
    //   (`attemptNumber`/`processedAt`, a real field, confirmed living in Postgres via
    //   `docker exec starci-postgres psql`).
    // · ONE `Disclosure` "Latest feedback" → opens onto `shortFeedback`, one sentence.
    //
    // DROPPED on the way to this shape (recorded so nobody rebuilds them):
    // · The sentence "Your latest attempt scored N/M. Minimum required: R." — N/M already
    //   sits in the accordion row's own `titleEnd` right above (see `scoreEnd`) and the chip
    //   already answers "passed or not"; that sentence restated the same fact across two
    //   lines of text (round-13).
    // · A per-line finding list (severity dot + message + location + suggestion) — measured
    //   against the real DB: one attempt can carry up to EIGHT findings × 3 fields, so
    //   building it here buried the submission form under two dozen lines. The detail
    //   belongs to the dedicated result page (`src`'s `SubmissionResult`), reached from the
    //   "View History" button right above (teacher's call: "here only shortFeedback is
    //   enough").
    // · A recursive accordion / colour-coded severity text + `|` separators (round 4-7) —
    //   built before there was a real anchor for it.
    //
    // `Disclosure` here is a PRESENTATION decision, not an invented field: the content
    // inside is still exactly one real field, just placed behind a click because it's
    // secondary detail (teacher's call, round-10, held through round-13).
    const gradedSection = item.graded != null ? (
        <StackV
            gap={4}
            anatPart={showAnatomy ? "StackV" : undefined}
            body={
                <>
                    {/* AUDIT 2026-07-30 round-13 (teacher: "the green section is too busy", settled
                        on option B): ONE single meta row — verdict chip + "attempt #N · HH:mm dd/MM"
                        — instead of three stacked layers like before. DROPPED entirely the sentence
                        "Your latest attempt scored N/M. Minimum required: R.": the N/M figure already
                        sits in the accordion row's own `titleEnd` right above (see `scoreEnd`), and
                        the chip already answers "passed or not" — that sentence restated the same
                        fact a second time across both lines. `earnedScore`/`requiredScore` are STILL
                        real fields and still render, just in exactly ONE place. */}
                    <StackH
                        gap={3}
                        align="center"
                        wrap
                        anatPart={showAnatomy ? "StackH" : undefined}
                        body={
                            <>
                                <EnumChip value={item.graded.verdict} map={VERDICT_MAP} anatPart={showAnatomy ? "EnumChip" : undefined} />
                                {item.graded.attemptNumber != null ? (
                                    <Typography
                                        size="xs"
                                        color="muted"
                                        text={item.graded.processedAt != null
                                            ? `attempt #${item.graded.attemptNumber} · ${item.graded.processedAt}`
                                            : `attempt #${item.graded.attemptNumber}`}
                                        showAnatomy={showAnatomy}
                                    />
                                ) : null}
                            </>
                        }
                    />

                    {item.graded.shortFeedback != null ? (
                        <Disclosure
                            title="Latest feedback"
                            showAnatomy={showAnatomy}
                            body={() => (
                                <Typography size="sm" text={item.graded?.shortFeedback} showAnatomy={showAnatomy} />
                            )}
                        />
                    ) : null}
                </>
            }
        />
    ) : null

    const panel = (
        <>
            {item.description != null ? (
                <MarkdownContent source={item.description} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />
            ) : null}

            <InputText
                variant="secondary"
                value={item.url}
                onValueChange={item.onUrlChange}
                errorMessage={item.urlError}
                placeholder="https://github.com/…"
                ariaLabel={`Submission URL — ${item.title}`}
                isDisabled={item.isPending}
                showAnatomy={showAnatomy}
            />

            {/* Grading-status strip — BETWEEN the URL field and the button row, the exact spot
                `src`'s `SubmissionRow` places `AIProcessingText` (lines 173-195: after
                `TextField`, before `GradeModelDropdown`). AUDIT 2026-07-30 round-15: this state
                is listed in `.artifacts/domain/challenge-and-milestone.md` §3 as MUST BE DRAWN
                ("grading in progress" + "grading failed") and the drawing was missing them —
                only `isPending` locked the input, unable to say which branch it was in.
                `jobError` prints RAW (untranslated) because `src` also prints it raw: it's a
                server error string, not a sentence meant for a reader. */}
            {item.jobStatus != null ? (
                <Callout
                    status={JOB_STATUS_CALLOUT[item.jobStatus].status}
                    title={JOB_STATUS_CALLOUT[item.jobStatus].title}
                    description={JOB_STATUS_CALLOUT[item.jobStatus].description}
                    body={item.jobStatus === "failed" && item.jobError != null
                        ? <Typography size="xs" color="danger" text={item.jobError} showAnatomy={showAnatomy} />
                        : undefined}
                    anatPart={showAnatomy ? "Callout" : undefined}
                    showAnatomy={showAnatomy}
                />
            ) : null}

            <StackH gap={3} anatPart={showAnatomy ? "StackH" : undefined} body={actions} />

            {gradedSection}
        </>
    )

    return <StackV gap={4} anatPart={showAnatomy ? "StackV" : undefined} body={panel} />
}

/**
 * The "Submit" card. See the file header for the full contract.
 *
 * @param props - {@link ChallengeDeliverableListProps}
 */
const ChallengeDeliverableList = ({
    items,
    autosaveStatus,
    onOpenGradingSettings,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ChallengeDeliverableListProps) => {
    // The first requirement that has not PASSED opens by default, so a returning
    // learner lands on what they still owe instead of requirement #1 every time.
    const firstOpenId = items.find((item) => item.status !== "done")?.id

    const accordionItems: Array<SurfaceCardAccordionItem> = items.map((item, index) => ({
        id: item.id,
        titleStart: triggerIcon(item, showAnatomy),
        title: `${index + 1}. ${item.title}`,
        titleEnd: scoreEnd(item, showAnatomy),
        body: deliverableBody(item, showAnatomy),
    }))

    // ONE surface, not two (teacher's call 2026-07-29): the accordion IS the card's entire
    // content — nothing else sits inside "Submit" beside it — so it draws its own
    // top-level frame directly (`label`/`action` are its own header slots) instead of
    // a `SurfaceCard` wrapping a `variant="nested"` child. Surface-in-surface is only
    // for a part that stays SMALL relative to a parent holding other things too;
    // nesting a border around content that already equals the whole parent just
    // draws the same outline twice.
    // The autosave line sits ABOVE the accordion, the exact spot `src`'s
    // `ChallengeSubmissionPanel` places it (lines 388-398: the panel wrapper's first
    // child, right before `<Accordion>`) — it's a fact of the WHOLE PANEL (one sync pass
    // batching every URL field), so it can't be part of a single row.
    // Does not go through the header's `labelEnd` even though that slot looks like it
    // might fit: `action` (the gear button) WINS over `labelEnd` in
    // `surface-card-header.tsx:90-104`, so the label would never render.
    const listBody = (
        <>
            {autosaveStatus != null ? (
                <Typography
                    size="xs"
                    color={autosaveStatus === "failed" ? "danger" : "muted"}
                    text={AUTOSAVE_LABEL[autosaveStatus]}
                    showAnatomy={showAnatomy}
                />
            ) : null}
            <SurfaceCardAccordion
                label="Submit"
                action={() => (
                    <Button
                        isIconOnly
                        prefixIcon={GearSixIcon}
                        ariaLabel="Grading settings"
                        variant="tertiary"
                        size="sm"
                        onPress={onOpenGradingSettings}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                    />
                )}
                items={accordionItems}
                defaultExpandedKeys={firstOpenId != null ? new Set([firstOpenId]) : undefined}
                isSkeleton={isSkeleton}
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
            />
        </>
    )

    return (
        <StackV gap={3} anatPart={anatPart} showAnatomy={showAnatomy} body={listBody} />
    )
}

export { ChallengeDeliverableList }
