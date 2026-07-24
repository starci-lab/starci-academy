import React from "react"
import type { ReactNode } from "react"
import { ScrollShadow, Typography, cn } from "@heroui/react"
import { ArrowRightIcon, ArrowClockwiseIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { ChatBubble } from "../../feed/ChatBubble/ChatBubble"
import { ChatToolResult } from "../ChatToolResult/ChatToolResult"
import { MarkdownContent } from "../../rendering/MarkdownContent/MarkdownContent"
import { Button } from "../../buttons/Button/Button"
import { ChipButtonList } from "../../buttons/ChipButtonList/ChipButtonList"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"
import { InlineIconLabel } from "../../text/InlineIconLabel/InlineIconLabel"
import type { SearchCourseContentItem } from "../EntityResultRow/EntityResultRow"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — BLOCK: the AI-chat message THREAD (the scrolling
 * conversation region), ported from `features/learn/ContentAiChat` (the chat view's
 * `messages.map`, ~:1317-1398). A single function — render the turn list — owned as
 * ONE block, distinct from the conversation-history block and the composer block.
 *
 * Each turn is a {@link ChatBubble}; the assistant turn is a 4-way ladder: a RAG
 * {@link ChatToolResult}, a "thinking" placeholder, a quota-error + upgrade CTA, or a
 * normal {@link MarkdownContent} answer. An empty thread shows a hint + suggestion chips.
 */

/** A RAG tool-result carried by an assistant turn (rendered as a {@link ChatToolResult}). */
export interface ChatThreadToolResult {
    /** Header label (e.g. "Flashcard liên quan"). */
    label: ReactNode
    /** Header eyebrow icon. */
    icon?: ReactNode
    /** The matched hits. */
    items: Array<SearchCourseContentItem>
    /** Mirror the row shape with skeletons while the tool runs. */
    isLoading?: boolean
    /** Mixed-kind list → show a kind chip per row. */
    showKindChip?: boolean
    /** "See all" affordance below the list. */
    onViewAll?: () => void
    /** Label for the view-all footer. */
    viewAllLabel?: ReactNode
    /** Optional intro line the assistant says above the results. */
    intro?: ReactNode
}

/** One turn in the thread. */
export interface ChatThreadMessage {
    /** Stable id (React key). */
    id: string
    /** Author. */
    role: "user" | "assistant"
    /** Text — plain for a user turn, markdown for a normal assistant turn. Empty assistant content = "thinking". */
    content: string
    /** Assistant turn hit the AI quota → render an upgrade CTA instead of an answer. */
    isQuotaError?: boolean
    /** Assistant turn failed (couldn't respond) → render an error line + a retry CTA. */
    isError?: boolean
    /** Assistant turn carries a RAG tool result. */
    toolResult?: ChatThreadToolResult
}

/** An empty-thread suggestion chip. */
export interface ChatThreadSuggestion {
    /** Chip label. */
    label: ReactNode
    /** Optional leading icon (a retrieval-skill glyph). */
    icon?: ReactNode
    /** Press handler. */
    onPress?: () => void
}

/**
 * Which grounding the empty thread is offering suggestions FOR (source:
 * `ChatContextScope`, index.tsx:176 — collapsed to the 3 shapes the empty state
 * actually renders differently for). Drives which chip clusters show, NOT their
 * labels — the caller still supplies `suggestions`/`skills` content.
 *
 * - `"content"` — a lesson is open → hint + `suggestions` cluster (tóm tắt/khó
 *   nhất/ví dụ) + `skills` cluster (source :1329-1359, `isContentScope` gate).
 * - `"course"` / `"other"` — no lesson open (course-wide, or a task/challenge/
 *   quiz/foundation surface) → hint only + `skills` cluster, no `suggestions`
 *   (there is no "this lesson" to summarise).
 */
export type ChatThreadScope = "content" | "course" | "other"

/** Props for the {@link ChatThread} block. */
export interface ChatThreadProps {
    /** The turns to render. Empty → the empty-state (hint + suggestions). */
    messages: Array<ChatThreadMessage>
    /** `true` → render the loading skeleton (mirror bubbles) while past turns load. Overrides messages/empty. */
    isLoading?: boolean
    /** Fired by an error turn's retry CTA. */
    onRetry?: () => void
    /** Retry CTA label on an error turn. */
    retryLabel?: ReactNode
    /** Error line on a failed assistant turn. */
    errorLabel?: ReactNode
    /**
     * Grounding scope for the empty-state chip clusters (source `ChatContextScope`,
     * index.tsx:176). Omitted → the legacy single `suggestions` cluster (back-compat
     * with existing leaves). Set → gates `suggestions` to `"content"` only and adds
     * the `skills` cluster; see {@link ChatThreadScope}.
     */
    scope?: ChatThreadScope
    /** Empty-thread hint line (muted). Shown only when `messages` is empty. */
    emptyHint?: ReactNode
    /**
     * Empty-thread suggestion chips (summarize / example…). With `scope` set,
     * this cluster renders ONLY for `scope="content"` (source `isContentScope`
     * gate, index.tsx:1329) — pass `scope` to get that gate; omit `scope` to keep
     * the legacy always-shown single cluster.
     */
    suggestions?: Array<ChatThreadSuggestion>
    /**
     * Empty-thread retrieval-SKILL chips (challenges/flashcards/lessons…), a
     * SECOND cluster below `suggestions` — shown for every scope, only the item
     * COUNT differs (course adds "lessons" up front; source `EMPTY_STATE_SKILLS`,
     * index.tsx:138). Only rendered when `scope` is set.
     */
    skills?: Array<ChatThreadSuggestion>
    /**
     * `true` → a passage is selected and no turn has happened yet: the thread
     * renders NOTHING (no hint, no chips) — mirrors source gate
     * `messages.length === 0 && !selection` (index.tsx:1319), a deliberate GAP
     * (the excerpt + its own quick-asks live in the rail above the thread, not
     * in this block).
     */
    hasSelection?: boolean
    /** Fired when a tool-result row is picked. */
    onSelectHit?: (item: SearchCourseContentItem) => void
    /** Fired by a quota-error turn's upgrade CTA. */
    onUpgrade?: () => void
    /** "Thinking" line for an in-flight assistant turn (empty content). */
    thinkingLabel?: ReactNode
    /** Upgrade CTA label on a quota-error turn. */
    upgradeLabel?: ReactNode
    /** Extra classes on the scroll region. */
    className?: string
    /** Anatomy tag: names the thread root so a parent panel can badge it. */
    anatPart?: string
    /** When on, emit `data-anat-part` on each part so a BlockAnatomy panel can badge them. */
    showAnatomy?: boolean
}

/**
 * Renders one assistant turn's body via the 4-way ladder.
 */
const AssistantBody = ({
    message,
    onSelectHit,
    onUpgrade,
    onRetry,
    thinkingLabel,
    upgradeLabel,
    retryLabel,
    errorLabel,
    showAnatomy,
}: {
    message: ChatThreadMessage
    onSelectHit?: (item: SearchCourseContentItem) => void
    onUpgrade?: () => void
    onRetry?: () => void
    thinkingLabel: ReactNode
    upgradeLabel: ReactNode
    retryLabel: ReactNode
    errorLabel: ReactNode
    showAnatomy: boolean
}) => {
    if (message.isError) {
        return (
            <div className="flex flex-col gap-2">
                <InlineIconLabel
                    icon={<WarningCircleIcon aria-hidden focusable="false" />}
                    tone="danger"
                    size="sm"
                    anatPart={showAnatomy ? "InlineIconLabel · lỗi" : undefined}
                >
                    {errorLabel}
                </InlineIconLabel>
                <Button variant="secondary" size="sm" onPress={onRetry} anatPart={showAnatomy ? "Button · thử lại" : undefined}>
                    <ArrowClockwiseIcon aria-hidden focusable="false" />
                    {retryLabel}
                </Button>
            </div>
        )
    }
    if (message.toolResult) {
        const tr = message.toolResult
        return (
            <div className="flex flex-col gap-2">
                {tr.intro ? <Typography type="body-sm">{tr.intro}</Typography> : null}
                <ChatToolResult
                    items={tr.items}
                    label={tr.label}
                    icon={tr.icon}
                    isLoading={tr.isLoading}
                    showKindChip={tr.showKindChip}
                    onSelect={onSelectHit ?? (() => {})}
                    onViewAll={tr.onViewAll}
                    viewAllLabel={tr.viewAllLabel}
                    anatPart={showAnatomy ? "ChatToolResult" : undefined}
                />
            </div>
        )
    }
    if (message.content === "") {
        return <Typography type="body-sm" color="muted" data-anat-part={showAnatomy ? "Typography · đang soạn" : undefined}>{thinkingLabel}</Typography>
    }
    if (message.isQuotaError) {
        return (
            <div className="flex flex-col gap-2">
                <MarkdownContent markdown={message.content} anatPart={showAnatomy ? "MarkdownContent" : undefined} />
                <Button variant="primary" size="sm" onPress={onUpgrade} anatPart={showAnatomy ? "Button · nâng cấp" : undefined}>
                    {upgradeLabel}
                    <ArrowRightIcon aria-hidden focusable="false" />
                </Button>
            </div>
        )
    }
    return <MarkdownContent markdown={message.content} anatPart={showAnatomy ? "MarkdownContent" : undefined} />
}

/**
 * ChatThread — the scrolling conversation region. Owns the turn-rendering ladder;
 * the caller supplies the message list + empty-state copy.
 *
 * @param props - {@link ChatThreadProps}
 */
export const ChatThread = ({
    messages,
    isLoading = false,
    onSelectHit,
    onUpgrade,
    onRetry,
    thinkingLabel = "Đang soạn câu trả lời…",
    upgradeLabel = "Nâng cấp để dùng tiếp",
    retryLabel = "Thử lại",
    errorLabel = "Không thể trả lời lúc này. Vui lòng thử lại.",
    emptyHint,
    suggestions,
    skills,
    scope,
    hasSelection = false,
    className,
    anatPart,
    showAnatomy = false,
}: ChatThreadProps) => (
    <ScrollShadow data-anat-part={anatPart} className={cn("flex max-h-[420px] flex-col", className)} hideScrollBar>
        <div className="flex flex-col gap-3">
            {isLoading ? (
                // Skeleton mirror — a short user bubble + a taller assistant bubble.
                <>
                    <ChatBubble role="user" anatPart={showAnatomy ? "ChatBubble · skeleton" : undefined}>
                        <Skeleton.Typography type="body-sm" width="w-40" />
                    </ChatBubble>
                    <ChatBubble role="assistant" anatPart={showAnatomy ? "ChatBubble · skeleton" : undefined}>
                        <div className="flex w-56 flex-col gap-1">
                            <Skeleton.Typography type="body-sm" width="full" />
                            <Skeleton.Typography type="body-sm" width="3/4" />
                            <Skeleton.Typography type="body-sm" width="1/2" />
                        </div>
                    </ChatBubble>
                </>
            ) : messages.length === 0 ? (
                // a selected passage with no turn yet renders NOTHING here — the
                // excerpt + its own quick-asks live in the rail ABOVE this block
                // (source gate `messages.length === 0 && !selection`, index.tsx:1319)
                hasSelection ? null : scope ? (
                    <>
                        {emptyHint ? (
                            <Typography type="body-sm" color="muted" data-anat-part={showAnatomy ? "Typography · gợi ý" : undefined}>
                                {emptyHint}
                            </Typography>
                        ) : null}
                        {/* suggestion cluster ("tóm tắt/khó nhất/ví dụ") only makes sense
                            against an OPEN lesson — course/task/challenge/foundation offer
                            retrieval skills only (source `isContentScope` gate, :1329) */}
                        {scope === "content" && suggestions && suggestions.length > 0 ? (
                            <ChipButtonList
                                items={suggestions.map((s, index) => ({ id: `suggestion-${index}`, label: s.label, icon: s.icon, onPress: s.onPress }))}
                                direction="wrap"
                                anatPart={showAnatomy ? "ChipButtonList · gợi ý" : undefined}
                                showAnatomy={showAnatomy}
                            />
                        ) : null}
                        {skills && skills.length > 0 ? (
                            <ChipButtonList
                                items={skills.map((s, index) => ({ id: `skill-${index}`, label: s.label, icon: s.icon, onPress: s.onPress }))}
                                direction="wrap"
                                anatPart={showAnatomy ? "ChipButtonList · kỹ năng" : undefined}
                                showAnatomy={showAnatomy}
                            />
                        ) : null}
                    </>
                ) : (
                    <>
                        {emptyHint ? (
                            <Typography type="body-sm" color="muted" data-anat-part={showAnatomy ? "Typography · gợi ý" : undefined}>
                                {emptyHint}
                            </Typography>
                        ) : null}
                        {suggestions && suggestions.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {suggestions.map((s, index) => (
                                    <Button
                                        key={index}
                                        variant="secondary"
                                        size="sm"
                                        onPress={s.onPress}
                                        anatPart={showAnatomy ? "Button · gợi ý" : undefined}
                                    >
                                        {s.icon}
                                        {s.label}
                                    </Button>
                                ))}
                            </div>
                        ) : null}
                    </>
                )
            ) : (
                messages.map((message) =>
                    message.role === "user" ? (
                        <ChatBubble key={message.id} role="user" anatPart={showAnatomy ? "ChatBubble · user" : undefined}>
                            <Typography type="body-sm">{message.content}</Typography>
                        </ChatBubble>
                    ) : (
                        <ChatBubble key={message.id} role="assistant" anatPart={showAnatomy ? "ChatBubble · assistant" : undefined}>
                            <AssistantBody
                                message={message}
                                onSelectHit={onSelectHit}
                                onUpgrade={onUpgrade}
                                onRetry={onRetry}
                                thinkingLabel={thinkingLabel}
                                upgradeLabel={upgradeLabel}
                                retryLabel={retryLabel}
                                errorLabel={errorLabel}
                                showAnatomy={showAnatomy}
                            />
                        </ChatBubble>
                    ),
                )
            )}
        </div>
    </ScrollShadow>
)
