"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useParams,
    useRouter,
} from "next/navigation"
import useSWR from "swr"
import useSWRInfinite from "swr/infinite"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { useQueryContentSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentSwr"
import { useQueryContentStatusSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentStatusSwr"
import { useQueryCoursePricePreviewSwr } from "@/hooks/swr/api/graphql/queries/useQueryCoursePricePreviewSwr"
import { useQueryAiLabPlaygroundSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiLabPlaygroundSwr"
import { useQuerySearchCourseContentSwr } from "@/hooks/swr/api/graphql/queries/useQuerySearchCourseContentSwr"
import { useLessonNavigation } from "@/components/blocks/learn/lesson/hooks/useLessonNavigation"
import { usePaymentOverlayState, usePremiumGateOverlayState } from "@/hooks/zustand/overlay/hooks"
import { useContentDiscussionSocketIo } from "@/hooks/socketio/useContentDiscussionSocketIo"
import { contentDiscussionSocketIoEventEmitter } from "@/hooks/socketio/useContentDiscussionSocketIoLifecycle"
import { PublicationEvent } from "@/hooks/socketio/enums/publication-event"
import { SubscriptionEvent } from "@/hooks/socketio/enums/subscription-event"
import { type SubscribeContentDiscussionSocketIoPayload } from "@/hooks/socketio/types/content-discussion"
import { mutateCreateComment } from "@/modules/api/graphql/mutations/mutation-create-comment"
import { mutateUpdateComment } from "@/modules/api/graphql/mutations/mutation-update-comment"
import { mutateDeleteComment } from "@/modules/api/graphql/mutations/mutation-delete-comment"
import { mutateReactToComment } from "@/modules/api/graphql/mutations/mutation-react-to-comment"
import { mutateReactToContent } from "@/modules/api/graphql/mutations/mutation-react-to-content"
import { queryContentComments } from "@/modules/api/graphql/queries/query-content-comments"
import { queryContentReactions } from "@/modules/api/graphql/queries/query-content-reactions"
import { GraphQLHeadersKey, type GraphQLHeaders } from "@/modules/api/graphql/types"
import type { CommentNode } from "@/modules/api/graphql/queries/types/discussion"
import { PaymentFlow } from "@/modules/types/payment"
import { pathConfig } from "@/resources/path"
import { ContentTab, setContentTab } from "@/redux/slices/tabs"
import { setContentSelectedProgrammingLang } from "@/redux/slices/content"
import { listContentBodyLangs, pickContentBodyByLang, resolveContentBody } from "@/modules/types/entities/content-body"
import {
    DEFAULT_PROGRAMMING_LANGUAGES,
    isProgrammingLangAvailable,
    resolveActiveProgrammingLang,
} from "@/modules/types/utils/programming-language"
import { getContentChallengeCount } from "@/modules/types/entities/content"
import { resolveSearchResultHref } from "@/modules/learn/resolve-search-result-href"
import {
    _ContentPage,
    type ContentHeaderCrumb,
    type ContentHeaderOutcome,
    type ContentLanguage,
    type ContentMode,
    type ContentModeOption,
    type ContentPageUpNext,
    type ContentReactionType,
    type ContentRelatedItem,
} from "./component"
import {
    toArticleComment,
    toArticlePricingPhase,
    toArticleReactionCounts,
    toArticleReactionType,
    toRealReactionType,
} from "@/components/pages/_map"

/** Page size for a parent's replies (loaded in one shot per parent). */
const REPLIES_LIMIT = 50
/** Page size for the paginated top-level comment list ("load more"). */
const COMMENTS_PAGE_SIZE = 10
/** Max related-lesson rows shown (mirrors `RelatedContentList`'s own default). */
const RELATED_LIMIT = 3

/** Server -> client discussion events this page reacts to (revalidate on any). */
const DISCUSSION_EVENTS: ReadonlyArray<SubscriptionEvent> = [
    SubscriptionEvent.CommentCreated,
    SubscriptionEvent.CommentUpdated,
    SubscriptionEvent.CommentDeleted,
    SubscriptionEvent.ContentReactionChanged,
    SubscriptionEvent.CommentReactionChanged,
]

/** `ContentTab` (redux) <-> `ContentMode` (the `ContentModeNav` block's own vocabulary) — the four
 *  reader-facing tabs share the exact same string values; the extra `ContentTab` members
 *  (`codeExplainings`/`lessonVideos`/`codeImplementation`/`e2e`) have no `ContentMode` counterpart yet. */
const MODE_TO_TAB: Record<ContentMode, ContentTab> = {
    content: ContentTab.Content,
    sandbox: ContentTab.Sandbox,
    challenges: ContentTab.Challenges,
    aiLab: ContentTab.AILab,
}
const TAB_TO_MODE: Partial<Record<ContentTab, ContentMode>> = {
    [ContentTab.Content]: "content",
    [ContentTab.Sandbox]: "sandbox",
    [ContentTab.Challenges]: "challenges",
    [ContentTab.AILab]: "aiLab",
}

/**
 * `ContentPage` — the CONNECTED half of the SRC TWIN. Mirrors the data wiring already
 * proven across `LessonReader`, `LessonReader/ContentBody/ContentBodyV2`, `.../Discussion`,
 * `.../Discussion/ContentReactionBar`, `LessonReader/hooks/useLessonNavigation`, and the
 * sibling page `ContentArticle` (same lesson-reading domain, same hooks) onto the
 * storybook-driven block tree in `./component`, keyed off the SAME route params
 * (`…/modules/[moduleId]/contents/[contentId]`) `LessonReader` reads.
 *
 * STAGED TWIN: this connected component is ported but not yet mounted — the route
 * still renders the v1 `LessonReader`. Wiring is deferred debt
 * (`src-tier-ported-but-unused`), matching `ChallengePage`/`ModulePage`.
 */
export const ContentPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { open: openPremiumGate } = usePremiumGateOverlayState()

    const routeContentId = params.contentId as string | undefined
    const routeModuleId = params.moduleId as string | undefined

    const contentFromRedux = useAppSelector((state) => state.content.entity)
    const contentTab = useAppSelector((state) => state.tabs.contentTab)
    const selectedLang = useAppSelector((state) => state.content.selectedProgrammingLang)
    const course = useAppSelector((state) => state.course.entity)
    const courseId = course?.id
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const currentUser = useAppSelector((state) => state.user.user)
    const currentUserId = currentUser?.id ?? null

    const queryContentSwr = useQueryContentSwr()
    /** Prefer redux (kept warm by the reader shell / content-map rail); fall back to the SWR cache. */
    const contentSnapshot = contentFromRedux ?? queryContentSwr.data
    /** Ignore a stale entity left over after `contentId` changes until fetch/cache catches up. */
    const content =
        contentSnapshot?.id && routeContentId && contentSnapshot.id === routeContentId
            ? contentSnapshot
            : undefined
    /** First load, nothing in hand yet — the co-located shimmer formula. */
    const isLoading = queryContentSwr.isLoading && !content

    const contentStatusSwr = useQueryContentStatusSwr()
    /** AI Lab playground bound to this lesson, if any (drives the AI Lab mode). */
    const playgroundSwr = useQueryAiLabPlaygroundSwr(content?.id)

    const isLocked = content?.isPremium === true
    const isSandbox = Boolean(content?.isSandbox) && Boolean(content?.githubBaseUrl) && Boolean(content?.githubDir)
    const challengeCount = useMemo(() => getContentChallengeCount(content ?? {}), [content])

    // ---- mode (content / sandbox / challenges / AI lab) ----

    const mode: ContentMode = TAB_TO_MODE[contentTab] ?? "content"
    const modes = useMemo<Array<ContentModeOption>>(() => {
        const entries: Array<ContentModeOption> = [{ mode: "content" }]
        if (isSandbox) {
            entries.push({ mode: "sandbox" })
        }
        entries.push({ mode: "challenges", isLocked })
        if (playgroundSwr.data) {
            entries.push({ mode: "aiLab" })
        }
        return entries
    }, [isSandbox, isLocked, playgroundSwr.data])

    const onModeChange = useCallback((next: ContentMode) => {
        // A locked mode (premium `challenges`/`aiLab` for a trial viewer) opens the paywall
        // gate instead of switching — same guard `LessonReader.onTabChange` applies.
        if (modes.find((option) => option.mode === next)?.isLocked) {
            openPremiumGate()
            return
        }
        dispatch(setContentTab(MODE_TO_TAB[next]))
        router.push(
            `${pathConfig().locale(locale).course(courseDisplayId ?? "").learn()
                .module(routeModuleId ?? "").content(routeContentId ?? "").build()}?tab=${next}`,
        )
    }, [modes, openPremiumGate, dispatch, router, locale, courseDisplayId, routeModuleId, routeContentId])

    // ---- language (SCHEMA V2 bodies) ----

    const langs = useMemo(() => listContentBodyLangs(content?.bodies), [content?.bodies])
    const activeLang = useMemo(() => resolveActiveProgrammingLang(selectedLang, langs), [selectedLang, langs])
    const onLanguageChange = useCallback(
        (lang: string) => dispatch(setContentSelectedProgrammingLang(lang)),
        [dispatch],
    )
    const languages = useMemo<Array<ContentLanguage>>(
        () => DEFAULT_PROGRAMMING_LANGUAGES.map((lang) => ({
            key: lang,
            label: t(`programmingLanguage.${lang}`),
            isDisabled: !isProgrammingLangAvailable(lang, langs),
        })),
        [langs, t],
    )
    const activeBody = useMemo(
        () => resolveContentBody(pickContentBodyByLang(content?.bodies, activeLang), locale),
        [content?.bodies, activeLang, locale],
    )

    // ---- header (breadcrumb + outcomes) ----

    const breadcrumbItems = useMemo<Array<ContentHeaderCrumb>>(() => [
        { key: "home", label: t("nav.home"), onPress: () => router.push(pathConfig().locale().build()) },
        { key: "courses", label: t("nav.courses"), onPress: () => router.push(pathConfig().locale(locale).course().build()) },
        {
            key: "course",
            label: course?.title || t("nav.courses"),
            onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId ?? "").build()),
        },
        {
            key: "modules",
            label: t("modules.title"),
            onPress: () => router.push(pathConfig().locale(locale).course(courseDisplayId ?? "").learn().content().build()),
        },
    ], [t, locale, router, course?.title, courseDisplayId])

    const outcomes = useMemo<Array<ContentHeaderOutcome>>(
        () => [...(content?.outcomes ?? [])]
            .sort((left, right) => left.sortIndex - right.sortIndex)
            .map((outcome) => ({ key: outcome.id, text: outcome.text })),
        [content?.outcomes],
    )

    // ---- premium offer (loyalty-aware price preview, same source as `PremiumPaywall`) ----

    const priceSwr = useQueryCoursePricePreviewSwr(isLocked ? courseId : undefined)
    const { open: openPaymentModal } = usePaymentOverlayState()
    const onPurchase = useCallback(
        () => openPaymentModal({ flow: PaymentFlow.CourseEnroll }),
        [openPaymentModal],
    )
    const offer = useMemo(() => {
        if (!isLocked || !priceSwr.data) {
            return undefined
        }
        const price = priceSwr.data
        return {
            title: t("course.paywall.title"),
            description: t("course.paywall.description"),
            discountedPriceVnd: price.discountedPriceVnd,
            originalPriceVnd: price.originalPriceVnd,
            currentPhase: toArticlePricingPhase(price.currentPhase),
            seatsRemaining: price.seatsRemainingInCurrentPhase,
            nextPhasePriceVnd: price.nextPhasePriceVnd,
            ctaLabel: t("course.paywall.buy"),
            onPurchase,
        }
    }, [isLocked, priceSwr.data, t, onPurchase])

    // ---- reaction (content-level) — shared SWR key with the discussion realtime refresh below ----

    const contentId = content?.id
    const courseHeaders: GraphQLHeaders | undefined = courseId
        ? { [GraphQLHeadersKey.XCourseId]: courseId }
        : undefined

    const reactionsSwr = useSWR(
        contentId && courseId ? ["content-discussion-reactions", contentId] : null,
        async () => {
            const response = await queryContentReactions({
                request: { contentId: contentId as string },
                headers: courseHeaders,
            })
            return response.data?.contentReactions.data
        },
    )

    const onReact = useCallback(async (type: ContentReactionType | null) => {
        if (!contentId || !courseId) {
            return
        }
        await mutateReactToContent({
            request: { contentId, type: toRealReactionType(type) },
            headers: courseHeaders,
        })
        void reactionsSwr.mutate()
    }, [contentId, courseId, courseHeaders, reactionsSwr])

    // ---- discussion (comments + replies + realtime) ----

    const socket = useContentDiscussionSocketIo()
    const [repliesByParentRaw, setRepliesByParentRaw] = useState<Record<string, Array<CommentNode>>>({})
    const loadedParentsRef = useRef<Set<string>>(new Set())

    const commentsSwr = useSWRInfinite(
        (pageIndex, previousPageData) => {
            if (!contentId || !courseId) {
                return null
            }
            if (previousPageData && (previousPageData.comments?.length ?? 0) === 0) {
                return null
            }
            return ["content-discussion-comments", contentId, pageIndex + 1] as const
        },
        async ([, , page]) => {
            const response = await queryContentComments({
                request: { contentId: contentId as string, page, limit: COMMENTS_PAGE_SIZE },
                headers: courseHeaders,
            })
            return response.data?.contentComments.data
        },
    )

    const commentPages = commentsSwr.data ?? []
    const rawComments = commentPages.flatMap((page) => page?.comments ?? [])
    const commentsTotal = commentPages[0]?.total ?? 0
    const hasMoreComments = rawComments.length < commentsTotal
    const isLoadingMoreComments = commentsSwr.isValidating
        && commentsSwr.data !== undefined
        && typeof commentsSwr.data[commentsSwr.size - 1] === "undefined"

    const loadReplies = useCallback(async (parentId: string) => {
        if (!contentId || !courseId) {
            return
        }
        const response = await queryContentComments({
            request: { contentId, parentCommentId: parentId, limit: REPLIES_LIMIT },
            headers: courseHeaders,
        })
        const replies = response.data?.contentComments.data?.comments ?? []
        loadedParentsRef.current.add(parentId)
        setRepliesByParentRaw((prev) => ({ ...prev, [parentId]: replies }))
    }, [contentId, courseId, courseHeaders])

    const reloadLoadedReplies = useCallback(() => {
        loadedParentsRef.current.forEach((parentId) => { void loadReplies(parentId) })
    }, [loadReplies])

    const revalidateAll = useCallback(() => {
        void reactionsSwr.mutate()
        void commentsSwr.mutate()
        reloadLoadedReplies()
    }, [reactionsSwr, commentsSwr, reloadLoadedReplies])

    // join the content's discussion room (and re-join on reconnect)
    useEffect(() => {
        if (!contentId || !courseId) {
            return
        }
        const subscribe = () => {
            const payload: SubscribeContentDiscussionSocketIoPayload = { data: { contentId }, locale }
            socket.emit(PublicationEvent.SubscribeContentDiscussion, payload)
        }
        if (socket.connected) {
            subscribe()
        }
        socket.on("connect", subscribe)
        return () => { socket.off("connect", subscribe) }
    }, [socket, contentId, courseId, locale])

    // refetch affected data whenever a realtime event arrives for this content
    useEffect(() => {
        if (!contentId || !courseId) {
            return
        }
        const handler = (message: { data?: { contentId?: string } }) => {
            if (message?.data?.contentId !== contentId) {
                return
            }
            revalidateAll()
        }
        DISCUSSION_EVENTS.forEach((event) => contentDiscussionSocketIoEventEmitter.on(event, handler))
        return () => {
            DISCUSSION_EVENTS.forEach((event) => contentDiscussionSocketIoEventEmitter.off(event, handler))
        }
    }, [contentId, courseId, revalidateAll])

    const onSubmitComment = useCallback(async (bodyText: string) => {
        if (!contentId || !courseId) {
            return
        }
        await mutateCreateComment({ request: { contentId, body: bodyText }, headers: courseHeaders })
        void commentsSwr.mutate()
    }, [contentId, courseId, courseHeaders, commentsSwr])

    const onReply = useCallback(async (parentId: string, bodyText: string) => {
        if (!contentId || !courseId) {
            return
        }
        await mutateCreateComment({
            request: { contentId, parentCommentId: parentId, body: bodyText },
            headers: courseHeaders,
        })
        void commentsSwr.mutate()
        void loadReplies(parentId)
    }, [contentId, courseId, courseHeaders, commentsSwr, loadReplies])

    const onEditComment = useCallback(async (commentId: string, bodyText: string) => {
        if (!courseId) {
            return
        }
        await mutateUpdateComment({ request: { commentId, body: bodyText }, headers: courseHeaders })
        revalidateAll()
    }, [courseId, courseHeaders, revalidateAll])

    const onDeleteComment = useCallback(async (commentId: string) => {
        if (!courseId) {
            return
        }
        await mutateDeleteComment({ request: { commentId }, headers: courseHeaders })
        revalidateAll()
    }, [courseId, courseHeaders, revalidateAll])

    const onReactComment = useCallback(async (commentId: string, type: ContentReactionType | null) => {
        if (!courseId) {
            return
        }
        await mutateReactToComment({
            request: { commentId, type: toRealReactionType(type) },
            headers: courseHeaders,
        })
        revalidateAll()
    }, [courseId, courseHeaders, revalidateAll])

    const onLoadReplies = useCallback((parentId: string) => { void loadReplies(parentId) }, [loadReplies])

    const comments = useMemo(
        () => rawComments.map((comment) => toArticleComment(comment, t)),
        [rawComments, t],
    )
    const repliesByParent = useMemo(
        () => Object.fromEntries(
            Object.entries(repliesByParentRaw).map(
                ([parentId, replies]) => [parentId, replies.map((reply) => toArticleComment(reply, t))],
            ),
        ),
        [repliesByParentRaw, t],
    )

    // `ContentDiscussion` appends "· {total}" itself, so it takes a bare label (no count).
    const discussionLabel = t("content.discussionLabel")

    // ---- related lessons (course-wide RAG search on this lesson's own title) ----

    const relatedSwr = useQuerySearchCourseContentSwr(
        courseId ?? null,
        content?.title ?? "",
        Boolean(content?.title && courseId),
    )
    const relatedItems = useMemo<Array<ContentRelatedItem>>(() => {
        if (!courseDisplayId) {
            return []
        }
        const excludeId = content?.id
        return (relatedSwr.data ?? [])
            .filter((item) => !excludeId
                || (item.contentId !== excludeId && item.deckId !== excludeId && item.taskId !== excludeId))
            .slice(0, RELATED_LIMIT)
            .flatMap((item, index) => {
                const href = resolveSearchResultHref(item, locale, courseDisplayId)
                if (!href) {
                    return []
                }
                return [{
                    key: `${item.kind}-${item.contentId ?? item.deckId ?? item.taskId ?? index}`,
                    title: item.title,
                    breadcrumb: item.breadcrumb ?? undefined,
                    isLocked: item.isLocked,
                    href,
                }]
            })
    }, [relatedSwr.data, content?.id, courseDisplayId, locale])

    // ---- pager (linear course order; SWR-shared with the content-map rail) ----

    const { previous, next } = useLessonNavigation()

    // ---- mobile/tablet "practice this lesson" nudge ----

    const upNext = useMemo<ContentPageUpNext | undefined>(() => {
        if (challengeCount <= 0) {
            return undefined
        }
        return {
            eyebrow: t("content.upNext.eyebrow"),
            title: t("content.upNext.challengesTitle", { count: challengeCount }),
            description: t("content.upNext.challengesDesc"),
            ctaLabel: t("content.upNext.challengesCta"),
            onPress: () => onModeChange("challenges"),
        }
    }, [challengeCount, t, onModeChange])

    return (
        <_ContentPage
            isLoading={isLoading}
            error={!content ? queryContentSwr.error : undefined}
            onRetry={() => { void queryContentSwr.mutate() }}
            isEmpty={!isLoading && !content}
            emptyTitle={t("content.empty")}
            errorTitle={t("content.loadError")}
            retryLabel={t("content.retry")}
            breadcrumbItems={breadcrumbItems}
            title={content?.title ?? ""}
            description={content?.description || undefined}
            isRead={contentStatusSwr.data?.isRead}
            minutesRead={content?.minutesRead}
            challengeCount={challengeCount}
            outcomes={outcomes}
            modes={modes}
            mode={mode}
            onModeChange={onModeChange}
            languages={languages}
            language={activeLang}
            onLanguageChange={onLanguageChange}
            languageAriaLabel={t("content.language")}
            tabsAriaLabel={t("module.tabListAria")}
            body={activeBody || t("content.empty")}
            isLocked={isLocked}
            offer={offer}
            // NOTE: `hintText` is intentionally unset — the ask-AI-about-a-selection hint is NOT a
            // static string, it's the connected `SelectionHintCallout` (its own localStorage
            // "shown once" gate + `data-ai-selectable` article), rendered as a self-fetching child
            // when this page takes over the route, the same way `ContentArticle` leaves it unset.
            myReaction={reactionsSwr.data?.myReaction != null ? toArticleReactionType(reactionsSwr.data.myReaction) : null}
            reactionCounts={toArticleReactionCounts(reactionsSwr.data?.counts)}
            viewCount={reactionsSwr.data?.viewCount}
            onReact={onReact}
            upNext={upNext}
            relatedItems={relatedItems}
            relatedLabel={t("content.relatedContent.label")}
            discussionLabel={discussionLabel}
            currentUserId={currentUserId}
            currentUser={currentUser ? { username: currentUser.username, avatarUrl: currentUser.avatar } : null}
            comments={comments}
            commentsTotal={commentsTotal}
            repliesByParent={repliesByParent}
            onSubmitComment={onSubmitComment}
            onReply={onReply}
            onEditComment={onEditComment}
            onDeleteComment={onDeleteComment}
            onReactComment={onReactComment}
            onLoadReplies={onLoadReplies}
            hasMoreComments={hasMoreComments}
            isLoadingMoreComments={isLoadingMoreComments}
            onLoadMoreComments={() => void commentsSwr.setSize(commentsSwr.size + 1)}
            previous={previous}
            next={next}
            pagerAriaLabel={t("content.pagerAria")}
        />
    )
}
