"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    Button,
    CloseButton,
    Input,
    Label,
    Link,
    ScrollShadow,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArrowLeftIcon,
    ArrowRightIcon,
    BookOpenIcon,
    CardsThreeIcon,
    CaretDownIcon,
    ChatsCircleIcon,
    CodeIcon,
    FlagIcon,
    GearIcon,
    PaperPlaneTiltIcon,
    PlusIcon,
    QuotesIcon,
    TrashIcon,
} from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import {
    useContentAiChatOverlayState,
    useContentAiSelectedModel,
    useContentAiSelection,
} from "@/hooks/zustand/overlay/hooks"
import { useContentAiStream } from "@/hooks/socketio/useContentAiStream"
import { useQueryAiModelsSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiModelsSwr"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import { AiModelTask } from "@/modules/api/graphql/queries/query-ai-models"
import {
    GradeModelDropdown,
    type GradeModelSelection,
} from "@/components/blocks/grading/GradeModelDropdown"
import { pathConfig } from "@/resources/path"
import { useQueryContentAiHistorySwr } from "@/hooks/swr/api/graphql/queries/useQueryContentAiHistorySwr"
import { useQueryContentAiSessionsSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentAiSessionsSwr"
import {
    CONTENT_AI_SESSIONS_PAGE_LIMIT,
    useQueryContentAiSessionsInfiniteSwr,
} from "@/hooks/swr/api/graphql/queries/useQueryContentAiSessionsInfiniteSwr"
import { useMutateCreateContentAiSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCreateContentAiSessionSwr"
import { useMutateClearContentAiHistorySwr } from "@/hooks/swr/api/graphql/mutations/useMutateClearContentAiHistorySwr"
import { useMutateTouchContentAiSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateTouchContentAiSessionSwr"
import { ChatBubble, type ChatRole } from "@/components/blocks/feed/ChatBubble"
import { MarkdownContent } from "@/components/reuseable/MarkdownContent"
import { SearchInput } from "@/components/reuseable/SearchInput"
import { InfiniteScrollSentinel } from "@/components/blocks/async/InfiniteScrollSentinel"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { querySearchCourseContent } from "@/modules/api/graphql/queries/query-search-course-content"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { ChatToolResult } from "@/components/blocks/learn/ChatToolResult"
import { EntityResultRow } from "@/components/blocks/learn/EntityResultRow"

/** Props for {@link ContentAiChat}. */
export type ContentAiChatProps = WithClassNames<undefined>

/** Generic starter questions shown in the empty chat (i18n keys under `contentAi.suggestions`). */
const SUGGESTION_KEYS = ["summarize", "hardest", "example", "remember"] as const

/** Scoped quick-asks shown when a lesson passage is selected (keys under `contentAi.selectionSuggestions`). */
const SELECTION_SUGGESTION_KEYS = ["explain", "example", "simplify"] as const

/** The kind an in-chat "find X" intent resolves to. */
type ContentIntentKind = "content" | "challenge" | "flashcard" | "milestone"

/** A find-verb that signals the learner wants a LIST of course content, not a chat answer. */
const CONTENT_INTENT_VERB_RE = /(tìm|find|gợi ý|liệt kê|list|show|kiếm)/i

/** Kind noun → the corpus kind to search. */
const CONTENT_INTENT_KINDS: Array<{ re: RegExp, kind: ContentIntentKind }> = [
    { re: /(flashcard|thẻ)/i, kind: "flashcard" },
    { re: /(thử thách|challenge|bài tập)/i, kind: "challenge" },
    { re: /(dự án|milestone|capstone|nhiệm vụ)/i, kind: "milestone" },
    { re: /(bài học|bài|lesson|nội dung)/i, kind: "content" },
]

/**
 * Detect an in-chat "find <kind> for this" intent — requires BOTH a find-verb
 * and a kind noun so a normal question ("tóm tắt bài này") never hijacks the chat
 * into a search. Returns the kind to render, or null for a normal answer.
 * MVP intent lives client-side; the BE classifier + persisted tool turn is phase 2.
 */
const detectContentIntent = (text: string): ContentIntentKind | null => {
    if (!CONTENT_INTENT_VERB_RE.test(text)) {
        return null
    }
    return CONTENT_INTENT_KINDS.find((entry) => entry.re.test(text))?.kind ?? null
}

/** Per-kind header presentation for the in-chat tool-result widget. */
const TOOL_RESULT_META: Record<ContentIntentKind, { labelKey: string, Icon: typeof CardsThreeIcon }> = {
    flashcard: { labelKey: "entityResult.kindFlashcard", Icon: CardsThreeIcon },
    content: { labelKey: "entityResult.kindContent", Icon: BookOpenIcon },
    challenge: { labelKey: "entityResult.kindChallenge", Icon: CodeIcon },
    milestone: { labelKey: "entityResult.kindMilestone", Icon: FlagIcon },
}

/** Number of rows the in-chat tool result shows before "see all". */
const TOOL_RESULT_LIMIT = 5

/** Extract the visible `<display>…</display>` part of a message (hides `<context>` from the UI). */
const DISPLAY_RE = /<display>([\s\S]*?)<\/display>/
const displayText = (content: string): string => {
    const match = content.match(DISPLAY_RE)
    return match ? match[1].trim() : content
}

/** Which in-panel view is showing. Conversations + settings + search are all
 * in-panel (not separate overlays) so they never z-fight the chat popover they
 * live inside. */
type PanelView = "chat" | "conversations" | "settings" | "search"

/** One turn in the content-AI conversation. */
interface ChatMessage {
    /** Author of the turn. */
    role: ChatRole
    /** The message text (assistant content may be markdown). */
    content: string
    /** Whether this assistant turn is an AI-quota-exhausted error (shows an upgrade CTA). */
    isQuotaError?: boolean
    /**
     * In-chat tool result (generative-UI part) — when the learner asks to FIND
     * content ("tìm flashcard cho phần này"), this assistant turn renders a
     * pickable {@link ChatToolResult} list instead of streamed text.
     */
    toolResult?: {
        /** Which corpus the results belong to (drives the header label/icon). */
        kind: ContentIntentKind
        /** The query that produced them (feeds the "see all" full-search view). */
        query: string
        /** The matched sources (already sliced to {@link TOOL_RESULT_LIMIT}). */
        items: Array<SearchCourseContentItem>
        /** True while the RAG search is in flight (renders skeleton rows). */
        isLoading: boolean
    }
}

/**
 * Content-AI chat thread + composer (the body of the ask-AI popover/drawer).
 * A lesson can hold MANY named conversations (e.g. one about nginx, one about
 * kafka): the thread is a **session** persisted server-side (scoped to the
 * learner's enrollment), switchable + searchable via the in-panel conversations
 * view. Recent turns are replayed as short-term memory on each question; the
 * answer **streams** token-by-token over the `/content_ai` socket on the free
 * model (self-hosted Qwen — no AI credit).
 *
 * @param props - {@link ContentAiChatProps}
 */
export const ContentAiChat = ({ className }: ContentAiChatProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const contentId = useAppSelector((state) => state.content.id)
    const contentEntity = useAppSelector((state) => state.content.entity)
    const course = useAppSelector((state) => state.course.entity)
    const { ask, abort } = useContentAiStream()
    const { close: closeChat } = useContentAiChatOverlayState()
    const [messages, setMessages] = useState<Array<ChatMessage>>([])
    const [input, setInput] = useState("")
    const [isStreaming, setIsStreaming] = useState(false)
    // lesson passage the learner highlighted to ask about (set by ContentAiSelectionAsk)
    const { selection, selectionContext, setSelection } = useContentAiSelection()

    // which conversation (session) is open + which in-panel view is showing
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [view, setView] = useState<PanelView>("chat")
    const [searchTerm, setSearchTerm] = useState("")

    // "Tìm nội dung khóa" (search view) — debounced so typing never fires an
    // embedding call per keystroke (unlike the plain-ILIKE conversations search above)
    const [contentSearchQuery, setContentSearchQuery] = useState("")
    const [debouncedContentSearchQuery, setDebouncedContentSearchQuery] = useState("")
    useEffect(() => {
        const timer = setTimeout(() => setDebouncedContentSearchQuery(contentSearchQuery), 400)
        return () => clearTimeout(timer)
    }, [contentSearchQuery])
    const contentSearchSwr = useQuerySearchCourseContentSwr(
        course?.id ?? null,
        debouncedContentSearchQuery,
        view === "search",
    )

    // every available model — the picker shows them all (Free is the chatbot's
    // normal lane here, NOT flagged danger; higher tiers gate on the unlock)
    const aiModelsSwr = useQueryAiModelsSwr()
    const models = useMemo(
        () => (aiModelsSwr.data?.aiModels?.data?.gradableModels ?? [])
            .filter((model) => model.available),
        [aiModelsSwr.data],
    )
    const myAiSettingsSwr = useQueryMyAiSettingsSwr()
    // unlocked (paid OR enrolled) → may pin higher-tier models
    const canPremium = Boolean(myAiSettingsSwr.data?.canPremium)
    const { selectedModel, setSelectedModel } = useContentAiSelectedModel()
    // default = Auto (no concrete model pinned); a picked model runs on that model
    const modelSelection = useMemo<GradeModelSelection>(() => {
        if (!selectedModel) {
            return {
                model: null,
                provider: null,
            }
        }
        const found = models.find((model) => model.model === selectedModel)
        return {
            model: selectedModel,
            provider: found?.provider ?? null,
        }
    }, [selectedModel, models])

    // recent conversations for the header (auto-select most recent + current title)
    const sessionsSwr = useQueryContentAiSessionsSwr(contentId)
    // the conversations view list is paginated/infinite (mirror followers infinite)
    const sessionsInfinite = useQueryContentAiSessionsInfiniteSwr(
        contentId,
        searchTerm,
        view === "conversations",
    )
    // saved turns of the OPEN conversation
    const historySwr = useQueryContentAiHistorySwr(currentSessionId ?? undefined)
    const createSwr = useMutateCreateContentAiSessionSwr()
    const deleteSwr = useMutateClearContentAiHistorySwr()
    const touchSwr = useMutateTouchContentAiSessionSwr()

    const hydratedRef = useRef<string | undefined>(undefined)
    const contentSelectedRef = useRef<string | undefined>(undefined)
    const prevContentIdRef = useRef<string | undefined>(undefined)
    // thread scroll container — auto-follow the answer to the bottom as it
    // streams, scrolling ONLY this region (never the page)
    const scrollRef = useRef<HTMLDivElement>(null)
    // whether the user is pinned to the bottom; false once they scroll up to
    // re-read, so streaming does not drag them back down
    const stickToBottomRef = useRef<boolean>(true)

    // a new content resets everything (thread, open session, view, search)
    useEffect(() => {
        abort()
        setMessages([])
        setInput("")
        setIsStreaming(false)
        setCurrentSessionId(null)
        setView("chat")
        setSearchTerm("")
        setContentSearchQuery("")
        setDebouncedContentSearchQuery("")
        hydratedRef.current = undefined
        contentSelectedRef.current = undefined
    }, [contentId, abort])

    /** Jump to a search result's real surface (content/challenge/flashcard/milestone), then close the panel. */
    const onSelectSearchResult = useCallback(
        (item: SearchCourseContentItem) => {
            const displayId = course?.displayId
            if (!displayId) {
                return
            }
            const learn = pathConfig().locale(locale).course(displayId).learn()
            const href = item.kind === "flashcard" && item.deckId
                ? learn.flashcards().review(item.deckId).build()
                : item.kind === "milestone" && item.taskId
                    ? learn.personalProject(item.taskId).build()
                    : item.moduleId && item.contentId
                        ? learn.module(item.moduleId).content(item.contentId).build()
                        : null
            if (!href) {
                return
            }
            closeChat()
            router.push(href)
        },
        [course?.displayId, locale, router, closeChat],
    )

    // once the lesson's conversations load, reopen the most recent one — opening a
    // chat bumps its recency server-side (touchSession), so "most recent" = the
    // last conversation the user read (persisted in the DB, not the browser)
    useEffect(() => {
        if (!contentId || contentSelectedRef.current === contentId || sessionsSwr.data === undefined) {
            return
        }
        setCurrentSessionId(sessionsSwr.data[0]?.id ?? null)
        contentSelectedRef.current = contentId
    }, [contentId, sessionsSwr.data])

    // clear a stale selected passage only when the content ACTUALLY changes
    useEffect(() => {
        if (prevContentIdRef.current !== undefined && prevContentIdRef.current !== contentId) {
            setSelection(null)
        }
        prevContentIdRef.current = contentId
    }, [contentId, setSelection])

    // hydrate the thread from the server once the open session's turns load
    useEffect(() => {
        if (!currentSessionId || hydratedRef.current === currentSessionId || !historySwr.data) {
            return
        }
        setMessages(historySwr.data.map((turn) => ({
            role: turn.role as ChatRole,
            content: turn.content,
        })))
        hydratedRef.current = currentSessionId
    }, [currentSessionId, historySwr.data])

    // keep the latest content in view as messages append / the answer streams.
    // scroll ONLY the thread container (scrollIntoView would walk up and yank the
    // whole lesson page / popover). a user's own send always scrolls; an assistant
    // delta only follows when the user is still pinned to the bottom.
    useEffect(() => {
        const el = scrollRef.current
        if (!el) {
            return
        }
        const last = messages[messages.length - 1]
        if (last?.role === "user" || stickToBottomRef.current) {
            el.scrollTop = el.scrollHeight
            stickToBottomRef.current = true
        }
    }, [messages])

    // track whether the user is near the bottom so streaming does not drag them
    // down while they scroll up to re-read earlier turns
    const handleThreadScroll = useCallback(() => {
        const el = scrollRef.current
        if (!el) {
            return
        }
        stickToBottomRef.current =
            el.scrollHeight - el.scrollTop - el.clientHeight < 80
    }, [])

    /** Append a delta to the trailing assistant bubble as the answer streams in. */
    const appendToAssistant = useCallback((delta: string) => {
        setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last && last.role === "assistant") {
                next[next.length - 1] = { ...last, content: last.content + delta }
            }
            return next
        })
    }, [])

    /**
     * Run an in-chat "find content" intent: append a tool-result assistant turn,
     * then fill it from a course-wide RAG search. Client-side MVP — the BE intent
     * classifier + persisted tool turn is phase 2 (this turn is not saved yet).
     */
    const runContentIntent = useCallback(async (raw: string, kind: ContentIntentKind) => {
        const courseId = course?.id
        if (!courseId) {
            return
        }
        setMessages((prev) => [
            ...prev,
            { role: "user", content: raw },
            { role: "assistant", content: "", toolResult: { kind, query: raw, items: [], isLoading: true } },
        ])
        setInput("")
        // ground the RAG search on the LESSON'S OWN topic, not the literal chat
        // phrase — "tìm flashcard liên quan" carries no topical signal (embeds
        // near nothing), so the search must run on what the learner is actually
        // reading (mirrors RelatedContentList's query={content.title}, the
        // pattern the eval measured at 93.8% recall@6).
        const groundedQuery = contentEntity?.title || raw
        let items: Array<SearchCourseContentItem> = []
        try {
            const res = await querySearchCourseContent({ courseId, searchQuery: groundedQuery })
            const all = res.data?.searchCourseContent?.data?.results ?? []
            items = all
                .filter((item) => (kind === "content"
                    ? item.kind === "content" || item.kind === "code"
                    : item.kind === kind))
                .slice(0, TOOL_RESULT_LIMIT)
        } catch {
            items = []
        }
        setMessages((prev) => {
            const next = [...prev]
            const last = next[next.length - 1]
            if (last?.role === "assistant" && last.toolResult) {
                next[next.length - 1] = { ...last, toolResult: { ...last.toolResult, items, isLoading: false } }
            }
            return next
        })
    }, [course?.id, contentEntity?.title])

    /** Send a question, creating a conversation lazily on the first message. */
    const onSend = useCallback(async (preset?: string) => {
        const raw = (preset ?? input).trim()
        if (!raw || !contentId || isStreaming) {
            return
        }
        // an in-chat "find <kind>" ask renders a pickable list, not a streamed
        // answer (skipped while a passage is selected — that path is "explain this")
        const intentKind = selection ? null : detectContentIntent(raw)
        if (intentKind && course?.id) {
            void runContentIntent(raw, intentKind)
            return
        }
        let sessionId = currentSessionId
        if (!sessionId) {
            const created = await createSwr.trigger({ contentId }).catch(() => undefined)
            sessionId = created?.data?.id ?? null
            if (!sessionId) {
                return
            }
            setCurrentSessionId(sessionId)
            hydratedRef.current = sessionId
        }
        // when a passage is selected, wrap the turn so the UI shows only the
        // question (<display>) while the model also gets the hidden <context>
        // (the surrounding paragraph + section) to reason about a short selection
        const content = selection
            ? `<display>${raw}</display>\n<context>${selectionContext ?? selection}</context>`
            : raw
        const history = messages.map((message) => ({
            role: message.role,
            content: message.content,
        }))
        setMessages((prev) => [
            ...prev,
            { role: "user", content },
            { role: "assistant", content: "" },
        ])
        setInput("")
        setSelection(null)
        setIsStreaming(true)
        ask({
            sessionId,
            contentId,
            question: content,
            history,
            model: modelSelection.model,
            provider: modelSelection.provider,
            onDelta: appendToAssistant,
            onDone: (error) => {
                setIsStreaming(false)
                void sessionsSwr.mutate()
                void sessionsInfinite.mutate()
                if (!error) {
                    return
                }
                setMessages((prev) => {
                    const next = [...prev]
                    const last = next[next.length - 1]
                    if (last && last.role === "assistant" && last.content === "") {
                        next[next.length - 1] = {
                            ...last,
                            content: `⚠️ ${error}`,
                            isQuotaError: error.startsWith("AI quota exhausted"),
                        }
                    }
                    return next
                })
            },
        })
    }, [input, contentId, isStreaming, currentSessionId, createSwr, selection, selectionContext, messages, ask, appendToAssistant, setSelection, sessionsSwr, sessionsInfinite, modelSelection, runContentIntent, course?.id])

    /** Start a fresh conversation (created lazily on the first message). */
    const onNewConversation = useCallback(() => {
        abort()
        setMessages([])
        setInput("")
        setIsStreaming(false)
        setCurrentSessionId(null)
        hydratedRef.current = undefined
        setView("chat")
    }, [abort])

    /** Open an existing conversation (re-opening the current one just returns to it). */
    const onSwitchConversation = useCallback((sessionId: string) => {
        // re-selecting the ALREADY-open conversation → just go back to the thread.
        // Do NOT wipe messages: setCurrentSessionId(sameId) is a no-op, so the
        // hydrate effect (keyed on currentSessionId + historySwr.data — both
        // unchanged) would never re-fire to restore them → the thread goes blank.
        if (sessionId === currentSessionId) {
            setView("chat")
            return
        }
        abort()
        setMessages([])
        setInput("")
        setIsStreaming(false)
        hydratedRef.current = undefined
        setCurrentSessionId(sessionId)
        // mark it just-opened server-side so reload reopens THIS conversation,
        // then revalidate the list so it reflects the new recency order
        void touchSwr.trigger({ sessionId }).then(() => sessionsSwr.mutate())
        setView("chat")
    }, [abort, touchSwr, sessionsSwr, currentSessionId])

    /** Delete a conversation; if it was open, drop back to a fresh thread. */
    const onDeleteConversation = useCallback(async (sessionId: string) => {
        await deleteSwr.trigger({ sessionId }).catch(() => undefined)
        void sessionsSwr.mutate()
        void sessionsInfinite.mutate()
        if (sessionId === currentSessionId) {
            setMessages([])
            setCurrentSessionId(null)
            hydratedRef.current = undefined
        }
    }, [deleteSwr, sessionsSwr, sessionsInfinite, currentSessionId])

    const trimmedSearch = searchTerm.trim()
    // flatten the infinite pages; a short last page means there are no more
    const infiniteItems = (sessionsInfinite.data ?? []).flat()
    const lastSessionsPage = sessionsInfinite.data?.[sessionsInfinite.data.length - 1]
    const hasMoreSessions = !!lastSessionsPage && lastSessionsPage.length === CONTENT_AI_SESSIONS_PAGE_LIMIT
    // search is course-wide on the server; scope the displayed rows to this lesson
    // (cross-lesson navigation is a later enhancement)
    const drawerSessions = trimmedSearch
        ? infiniteItems.filter((session) => session.originContentId === contentId)
        : infiniteItems

    // the model picker (shared block — composer + settings view). Auto = free
    // chain; a pinned model runs Premium when unlocked. No `floor` → Free is the
    // chatbot's normal lane (not flagged danger).
    const modelPicker = (placement: "top start" | "bottom start") => (
        <GradeModelDropdown
            className="min-w-0 max-w-full"
            models={models}
            task={AiModelTask.Chatting}
            selection={modelSelection}
            canPremium={canPremium}
            placement={placement}
            onSelect={(selection) => setSelectedModel(selection.model)}
            onUpgrade={() =>
                router.push(`${pathConfig().locale(locale).profile().build()}/ai-subscription`)}
        />
    )

    /** Fake input — parent composer/quote box owns fill + padding; Input is chỉ chỗ gõ (flat, no field chrome). */
    const FLAT_CHAT_INPUT_CLASS =
        "w-full !rounded-none border-0 !bg-transparent !p-0 !shadow-none ring-0 focus:ring-0 hover:!bg-transparent focus:!bg-transparent data-[hovered=true]:!bg-transparent data-[focused=true]:!bg-transparent"

    const chatInputField = () => (
        <TextField aria-label={t("contentAi.placeholder")} className="w-full">
            <Input
                className={FLAT_CHAT_INPUT_CLASS}
                placeholder={t("contentAi.placeholder")}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                    if (event.key === "Enter") {
                        event.preventDefault()
                        void onSend()
                    }
                }}
            />
        </TextField>
    )

    /** Render an in-chat tool-result turn: an intro line + the pickable widget
     *  (or a quiet text fallback when the search came back empty). */
    const renderToolResult = (tr: NonNullable<ChatMessage["toolResult"]>) => {
        const meta = TOOL_RESULT_META[tr.kind]
        const Icon = meta.Icon
        if (!tr.isLoading && tr.items.length === 0) {
            return (
                <div className="flex flex-col gap-2">
                    <Typography type="body-sm">{t("contentAi.toolResult.intro")}</Typography>
                    <Typography type="body-sm" color="muted">{t("contentAi.toolResult.empty")}</Typography>
                </div>
            )
        }
        return (
            <div className="flex flex-col gap-2">
                <Typography type="body-sm">{t("contentAi.toolResult.intro")}</Typography>
                <ChatToolResult
                    items={tr.items}
                    isLoading={tr.isLoading}
                    label={t(meta.labelKey)}
                    icon={<Icon className="size-4" aria-hidden focusable="false" />}
                    onSelect={onSelectSearchResult}
                    onViewAll={() => {
                        setContentSearchQuery(tr.query)
                        setDebouncedContentSearchQuery(tr.query)
                        setView("search")
                    }}
                    viewAllLabel={t("contentAi.toolResult.viewAll")}
                />
            </div>
        )
    }

    // ── conversations view ────────────────────────────────────────────────
    if (view === "conversations") {
        return (
            <div className={cn("flex h-full flex-col gap-3", className)}>
                {/* back — link sm, icon + label both muted */}
                <button
                    type="button"
                    className="group flex w-fit cursor-pointer items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                    onClick={() => setView("chat")}
                >
                    <ArrowLeftIcon className="size-4" />
                    <span className="group-hover:underline">{t("contentAi.conversations")}</span>
                </button>
                {/* search + add (add sits right next to search) */}
                <div className="flex items-center gap-2">
                    <SearchInput
                        variant="secondary"
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        placeholder={t("contentAi.searchConversations")}
                        className="!max-w-none min-w-0 flex-1"
                    />
                    <Button
                        isIconOnly
                        size="sm"
                        variant="tertiary"
                        aria-label={t("contentAi.newConversation")}
                        onPress={onNewConversation}
                    >
                        <PlusIcon className="size-5" />
                    </Button>
                </div>
                {/* list — self-bounded ScrollShadow + infinite scroll (mirror OutlineRail + followers infinite) */}
                <ScrollShadow hideScrollBar className="-mx-1 max-h-[55vh] min-h-0 min-w-0 flex-1 overflow-y-auto px-1">
                    <div className="flex flex-col gap-1">
                        {drawerSessions.length === 0 && !sessionsInfinite.isValidating ? (
                            <Typography type="body-sm" color="muted" className="px-1 py-2">
                                {t("contentAi.noConversations")}
                            </Typography>
                        ) : (
                            drawerSessions.map((session) => (
                                <div
                                    key={session.id}
                                    role="button"
                                    tabIndex={0}
                                    className={cn(
                                        "group flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition-colors hover:bg-default",
                                        session.id === currentSessionId && "bg-accent/10",
                                    )}
                                    onClick={() => onSwitchConversation(session.id)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            onSwitchConversation(session.id)
                                        }
                                    }}
                                >
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <Typography type="body-sm" className="truncate">
                                            {session.title ?? t("contentAi.untitled")}
                                        </Typography>
                                        <Typography type="body-xs" color="muted" className="truncate">
                                            {session.snippet
                                                ? displayText(session.snippet)
                                                : t("contentAi.turnsCount", { count: session.messageCount })}
                                        </Typography>
                                    </div>
                                    <button
                                        type="button"
                                        aria-label={t("contentAi.deleteConversation")}
                                        className="shrink-0 cursor-pointer text-muted opacity-0 transition-opacity hover:text-danger group-hover:opacity-100"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            void onDeleteConversation(session.id)
                                        }}
                                    >
                                        <TrashIcon className="size-4" />
                                    </button>
                                </div>
                            ))
                        )}
                        {/* grow on scroll instead of a "load more" button */}
                        <InfiniteScrollSentinel
                            onReach={() => sessionsInfinite.setSize((size) => size + 1)}
                            disabled={!hasMoreSessions || sessionsInfinite.isValidating}
                        />
                        {sessionsInfinite.isValidating ? (
                            <Typography type="body-xs" color="muted" className="px-1 py-2 text-center">
                                {t("common.loading")}
                            </Typography>
                        ) : null}
                    </div>
                </ScrollShadow>
            </div>
        )
    }

    // ── search view ("Tìm nội dung khóa") ──────────────────────────────────
    if (view === "search") {
        const results = contentSearchSwr.data ?? []
        return (
            <div className={cn("flex h-full flex-col gap-3", className)}>
                <button
                    type="button"
                    className="group flex w-fit cursor-pointer items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                    onClick={() => setView("chat")}
                >
                    <ArrowLeftIcon className="size-4" />
                    <span className="group-hover:underline">{t("contentAi.searchContent")}</span>
                </button>
                <SearchInput
                    value={contentSearchQuery}
                    onValueChange={setContentSearchQuery}
                    placeholder={t("contentAi.searchContentPlaceholder")}
                />
                <ScrollShadow hideScrollBar className="max-h-[55vh] min-h-0 flex-1 overflow-y-auto">
                    <AsyncContent
                        isLoading={contentSearchSwr.isLoading && debouncedContentSearchQuery.trim().length > 0}
                        skeleton={
                            <div className="flex flex-col gap-2">
                                {[0, 1, 2].map((row) => (
                                    <div key={row} className="h-14 animate-pulse rounded-xl bg-default" />
                                ))}
                            </div>
                        }
                        isEmpty={debouncedContentSearchQuery.trim().length > 0 && results.length === 0}
                        emptyContent={{
                            title: t("contentAi.searchContentEmpty"),
                        }}
                        error={contentSearchSwr.error}
                        errorContent={{
                            title: t("contentAi.searchContentEmpty"),
                        }}
                    >
                        {debouncedContentSearchQuery.trim().length === 0 ? (
                            <Typography type="body-sm" color="muted">
                                {t("contentAi.searchContentHint")}
                            </Typography>
                        ) : (
                            <div className="flex flex-col overflow-hidden rounded-2xl border border-default">
                                {results.map((item, index) => (
                                    <EntityResultRow
                                        key={`${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`}
                                        item={item}
                                        showKindChip
                                        showSnippet
                                        onSelect={onSelectSearchResult}
                                    />
                                ))}
                            </div>
                        )}
                    </AsyncContent>
                </ScrollShadow>
            </div>
        )
    }

    // ── settings view (model picker) ──────────────────────────────────────
    if (view === "settings") {
        return (
            <div className={cn("flex h-full flex-col gap-3", className)}>
                {/* back — link sm, icon + label both muted */}
                <button
                    type="button"
                    className="group flex w-fit cursor-pointer items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                    onClick={() => setView("chat")}
                >
                    <ArrowLeftIcon className="size-4" />
                    <span className="group-hover:underline">{t("contentAi.settings")}</span>
                </button>
                <div className="flex flex-col gap-2">
                    <Label>{t("contentAi.modelLabel")}</Label>
                    {modelPicker("bottom start")}
                </div>
            </div>
        )
    }

    // ── chat view ─────────────────────────────────────────────────────────
    return (
        <div className={cn("flex h-full flex-col gap-3", className)}>
            {/* conversation switcher — quiet go-there link (foreground + hover underline),
                opens the conversations view. Not accent: it's a secondary nav link, not a
                primary/selected signal. Paired with the search icon — both are "find
                something" actions (history = find a past chat; search = find course content). */}
            <div className="flex items-center gap-2">
                <Link
                    onPress={() => setView("conversations")}
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm font-medium text-foreground hover:underline"
                >
                    <ChatsCircleIcon className="size-5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-left">
                        {t("contentAi.chatHistory")}
                    </span>
                    <CaretDownIcon className="size-4 shrink-0" />
                </Link>
            </div>

            {/* thread — self-bounded scroll region (scroll shadow on the messages,
                not the popover); composer stays fixed below */}
            <ScrollShadow ref={scrollRef} onScroll={handleThreadScroll} hideScrollBar className="max-h-[55vh] min-h-0 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-3">
                    {messages.length === 0 && !selection ? (
                        <div className="flex flex-col gap-2">
                            <Typography type="body-sm" color="muted">
                                {t("contentAi.hint")}
                            </Typography>
                            {SUGGESTION_KEYS.map((key) => (
                                <Button
                                    key={key}
                                    variant="secondary"
                                    size="sm"
                                    className="justify-start text-start"
                                    onPress={() => onSend(t(`contentAi.suggestions.${key}`))}
                                >
                                    {t(`contentAi.suggestions.${key}`)}
                                </Button>
                            ))}
                        </div>
                    ) : (
                        messages.map((message, index) => (
                            <ChatBubble key={index} role={message.role}>
                                {message.role === "assistant" ? (
                                    message.toolResult ? (
                                        renderToolResult(message.toolResult)
                                    ) : message.content === "" ? (
                                        <Typography type="body-sm" color="muted">
                                            {t("contentAi.thinking")}
                                        </Typography>
                                    ) : message.isQuotaError ? (
                                        <div className="flex flex-col gap-2">
                                            <MarkdownContent markdown={message.content} />
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                className="self-start"
                                                onPress={() => router.push(
                                                    `${pathConfig().locale(locale).profile().build()}/ai-subscription`,
                                                )}
                                            >
                                                {t("contentAi.upgrade")}
                                                <ArrowRightIcon aria-hidden focusable="false" className="size-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <MarkdownContent markdown={message.content} />
                                    )
                                ) : (
                                    <Typography type="body-sm">
                                        {displayText(message.content)}
                                    </Typography>
                                )}
                            </ChatBubble>
                        ))
                    )}
                </div>
            </ScrollShadow>

            {/* selected-passage context — surface-in-surface on popover panel: border only, no stacked fill (elements/card §4) */}
            {selection ? (
                <div className="flex flex-col gap-2 rounded-xl border border-default bg-transparent px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
                    <div className="flex items-start gap-2">
                        <QuotesIcon className="size-4 shrink-0 text-muted" />
                        <Typography type="body-sm" color="muted" className="line-clamp-2 flex-1">
                            {selection}
                        </Typography>
                        <CloseButton
                            aria-label={t("contentAi.clearSelection")}
                            className="shrink-0 text-muted hover:bg-default"
                            onPress={() => setSelection(null)}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {SELECTION_SUGGESTION_KEYS.map((key) => (
                            <Button
                                key={key}
                                variant="secondary"
                                size="sm"
                                onPress={() => onSend(t(`contentAi.selectionSuggestions.${key}`))}
                            >
                                {t(`contentAi.selectionSuggestions.${key}`)}
                            </Button>
                        ))}
                    </div>
                    {chatInputField()}
                </div>
            ) : null}

            {/* composer — input lives in quote block while a passage is selected */}
            <div className="flex flex-col gap-2 rounded-2xl bg-default px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
                {!selection ? chatInputField() : null}
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="min-w-0 overflow-hidden">
                        {modelPicker("top start")}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="ghost"
                            aria-label={t("contentAi.settings")}
                            onPress={() => setView("settings")}
                        >
                            <GearIcon className="size-5" />
                        </Button>
                        <Button
                            isIconOnly
                            size="sm"
                            variant="primary"
                            isPending={isStreaming}
                            aria-label={t("contentAi.send")}
                            onPress={() => void onSend()}
                        >
                            <PaperPlaneTiltIcon className="size-5" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
