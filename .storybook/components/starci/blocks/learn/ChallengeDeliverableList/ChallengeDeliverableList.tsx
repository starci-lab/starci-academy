import React from "react"
import { GearSixIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { SurfaceCardAccordion, markIcon, type ListMark, type MarkTone, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ScoreValue } from "@sb-components/composites/text/ScoreValue/ScoreValue"
import { type SubmissionFeedbackSeverity } from "@sb-components/starci/blocks/learn/SubmissionFindingsList/SubmissionFindingsList"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ChallengeDeliverableList`: the "Nộp bài" card — one accordion row per
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
 * ⭐ THE STATUS ICON RIDES `titleStart`, `title` STAYS PLAIN TEXT (thầy chốt
 * 2026-07-29, markdown-tier-rules.html: a title is never richtext). The icon
 * needs its OWN status colour (muted/success/danger) independent of the title
 * text — `Typography`'s `prefixIcon` would force it to the text's `currentColor`,
 * recolouring "1. Viết API" red along with the icon on a failed row — so it goes
 * through `titleStart` (a leading slot beside `titleEnd`, both OUTSIDE
 * `Typography`) instead of composing custom JSX into `title` itself.
 *
 * ⭐ POINTS BECOMES SCORE, NEVER BOTH. Before an attempt the trailing slot reads
 * "N điểm" — what the row is worth. Once `graded` lands it switches to
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
 * One line of AI feedback on a graded attempt. `severity` reuses
 * {@link SubmissionFeedbackSeverity} — "how serious one piece of AI-grading
 * feedback is" is the SAME concept `SubmissionFindingsList` already owns for
 * the personal-project grading flow, not a second vocabulary for this one
 * (thầy chốt 2026-07-29: gần giống thì áp dụng lại pattern, không xây mới).
 */
export interface ChallengeDeliverableFeedback {
    /** Stable React key. */
    id: string
    /** How serious this finding is. */
    severity: SubmissionFeedbackSeverity
    /** What the grader found. */
    message: string
    /** Where in the submission this applies, e.g. a file/line — shown monospace. */
    location?: string
    /** How to fix it. */
    suggestion?: string
}

/** The last graded attempt's result for one requirement. */
export interface ChallengeDeliverableGrade {
    /** Pass/fail for this requirement's last attempt. */
    verdict: ChallengeDeliverableVerdict
    /** Score actually earned. */
    earnedScore: number
    /** Score needed to pass. */
    requiredScore: number
    /** Structured findings behind the verdict, in report order. */
    feedback?: Array<ChallengeDeliverableFeedback>
}

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
    /** Fired to open this requirement's attempt history. */
    onViewHistory: () => void
    /** The last graded attempt. Present → the panel shows the verdict + feedback. */
    graded?: ChallengeDeliverableGrade
}

/** Props for {@link ChallengeDeliverableList}. */
export interface ChallengeDeliverableListProps {
    /** The challenge's requirements, in display order. */
    items: Array<ChallengeDeliverableItem>
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
 * (thầy chốt 2026-07-29): a "not decided yet / passed / failed" row is the same
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

/** Verdict wording — the block's own (§4: a caller passes `"pass" | "fail"`, never a string). */
const VERDICT_MAP: Partial<Record<ChallengeDeliverableVerdict, EnumChipEntry>> = {
    pass: { color: "success", label: "Đạt" },
    fail: { color: "danger", label: "Chưa đạt" },
}

/**
 * Severity wording. `low` reads as neutral rather than "info" — `EnumChip`'s
 * colour set has no info tone, and a neutral chip still reads as the mildest of
 * the three without inventing a colour outside the system.
 */
const SEVERITY_MAP: Partial<Record<SubmissionFeedbackSeverity, EnumChipEntry>> = {
    high: { color: "danger", label: "Nghiêm trọng" },
    medium: { color: "warning", label: "Cần sửa" },
    low: { color: "default", label: "Gợi ý" },
}

/** Trailing trigger slot: points before an attempt, earned/required once graded — never both. */
const scoreEnd = (item: ChallengeDeliverableItem, showAnatomy: boolean) =>
    item.graded != null ? (
        <Typography
            size="xs"
            color="muted"
            tabularNums
            text={`${item.graded.earnedScore}/${item.graded.requiredScore}`}
            anatPart={showAnatomy ? "Typography" : undefined}
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
const deliverableBody = (item: ChallengeDeliverableItem, showAnatomy: boolean) => (
    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
        {item.description != null ? (
            <MarkdownContent source={item.description} measure="compact" anatPart={showAnatomy ? "MarkdownContent" : undefined} />
        ) : null}

        <InputText
            variant="secondary"
            value={item.url}
            onValueChange={item.onUrlChange}
            errorMessage={item.urlError}
            placeholder="https://github.com/…"
            ariaLabel={`URL nộp bài — ${item.title}`}
            isDisabled={item.isPending}
            showAnatomy={showAnatomy}
        />

        <StackH gap="related" justify="end" anatPart={showAnatomy ? "StackH" : undefined}>
            <Button
                label="Nộp bài"
                variant="primary"
                onPress={item.onSubmit}
                isDisabled={item.url.trim().length === 0}
                isPending={item.isPending}
                anatPart={showAnatomy ? "Button" : undefined}
            />
            <Button
                label="Xem lịch sử"
                variant="secondary"
                onPress={item.onViewHistory}
                anatPart={showAnatomy ? "Button" : undefined}
            />
        </StackH>

        {/* Graded is a STATE of this same leaf (mirrors QuizQuestion's `verdict` toggle),
            never a second component — see file header. */}
        {item.graded != null ? (
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                <StackH gap="related" align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                    <EnumChip value={item.graded.verdict} map={VERDICT_MAP} anatPart={showAnatomy ? "EnumChip" : undefined} />
                    <Typography
                        size="xs"
                        color="muted"
                        tabularNums
                        text={`${item.graded.earnedScore}/${item.graded.requiredScore} điểm`}
                        anatPart={showAnatomy ? "Typography" : undefined}
                    />
                </StackH>

                {item.graded.feedback != null && item.graded.feedback.length > 0 ? (
                    <StackV gap="related" anatPart={showAnatomy ? "StackV" : undefined}>
                        <Typography size="xs" weight="medium" color="muted" text="Phản hồi" anatPart={showAnatomy ? "Typography" : undefined} />
                        {item.graded.feedback.map((entry) => (
                            <StackH key={entry.id} gap="related" align="start" anatPart={showAnatomy ? "StackH" : undefined}>
                                <EnumChip value={entry.severity} map={SEVERITY_MAP} anatPart={showAnatomy ? "EnumChip" : undefined} />
                                <StackV gap="flush" anatPart={showAnatomy ? "StackV" : undefined}>
                                    <Typography size="xs" text={entry.message} anatPart={showAnatomy ? "Typography" : undefined} />
                                    {entry.location != null ? (
                                        <Typography size="xs" color="muted" className="font-mono" text={entry.location} anatPart={showAnatomy ? "Typography" : undefined} />
                                    ) : null}
                                    {entry.suggestion != null ? (
                                        <Typography size="xs" color="muted" text={`Gợi ý: ${entry.suggestion}`} anatPart={showAnatomy ? "Typography" : undefined} />
                                    ) : null}
                                </StackV>
                            </StackH>
                        ))}
                    </StackV>
                ) : null}
            </StackV>
        ) : null}
    </StackV>
)

/**
 * The "Nộp bài" card. See the file header for the full contract.
 *
 * @param props - {@link ChallengeDeliverableListProps}
 */
const ChallengeDeliverableList = ({
    items,
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

    // ONE surface, not two (thầy chốt 2026-07-29): the accordion IS the card's entire
    // content — nothing else sits inside "Nộp bài" beside it — so it draws its own
    // top-level frame directly (`label`/`action` are its own header slots) instead of
    // a `SurfaceCard` wrapping a `variant="nested"` child. Surface-in-surface is only
    // for a part that stays SMALL relative to a parent holding other things too;
    // nesting a border around content that already equals the whole parent just
    // draws the same outline twice.
    return (
        <SurfaceCardAccordion
            label="Nộp bài"
            action={
                <Button
                    isIconOnly
                    prefixIcon={GearSixIcon}
                    ariaLabel="Cài đặt chấm điểm"
                    variant="tertiary"
                    size="sm"
                    onPress={onOpenGradingSettings}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "Button" : undefined}
                />
            }
            items={accordionItems}
            defaultExpandedKeys={firstOpenId != null ? new Set([firstOpenId]) : undefined}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            anatPart={anatPart}
        />
    )
}

export { ChallengeDeliverableList }
