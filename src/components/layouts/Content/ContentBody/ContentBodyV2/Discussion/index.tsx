"use client"

import React, {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react"
import useSWR from "swr"
import useSWRInfinite from "swr/infinite"
import { useLocale } from "next-intl"
import { useAppSelector } from "@/redux"
import { Discussion } from "@/components/reuseable"
import {
    GraphQLHeadersKey,
    mutateCreateComment,
    mutateDeleteComment,
    mutateReactToComment,
    mutateReactToContent,
    mutateUpdateComment,
    queryContentComments,
    queryContentReactions,
    ReactionType,
    type CommentNode,
    type GraphQLHeaders,
} from "@/modules/api"
import {
    contentDiscussionSocketIoEventEmitter,
    PublicationEvent,
    SubscriptionEvent,
    useContentDiscussionSocketIo,
    type SubscribeContentDiscussionSocketIoPayload,
} from "@/hooks/singleton"

/** Page size for a parent's replies (loaded in one shot per parent). */
const REPLIES_LIMIT = 50

/** Page size for the paginated top-level comment list ("load more"). */
const COMMENTS_PAGE_SIZE = 10

/** Server → client discussion events this container reacts to (revalidate on any). */
const DISCUSSION_EVENTS: ReadonlyArray<SubscriptionEvent> = [
    SubscriptionEvent.CommentCreated,
    SubscriptionEvent.CommentUpdated,
    SubscriptionEvent.CommentDeleted,
    SubscriptionEvent.ContentReactionChanged,
    SubscriptionEvent.CommentReactionChanged,
]

/**
 * Container for the lesson-content discussion (reactions + threaded comments).
 *
 * Owns the data hooks (local SWR), the realtime socket subscription, and all persistence
 * callbacks; renders the presentational {@link Discussion}. Mounted at the bottom of
 * {@link ContentBodyV2}. `"use client"` for hooks + socket.
 */
export const ContentDiscussion = () => {
    const locale = useLocale()
    const contentId = useAppSelector((state) => state.content.entity?.id)
    const currentUserId = useAppSelector((state) => state.user.user?.id ?? null)
    // the enrolled-guard on every discussion resolver requires the X-Course-Id header
    const courseId = useAppSelector((state) => state.course.entity?.id)
    const socket = useContentDiscussionSocketIo()

    // course header sent on every discussion call so GraphQLMustEnrolledGuard passes
    const courseHeaders: GraphQLHeaders | undefined = courseId
        ? {
            [GraphQLHeadersKey.XCourseId]: courseId,
        }
        : undefined

    // replies loaded on demand, keyed by parent comment id
    const [repliesByParent, setRepliesByParent] = useState<Record<string, Array<CommentNode>>>({})
    // track which parents have replies loaded so realtime can refresh exactly those
    const loadedParentsRef = useRef<Set<string>>(new Set())

    // content-level reaction summary (only once we also have the course id for the header)
    const reactionsSwr = useSWR(
        contentId && courseId ? ["content-discussion-reactions", contentId] : null,
        async () => {
            const response = await queryContentReactions({
                request: {
                    contentId: contentId as string,
                },
                headers: courseHeaders,
            })
            return response.data?.contentReactions.data
        },
    )

    // top-level comments, paginated for "load more"; each page is one API call
    const commentsSwr = useSWRInfinite(
        (pageIndex, previousPageData) => {
            // need both content + course (header) before any call (else the guard 400s)
            if (!contentId || !courseId) {
                return null
            }
            // stop paginating once a page comes back empty (reached the end)
            if (previousPageData && (previousPageData.comments?.length ?? 0) === 0) {
                return null
            }
            // 1-based page in the key tuple
            return ["content-discussion-comments", contentId, pageIndex + 1] as const
        },
        async ([, , page]) => {
            const response = await queryContentComments({
                request: {
                    contentId: contentId as string,
                    page,
                    limit: COMMENTS_PAGE_SIZE,
                },
                headers: courseHeaders,
            })
            return response.data?.contentComments.data
        },
    )

    // flatten loaded pages into a single comment list; total comes from the first page
    const commentPages = commentsSwr.data ?? []
    const comments = commentPages.flatMap((page) => page?.comments ?? [])
    const total = commentPages[0]?.total ?? 0
    // more remain while we have not yet accumulated the reported total
    const hasMore = comments.length < total
    // the last requested page is still resolving
    const isLoadingMore = commentsSwr.isValidating
        && commentsSwr.data !== undefined
        && typeof commentsSwr.data[commentsSwr.size - 1] === "undefined"

    // fetch a parent's replies and cache them in state
    const loadReplies = useCallback(async (parentId: string) => {
        if (!contentId) {
            return
        }
        const response = await queryContentComments({
            request: {
                contentId,
                parentCommentId: parentId,
                limit: REPLIES_LIMIT,
            },
            headers: courseHeaders,
        })
        const replies = response.data?.contentComments.data?.comments ?? []
        // remember this parent so realtime updates can refresh it later
        loadedParentsRef.current.add(parentId)
        setRepliesByParent((prev) => ({
            ...prev,
            [parentId]: replies,
        }))
    }, [contentId])

    // re-fetch every already-loaded reply subtree (used after a realtime event)
    const reloadLoadedReplies = useCallback(() => {
        loadedParentsRef.current.forEach((parentId) => {
            void loadReplies(parentId)
        })
    }, [loadReplies])

    // single revalidation entry point for any discussion change
    const revalidateAll = useCallback(() => {
        void reactionsSwr.mutate()
        void commentsSwr.mutate()
        reloadLoadedReplies()
    }, [reactionsSwr, commentsSwr, reloadLoadedReplies])

    // join the content's discussion room (and re-join on reconnect)
    useEffect(() => {
        if (!contentId) {
            return
        }
        const subscribe = () => {
            const payload: SubscribeContentDiscussionSocketIoPayload = {
                data: {
                    contentId,
                },
                locale,
            }
            socket.emit(PublicationEvent.SubscribeContentDiscussion, payload)
        }
        // subscribe now if already connected, and again on every (re)connect
        if (socket.connected) {
            subscribe()
        }
        socket.on("connect", subscribe)
        return () => {
            socket.off("connect", subscribe)
        }
    }, [socket, contentId, locale])

    // refetch affected data whenever a realtime event arrives for this content
    useEffect(() => {
        if (!contentId) {
            return
        }
        const handler = (message: { data?: { contentId?: string } }) => {
            // ignore events for other contents sharing the same socket
            if (message?.data?.contentId !== contentId) {
                return
            }
            revalidateAll()
        }
        DISCUSSION_EVENTS.forEach((event) => contentDiscussionSocketIoEventEmitter.on(event, handler))
        return () => {
            DISCUSSION_EVENTS.forEach((event) => contentDiscussionSocketIoEventEmitter.off(event, handler))
        }
    }, [contentId, revalidateAll])

    // --- persistence callbacks (optimistic-free: mutate then revalidate) ---

    const onReactContent = useCallback(async (type: ReactionType | null) => {
        if (!contentId) {
            return
        }
        await mutateReactToContent({
            request: {
                contentId,
                type,
            },
            headers: courseHeaders,
        })
        void reactionsSwr.mutate()
    }, [contentId, courseHeaders, reactionsSwr])

    const onSubmitComment = useCallback(async (body: string) => {
        if (!contentId) {
            return
        }
        await mutateCreateComment({
            request: {
                contentId,
                body,
            },
            headers: courseHeaders,
        })
        void commentsSwr.mutate()
    }, [contentId, courseHeaders, commentsSwr])

    const onReply = useCallback(async (parentId: string, body: string) => {
        if (!contentId) {
            return
        }
        await mutateCreateComment({
            request: {
                contentId,
                parentCommentId: parentId,
                body,
            },
            headers: courseHeaders,
        })
        // reply count + the subtree both changed
        void commentsSwr.mutate()
        void loadReplies(parentId)
    }, [contentId, courseHeaders, commentsSwr, loadReplies])

    const onEdit = useCallback(async (commentId: string, body: string) => {
        await mutateUpdateComment({
            request: {
                commentId,
                body,
            },
            headers: courseHeaders,
        })
        revalidateAll()
    }, [courseHeaders, revalidateAll])

    const onDelete = useCallback(async (commentId: string) => {
        await mutateDeleteComment({
            request: {
                commentId,
            },
            headers: courseHeaders,
        })
        revalidateAll()
    }, [courseHeaders, revalidateAll])

    const onReactComment = useCallback(async (commentId: string, type: ReactionType | null) => {
        await mutateReactToComment({
            request: {
                commentId,
                type,
            },
            headers: courseHeaders,
        })
        revalidateAll()
    }, [courseHeaders, revalidateAll])

    const onLoadReplies = useCallback((parentId: string) => {
        void loadReplies(parentId)
    }, [loadReplies])

    // hide the whole section until we know which content we're on
    if (!contentId) {
        return null
    }

    return (
        <Discussion
            currentUserId={currentUserId}
            contentReactions={reactionsSwr.data ?? undefined}
            onReactContent={onReactContent}
            comments={comments}
            total={total}
            isLoading={commentsSwr.isLoading}
            repliesByParent={repliesByParent}
            onSubmitComment={onSubmitComment}
            onReply={onReply}
            onEdit={onEdit}
            onDelete={onDelete}
            onReactComment={onReactComment}
            onLoadReplies={onLoadReplies}
            hasMore={hasMore}
            isLoadingMore={isLoadingMore}
            onLoadMore={() => void commentsSwr.setSize(commentsSwr.size + 1)}
        />
    )
}
