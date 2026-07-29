import React from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon, CircleIcon, GearSixIcon, XCircleIcon } from "@phosphor-icons/react"
import type { IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { SurfaceCard, SurfaceCardAccordion, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
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
 * ⭐ THE STATUS ICON LIVES INSIDE `title` (composed JSX), not a slot of its own.
 * `SurfaceCard.Accordion`'s `SurfaceCardAccordionItem` has exactly two text
 * slots — `title` (leading, truncates) and `titleEnd` (trailing, before the
 * caret) — with no separate "leading icon" prop. The real screen needs BOTH an
 * icon before the title AND a score after it, so the icon rides inside the
 * `title` node the block builds, exactly as `SurfaceCardAccordionItem.title`'s
 * own type (`ReactNode`) allows. The icon carries its OWN status colour
 * (muted/success/danger) independent of the title text, which is why it is
 * built here rather than through `Typography`'s `prefixIcon` — that slot forces
 * the icon to the text's `currentColor`, which would recolour "1. Viết API" red
 * along with the icon on a failed row.
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

/** How serious one piece of structured feedback is. */
export type ChallengeDeliverableFeedbackSeverity = "low" | "medium" | "high"

/** One line of AI feedback on a graded attempt. */
export interface ChallengeDeliverableFeedback {
    /** Stable React key. */
    id: string
    /** How serious this finding is. */
    severity: ChallengeDeliverableFeedbackSeverity
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

/** Status → leading icon + its OWN colour, independent of the title text. */
const STATUS_ICON: Record<ChallengeDeliverableStatus, IconComponent> = {
    todo: CircleIcon,
    done: CheckCircleIcon,
    failed: XCircleIcon,
}

const STATUS_ICON_CLASS: Record<ChallengeDeliverableStatus, string> = {
    todo: "text-muted",
    done: "text-success",
    failed: "text-danger",
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
const SEVERITY_MAP: Partial<Record<ChallengeDeliverableFeedbackSeverity, EnumChipEntry>> = {
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
        <Typography
            size="xs"
            color="accent"
            weight="medium"
            tabularNums
            text={`${item.points} điểm`}
            anatPart={showAnatomy ? "Typography" : undefined}
        />
    )

/**
 * Leading trigger slot: status icon (its own colour) + "index. title" (the
 * text that truncates). Built here rather than through `Typography.prefixIcon`
 * so the icon's colour stays independent of the title (see file header).
 *
 * Laid out with `StackH` (§13z: hand-rolled `flex`/`gap-*` above the layout
 * tier is a gate violation) — `gap="tight"` since the icon is a MARK attached
 * to the title, not a peer beside it.
 */
const triggerTitle = (item: ChallengeDeliverableItem, index: number, showAnatomy: boolean) => {
    const StatusIcon = STATUS_ICON[item.status]
    return (
        <StackH gap="tight" className="min-w-0" anatPart={showAnatomy ? "StackH" : undefined}>
            <StatusIcon aria-hidden focusable="false" className={cn("size-4 shrink-0", STATUS_ICON_CLASS[item.status])} />
            {/* Through `Typography` (not a raw `<span>`) so `` `code` `` segments in `item.title`
                get the same accordion-safe inline-code treatment `ChallengeBrief` gets — a
                hand-rolled span bypasses that atom entirely (§9c: chữ qua Typography). */}
            <Typography size="sm" truncate parseInlineCode text={`${index + 1}. ${item.title}`} className="min-w-0" />
        </StackH>
    )
}

/** One requirement's panel: description → URL field → actions → the graded result once it exists. */
const deliverableBody = (item: ChallengeDeliverableItem, showAnatomy: boolean) => (
    <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
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
        title: triggerTitle(item, index, showAnatomy),
        titleEnd: scoreEnd(item, showAnatomy),
        body: deliverableBody(item, showAnatomy),
    }))

    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard
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
                isSkeleton={isSkeleton}
                anatPart={showAnatomy ? "SurfaceCard" : undefined}
            >
                <SurfaceCardAccordion
                    variant="nested"
                    items={accordionItems}
                    defaultExpandedKeys={firstOpenId != null ? new Set([firstOpenId]) : undefined}
                    isSkeleton={isSkeleton}
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
                />
            </SurfaceCard>
        </div>
    )
}

export { ChallengeDeliverableList }
