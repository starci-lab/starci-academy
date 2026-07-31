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
 * used to be a bare `SurfaceCardAccordion` (no `label`, one item titled "Gợi ý"
 * with a lightbulb in `titleStart`), a faithful port of `src`'s un-labelled hint
 * accordion. Thầy chốt 2026-07-30: a labelled card like its four siblings, no
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
        content: <Typography size="sm" isSkeleton classNames={["w-3/4"]} />,
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

    // AUDIT 2026-07-30 (feedback ChallengePage/Graded round-3, thầy chốt): prerequisites/
    // outputs render PLAIN TEXT, không qua markdown — đảo lại quyết định round-2 (từng khớp
    // `src/ChallengeView` để giữ inline-code). Backend content-authoring schema
    // (`.claude/docs/rules/fullstack/challenges.md` §3: "outputs/prerequisites chỉ lang+TEXT")
    // đặt tên field khác hẳn requirements/steps (lang+title+BODY, cho phép markdown/callout
    // `:::muted`) — "text" vs "body" là ranh giới CỐ Ý ở tầng content, không phải tuỳ tiện.
    // `.storybook` là bản vẽ, được quyền dẫn trước `src` khi thầy chốt lại một quyết định.
    // `stripMarkdown` chặn ở biên render: content vẫn có thể gõ backtick/bold theo thói quen,
    // chữ hiện ra phải sạch hoàn toàn, không chỉ đổi cơ chế render mà còn ký tự literal.
    const prerequisiteItems: Array<SurfaceCardListItem> = isSkeleton
        ? skeletonListRows(PREREQUISITE_SKELETON_ROWS, "prereq-skeleton")
        : (prerequisites ?? []).map((item) => ({
            key: item.key,
            content: <Typography size="sm" text={stripMarkdown(item.body)} anatPart={showAnatomy ? "Typography" : undefined} />,
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
                    <Typography size="sm" text={stripMarkdown(item.body)} anatPart={showAnatomy ? "Typography" : undefined} />
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

    // AUDIT 2026-07-30 (feedback ChallengePage/Graded round-12, thầy chốt: "gợi ý render dạng
    // SurfaceCard with label, bỏ icon bóng đèn" rồi "sao lại là SurfaceCardList mà không render
    // SurfaceCard và bỏ text vào thôi? nó phải list đâu?"): ĐỔI HẲN HÌNH, hai nhịp.
    //
    // Trước: `SurfaceCardAccordion` bare (không `label`), một item duy nhất mang title "Gợi ý" +
    // icon đèn ở `titleStart` — port nguyên `src`'s un-labelled hint accordion.
    // Nay: `SurfaceCard` TRẦN, `label="Gợi ý"`, nội dung là MỘT đoạn markdown làm `children`.
    //
    // Vì sao KHÔNG accordion: nếu giữ accordion mà thêm `label="Gợi ý"`, chữ "Gợi ý" hiện HAI
    // LẦN (header của card + trigger của item duy nhất) — một item accordion buộc phải có title,
    // không thể để rỗng. Nhãn ngoài đã nói rõ đây là gì, nên hành vi ẩn/hiện mất lý do tồn tại.
    //
    // Vì sao KHÔNG `SurfaceCardList` (nhịp sửa thứ hai, thầy bắt): hint là MỘT đoạn văn, không
    // phải danh sách — một `items` array độ dài luôn bằng 1 là dựng sai khái niệm ngay ở kiểu dữ
    // liệu, kéo theo cả divider-giữa-hàng và `key` vô nghĩa. `SurfaceCard` trần nhận thẳng
    // `children`, đúng số lượng nội dung thật.
    //
    // Icon đèn bỏ theo lời thầy: `label` giờ là header card giống "Yêu cầu"/"Đầu ra mong đợi" —
    // các nhãn cùng cấp mà một cái đeo icon là lệch nhịp, và bản thân chữ "Gợi ý" đã đủ nghĩa
    // (icon §2a: chỉ ký hiệu quốc dân mới xứng một glyph, một nhãn văn xuôi thì không).

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
                <SurfaceCard
                    label="Gợi ý"
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "SurfaceCard" : undefined}
                    showAnatomy={showAnatomy}
                >
                    {isSkeleton
                        ? <Typography size="sm" isSkeleton classNames={["w-3/4"]} />
                        : markdownBody(trimmedHint, showAnatomy)}
                </SurfaceCard>
            ) : null}
        </StackV>
    )
}

export { ChallengeBrief }
