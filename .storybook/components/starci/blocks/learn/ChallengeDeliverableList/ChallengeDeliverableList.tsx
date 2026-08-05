import React from "react"
import { GearSixIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { SurfaceCardAccordion, markIcon, type ListMark, type MarkTone, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Callout, type CalloutStatus } from "@sb-components/composites/feedback/Callout/Callout"
import { Disclosure } from "@sb-components/composites/layout/Disclosure/Disclosure"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ScoreValue } from "@sb-components/composites/text/ScoreValue/ScoreValue"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `ChallengeDeliverableList` — the "Submit assignment" card: one
 * `SurfaceCard.Accordion` row per challenge requirement, its trigger a live
 * status, its panel the submission form plus, once graded, the verdict and its
 * reasons. `graded` toggles a state inside the same leaf. How many requirements,
 * which are graded, and whether a submission is mid-flight are all data.
 */

/** Where one requirement stands. */
export type ChallengeDeliverableStatus = "todo" | "done" | "failed"

/** How the last graded attempt on a requirement came out. */
export type ChallengeDeliverableVerdict = "pass" | "fail"

/**
 * The last graded attempt's result for one requirement.
 *
 * NO ITEMIZED FINDINGS HERE — only `shortFeedback`. An attempt can carry up to
 * EIGHT findings × 3 text fields, so rendering them here would bury the
 * submission form under two dozen lines. The itemized list belongs to the
 * dedicated result surface (`src`'s `SubmissionResult`, reachable from the
 * "View History" action right above); this panel keeps only the one-line
 * summary.
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
     * `UserChallengeSubmissionAttemptEntity.attemptNumber`.
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
     * GROUND TRUTH: backend `UserChallengeSubmissionAttemptEntity.shortFeedback`.
     * In practice this column is filled on every attempt, but it stays optional
     * in the type: a grading run that failed mid-way could leave it empty, and
     * the panel must not break.
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
}

/**
 * Status → the SAME icon-per-status mapping `SurfaceCard.CrossList` already owns:
 * a "not decided yet / passed / failed" row is the same shape as that composite's
 * check/cross mark, missing only the neutral pending case — extended there
 * (`ListMark`/`MarkTone` gained `"pending"`/`"neutral"`) rather than hand-rolled a
 * second time here. `failed` passes `tone="danger"` explicitly because `markIcon`'s
 * own default for `cross` is `"muted"` (an EXCLUDED row, not a FAILED one) — this
 * block's `cross` always means failed.
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
 * Verdict wording — the block's own (a caller passes `"pass" | "fail"`, never a string).
 *
 * `fail` gets a leading icon (`EnumChipIcon`'s closed "check"/"cross" set, not a raw
 * component — same as `ChallengeHeader.STATUS_MAP.failed`). `pass` stays text-only.
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
 * The graded branch is `default`, not `muted`: a number sitting right on an active
 * `Accordion.Trigger` and carrying real information reads as `default` (same
 * reasoning as `ScoreValue.tsx`).
 *
 * `weight="medium"` is explicit — without it this branch falls back to the atom's
 * default `font-normal`, while `ScoreValue` (the branch below it, AND the same
 * info-type "score" in `ChallengeBrief`'s Requirements) is always `weight="medium"`.
 * Same `size="xs"` but a different weight reads as a different font size — kept in
 * sync so the same info-type shares one typeface treatment.
 */
const scoreEnd = (item: ChallengeDeliverableItem) =>
    item.graded != null ? (
        <Typography
            size="xs"
            weight="medium"
            tabularNums
            text={`${item.graded.earnedScore}/${item.graded.requiredScore}`}

        />
    ) : (
        <ScoreValue points={item.points} />
    )

/**
 * Leading trigger icon: status icon, its OWN colour, independent of the title
 * text — rides `titleStart`, not composed into `title` itself (see file header).
 * Delegates the actual icon+tone to `SurfaceCard`'s `markIcon` (see `STATUS_MARK`).
 */
const triggerIcon = (item: ChallengeDeliverableItem) =>
    markIcon(STATUS_MARK[item.status], STATUS_TONE[item.status])

