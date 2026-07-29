import React, { useMemo, useState } from "react"
import { cn } from "@heroui/react"
import { PushPinIcon, SealCheckIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"
import { CourseQaComposer } from "@sb-components/starci/blocks/learn/CourseQaComposer/CourseQaComposer"
import { QaConversationHeader } from "@sb-components/starci/blocks/learn/QaConversationHeader/QaConversationHeader"
import { QaChatBubble } from "@sb-components/starci/blocks/learn/QaChatBubble/QaChatBubble"
import { QaReactionBar } from "@sb-components/starci/blocks/learn/QaReactionBar/QaReactionBar"
import { QaMessageBubble } from "@sb-components/starci/blocks/learn/QaMessageBubble/QaMessageBubble"
import { Cluster, type ClusterItem } from "@sb-components/frames/Cluster/Cluster"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `QaQuestionThread`: ONE course-Q&A conversation. Collapsed, it is a
 * private social inbox row (asker, preview, scope + status, reply count,
 * status dot, the whole row pressable). Pressing it swaps in the FULL
 * conversation: a {@link QaConversationHeader}, the question itself as the
 * first chat bubble (own chips + reactions), every answer as a
 * {@link QaMessageBubble} (recursing internally for flattened reply-to-reply),
 * and a bottom plain {@link CourseQaComposer}. Port of `src`'s `QuestionRow`
 * (`src/components/features/learn/CourseQa/QuestionRow/index.tsx`), which
 * itself does `if (!expanded) return <QaInboxRow/>` — ONE component, a real
 * toggle, not two permanently-separate leaves. This file's story still treats
 * Collapsed/Expanded as two structural leaves (per the task brief) because the
 * DOM each side renders shares nothing beyond the outer wrapper.
 *
 * ⭐ REUSE FIRST — the collapsed row is `SurfaceCard.Pressable` (whole-card
 * press target, §"whole row pressable"), NOT a hand-rolled `role="button"` div
 * the way `src`'s `QaInboxRow` does it — this design system already owns that
 * behaviour. The expanded conversation is `SurfaceCard` (`.Base`) as its bounding
 * face. Chips route through `Cluster` (a same-kind repeating row, §13b), not a
 * hand-rolled wrapping flex.
 *
 * ⚠️ KNOWN LAYERING FRICTION WITH `CourseQaQuestionList` (built earlier in this
 * same run — see its file header's GAP note, ★2). That block's real usage
 * threads each question through `SurfaceCardList`'s FREE-FORM `content` slot,
 * which already supplies its own `p-3` + hover row + bottom separator — nesting
 * THIS block's own `SurfaceCard.Pressable` (its own `rounded-3xl` + `shadow-surface`)
 * inside that slot would double the card chrome (a floating rounded card inside
 * a flush divided row). This file still builds the collapsed leaf as a
 * standalone pressable card because that is what the task brief's compose-from
 * list and "whole row pressable" phrasing ask for, and because `QaQuestionThread`
 * is also a reasonable STANDALONE unit (used on its own, or inside a plain
 * `StackV` with `divider`, not only inside `SurfaceCardList`). Reconciling the
 * two — most likely by having `CourseQaQuestionList` switch its list surface to
 * a divider-only `StackV` once this block lands — is left to whichever pass
 * does that swap; flagged here rather than silently guessing one side away.
 *
 * ⚠️ ASSUMED CONTRACTS — FOUR of the five compose-from siblings did not exist
 * anywhere in `components/**` at the time this file was written (verified via
 * `Glob` immediately before writing, and re-verified once more mid-session as
 * sibling agents kept landing `CourseQaComposer`/`CourseQaToolbar` around this
 * one): `QaConversationHeader`, `QaChatBubble`, `QaReactionBar`,
 * `QaMessageBubble`. Their prop contracts below are this file's BEST-EFFORT
 * mirror of `src`'s real `QaConversationHeader`/`ChatBubble`/legacy
 * `ReactionBar`/real `QaMessageBubble` (all read in full before writing this
 * file), simplified to the plain-data props this task's own PROPS line allows
 * (`question, currentUserId, currentUser, onAnswered?, isSkeleton?,
 * showAnatomy?, anatPart?` — no per-answer reply/edit/delete/follow callbacks,
 * since none of those are named in the task's PURPOSE text either). `tsc` will
 * report an unresolved module for each of the four until its sibling file
 * lands — that is a dependency this task explicitly assigns to a different
 * agent, not a defect in this one. `CourseQaComposer` (the fifth) DID exist by
 * the time this file was written and is wired to its REAL, verified contract.
 *
 * ⭐ EVERYTHING BUT `onAnswered` IS LOCAL, EPHEMERAL UI STATE — deliberately,
 * mirroring `src`'s own `QuestionRow`: the real component ALSO keeps `expanded`,
 * the follow toggle, the answer draft and every reply/react/accept action
 * inside itself (via its own `useQuestionAnswers` facade hook) and exposes only
 * `onAnswered` outward ("bumps the parent roll-up's aggregates"). This design
 * system has no fetch/mutation layer to wire in its place, so reacting to a
 * message, accepting an answer, and posting a new one all mutate a local copy
 * of `question.answers` seeded once on mount — correct for a block instantiated
 * once per question (`key={question.id}` at the call site, exactly like `src`'s
 * `<QuestionRow key={question.id} .../>`), which is the only way this block is
 * ever used. The follow toggle itself is left OUT entirely (optional on
 * `QaConversationHeader`'s real contract) rather than guessed, to keep the
 * assumed-contract surface as small as the task's own PROPS line asks for.
 *
 * 📐 LEAVES BY STRUCTURE: `Collapsed` (inbox row) | `Expanded` (conversation).
 * Within `Expanded`, zero answers is a STATE ("hãy là người đầu tiên"), not a
 * third leaf — rules/2 §8's 0/1-3/many, same call `ContentDiscussion` already
 * makes for an empty comment list.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Reaction kinds a message in this thread can carry (mirrors backend `ReactionType`). */
export type QaReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry"

/** Minimal identity carried by whoever wrote the question or an answer. */
export interface QaQuestionThreadAuthor {
    /** Stable id — drives "is this the viewer's own message" checks. */
    id: string
    /** Display name, already resolved by the caller (falls back to username upstream). */
    displayName: string
    /** Avatar image url. Omitted → `Avatar`'s own generated/initials fallback chain. */
    avatarUrl?: string
}

/** Where a question was asked — drives the scope chip's own wording (§14d.1). */
export type QaQuestionThreadScope =
    | { kind: "lesson", lessonTitle: string }
    | { kind: "general" }

/** One answer — or, once flattened, one reply-to-a-reply — in the conversation. */
export interface QaThreadAnswer {
    /** Stable id — the React key, and what accept/react actions target. */
    id: string
    /** Answer body, as authored markdown. */
    body: string
    /** Who wrote this answer. */
    author: QaQuestionThreadAuthor
    /** Already-formatted relative time, e.g. "2 giờ trước" — no i18n layer at this tier. */
    createdTimeAgo: string
    /** `true` → this is the asker's chosen answer; only ever true on a DIRECT (top-level) answer. */
    isAcceptedAnswer?: boolean
    /** Total reactions on this answer. */
    reactionCount: number
    /** The viewer's own reaction on this answer, or null. */
    myReaction: QaReactionType | null
    /** Already-loaded flattened replies to THIS answer — rendered as sibling bubbles, not indented. */
    replies?: ReadonlyArray<QaThreadAnswer>
}

/** The question this whole thread is about. */
export interface QaQuestionThreadQuestion {
    /** Question primary id. */
    id: string
    /** Who asked it. */
    author: QaQuestionThreadAuthor
    /** Already-formatted relative time, e.g. "2 giờ trước". */
    createdTimeAgo: string
    /** `true` → a pin glyph rides beside the asker's name (founder moderation). */
    isPinned?: boolean
    /** `true` → the asker is the founder (drives the founder-author badge). */
    isFounderAuthor?: boolean
    /** Question body, as authored markdown. */
    body: string
    /** Which lesson (or "chung khoá") this question belongs to. */
    scope: QaQuestionThreadScope
    /** Total answers (top-level + replies) — the SSOT count, independent of how many `answers` are loaded below. */
    replyCount: number
    /** `true` → at least one answer came from the course founder. */
    answeredByFounder?: boolean
    /** Total reactions on the question itself (the question is a comment too). */
    reactionCount: number
    /** The viewer's own reaction on the question, or null. */
    myReaction: QaReactionType | null
    /** Already-loaded top-level answers — this design-system block does no fetching (§13). */
    answers: ReadonlyArray<QaThreadAnswer>
}

/** The signed-in viewer's identity — pass-through shape, matches `src`'s real `QuestionRow` contract 1:1. */
export interface QaQuestionThreadViewer {
    username: string
    avatar?: string
}

/** Props for {@link QaQuestionThread}. */
export interface QaQuestionThreadProps {
    /** The question to render. */
    question: QaQuestionThreadQuestion
    /** Current viewer id — drives own-bubble alignment + accept-answer eligibility; null when unknown. */
    currentUserId: string | null
    /** Current viewer identity for the bottom composer's avatar; null when signed out. */
    currentUser: QaQuestionThreadViewer | null
    /** Called after a new answer is posted — bumps the parent roll-up's aggregates. */
    onAnswered?: () => void
    /**
     * `true` → the collapsed row draws its own shimmer mirror and stops accepting
     * presses (there is no real conversation to open yet). See the file header
     * for why this never reaches `SurfaceCard.Pressable`'s own generic flag.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** The block's own scope → label vocabulary (§14d.1) — never handed in pre-formatted. */
const scopeLabel = (scope: QaQuestionThreadScope): string =>
    scope.kind === "lesson" ? `Bài: ${scope.lessonTitle}` : "Chung"

/** The block's own status → label vocabulary (§14d.1). */
const statusLabel = (replyCount: number, answeredByFounder?: boolean): string => {
    if (replyCount <= 0) {
        return "Chưa trả lời"
    }
    return answeredByFounder ? "Người hướng dẫn đã trả lời" : "Đã trả lời"
}

/** Options controlling which chips {@link buildQuestionChips} builds. */
interface QaQuestionChipsOptions {
    /** `true` → both chips draw their shimmer mirror. */
    isSkeleton: boolean
    /** When on, each chip emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy: boolean
    /**
     * `true` → a third, quiet reply-count fact rides beside the two chips. The
     * collapsed row needs it (no `QaConversationHeader` around to say it
     * elsewhere); the expanded question bubble does not, since the header above
     * it already carries the same count.
     */
    includeReplyCount: boolean
}

/**
 * The scope + status chip pair shared by the collapsed row and the expanded
 * question bubble — built ONCE so the two never drift on wording.
 */
const buildQuestionChips = (question: QaQuestionThreadQuestion, options: QaQuestionChipsOptions): Array<ClusterItem> => {
    const { isSkeleton, showAnatomy, includeReplyCount } = options

    if (isSkeleton) {
        return [
            { key: "scope", content: <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} /> },
            { key: "status", content: <Chip isSkeleton anatPart={showAnatomy ? "Chip" : undefined} /> },
        ]
    }

    const items: Array<ClusterItem> = [
        { key: "scope", content: <Chip tone="neutral" text={scopeLabel(question.scope)} anatPart={showAnatomy ? "Chip" : undefined} /> },
        {
            key: "status",
            content: (
                <Chip
                    tone={question.replyCount > 0 ? "success" : "neutral"}
                    text={statusLabel(question.replyCount, question.answeredByFounder)}
                    anatPart={showAnatomy ? "Chip" : undefined}
                />
            ),
        },
    ]

    if (includeReplyCount && question.replyCount > 0) {
        items.push({
            key: "replyCount",
            content: (
                <Typography
                    size="xs"
                    color="muted"
                    text={`${question.replyCount} phản hồi`}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ),
        })
    }

    return items
}

/** Apply (or clear) a reaction pick against a `{count, myReaction}` pair, adjusting the count by exactly one. */
const applyReaction = (
    count: number,
    current: QaReactionType | null,
    next: QaReactionType | null,
): { count: number, myReaction: QaReactionType | null } => {
    if (current === next) {
        return { count, myReaction: current }
    }
    const delta = (next != null ? 1 : 0) - (current != null ? 1 : 0)
    return { count: Math.max(0, count + delta), myReaction: next }
}

/**
 * One course-Q&A conversation. See the file header for the full contract, the
 * assumed-sibling-contract risk, and the local-state judgement call.
 *
 * @param props - {@link QaQuestionThreadProps}
 */
const QaQuestionThread = ({
    question,
    currentUserId,
    currentUser,
    onAnswered,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: QaQuestionThreadProps) => {
    // Collapsed ⇄ Expanded is a real TOGGLE local to this instance, exactly like
    // `src`'s own `QuestionRow` (see file header) — never lifted to a prop.
    const [isExpanded, setIsExpanded] = useState(false)

    // Seeded ONCE from props — correct because this block is instantiated once per
    // question (`key={question.id}` at the call site remounts it on real data
    // change), same assumption `src`'s `QuestionRow` makes for its own local state.
    const [answers, setAnswers] = useState<ReadonlyArray<QaThreadAnswer>>(question.answers)
    const [questionReaction, setQuestionReaction] = useState({ count: question.reactionCount, myReaction: question.myReaction })
    const [draft, setDraft] = useState("")

    const isMineQuestion = currentUserId != null && currentUserId === question.author.id
    const askerDisplayName = isMineQuestion ? "Bạn" : question.author.displayName

    // Distinct answerers → the "who joined in" avatar group in the header.
    const participants = useMemo<Array<QaQuestionThreadAuthor>>(() => {
        const seen = new Set<string>()
        const list: Array<QaQuestionThreadAuthor> = []
        for (const answer of answers) {
            if (!seen.has(answer.author.id)) {
                seen.add(answer.author.id)
                list.push(answer.author)
            }
        }
        return list
    }, [answers])

    const onReactQuestion = (type: QaReactionType | null) => {
        setQuestionReaction((prev) => applyReaction(prev.count, prev.myReaction, type))
    }

    const onReactAnswer = (answerId: string, type: QaReactionType | null) => {
        setAnswers((prev) => prev.map((answer) => {
            if (answer.id !== answerId) {
                return answer
            }
            const { count, myReaction } = applyReaction(answer.reactionCount, answer.myReaction, type)
            return { ...answer, reactionCount: count, myReaction }
        }))
    }

    const onAcceptAnswer = (answerId: string, accepted: boolean) => {
        setAnswers((prev) => prev.map((answer) => (answer.id === answerId ? { ...answer, isAcceptedAnswer: accepted } : answer)))
    }

    const canSubmitAnswer = draft.trim().length > 0 && currentUserId != null && currentUser != null

    const onSubmitAnswer = () => {
        if (!canSubmitAnswer || currentUserId == null || currentUser == null) {
            return
        }
        const newAnswer: QaThreadAnswer = {
            id: `local-${answers.length}-${Date.now()}`,
            body: draft.trim(),
            author: { id: currentUserId, displayName: currentUser.username, avatarUrl: currentUser.avatar },
            createdTimeAgo: "Vừa xong",
            reactionCount: 0,
            myReaction: null,
        }
        setAnswers((prev) => [...prev, newAnswer])
        setDraft("")
        onAnswered?.()
    }

    // ── LEAF — Collapsed: a private social inbox row, the whole row pressable ──
    if (!isExpanded) {
        return (
            <div data-anat-part={anatPart}>
                <div data-anat-part={showAnatomy ? "SurfaceCard" : undefined}>
                    <SurfaceCard
                        onPress={() => setIsExpanded(true)}
                        isDisabled={isSkeleton}
                        showAnatomy={showAnatomy}
                    >
                        <StackH gap="grouped" align="start" anatPart={showAnatomy ? "StackH" : undefined}>
                            <div data-anat-part={showAnatomy ? "Avatar" : undefined}>
                                <Avatar
                                    src={question.author.avatarUrl}
                                    name={question.author.displayName}
                                    seed={question.author.id}
                                    size="sm"
                                    isSkeleton={isSkeleton}
                                    showAnatomy={showAnatomy}
                                />
                            </div>

                            <StackV gap="tight" className="min-w-0 flex-1" anatPart={showAnatomy ? "StackV" : undefined}>
                                <StackH gap="related" wrap align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                                    {isSkeleton ? (
                                        <Typography size="xs" weight="medium" isSkeleton className="w-24" anatPart={showAnatomy ? "Typography" : undefined} />
                                    ) : (
                                        <>
                                            {question.isPinned ? (
                                                <PushPinIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                                            ) : null}
                                            <Typography size="xs" weight="medium" text={askerDisplayName} anatPart={showAnatomy ? "Typography" : undefined} />
                                            {question.isFounderAuthor ? (
                                                <SealCheckIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                                            ) : null}
                                            <Typography size="xs" color="muted" text={`· ${question.createdTimeAgo}`} anatPart={showAnatomy ? "Typography" : undefined} />
                                        </>
                                    )}
                                </StackH>

                                {isSkeleton ? (
                                    <StackV gap="tight" anatPart={showAnatomy ? "StackV" : undefined}>
                                        <Typography size="sm" isSkeleton className="w-full" anatPart={showAnatomy ? "Typography" : undefined} />
                                        <Typography size="sm" isSkeleton className="w-2/3" anatPart={showAnatomy ? "Typography" : undefined} />
                                    </StackV>
                                ) : (
                                    <MarkdownContent
                                        source={question.body}
                                        measure="compact"
                                        className="[&_p]:m-0 [&_p]:line-clamp-2"
                                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                                    />
                                )}

                                <Cluster
                                    gap="related"
                                    items={buildQuestionChips(question, { isSkeleton, showAnatomy, includeReplyCount: true })}
                                    anatPart={showAnatomy ? "Cluster" : undefined}
                                />
                            </StackV>

                            {!isSkeleton ? (
                                <span
                                    aria-hidden
                                    className={cn("size-2 shrink-0 rounded-full", question.replyCount > 0 ? "bg-success" : "bg-warning")}
                                />
                            ) : null}
                        </StackH>
                    </SurfaceCard>
                </div>
            </div>
        )
    }

    // ── LEAF — Expanded: the full conversation ─────────────────────────────────
    return (
        <div data-anat-part={anatPart}>
            <SurfaceCard anatPart={showAnatomy ? "SurfaceCard" : undefined}>
                <StackV gap="section" anatPart={showAnatomy ? "StackV" : undefined}>
                    <QaConversationHeader
                        asker={{
                            id: question.author.id,
                            displayName: question.author.displayName,
                            avatarUrl: question.author.avatarUrl,
                        }}
                        isFounderAsker={question.isFounderAuthor}
                        participants={participants}
                        replyCount={question.replyCount}
                        onCollapse={() => setIsExpanded(false)}
                        showAnatomy={showAnatomy}
                    />

                    <StackV gap="grouped" anatPart={showAnatomy ? "StackV" : undefined}>
                        {/* the question itself, as the first bubble of the conversation */}
                        <div className={cn("flex w-full", isMineQuestion ? "justify-end" : "justify-start")}>
                            <StackV gap="tight" className={cn("min-w-0 max-w-[92%]", isMineQuestion && "items-end")} anatPart={showAnatomy ? "StackV" : undefined}>
                                <StackH gap="related" wrap align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                                    <Typography size="xs" weight="medium" text={askerDisplayName} anatPart={showAnatomy ? "Typography" : undefined} />
                                    {question.isFounderAuthor ? (
                                        <SealCheckIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                                    ) : null}
                                    {question.isPinned ? (
                                        <PushPinIcon weight="fill" aria-hidden focusable="false" className="size-3.5 shrink-0 text-accent-soft-foreground" />
                                    ) : null}
                                    <Typography size="xs" color="muted" text={question.createdTimeAgo} anatPart={showAnatomy ? "Typography" : undefined} />
                                </StackH>

                                <QaChatBubble role={isMineQuestion ? "user" : "assistant"}>
                                    <MarkdownContent
                                        source={question.body}
                                        measure="compact"
                                        className="[&_p]:m-0"
                                        anatPart={showAnatomy ? "MarkdownContent" : undefined}
                                    />
                                </QaChatBubble>

                                <StackH gap="related" wrap align="center" anatPart={showAnatomy ? "StackH" : undefined}>
                                    <Cluster
                                        gap="related"
                                        items={buildQuestionChips(question, { isSkeleton: false, showAnatomy, includeReplyCount: false })}
                                        anatPart={showAnatomy ? "Cluster" : undefined}
                                    />
                                    <QaReactionBar
                                        count={questionReaction.count}
                                        myReaction={questionReaction.myReaction}
                                        onReact={onReactQuestion}
                                        showAnatomy={showAnatomy}
                                    />
                                </StackH>
                            </StackV>
                        </div>

                        {/* answers — QaMessageBubble recurses internally for flattened reply-to-reply */}
                        {answers.length === 0 ? (
                            <Typography
                                size="sm"
                                color="muted"
                                text="Chưa có câu trả lời nào — hãy là người đầu tiên."
                                anatPart={showAnatomy ? "Typography" : undefined}
                            />
                        ) : (
                            answers.map((answer) => (
                                <QaMessageBubble
                                    key={answer.id}
                                    answer={answer}
                                    currentUserId={currentUserId}
                                    canAccept={isMineQuestion}
                                    onAcceptAnswer={(accepted: boolean) => onAcceptAnswer(answer.id, accepted)}
                                    onReact={(type: QaReactionType | null) => onReactAnswer(answer.id, type)}
                                    showAnatomy={showAnatomy}
                                />
                            ))
                        )}
                    </StackV>

                    {/* bottom composer — the only way to answer a course-general question */}
                    <CourseQaComposer
                        mode="plain"
                        currentUser={currentUser ? { name: currentUser.username, avatarSrc: currentUser.avatar } : undefined}
                        value={draft}
                        onValueChange={setDraft}
                        onSubmit={onSubmitAnswer}
                        placeholder="Viết câu trả lời của bạn…"
                        submitLabel="Gửi"
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "CourseQaComposer" : undefined}
                    />
                </StackV>
            </SurfaceCard>
        </div>
    )
}

export { QaQuestionThread }
