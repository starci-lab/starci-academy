import React from "react"
import { GearSixIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EnumChip, type EnumChipEntry } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { SurfaceCardAccordion, markIcon, type ListMark, type MarkTone, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { FeedbackCallout, type FeedbackCalloutStatus } from "@sb-components/composites/feedback/Feedback/Feedback"
import { Disclosure } from "@sb-components/composites/layout/Disclosure/Disclosure"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { ScoreValue } from "@sb-components/composites/text/ScoreValue/ScoreValue"
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
 * The last graded attempt's result for one requirement.
 *
 * ⭐ NO ITEMIZED FINDINGS HERE (thầy chốt 2026-07-30, round-13: "ở đây thì
 * shortFeedback thôi là được"). This type used to carry
 * `feedback?: Array<ChallengeDeliverableFeedbackItem>` — message + severity +
 * location + suggestion per finding — and the panel rendered every one of them
 * inline. Measured against the real DB (`docker exec starci-postgres psql`): an
 * attempt can carry up to EIGHT findings × 3 text fields, so rendering them here
 * buried the submission form under two dozen lines. The itemized list belongs to
 * the dedicated result surface (`src`'s `SubmissionResult`, reachable from the
 * "Xem lịch sử" action right above); this panel keeps only the one-line summary.
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
 * able to say "đang chờ / đang chấm / xong / thất bại" while nothing else about it
 * changed yet.
 *
 * GROUND TRUTH: backend `JobStatus` (`src/modules/types/enums/job-status.ts`) —
 * all four members, spelled the same. Omit the prop when no job is in flight.
 * AUDIT 2026-07-30 (round-15): trước bản này block chỉ có `isPending` (boolean),
 * đủ để khoá ô nhập nhưng KHÔNG diễn đạt được ba trong bốn ngả — `.artifacts/domain/
 * challenge-and-milestone.md` §3 liệt kê cả "đang chấm" lẫn "chấm lỗi" là state
 * PHẢI VẼ, và bản vẽ đang thiếu.
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

/**
 * Verdict wording — the block's own (§4: a caller passes `"pass" | "fail"`, never a string).
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-2): `fail` gets a leading
 * icon (`EnumChipIcon`'s closed "check"/"cross" set, not a raw component — same
 * fix as `ChallengeHeader.STATUS_MAP.failed`). `pass` stays text-only for now.
 */
const VERDICT_MAP: Partial<Record<ChallengeDeliverableVerdict, EnumChipEntry>> = {
    pass: { color: "success", label: "Đạt" },
    fail: { color: "danger", label: "Chưa đạt", icon: "cross" },
}

/**
 * Job status → nội dung của dải trạng thái chấm bài (`FeedbackCallout`).
 *
 * Chữ lấy ĐÚNG bộ `aiProcessing.submitChallenge.*` của `src/messages/vi.json` —
 * không tự soạn lại câu, vì đây là chữ học viên đã đọc trong app thật.
 *
 * `status` theo đúng sắc thái `AIProcessingText` dùng: hai ngả đang-chạy đều
 * WARNING (chưa có gì sai, chỉ là chưa xong), `completed` SUCCESS, `failed`
 * DANGER. Không dùng `accent` cho ngả nào — accent là hồng active-state của
 * brand, không phải một sắc thái trạng thái (`matrix.md` §11).
 *
 * ⭐ CỐ Ý KHÔNG bê viền conic-gradient xoay của `AIProcessingText` sang. Đó là
 * IMPLEMENTATION riêng của `src` (một `motion.div` gradient quay 2.8s), không
 * phải hình mà hệ này có cửa cho — chép sang là đúng Bẫy 3 của
 * `.claude/fe/boundary.md` (chép hành vi/cấu trúc thì đúng, chép giá trị/hiệu
 * ứng thô thì sai). Mặt của hệ cho ca "ghi chú có sắc thái nằm trong một mặt"
 * là `FeedbackCallout`, và đó là thứ dùng ở đây.
 */
const JOB_STATUS_CALLOUT: Record<
    ChallengeDeliverableJobStatus,
    { status: FeedbackCalloutStatus, title: string, description: string }
> = {
    queued: {
        status: "warning",
        title: "Đang chờ xử lý",
        description: "Bài nộp của bạn đang trong hàng đợi và sẽ được xử lý ngay.",
    },
    processing: {
        status: "warning",
        title: "StarCI AI đang chấm bài",
        description: "StarCI AI đang phân tích bài nộp của bạn. Vui lòng chờ trong giây lát.",
    },
    completed: {
        status: "success",
        title: "Chấm bài hoàn tất",
        description: "Bài nộp đã được chấm xong. Bạn có thể xem kết quả ngay.",
    },
    failed: {
        status: "danger",
        title: "Chấm bài thất bại",
        description: "Đã xảy ra lỗi khi chấm bài. Vui lòng thử lại.",
    },
}

/**
 * Autosave status → một dòng chữ lặng phía trên danh sách.
 *
 * Chữ lấy đúng `autosave.*` của `src/messages/vi.json`. Màu: `failed` là DANGER,
 * hai ngả còn lại MUTED — `src` dùng `text-default-500` cho ngả thường, tức một
 * lớp Tailwind thô; ở đây đi qua `color` của atom `Typography` (`muted`) thay vì
 * bê nguyên class, đúng Bẫy 3 `boundary.md`.
 */
const AUTOSAVE_LABEL: Record<ChallengeDeliverableAutosaveStatus, string> = {
    saving: "Đang lưu…",
    saved: "Đã lưu",
    failed: "Lưu thất bại",
}

/**
 * Trailing trigger slot: points before an attempt, earned/required once
 * graded — never both.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded, round-1): gỡ
 * `color="muted"` khỏi nhánh graded — cùng lý lẽ với `ScoreValue.tsx`, số
 * dính liền `Accordion.Trigger` đang active + mang giá trị thông tin thật
 * ⇒ `default`, không phải `muted`. Xem `.artifacts/feedback/
 * 2026-07-29-challengepage-graded/round-1.md`.
 *
 * ⭐ AUDIT 2026-07-30 (feedback ChallengePage/Graded round-7, "sao 4 cái xanh
 * không cùng size thế"): thêm `weight="medium"` — thiếu nó nhánh này rơi về
 * `font-normal` mặc định của atom trong khi `ScoreValue` (nhánh dưới, VÀ cùng
 * info-type "điểm số" ở `ChallengeBrief`'s Yêu cầu) luôn `weight="medium"`.
 * Cùng `size="xs"` nhưng khác weight đọc như khác cỡ chữ — đồng bộ lại cho
 * đúng info-type dùng chung một kiểu chữ (§2d).
 */
const scoreEnd = (item: ChallengeDeliverableItem, showAnatomy: boolean) =>
    item.graded != null ? (
        <Typography
            size="xs"
            weight="medium"
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

        {/* Dải trạng thái chấm bài — GIỮA ô URL và hàng nút, đúng vị trí `src`'s `SubmissionRow`
            đặt `AIProcessingText` (dòng 173-195: sau `TextField`, trước `GradeModelDropdown`).
            AUDIT 2026-07-30 round-15: state này `.artifacts/domain/challenge-and-milestone.md` §3
            liệt kê là PHẢI VẼ ("đang chấm" + "chấm lỗi") mà bản vẽ thiếu — chỉ có `isPending`
            khoá được ô nhập, không nói được đang ở ngả nào. `jobError` in THÔ (không dịch) vì
            `src` cũng in thô: đó là chuỗi lỗi server, không phải câu cho người đọc. */}
        {item.jobStatus != null ? (
            <FeedbackCallout
                status={JOB_STATUS_CALLOUT[item.jobStatus].status}
                title={JOB_STATUS_CALLOUT[item.jobStatus].title}
                description={JOB_STATUS_CALLOUT[item.jobStatus].description}
                body={item.jobStatus === "failed" && item.jobError != null
                    ? <Typography size="xs" color="danger" text={item.jobError} anatPart={showAnatomy ? "Typography" : undefined} />
                    : undefined}
                anatPart={showAnatomy ? "FeedbackCallout" : undefined}
                showAnatomy={showAnatomy}
            />
        ) : null}

        {/* AUDIT 2026-07-30 round-14 (thầy chốt sau khi em phản biện): bỏ `justify="end"` —
            mọi thứ khác trong panel (description, ô URL, chip verdict, trigger "Phản hồi gần
            nhất") đều bám lề trái, chỉ hàng nút này dạt phải nên đọc như của một khối khác.
            KHÔNG dùng `flex-1`: neo `src` (`SubmissionRow`: primary `shrink-0` + secondary
            `min-w-0 flex-1`) làm nút PHỤ rộng hơn nút CHÍNH — ngược trọng số thị giác, thầy
            chốt bỏ. Cả hai ôm chữ, không nút nào giãn. */}
        <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined}>
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
            never a second component — see file header.

            SHAPE SETTLED 2026-07-30 (feedback ChallengePage/Graded, rounds 8→13). Two lines
            only, and the trimming is the whole story:
            · MỘT hàng meta luôn hiện — verdict Chip + "lần #N · HH:mm dd/MM"
              (`attemptNumber`/`processedAt`, field thật, xác nhận sống trong Postgres qua
              `docker exec starci-postgres psql`).
            · MỘT `Disclosure` "Phản hồi gần nhất" → mở ra `shortFeedback`, một câu.

            Đã BỎ trên đường tới hình này (ghi lại để không ai dựng lại):
            · Câu "Điểm lần thử gần nhất của bạn là N/M. Yêu cầu tối thiểu R." — N/M đã nằm ở
              `titleEnd` của hàng accordion ngay trên đầu (xem `scoreEnd`) và chip đã trả lời
              "đạt hay chưa"; câu đó nói lại cùng một fact bằng hai dòng chữ (round-13).
            · Danh sách finding từng dòng (dot severity + message + location + gợi ý) — đo DB
              thật: một attempt tới TÁM finding × 3 field, dựng ở đây thì form nộp bài bị chôn
              dưới hai chục dòng. Chi tiết thuộc trang kết quả riêng (`src`'s `SubmissionResult`),
              vào từ nút "Xem lịch sử" ngay trên (thầy chốt: "ở đây thì shortFeedback thôi là được").
            · Accordion đệ quy / severity chữ-màu+`|` (round 4-7) — dựng khi chưa có neo thật.

            `Disclosure` ở đây là quyết định TRÌNH BÀY, không phải field bịa: nội dung bên trong
            vẫn đúng một field thật, chỉ nằm sau một cái bấm vì nó là chi tiết phụ (thầy chốt
            round-10, giữ nguyên qua round-13). */}
        {item.graded != null ? (
            <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                {/* AUDIT 2026-07-30 round-13 (thầy: "phần xanh rườm rà quá", chốt phương án B):
                    MỘT hàng meta duy nhất — chip verdict + "lần #N · HH:mm dd/MM" — thay vì ba
                    tầng chồng nhau như trước. Bỏ HẲN câu "Điểm lần thử gần nhất của bạn là N/M.
                    Yêu cầu tối thiểu R.": chính con số N/M đã nằm ở `titleEnd` của hàng accordion
                    ngay trên đầu (xem `scoreEnd`), và chip đã trả lời "đạt hay chưa" — câu văn đó
                    nói lại lần thứ hai cùng một fact bằng cả hai dòng chữ. `earnedScore`/
                    `requiredScore` VẪN là field thật và vẫn render, chỉ ở đúng MỘT chỗ. */}
                <StackH gap="related" align="center" wrap anatPart={showAnatomy ? "StackH" : undefined}>
                    <EnumChip value={item.graded.verdict} map={VERDICT_MAP} anatPart={showAnatomy ? "EnumChip" : undefined} />
                    {item.graded.attemptNumber != null ? (
                        <Typography
                            size="xs"
                            color="muted"
                            text={item.graded.processedAt != null
                                ? `lần #${item.graded.attemptNumber} · ${item.graded.processedAt}`
                                : `lần #${item.graded.attemptNumber}`}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    ) : null}
                </StackH>

                {item.graded.shortFeedback != null ? (
                    <Disclosure title="Phản hồi gần nhất" showAnatomy={showAnatomy}>
                        <Typography size="sm" text={item.graded.shortFeedback} anatPart={showAnatomy ? "Typography" : undefined} />
                    </Disclosure>
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

    // ONE surface, not two (thầy chốt 2026-07-29): the accordion IS the card's entire
    // content — nothing else sits inside "Nộp bài" beside it — so it draws its own
    // top-level frame directly (`label`/`action` are its own header slots) instead of
    // a `SurfaceCard` wrapping a `variant="nested"` child. Surface-in-surface is only
    // for a part that stays SMALL relative to a parent holding other things too;
    // nesting a border around content that already equals the whole parent just
    // draws the same outline twice.
    // Dòng autosave đứng TRÊN accordion, đúng vị trí `src`'s `ChallengeSubmissionPanel`
    // (dòng 388-398: con đầu của panel wrapper, ngay trước `<Accordion>`) — nó là fact của
    // CẢ PANEL (một lượt sync gộp mọi ô URL), nên không thể là part của một hàng.
    // Không đi qua `labelEnd` của header dù chỗ đó nhìn có vẻ hợp: `action` (nút bánh răng)
    // THẮNG `labelEnd` trong `surface-card-header.tsx:90-104`, nên nhãn sẽ không bao giờ render.
    return (
        <StackV gap="related" anatPart={anatPart} showAnatomy={showAnatomy}>
            {autosaveStatus != null ? (
                <Typography
                    size="xs"
                    color={autosaveStatus === "failed" ? "danger" : "muted"}
                    text={AUTOSAVE_LABEL[autosaveStatus]}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ) : null}
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
                anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
            />
        </StackV>
    )
}

export { ChallengeDeliverableList }