/** One requirement's panel: description → URL field → actions → the graded result once it exists. */
const deliverableBody = (item: ChallengeDeliverableItem) => {
    // No `justify="end"` — everything else in the panel (description, URL field, verdict
    // chip, "Latest feedback" trigger) hugs the left edge, so this button row hugs it too
    // rather than drifting right and reading like a different block. NOT using `flex-1`:
    // the `src` anchor (`SubmissionRow`: primary `shrink-0` + secondary `min-w-0 flex-1`)
    // makes the SECONDARY button wider than the PRIMARY one — inverted visual weight. Both
    // buttons hug their own text, neither stretches.
    const actions = (
        <>
            <Button
                label="Submit"
                variant="primary"
                onPress={item.onSubmit}
                isDisabled={item.url.trim().length === 0}
                isPending={item.isPending}

            />
            <Button
                label="View History"
                variant="secondary"
                onPress={item.onViewHistory}

            />
        </>
    )

    // Graded is a STATE of this same leaf (mirrors QuizQuestion's `verdict` toggle),
    // never a second component — see file header.
    //
    // Two lines only:
    // · ONE meta row always shows — verdict Chip + "attempt #N · HH:mm dd/MM"
    //   (`attemptNumber`/`processedAt`, real fields).
    // · ONE `Disclosure` "Latest feedback" → opens onto `shortFeedback`, one sentence.
    //
    // Not shown here: the full "scored N/M, minimum required R" sentence (N/M already
    //   sits in the accordion row's own `titleEnd` right above — see `scoreEnd` — and the
    //   chip already answers "passed or not"), and the per-line finding list (one attempt
    //   can carry up to EIGHT findings × 3 fields, which would bury the submission form;
    //   that detail belongs to the dedicated result page, `src`'s `SubmissionResult`,
    //   reached from the "View History" button right above).
    //
    // `Disclosure` here is a PRESENTATION decision, not an invented field: the content
    // inside is still exactly one real field, just placed behind a click because it's
    // secondary detail.
    const graded = item.graded
    const gradedSection = graded != null ? (
        <StackV
            gap={4}
            principles={["card-caption"]}
            items={[
                /* ONE single meta row — verdict chip + "attempt #N · HH:mm dd/MM" — rather than
                    three stacked layers. No "Your latest attempt scored N/M. Minimum required: R."
                    sentence: the N/M figure already sits in the accordion row's own `titleEnd`
                    right above (see `scoreEnd`), and the chip already answers "passed or not" —
                    that sentence would restate the same fact a second time across both lines.
                    `earnedScore`/`requiredScore` are real fields and render, just in exactly ONE
                    place. */
                () => (
                    <StackH
                        gap={3}
                        principles={["identity"]}
                        align="center"
                        at="sm"

                        items={[
                            () => <EnumChip value={graded.verdict} map={VERDICT_MAP} />,
                            ...(graded.attemptNumber != null ? [() => (
                                <Typography
                                    size="xs"
                                    color="muted"
                                    text={graded.processedAt != null
                                        ? `attempt #${graded.attemptNumber} · ${graded.processedAt}`
                                        : `attempt #${graded.attemptNumber}`}

                                />
                            )] : []),
                        ]}
                    />
                ),
                ...(graded.shortFeedback != null ? [() => (
                    <Disclosure
                        title="Latest feedback"

                        body={() => (
                            <Typography size="sm" text={graded.shortFeedback} />
                        )}
                    />
                )] : []),
            ]}
        />
    ) : null

    const panel = (
        <>
            {item.description != null ? (
                <MarkdownContent source={item.description} measure="compact" />
            ) : null}

            <InputText
                variant="secondary"
                value={item.url}
                onValueChange={item.onUrlChange}
                errorMessage={item.urlError}
                placeholder="https://github.com/…"
                ariaLabel={`Submission URL — ${item.title}`}
                isDisabled={item.isPending}

            />

            {/* Grading-status strip — BETWEEN the URL field and the button row, the exact spot
                `src`'s `SubmissionRow` places `AIProcessingText` (lines 173-195: after
                `TextField`, before `GradeModelDropdown`). This surfaces the "grading in
                progress" / "grading failed" states; `isPending` alone only locks the input
                and can't say which branch it's in. `jobError` prints RAW (untranslated)
                because `src` also prints it raw: it's a server error string, not a sentence
                meant for a reader. */}
            {item.jobStatus != null ? (
                <Callout
                    status={JOB_STATUS_CALLOUT[item.jobStatus].status}
                    title={JOB_STATUS_CALLOUT[item.jobStatus].title}
                    description={JOB_STATUS_CALLOUT[item.jobStatus].description}
                    body={item.jobStatus === "failed" && item.jobError != null
                        ? () => <Typography size="xs" color="danger" text={item.jobError} />
                        : undefined}


                />
            ) : null}

            <StackH gap={3} items={[() => actions]} />

            {gradedSection}
        </>
    )

    return <StackV gap={4} items={[() => panel]} />
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
}: ChallengeDeliverableListProps) => {
    // The first requirement that has not PASSED opens by default, so a returning
    // learner lands on what they still owe instead of requirement #1 every time.
    const firstOpenId = items.find((item) => item.status !== "done")?.id

    const accordionItems: Array<SurfaceCardAccordionItem> = items.map((item, index) => ({
        id: item.id,
        titleStart: () => triggerIcon(item),
        title: `${index + 1}. ${item.title}`,
        titleEnd: () => scoreEnd(item),
        body: () => deliverableBody(item),
    }))

    // ONE surface, not two: the accordion IS the card's entire content — nothing else
    // sits inside "Submit" beside it — so it draws its own top-level frame directly
    // (`label`/`action` are its own header slots) instead of a `SurfaceCard` wrapping a
    // `variant="nested"` child. Surface-in-surface is only for a part that stays SMALL
    // relative to a parent holding other things too; nesting a border around content
    // that already equals the whole parent just draws the same outline twice.
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

                    />
                )}
                items={accordionItems}
                defaultExpandedKeys={firstOpenId != null ? new Set([firstOpenId]) : undefined}
                isSkeleton={isSkeleton}


            />
        </>
    )

    return (
        <StackV gap={3} isSkeleton={isSkeleton} items={[() => listBody]} />
    )
}

export { ChallengeDeliverableList }
