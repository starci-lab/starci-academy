import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { MagnifyingGlassIcon, PushPinIcon, SealCheckIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Pagination } from "@sb-components/atoms/navigation/Pagination/Pagination"
import {
    AsyncContent,
    type AsyncContentEmptyProps,
    type AsyncContentErrorProps,
} from "@sb-components/composites/async/AsyncContent/AsyncContent"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV, StackH } from "@sb-components/frames/Stack/Stack"
import { Cluster, type ClusterItem } from "@sb-components/frames/Cluster/Cluster"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `CourseQaQuestionList`: the course-wide Q&A ROLL-UP region — the
 * async lifecycle (loading → error → search-empty → content) wrapped around a
 * flush divide-y list of questions plus a pager. Port of `src`'s
 * `CourseQa/index.tsx` list region (§E/§F of that file) + its own
 * `CourseQaSkeleton.tsx`.
 *
 * REUSE, NOT A NEW SHAPE (the exact mistake this task exists to avoid — see
 * `ContentModeNav`'s file header):
 *   • `AsyncContent` (composite) — owns the error → loading → empty → content
 *     switch. This block does not track "which message am I showing" itself.
 *   • `SurfaceCardList` (composite) — the bounded flush divide-y card. Its OWN
 *     `isSkeleton` mirror is a GENERIC 3-line row (leading/title/subtitle) —
 *     wrong shape for this list (avatar + 2 text bars + chip-pill row + status
 *     dot). So this block never sets `SurfaceCardList`'s `isSkeleton`; instead
 *     it hands BOTH the loading branch and the content branch their rows via
 *     the free-form `items[].content` slot, and owns the mirror shape itself
 *     (ported verbatim from `CourseQaSkeleton.tsx`) — see judgement call ★1.
 *   • `Pagination` (atom) — the page nav, verbatim.
 *   • `Avatar` / `Chip` / `Typography` (atoms), `StackV` / `StackH` / `Cluster`
 *     (frames) — the row's own composition, nothing hand-rolled beyond them
 *     except the status dot (★3).
 *
 * ⚠️ GAP — `QaQuestionThread` DOES NOT EXIST YET (★2). The task's compose-from
 * list names a `QaQuestionThread` block for the per-question row (collapsed
 * social-inbox row that expands into the full conversation — the real `src`
 * sibling is `QuestionRow`, which composes `QaInboxRow` + `QaConversationHeader`
 * + `QaMessageBubble` + a reply `Composer`). Verified ABSENT from this pass via
 * `Glob`/`Grep` across both `components/**` and `stories/**` (2026-07-28,
 * repeated 3× over the course of this build while sibling `CourseQa*` blocks
 * kept landing around it — it never appeared). Per SCOPE DISCIPLINE (§B3): the
 * chrome around it is built here IN FULL (async switch, own skeleton mirror,
 * flush list surface, pager) and the missing per-question piece is a CLEARLY
 * MARKED, HONEST placeholder (`QuestionPreviewRow` below) — real atoms
 * rendering real question data in the COLLAPSED look only, no expand/reply
 * behaviour invented for it — rather than either (a) silently faking the full
 * conversation experience, or (b) guessing `QaQuestionThread`'s prop contract
 * and importing a module that does not resolve (which would red-gate `tsc` on
 * THIS file for a dependency this task was told not to build). The moment
 * `QaQuestionThread` lands, swap `<QuestionPreviewRow .../>` for
 * `<QaQuestionThread question={…} currentUserId={…} currentUser={…}
 * onAnswered={…} />` in `questionItem()` below and delete `QuestionPreviewRow`
 * — the props this block already threads through (`currentUserId`,
 * `currentUser`, `onAnswered`) are exactly `QuestionRow`'s real contract, so
 * the swap is one function body, not a prop-surface change.
 *
 * 📐 LEAF BOUNDARY — four leaves, per the task brief (NOT the R0 default of
 * folding empty into content, which is `FoundationResourceList`'s call for a
 * DATA-driven `resources.length === 0`): here "empty" means specifically
 * "the current filter/search matched nothing", a caller-decided FILTER STATE
 * this list has no visibility into (the true zero-questions-ever case is a
 * SEPARATE screen-level concern already owned by the existing `CourseQaInvite`
 * block, one layer up) — closer to a caller-flipped switch than to R0's "0 is
 * just data" example, hence its own leaf rather than a state of `Content`.
 *
 * ⭐ JUDGEMENT CALLS:
 * ★1 — the loading branch's rows are NOT `SurfaceCardList`'s own mirror; they
 *   are this block's own `SkeletonQuestionRow`, handed in via `items[].content`
 *   so `SurfaceCardList` only ever supplies the flush divide-y card shell, in
 *   BOTH branches. This is why `SurfaceCardList.isSkeleton` is never set.
 * ★2 — see the GAP note above for the full reasoning behind `QuestionPreviewRow`.
 * ★3 — the status dot (answered=success / unanswered=warning) has no home atom
 *   anywhere in this system; it is hand-rolled at this tier exactly as the real
 *   `CourseQaSkeleton.tsx`/`QaInboxRow` do it at their own tier — parity, not a
 *   new pattern. Its SKELETON twin reaches for `HeroSkeleton` directly (no
 *   atom to flow `isSkeleton` into either), the same escape hatch the
 *   `Pagination` ATOM itself uses for its own placeholder squares.
 * ★4 — `pagerAriaLabel` names a `<nav>` WRAPPING `Pagination`, not a prop ON
 *   it — the `Pagination` atom hard-codes its own `aria-label` (§4: it owns
 *   its a11y strings) and does not expose one to override. Wrapping is the
 *   least-invasive way to still give the region a caller-chosen accessible name.
 * ★5 — `isSkeleton` is DISTINCT from `isLoading`: `isLoading` is this list's
 *   own fetch flag (feeds `AsyncContent` directly); `isSkeleton` is an EXTERNAL
 *   override — a parent's own `isSkeleton` flowing down, or a story pinning the
 *   Loading leaf without wiring a fetch flag — that also routes to the Loading
 *   branch. Both is-a's converge on one `AsyncContent.isLoading` computation
 *   rather than opening a second, competing branch.
 * ★6 — the asker's own question is labelled "Bạn" instead of their real name
 *   (mirrors `QuestionRow`'s `isMineQuestion`), the one piece of `currentUserId`
 *   the placeholder DOES use — everything else `currentUserId`/`currentUser`/
 *   `onAnswered` carry is pure pass-through for the future `QaQuestionThread`
 *   swap (★2), not consumed by `QuestionPreviewRow`.
 * ★7 — the chip-pill row keeps exactly ONE `Chip` (status — the axis worth
 *   scanning the whole list for) per row; the scope tag rides as plain muted
 *   text beside it instead of a second chip (`eslint-plugin-starci-fe`'s
 *   `no-adjacent-chip`: "≥2 chip kề nhau — giữ 1 chip, phần còn lại text +
 *   icon inline"). The real `src` sibling (`QaInboxRow`) uses two chips; this
 *   port deliberately diverges to honor THIS Storybook's own enforcement gate.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One asker — plain data, the row builds the avatar + name from it. */
export interface CourseQaQuestionAuthor {
    /** Stable id — used to detect "this is the viewer's own question". */
    id: string
    /** Display name (or username fallback), already resolved by the caller. */
    displayName: string
    /** Avatar image; absent → the atom's own generated/initials fallback chain. */
    avatarUrl?: string
}

/** Where a question was asked — drives the scope chip's own label (§14d.1). */
export type CourseQaQuestionScope =
    | { kind: "lesson", lessonTitle: string }
    | { kind: "general" }

/** One question row — plain DATA; the block builds the wording/chips/dot. */
export interface CourseQaQuestionItem {
    /** Stable id — the React key, and how "own question" is detected. */
    id: string
    /** Who asked it. */
    author: CourseQaQuestionAuthor
    /** Already-formatted relative time, e.g. "2 giờ trước" (no i18n layer at this tier). */
    createdTimeAgo: string
    /** `true` → a pin glyph rides beside the asker's name. */
    isPinned?: boolean
    /** `true` → a founder-verified glyph rides beside the asker's name. */
    isFounderAuthor?: boolean
    /** One/two-line preview of the question body. */
    preview: string
    /** Which lesson (or "chung khóa") this question belongs to. */
    scope: CourseQaQuestionScope
    /** How many answers this question has. `0` ⇒ unanswered. */
    replyCount: number
    /** `true` → the (at least one) answer came from the course founder. */
    answeredByFounder?: boolean
}

/** The signed-in viewer's own identity — threaded through for the `QaQuestionThread` swap (★2/★6). */
export interface CourseQaCurrentUser {
    username: string
    avatar?: string
}

/** Props for {@link CourseQaQuestionList}. */
export interface CourseQaQuestionListProps {
    /** The current page's questions, in display order. */
    questions: ReadonlyArray<CourseQaQuestionItem>
    /** `true` while this list's own fetch is in flight (feeds the Loading leaf). */
    isLoading: boolean
    /** Truthy → the fetch failed (feeds the Error leaf, outranks loading/empty). */
    error?: unknown
    /** Retry the failed fetch. Omit → the error message carries no action. */
    onRetry?: () => void
    /** 1-based current page. */
    page: number
    /** Total page count. */
    totalPages: number
    /** Fired with the 1-based page the viewer picked. */
    onPageChange: (page: number) => void
    /** Signed-in viewer's id (drives the "Bạn" swap, ★6); `null` when signed out. */
    currentUserId: string | null
    /** Signed-in viewer's identity — pass-through for the `QaQuestionThread` swap (★2). */
    currentUser: CourseQaCurrentUser | null
    /** Fired after an answer is posted/edited/deleted — pass-through for the `QaQuestionThread` swap (★2). */
    onAnswered?: () => void
    /** Accessible name for the pager region (★4). */
    pagerAriaLabel: string
    /** External skeleton override, distinct from `isLoading` (★5). */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** How many placeholder rows mirror the list while the first page loads — matches `CourseQaSkeleton.tsx`. */
const SKELETON_ROW_COUNT = 4

const ERROR_TITLE = "Không tải được danh sách câu hỏi"
const RETRY_LABEL = "Thử lại"
const EMPTY_TITLE = "Không có câu hỏi nào khớp bộ lọc hiện tại"
const EMPTY_DESCRIPTION = "Thử đổi bộ lọc hoặc từ khoá tìm kiếm khác."

/** The block's own scope→label vocabulary (§14d.1) — never handed in pre-formatted. */
const scopeLabel = (scope: CourseQaQuestionScope): string =>
    scope.kind === "lesson" ? `Bài: ${scope.lessonTitle}` : "Chung"

/** The block's own status→label vocabulary (§14d.1). */
const statusLabel = (replyCount: number, answeredByFounder?: boolean): string => {
    if (replyCount <= 0) {
        return "Chưa trả lời"
    }
    return answeredByFounder ? "Người hướng dẫn đã trả lời" : "Đã trả lời"
}

/** Props for the local {@link SkeletonQuestionRow}. */
interface SkeletonQuestionRowProps {
    showAnatomy: boolean
}

/**
 * One placeholder row for the Loading branch — avatar + 2 text bars +
 * chip-pill row + status dot, ported verbatim from the real
 * `CourseQaSkeleton.tsx` shape (★1).
 *
 * `align="start"` on the outer row (instead of the real file's `mt-2` on the
 * dot) top-aligns all three children without a child pushing its own margin
 * (§10a — the padding gate only allows a parent's `gap`/surface `padding` to
 * own a seam).
 */
const SkeletonQuestionRow = ({ showAnatomy }: SkeletonQuestionRowProps) => (
    <StackH gap="grouped" align="start" anatPart={showAnatomy ? "StackH" : undefined}>
        {/* Avatar has no `anatPart` of its own — the row wraps it, same convention `SurfaceCard.PressableGroup`'s own skeleton tile uses. */}
        <div className="shrink-0" data-anat-part={showAnatomy ? "Avatar" : undefined}>
            <Avatar isSkeleton size="sm" showAnatomy={showAnatomy} />
        </div>
        <StackV gap="tight" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackV" : undefined}>
            {/* asker + time line */}
            <Typography size="xs" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
            {/* two-line preview */}
            <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
                <Typography size="sm" isSkeleton classNames={["w-full"]} anatPart={showAnatomy ? "Typography" : undefined} />
                <Typography size="sm" isSkeleton classNames={["w-2/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
            </StackV>
            {/* chip-pill row — ONE chip (status, the classification axis) + the scope
                as a plain shimmer bar, matching the real row's own text-inline treatment
                (eslint `starci-fe/no-adjacent-chip`, ★7 below). */}
            <StackH gap="related" anatPart={showAnatomy ? "StackH" : undefined}>
                <Typography size="xs" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} />
            </StackH>
        </StackV>
        {/* status dot — no home atom (★3), same escape hatch `Pagination` uses for its own shimmer squares */}
        <HeroSkeleton className="size-2 shrink-0 rounded-full" />
    </StackH>
)

/** Props for the local {@link QuestionPreviewRow}. */
interface QuestionPreviewRowProps {
    question: CourseQaQuestionItem
    currentUserId: string | null
    showAnatomy: boolean
}

/**
 * TEMPORARY GAP STAND-IN for the not-yet-built `QaQuestionThread` block — see
 * the file header's GAP note (★2). Renders the COLLAPSED look only (real data,
 * real atoms), no expand/reply behaviour: pressing does nothing, because
 * inventing a fake "open the thread" affordance here would be worse than
 * honestly having none yet.
 */
const QuestionPreviewRow = ({ question, currentUserId, showAnatomy }: QuestionPreviewRowProps) => {
    const isMine = currentUserId != null && currentUserId === question.author.id
    const isAnswered = question.replyCount > 0
    const askerName = isMine ? "Bạn" : question.author.displayName

    // ONE chip for the row's classification axis (status — the thing worth scanning
    // the list for); the scope rides as plain muted text beside it instead of a
    // second chip (eslint `starci-fe/no-adjacent-chip`, ★7).
    const chips: Array<ClusterItem> = [
        {
            key: "scope",
            content: <Typography size="xs" color="muted" text={scopeLabel(question.scope)} anatPart={showAnatomy ? "Typography" : undefined} />,
        },
        {
            key: "status",
            content: (
                <Chip
                    tone={isAnswered ? "success" : "default"}
                    text={statusLabel(question.replyCount, question.answeredByFounder)}
                    anatPart={showAnatomy ? "Chip" : undefined}
                />
            ),
        },
    ]
    if (isAnswered) {
        // no icon here — §5a.2: a chat-bubble needs an ASSOCIATION step to read as
        // "replies" (not a universal symbol like ✓/🔒), and the text already carries
        // the fact on its own (same fix already applied to QaQuestionThread/QaConversationHeader).
        chips.push({
            key: "replyCount",
            content: (
                <Typography size="xs" color="muted" text={`${question.replyCount} phản hồi`} anatPart={showAnatomy ? "Typography" : undefined} />
            ),
        })
    }

    return (
        <StackH gap="grouped" align="start" anatPart={showAnatomy ? "StackH" : undefined}>
            {/* Avatar has no `anatPart` of its own — the row wraps it (same convention as the skeleton twin above). */}
            <div className="shrink-0" data-anat-part={showAnatomy ? "Avatar" : undefined}>
                <Avatar
                    src={question.author.avatarUrl}
                    name={question.author.displayName}
                    seed={question.author.id}
                    size="sm"
                    showAnatomy={showAnatomy}
                />
            </div>
            <StackV gap="tight" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackV" : undefined}>
                <StackH gap="tight" anatPart={showAnatomy ? "StackH" : undefined}>
                    {question.isPinned ? (
                        <PushPinIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                    ) : null}
                    <Typography size="xs" weight="medium" text={askerName} anatPart={showAnatomy ? "Typography" : undefined} />
                    {question.isFounderAuthor ? (
                        <SealCheckIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                    ) : null}
                    <Typography size="xs" color="muted" text={`· ${question.createdTimeAgo}`} anatPart={showAnatomy ? "Typography" : undefined} />
                </StackH>
                <Typography size="sm" lineClamp={2} text={question.preview} anatPart={showAnatomy ? "Typography" : undefined} />
                <Cluster gap="related" items={chips} anatPart={showAnatomy ? "Cluster" : undefined} />
            </StackV>
            <span
                aria-hidden
                className={`size-2 shrink-0 rounded-full ${isAnswered ? "bg-success" : "bg-warning"}`}
            />
        </StackH>
    )
}

/** The Loading branch's rows — see ★1 for why these are NOT `SurfaceCardList.isSkeleton`. */
const skeletonItems = (showAnatomy: boolean): Array<SurfaceCardListItem> =>
    Array.from({ length: SKELETON_ROW_COUNT }, (_unused, index) => ({
        key: `skeleton-${index}`,
        content: <SkeletonQuestionRow showAnatomy={showAnatomy} />,
    }))

/** The Content branch's real rows — each a {@link QuestionPreviewRow} (★2 gap stand-in). */
const questionItems = (
    questions: ReadonlyArray<CourseQaQuestionItem>,
    currentUserId: string | null,
    showAnatomy: boolean,
): Array<SurfaceCardListItem> =>
    questions.map((question) => ({
        key: question.id,
        content: <QuestionPreviewRow question={question} currentUserId={currentUserId} showAnatomy={showAnatomy} />,
    }))

/**
 * The course-wide Q&A roll-up list. See the file header for the full contract,
 * the GAP note on `QaQuestionThread` (★2), and the remaining judgement calls.
 *
 * @param props - {@link CourseQaQuestionListProps}
 */
const CourseQaQuestionList = ({
    questions,
    isLoading,
    error,
    onRetry,
    page,
    totalPages,
    onPageChange,
    currentUserId,
    currentUser,
    onAnswered,
    pagerAriaLabel,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: CourseQaQuestionListProps) => {
    // `currentUser`/`onAnswered` are pure pass-through for the future `QaQuestionThread`
    // swap (★2/GAP) — `QuestionPreviewRow` (today's stand-in) does not consume them.
    void currentUser
    void onAnswered

    const emptyContent: AsyncContentEmptyProps = {
        icon: MagnifyingGlassIcon,
        title: EMPTY_TITLE,
        description: EMPTY_DESCRIPTION,
        anatPart: showAnatomy ? "AsyncContentEmpty" : undefined,
        showAnatomy,
    }

    const errorContent: AsyncContentErrorProps = {
        title: ERROR_TITLE,
        onRetry,
        retryLabel: RETRY_LABEL,
        anatPart: showAnatomy ? "AsyncContentError" : undefined,
        showAnatomy,
    }

    return (
        <div data-anat-part={anatPart}>
            <AsyncContent
                // ★5 — an external override (`isSkeleton`) converges on the same Loading
                // branch as the list's own fetch flag (`isLoading`).
                isLoading={isSkeleton || isLoading}
                skeleton={
                    <SurfaceCardList
                        items={skeletonItems(showAnatomy)}
                        anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                    />
                }
                isEmpty={questions.length === 0}
                emptyContent={emptyContent}
                error={error}
                errorContent={errorContent}
                showAnatomy={showAnatomy}
                content={
                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                        <SurfaceCardList
                            items={questionItems(questions, currentUserId, showAnatomy)}
                            anatPart={showAnatomy ? "SurfaceCardList" : undefined}
                        />
                        {totalPages > 1 ? (
                            // ★4 — `Pagination` hard-codes its own aria-label; a wrapping
                            // <nav> is how the caller's `pagerAriaLabel` still names the region.
                            <nav aria-label={pagerAriaLabel} data-anat-part={showAnatomy ? "Pagination" : undefined}>
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={onPageChange}
                                    showAnatomy={showAnatomy}
                                />
                            </nav>
                        ) : null}
                    </StackV>
                }
            />
        </div>
    )
}

export { CourseQaQuestionList }
