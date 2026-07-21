"use client"

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
    Button,
    CloseButton,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownPopover,
    DropdownSection,
    DropdownTrigger,
    Link,
    ScrollShadow,
    Switch,
    Typography,
    cn,
} from "@heroui/react"
import {
    ArchiveIcon,
    ArrowLeftIcon,
    ArrowRightIcon,
    BookOpenIcon,
    CardsIcon,
    CaretDownIcon,
    ChatsCircleIcon,
    DotsThreeVerticalIcon,
    MagnifyingGlassIcon,
    PaperPlaneTiltIcon,
    PencilSimpleIcon,
    PlusIcon,
    PuzzlePieceIcon,
    QuotesIcon,
    SparkleIcon,
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
import { useMutateRenameContentAiSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateRenameContentAiSessionSwr"
import { useMutateSetContentAiSessionArchivedSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSetContentAiSessionArchivedSwr"
import { useMutateTouchContentAiSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateTouchContentAiSessionSwr"
import { ChatBubble, type ChatRole } from "@/components/blocks/feed/ChatBubble"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import { SearchInput } from "@/components/blocks/form/SearchInput"
import { InfiniteScrollSentinel } from "@/components/blocks/async/InfiniteScrollSentinel"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { querySearchCourseContent } from "@/modules/api/graphql/queries/query-search-course-content"
import { defaultChallengesListSorts, queryChallenges } from "@/modules/api/graphql/queries/query-challenges"
import type { SearchCourseContentItem } from "@/modules/api/graphql/queries/types/search-course-content"
import { ChatToolResult } from "@/components/blocks/learn/ChatToolResult"
import { EntityResultRow } from "@/components/blocks/learn/EntityResultRow"
import { SurfaceListCard, SurfaceListCardItem } from "@/components/blocks/cards/SurfaceListCard"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { useContentAiChatScopeStore } from "@/hooks/zustand/contentAiChatScope/store"

/** Props for {@link ContentAiChat}. */
export type ContentAiChatProps = WithClassNames<undefined>

/** Starter questions shown in the empty chat WITH A LESSON OPEN (keys under `contentAi.suggestions`). */
const SUGGESTION_KEYS = ["summarize", "hardest", "example"] as const

/** Scoped quick-asks shown when a lesson passage is selected (keys under `contentAi.selectionSuggestions`). */
const SELECTION_SUGGESTION_KEYS = ["explain", "example", "simplify"] as const

/**
 * The kind an in-chat "find X" intent resolves to.
 *
 * NOTE there is no `milestone` here on purpose: capstone tasks are not something
 * a learner looks up mid-lesson. They hang off the COURSE (not any content), the
 * personal-project surface is enrolled-only, and there is exactly one of it
 * reachable from the rail — so every capstone hit was noise (and, for a trial
 * viewer, a locked row). The backend still indexes and serves the kind for other
 * consumers (e.g. the mind-map node drawer); the chat just never asks for it.
 */
type ContentIntentKind = "content" | "challenge" | "flashcard"

/**
 * The retrieval "skills" the chat exposes — the ONLY tool-shaped capability it
 * has, and the reason they are surfaced as chips + a composer menu rather than a
 * slash grammar: each one runs the `searchCourseContent` RAG search and answers
 * with a PICKABLE list that navigates somewhere real.
 *
 * The old `/` palette also carried `summarize`/`explain`/`example`, which merely
 * sent a preset question and streamed plain prose back — those are not tools, so
 * they now live purely as empty-state suggestion chips ({@link SUGGESTION_KEYS})
 * and the slash grammar is gone entirely: learners here are beginners, often on a
 * phone, and a two-level `<verb> <noun>` grammar was a power-user affordance most
 * never discovered. Typing "tìm thử thách…" already routes here via
 * {@link detectContentIntent}.
 */
interface RetrievalSkill {
    /** i18n token — label at `contentAi.commands.<token>`. */
    token: string
    /** Corpus this skill searches (`all` = every kind, the mixed "related" list). */
    kind: ContentIntentKind | "all"
    /** Leading icon (signals the result kind at a glance). */
    Icon: typeof CardsIcon
}
const RETRIEVAL_SKILLS: ReadonlyArray<RetrievalSkill> = [
    { token: "challenges", kind: "challenge", Icon: PuzzlePieceIcon },
    { token: "flashcards", kind: "flashcard", Icon: CardsIcon },
    { token: "lessons", kind: "content", Icon: BookOpenIcon },
    { token: "related", kind: "all", Icon: SparkleIcon },
]

/**
 * Which retrieval chips lead the EMPTY state, per scope.
 *
 * Course scope leads with `lessons` because with no lesson open the first useful
 * move is finding one; lesson scope has no reason to offer it (you are already in
 * one) and leads with the practice that follows the reading instead.
 */
const EMPTY_STATE_SKILLS: Record<ChatContextScope, ReadonlyArray<string>> = {
    content: ["challenges", "flashcards"],
    course: ["lessons", "challenges", "flashcards"],
    // a capstone task and a foundation each read like a single lesson — lead with
    // the practice that follows the reading, not "find a lesson" (you are in one)
    task: ["challenges", "flashcards"],
    foundation: ["challenges", "flashcards"],
}

/**
 * Label for a retrieval chip, worded for the scope it will actually search.
 *
 * The labels used to be fixed lesson-wording ("Tìm challenges liên quan BÀI NÀY")
 * and rendered in both scopes, so on a lesson-less surface the chat offered to
 * search a lesson that was not open — and answered with hits from unrelated
 * modules. The search itself was always course-wide; only the promise was wrong.
 */
const SCOPE_LABEL_SUFFIX: Record<ChatContextScope, string> = {
    content: "OfLesson",
    course: "InCourse",
    task: "OfTask",
    foundation: "OfFoundation",
}
const retrievalLabelKey = (token: string, scope: ChatContextScope): string =>
    `contentAi.commands.${token}${SCOPE_LABEL_SUFFIX[scope]}`

/**
 * Which grounding the next question runs against — surfaced to the learner as the
 * context pill above the composer so it is never a mystery what the AI is reading.
 * `content` is the DEFAULT whenever a lesson is open; `course` is both the
 * automatic fallback on a lesson-less surface (flashcards, mind-map, leaderboard)
 * and an explicit widening the learner can pick while reading.
 */
type ChatContextScope = "content" | "course" | "task" | "foundation"

/** A find-verb that signals the learner wants a LIST of course content, not a chat answer. */
const CONTENT_INTENT_VERB_RE = /(tìm|find|gợi ý|liệt kê|list|show|kiếm)/i

/** Kind noun → the corpus kind to search. */
const CONTENT_INTENT_KINDS: Array<{ re: RegExp, kind: ContentIntentKind }> = [
    { re: /(flashcard|thẻ)/i, kind: "flashcard" },
    { re: /(thử thách|challenge|bài tập)/i, kind: "challenge" },
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

/** Per-kind header presentation for the in-chat tool-result widget (`all` = the
 * mixed "related content" list from the `/related` command). */
const TOOL_RESULT_META: Record<ContentIntentKind | "all", { labelKey: string, Icon: typeof CardsIcon }> = {
    flashcard: { labelKey: "entityResult.kindFlashcard", Icon: CardsIcon },
    content: { labelKey: "entityResult.kindContent", Icon: BookOpenIcon },
    challenge: { labelKey: "entityResult.kindChallenge", Icon: PuzzlePieceIcon },
    all: { labelKey: "contentAi.toolResult.relatedLabel", Icon: SparkleIcon },
}

/** Corpus kinds the chat's "everything related" skill spans — capstone tasks excluded (see {@link ContentIntentKind}). */
const RELATED_KINDS: ReadonlyArray<string> = ["content", "code", "challenge", "flashcard"]

/** Number of rows the in-chat tool result shows before "see all". */
const TOOL_RESULT_LIMIT = 5

/**
 * The open lesson's OWN challenges, shaped as tool-result rows.
 *
 * A challenge hangs off exactly one content (FK `content_id`), so while a lesson
 * is open "thử thách của bài này" is an exact list, not a similarity guess — this
 * reads the challenges-by-content query instead of RAG. Never locked: the learner
 * is already reading the parent lesson, so they can open its challenges.
 *
 * @param contentId - The open lesson.
 * @param contentTitle - Its title, used as each row's breadcrumb.
 * @returns Up to {@link TOOL_RESULT_LIMIT} rows (empty when the lesson has none).
 */
const loadContentChallenges = async (
    contentId: string,
    contentTitle: string | null,
): Promise<Array<SearchCourseContentItem>> => {
    const res = await queryChallenges({
        request: {
            contentId,
            filters: {
                pageNumber: 0,
                limit: TOOL_RESULT_LIMIT,
                sorts: defaultChallengesListSorts,
            },
        },
    })
    const rows = res.data?.challenges?.data?.data ?? []
    return rows.map((challenge) => ({
        kind: "challenge",
        title: challenge.title,
        breadcrumb: contentTitle,
        snippet: challenge.description ?? "",
        // a direct relation, not a similarity ranking — score is only used for
        // ordering RAG hits, and these arrive already ordered by `sortIndex`
        score: 1,
        moduleId: null,
        contentId,
        deckId: null,
        taskId: null,
        isLocked: false,
    }))
}

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
        /** Which corpus the results belong to (drives the header label/icon);
         *  `all` = the mixed "related content" list from the `/related` command. */
        kind: ContentIntentKind | "all"
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
    // grounding ids for the non-lesson scopes (capstone task, foundation) — the
    // route/outline populate these via redux (milestone.selectedTaskId is set by
    // MilestoneOutline/PersonalProject; foundation.foundationId by
    // useSyncReduxFoundationId). Absent → the scope falls back to course.
    const taskId = useAppSelector((state) => state.milestone.selectedTaskId)
    const foundationId = useAppSelector((state) => state.foundation.foundationId)
    const { ask, abort } = useContentAiStream()
    const { close: closeChat } = useContentAiChatOverlayState()
    const [messages, setMessages] = useState<Array<ChatMessage>>([])
    const [input, setInput] = useState("")
    // whether the composer's retrieval-skill menu is open (the ⌥ button) — the
    // mid-conversation way to reach the skills once the empty-state chips are gone
    const [isSkillMenuOpen, setSkillMenuOpen] = useState(false)
    // explicit "ask the whole course instead" widening while a lesson IS open;
    // ignored (and reset) when there is no lesson to narrow back to.
    // Lives in a store, not local state: the scope PILL renders in the panel
    // header (rail + drawer), so the host has to read the same value this body
    // grounds on — otherwise the header could claim a scope the next question
    // does not use.
    const { prefersCourseScope, resetScope } = useContentAiChatScopeStore()
    const [isStreaming, setIsStreaming] = useState(false)
    // lesson passage the learner highlighted to ask about (set by ContentAiSelectionAsk)
    const { selection, selectionContext, setSelection } = useContentAiSelection()

    // which conversation (session) is open + which in-panel view is showing
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [view, setView] = useState<PanelView>("chat")
    const [searchTerm, setSearchTerm] = useState("")
    // "Đã lưu trữ" toggle — folds archived conversations into the history list
    // (born-archived selection chats + anything manually archived). Default off.
    const [showArchived, setShowArchived] = useState(false)
    // inline-rename state: which history row is being renamed + its draft title
    const [renamingSessionId, setRenamingSessionId] = useState<string | null>(null)
    const [renameDraft, setRenameDraft] = useState("")

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

    // ACTIVE SCOPE — one session per scope. A lesson grounds on itself unless the
    // learner widened to the course; with no lesson open the surface picks the
    // next grounding it has (capstone task → foundation → whole course).
    // Everything downstream (what we send, which chips show, what the pill says)
    // reads this one value.
    const scope: ChatContextScope = prefersCourseScope
        ? "course"
        : contentId
            ? "content"
            : taskId
                ? "task"
                : foundationId
                    ? "foundation"
                    : "course"
    const isContentScope = scope === "content"
    // what the next question actually grounds on — exactly one id per scope
    const askContentId = scope === "content" ? contentId : undefined
    const askTaskId = scope === "task" ? taskId : undefined
    const askFoundationId = scope === "foundation" ? foundationId : undefined
    const askCourseId = scope === "course" ? course?.id : undefined
    // the raw SURFACE key — changes when the learner moves to a different
    // lesson/task/foundation/course, but NOT when they widen a lesson to course
    // (a widen is an overlay on the same surface → same session). Drives the reset
    // + auto-select effects so each scope keeps its own thread.
    const baseSurfaceKey = contentId
        ? `content:${contentId}`
        : taskId
            ? `task:${taskId}`
            : foundationId
                ? `foundation:${foundationId}`
                : `course:${course?.id ?? ""}`
    // a SELECTED PASSAGE is its own scope-key → its own born-archived side-thread
    // (inherits the surface grounding + the passage). Selecting or changing the
    // highlight resets to a fresh thread; clearing it (✕ / navigating) reverts to
    // the surface's own conversation.
    const surfaceScopeKey = selection
        ? `${baseSurfaceKey}|sel:${selection}`
        : baseSurfaceKey

    // recent conversations for the header (auto-select most recent + current title).
    // Each surface lists ITS OWN sessions: the active scope + its single anchor go
    // to the query, so a lesson lists that lesson's, a task that task's, a
    // foundation that foundation's, and the course surface the whole-course ones.
    const sessionsSwr = useQueryContentAiSessionsSwr(
        askContentId,
        undefined,
        askCourseId,
        scope,
        askTaskId,
        askFoundationId,
    )
    // the conversations view list is paginated/infinite (mirror followers infinite)
    const sessionsInfinite = useQueryContentAiSessionsInfiniteSwr(
        askContentId,
        searchTerm,
        view === "conversations",
        askCourseId,
        showArchived,
        scope,
        askTaskId,
        askFoundationId,
    )
    // saved turns of the OPEN conversation
    const historySwr = useQueryContentAiHistorySwr(currentSessionId ?? undefined)
    const createSwr = useMutateCreateContentAiSessionSwr()
    const deleteSwr = useMutateClearContentAiHistorySwr()
    const renameSwr = useMutateRenameContentAiSessionSwr()
    const archiveSwr = useMutateSetContentAiSessionArchivedSwr()
    const touchSwr = useMutateTouchContentAiSessionSwr()

    const hydratedRef = useRef<string | undefined>(undefined)
    // which surface-scope the auto-select effect has already resumed a session for
    // (guards it from re-firing on unrelated re-renders / streamed tokens)
    const scopeSelectedRef = useRef<string | undefined>(undefined)
    const prevContentIdRef = useRef<string | undefined>(undefined)
    // thread scroll container — auto-follow the answer to the bottom as it
    // streams, scrolling ONLY this region (never the page)
    const scrollRef = useRef<HTMLDivElement>(null)
    // whether the user is pinned to the bottom; false once they scroll up to
    // re-read, so streaming does not drag them back down
    const stickToBottomRef = useRef<boolean>(true)

    // One session per scope, NO carry-thread. Moving to a different surface
    // (lesson → task → foundation → course) RESETS the thread; the auto-select
    // effect below then resumes THAT surface's own most-recent session (or leaves
    // an empty thread until the first question). Continuity between scopes comes
    // from the conversations history list — never from carrying turns across, so
    // there is no context divider either.
    useEffect(() => {
        abort()
        setInput("")
        setIsStreaming(false)
        setView("chat")
        setSearchTerm("")
        setContentSearchQuery("")
        setDebouncedContentSearchQuery("")
        // a widening belongs to the surface it was made on — landing on a new one
        // starts from that surface's natural scope again
        resetScope()
        setSkillMenuOpen(false)
        hydratedRef.current = undefined
        setMessages([])
        setCurrentSessionId(null)
        scopeSelectedRef.current = undefined
    }, [surfaceScopeKey, abort, resetScope])

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

    // once this scope's conversations load, reopen the most recent one — opening a
    // chat bumps its recency server-side (touchSession), so "most recent" = the
    // last conversation the user read in this scope (persisted in the DB, not the
    // browser). Runs for EVERY scope now, so task/foundation/course resume too.
    useEffect(() => {
        if (scopeSelectedRef.current === surfaceScopeKey) {
            return
        }
        // a selected-passage thread is a fresh born-archived side-chat — it is NOT
        // in the surface list, so never resume a surface session into it. Start
        // empty; the born-archived session is created on the first ask.
        if (selection) {
            setCurrentSessionId(null)
            scopeSelectedRef.current = surfaceScopeKey
            return
        }
        if (sessionsSwr.data === undefined) {
            return
        }
        setCurrentSessionId(sessionsSwr.data[0]?.id ?? null)
        scopeSelectedRef.current = surfaceScopeKey
    }, [surfaceScopeKey, sessionsSwr.data, selection])

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
     * then fill it. Client-side MVP — the BE intent classifier + persisted tool
     * turn is phase 2 (this turn is not saved yet).
     *
     * Two data paths, because they answer two different questions:
     * - **Challenges while a lesson is open** come from the challenges-OF-THIS-CONTENT
     *   query, not RAG. A challenge belongs to exactly one lesson (FK `content_id`),
     *   so "thử thách của bài này" has an EXACT, complete answer; semantic search
     *   could rank this lesson's own challenges below another lesson's, or miss them.
     * - **Everything else** is a semantic question ("what in this course relates to
     *   what I'm reading") → course-wide RAG.
     */
    const runContentIntent = useCallback(async (raw: string, kind: ContentIntentKind | "all") => {
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
            if (kind === "challenge" && contentId) {
                items = await loadContentChallenges(contentId, contentEntity?.title ?? null)
            } else {
                // scope the retrieval to the kinds we actually render: the backend takes
                // ONE top-k across every kind, so an unscoped topical query comes back
                // content-dominated and the old client-side filter emptied the list.
                const kinds = kind === "all"
                    ? [...RELATED_KINDS]
                    : kind === "content"
                        ? ["content", "code"]
                        : [kind]
                const res = await querySearchCourseContent({ courseId, searchQuery: groundedQuery, kinds })
                const all = res.data?.searchCourseContent?.data?.results ?? []
                items = all
                    // defensive: the backend serves capstone hits to other consumers,
                    // and the chat never shows them (see ContentIntentKind)
                    .filter((item) => item.kind !== "milestone")
                    .slice(0, TOOL_RESULT_LIMIT)
            }
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
    }, [course?.id, contentEntity?.title, contentId])

    /** Send a question, creating a conversation lazily on the first message. */
    const onSend = useCallback(async (preset?: string) => {
        const raw = (preset ?? input).trim()
        // a question needs SOME grounding scope — a lesson, capstone task,
        // foundation, or the whole course (a missing id must not silently swallow the send)
        if (!raw || (!askContentId && !askTaskId && !askFoundationId && !askCourseId) || isStreaming) {
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
            const created = await createSwr
                .trigger({
                    contentId: askContentId,
                    taskId: askTaskId,
                    foundationId: askFoundationId,
                    courseId: askCourseId,
                    // a selection-passage ask is a born-archived side-thread
                    archived: selection ? true : undefined,
                })
                .catch(() => undefined)
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
        // KEEP the selection sticky: it is part of the scope-key, so clearing it
        // here would revert the key and reset the thread — wiping the answer that
        // is about to stream. The passage stays (its input + quick-asks remain) so
        // follow-ups accumulate in the SAME born-archived side-thread; the learner
        // dismisses it with the quote's ✕ (or by navigating) to return to the
        // surface's own conversation.
        setIsStreaming(true)
        ask({
            sessionId,
            contentId: askContentId,
            taskId: askTaskId,
            foundationId: askFoundationId,
            courseId: askCourseId,
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
    }, [input, askContentId, askTaskId, askFoundationId, askCourseId, isStreaming, currentSessionId, createSwr, selection, selectionContext, messages, ask, appendToAssistant, setSelection, sessionsSwr, sessionsInfinite, modelSelection, runContentIntent, course?.id])

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

    /** Archive a conversation (drops from the default list, stays searchable);
     *  if it was open, drop back to a fresh thread. */
    const onArchiveConversation = useCallback(async (sessionId: string) => {
        await archiveSwr.trigger({ sessionId, archived: true }).catch(() => undefined)
        void sessionsSwr.mutate()
        void sessionsInfinite.mutate()
        if (sessionId === currentSessionId) {
            setMessages([])
            setCurrentSessionId(null)
            hydratedRef.current = undefined
        }
    }, [archiveSwr, sessionsSwr, sessionsInfinite, currentSessionId])

    /** Open the inline rename editor for a row, seeded with its current title. */
    const onStartRename = useCallback((sessionId: string, currentTitle: string | null) => {
        setRenamingSessionId(sessionId)
        setRenameDraft(currentTitle ?? "")
    }, [])

    /** Commit the inline rename (blank title resets to auto-titling); revalidate the lists. */
    const onCommitRename = useCallback(async () => {
        const sessionId = renamingSessionId
        if (!sessionId) {
            return
        }
        setRenamingSessionId(null)
        await renameSwr.trigger({ sessionId, title: renameDraft.trim() }).catch(() => undefined)
        void sessionsSwr.mutate()
        void sessionsInfinite.mutate()
    }, [renamingSessionId, renameDraft, renameSwr, sessionsSwr, sessionsInfinite])

    const trimmedSearch = searchTerm.trim()
    // flatten the infinite pages; a short last page means there are no more
    const infiniteItems = (sessionsInfinite.data ?? []).flat()
    const lastSessionsPage = sessionsInfinite.data?.[sessionsInfinite.data.length - 1]
    const hasMoreSessions = !!lastSessionsPage && lastSessionsPage.length === CONTENT_AI_SESSIONS_PAGE_LIMIT
    // search is course-wide on the server. In LESSON scope narrow the displayed rows
    // back to this lesson (cross-lesson navigation is a later enhancement); in COURSE
    // scope keep every row — there is no lesson to narrow to, and filtering on an
    // absent contentId would silently empty the whole result list.
    const drawerSessions = trimmedSearch && isContentScope
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

    /** Run one retrieval skill (chip or ⌥ menu row) — same RAG list either way. */
    const runRetrievalSkill = useCallback((skill: RetrievalSkill) => {
        setSkillMenuOpen(false)
        if (!course?.id) {
            return
        }
        // the label IS the question that lands in the thread, so it has to be the
        // scoped one — this is what put "Tìm challenges liên quan bài này" in the
        // transcript on a surface with no lesson open
        void runContentIntent(t(retrievalLabelKey(skill.token, scope)), skill.kind)
    }, [course?.id, runContentIntent, scope, t])

    /** Plain input — parent composer/quote box owns fill + padding; this is chỉ chỗ gõ
     *  (no HeroUI field chrome, so it never nests a second border/ring inside the box). */
    const chatInputField = () => (
        <input
            type="text"
            aria-label={t("contentAi.placeholder")}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted"
            placeholder={t("contentAi.placeholder")}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
                // plain composer: Enter sends. A retrieval ask needs no special
                // grammar — `detectContentIntent` picks "tìm thử thách…" out of
                // ordinary typing inside `onSend`.
                if (event.key === "Enter") {
                    event.preventDefault()
                    void onSend()
                }
                if (event.key === "Escape" && isSkillMenuOpen) {
                    event.preventDefault()
                    setSkillMenuOpen(false)
                }
            }}
        />
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
                    <span className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">{t("contentAi.conversations")}</span>
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
                {/* fold archived conversations into the list — born-archived selection
                    chats + anything the learner manually archived (search always spans
                    archived regardless, so this only affects plain browsing) */}
                <label className="flex cursor-pointer items-center justify-between gap-2">
                    <Typography type="body-sm" color="muted">{t("contentAi.showArchived")}</Typography>
                    <Switch
                        className="shrink-0"
                        isSelected={showArchived}
                        onChange={setShowArchived}
                        aria-label={t("contentAi.showArchived")}
                    >
                        <Switch.Content>
                            <Switch.Control>
                                <Switch.Thumb />
                            </Switch.Control>
                        </Switch.Content>
                    </Switch>
                </label>
                {/* list — self-bounded ScrollShadow + infinite scroll (mirror OutlineRail + followers infinite) */}
                <ScrollShadow hideScrollBar className="-mx-1 max-h-[55vh] min-h-0 min-w-0 flex-1 overflow-y-auto px-1">
                    <AsyncContent
                        isLoading={sessionsInfinite.data === undefined}
                        skeleton={
                            <SurfaceListCard bordered>
                                {[0, 1, 2].map((row) => (
                                    <SurfaceListCardItem key={row}>
                                        <div className="flex items-center gap-2">
                                            <div className="flex min-w-0 flex-1 flex-col gap-0">
                                                <Skeleton.Typography type="body-sm" width="2/3" />
                                                <Skeleton.Typography type="body-xs" width="1/2" />
                                            </div>
                                            {/* matches the row's ⋯ overflow-menu trigger (size-sm icon button) */}
                                            <Skeleton className="size-8 shrink-0 rounded-xl" />
                                        </div>
                                    </SurfaceListCardItem>
                                ))}
                            </SurfaceListCard>
                        }
                        isEmpty={drawerSessions.length === 0}
                        emptyContent={{
                            title: t("contentAi.noConversations"),
                        }}
                        error={sessionsInfinite.error}
                        errorContent={{
                            title: t("contentAi.noConversations"),
                        }}
                    >
                        <SurfaceListCard bordered>
                            {drawerSessions.map((session) => (
                                <SurfaceListCardItem key={session.id}>
                                    <div
                                        className={cn(
                                            "group flex items-center gap-2",
                                            session.id === currentSessionId && "text-accent-soft-foreground",
                                        )}
                                    >
                                        {renamingSessionId === session.id ? (
                                            // inline rename — replaces the title row while editing;
                                            // Enter / blur commits, Escape cancels
                                            <input
                                                type="text"
                                                autoFocus
                                                aria-label={t("contentAi.renameConversation")}
                                                className="min-w-0 flex-1 border-b border-default bg-transparent py-1 text-sm text-foreground outline-none focus:border-accent"
                                                value={renameDraft}
                                                onChange={(event) => setRenameDraft(event.target.value)}
                                                onBlur={() => void onCommitRename()}
                                                onKeyDown={(event) => {
                                                    if (event.key === "Enter") {
                                                        event.preventDefault()
                                                        void onCommitRename()
                                                    }
                                                    if (event.key === "Escape") {
                                                        event.preventDefault()
                                                        setRenamingSessionId(null)
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <button
                                                type="button"
                                                className="flex min-w-0 flex-1 cursor-pointer flex-col text-left"
                                                onClick={() => onSwitchConversation(session.id)}
                                            >
                                                <Typography type="body-sm" className="truncate">
                                                    {session.title ?? t("contentAi.untitled")}
                                                </Typography>
                                                {/* WHERE this conversation was had + how long it ran.
                                                    Sessions split per lesson, so without the source a
                                                    learner sees a pile of fragments with no idea which
                                                    belongs where. The snippet only replaces it while
                                                    SEARCHING — that is the one moment it earns the row,
                                                    by showing which line matched. */}
                                                <Typography type="body-xs" color="muted" className="truncate">
                                                    {/* content rows carry their lesson title; course rows read
                                                        "Cả khoá"; task/foundation rows have no origin title (null),
                                                        so they fall back to just the turn count rather than a
                                                        misleading course-wide label. */}
                                                    {searchTerm.trim() && session.snippet
                                                        ? displayText(session.snippet)
                                                        : session.originContentTitle
                                                            ? `${session.originContentTitle} · ${t("contentAi.turnsCount", { count: session.messageCount })}`
                                                            : session.scope === "course"
                                                                ? `${t("contentAi.context.courseWide")} · ${t("contentAi.turnsCount", { count: session.messageCount })}`
                                                                : t("contentAi.turnsCount", { count: session.messageCount })}
                                                </Typography>
                                            </button>
                                        )}
                                        {/* overflow menu ⋯ — Đổi tên · Lưu trữ · Xoá (hidden while
                                            this row is being renamed) */}
                                        {renamingSessionId === session.id ? null : (
                                            <Dropdown>
                                                <DropdownTrigger className="shrink-0 cursor-pointer">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        variant="tertiary"
                                                        aria-label={t("contentAi.conversationActions")}
                                                    >
                                                        <DotsThreeVerticalIcon weight="bold" className="size-5" />
                                                    </Button>
                                                </DropdownTrigger>
                                                <DropdownPopover placement="bottom end" className="min-w-44">
                                                    <DropdownMenu aria-label={t("contentAi.conversationActions")}>
                                                        <DropdownSection>
                                                            <DropdownItem
                                                                key="rename"
                                                                onPress={() => onStartRename(session.id, session.title)}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <PencilSimpleIcon className="size-4 shrink-0" />
                                                                    <span className="text-sm">{t("contentAi.renameConversation")}</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                key="archive"
                                                                onPress={() => void onArchiveConversation(session.id)}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <ArchiveIcon className="size-4 shrink-0" />
                                                                    <span className="text-sm">{t("contentAi.archiveConversation")}</span>
                                                                </div>
                                                            </DropdownItem>
                                                            <DropdownItem
                                                                key="delete"
                                                                className="text-danger-soft-foreground"
                                                                onPress={() => void onDeleteConversation(session.id)}
                                                            >
                                                                <div className="flex items-center gap-2">
                                                                    <TrashIcon className="size-4 shrink-0" />
                                                                    <span className="text-sm">{t("contentAi.deleteConversation")}</span>
                                                                </div>
                                                            </DropdownItem>
                                                        </DropdownSection>
                                                    </DropdownMenu>
                                                </DropdownPopover>
                                            </Dropdown>
                                        )}
                                    </div>
                                </SurfaceListCardItem>
                            ))}
                        </SurfaceListCard>
                    </AsyncContent>
                    {/* grow on scroll instead of a "load more" button */}
                    <InfiniteScrollSentinel
                        onReach={() => sessionsInfinite.setSize((size) => size + 1)}
                        disabled={!hasMoreSessions || sessionsInfinite.isValidating}
                    />
                    {sessionsInfinite.isValidating && sessionsInfinite.data !== undefined ? (
                        <Typography type="body-xs" color="muted" className="px-1 py-2 text-center">
                            {t("common.loading")}
                        </Typography>
                    ) : null}
                </ScrollShadow>
            </div>
        )
    }

    // ── search view ("Tìm nội dung khóa") ──────────────────────────────────
    if (view === "search") {
        // same exclusion as the in-chat skills: the chat never surfaces capstone
        // tasks, so its own "see all" view must not either (see ContentIntentKind)
        const results = (contentSearchSwr.data ?? []).filter((item) => item.kind !== "milestone")
        return (
            <div className={cn("flex h-full flex-col gap-3", className)}>
                <button
                    type="button"
                    className="group flex w-fit cursor-pointer items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                    onClick={() => setView("chat")}
                >
                    <ArrowLeftIcon className="size-4" />
                    <span className="underline-offset-4 decoration-[var(--separator-tertiary)] group-hover:underline">{t("contentAi.searchContent")}</span>
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
                            <SurfaceListCard bordered>
                                {[0, 1, 2].map((row) => (
                                    <SurfaceListCardItem key={row}>
                                        <div className="flex items-center gap-2">
                                            <div className="flex min-w-0 flex-1 flex-col gap-0">
                                                <Skeleton.Typography type="body-sm" width="2/3" />
                                                <Skeleton.Typography type="body-xs" width="1/2" />
                                            </div>
                                            <Skeleton className="size-4 shrink-0 rounded" />
                                        </div>
                                    </SurfaceListCardItem>
                                ))}
                            </SurfaceListCard>
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
                    className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 text-sm font-medium text-foreground underline-offset-4 decoration-[var(--separator-tertiary)] hover:underline"
                >
                    <ChatsCircleIcon className="size-5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate text-left">
                        {t("contentAi.chatHistory")}
                    </span>
                    <CaretDownIcon weight="bold" className="size-4 shrink-0" />
                </Link>
            </div>

            {/* thread — self-bounded scroll region (scroll shadow on the messages,
                not the popover); composer stays fixed below */}
            <ScrollShadow ref={scrollRef} onScroll={handleThreadScroll} hideScrollBar className="max-h-[55vh] min-h-0 flex-1 overflow-y-auto">
                <div className="flex flex-col gap-3">
                    {messages.length === 0 && !selection ? (
                        <div className="flex flex-col gap-2">
                            <Typography type="body-sm" color="muted">
                                {isContentScope
                                    ? t("contentAi.hint")
                                    : t("contentAi.courseHint")}
                            </Typography>
                            {/* summarize / hardest / example only make sense against an
                                OPEN lesson — there is no "this lesson" to summarise for a
                                task / foundation / course, so those scopes offer retrieval only */}
                            {isContentScope ? SUGGESTION_KEYS.map((key) => (
                                <Button
                                    key={key}
                                    variant="secondary"
                                    size="sm"
                                    className="justify-start text-start"
                                    onPress={() => onSend(t(`contentAi.suggestions.${key}`))}
                                >
                                    {t(`contentAi.suggestions.${key}`)}
                                </Button>
                            )) : null}
                            {/* retrieval skills — available in BOTH scopes (the search is
                                course-wide either way), but the LABEL follows the scope so
                                a lesson-less surface never offers "of this lesson" */}
                            {RETRIEVAL_SKILLS
                                .filter((skill) => EMPTY_STATE_SKILLS[scope].includes(skill.token))
                                .map((skill) => {
                                    const SkillIcon = skill.Icon
                                    return (
                                        <Button
                                            key={skill.token}
                                            variant="secondary"
                                            size="sm"
                                            className="justify-start text-start"
                                            onPress={() => runRetrievalSkill(skill)}
                                        >
                                            <SkillIcon aria-hidden focusable="false" className="size-4 shrink-0 text-muted" />
                                            {t(retrievalLabelKey(skill.token, scope))}
                                        </Button>
                                    )
                                })}
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

            {/* retrieval-skill menu — the ⌥ composer button opens it. This replaces the
                old "/" grammar: same capabilities, but TAPPABLE (works on a phone) and
                reachable MID-conversation, once the empty-state chips are gone. */}
            {isSkillMenuOpen ? (
                <div
                    role="listbox"
                    aria-label={t("contentAi.commands.aria")}
                    className="flex flex-col overflow-hidden rounded-2xl border border-default bg-surface"
                >
                    <div className="px-3 pb-1 pt-2">
                        <Typography type="body-xs" color="muted">{t("contentAi.commands.hint")}</Typography>
                    </div>
                    <ScrollShadow hideScrollBar className="max-h-64 min-h-0 overflow-y-auto p-1">
                        {RETRIEVAL_SKILLS.map((skill) => {
                            const SkillIcon = skill.Icon
                            return (
                                <Button
                                    key={skill.token}
                                    variant="ghost"
                                    className="h-auto w-full justify-start gap-3 px-3 py-2 text-start"
                                    onPress={() => runRetrievalSkill(skill)}
                                >
                                    <SkillIcon className="size-4 shrink-0 text-muted" aria-hidden focusable="false" />
                                    <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
                                        {t(retrievalLabelKey(skill.token, scope))}
                                    </span>
                                </Button>
                            )
                        })}
                    </ScrollShadow>
                </div>
            ) : null}

            {/* The CONTEXT PILL used to live here, above the composer. It moved into
                the panel HEADER (`ContentAiScopePill`, rendered by the rail + drawer):
                the header already named the same thing as a plain title, so the panel
                stated its context twice, two screen-heights apart. */}

            {/* composer — input lives in quote block while a passage is selected */}
            <div className="flex flex-col gap-2 rounded-2xl bg-default px-3 py-2 focus-within:ring-2 focus-within:ring-accent">
                {!selection ? chatInputField() : null}
                <div className="flex w-full items-center justify-between gap-2">
                    <div className="min-w-0 overflow-hidden">
                        {modelPicker("top start")}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        {/* retrieval skills, mid-conversation — the tappable replacement
                            for the removed "/" grammar */}
                        <Button
                            isIconOnly
                            size="sm"
                            variant="tertiary"
                            aria-label={t("contentAi.commands.aria")}
                            aria-expanded={isSkillMenuOpen}
                            onPress={() => setSkillMenuOpen((previous) => !previous)}
                        >
                            <MagnifyingGlassIcon className="size-5" />
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
