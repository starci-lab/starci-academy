"use client"

import { useCallback, useState } from "react"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { useQueryContentCommentsSwr } from "@/hooks/swr/api/graphql/queries/useQueryContentCommentsSwr"
import { useMutateCreateCommentSwr } from "@/hooks/swr/api/graphql/mutations/useMutateCreateCommentSwr"
import { useMutateUpdateCommentSwr } from "@/hooks/swr/api/graphql/mutations/useMutateUpdateCommentSwr"
import { useMutateDeleteCommentSwr } from "@/hooks/swr/api/graphql/mutations/useMutateDeleteCommentSwr"
import { useMutateReactToCommentSwr } from "@/hooks/swr/api/graphql/mutations/useMutateReactToCommentSwr"
import { useMutateAcceptAnswerSwr } from "@/hooks/swr/api/graphql/mutations/useMutateAcceptAnswerSwr"
import { queryContentComments } from "@/modules/api/graphql/queries/query-content-comments"
import type { CommentNode, ReactionType } from "@/modules/api/graphql/queries/types/discussion"

/** Result of {@link useQuestionAnswers}. */
export interface UseQuestionAnswersResult {
    /** Top-level answers to the question (empty until `expanded`). */
    answers: Array<CommentNode>
    /** True while the first answer page is in flight. */
    isLoadingAnswers: boolean
    /** Loaded reply-to-reply subtrees, keyed by parent comment id. */
    answerRepliesByParent: Record<string, Array<CommentNode>>
    /** Post a new answer (`parentId === questionId`) or a nested reply. */
    onReply: (parentId: string, body: string) => Promise<void>
    /** Edit an existing answer/reply. */
    onEdit: (commentId: string, body: string) => Promise<void>
    /** Delete an existing answer/reply. */
    onDelete: (commentId: string) => Promise<void>
    /** React to an answer/reply (`type: null` removes the reaction). */
    onReactComment: (commentId: string, type: ReactionType | null) => Promise<void>
    /** React to the question itself — the question is a top-level comment (`type: null` removes it). */
    onReactQuestion: (type: ReactionType | null) => Promise<void>
    /** Accept (or clear) a direct answer as the accepted answer to this question. */
    onAcceptAnswer: (commentId: string, accepted: boolean) => Promise<void>
    /** Load (or reload) a nested reply subtree on demand. */
    onLoadReplies: (parentId: string) => void
}

/**
 * Data + persistence for one course-Q&A question's answer thread: the
 * top-level answers via {@link useQueryContentCommentsSwr} (gated by
 * `expanded`, so nothing fetches before the thread is opened) plus on-demand
 * nested reply-to-reply subtrees, with every write (reply/edit/delete/react)
 * run through `runGraphQL` so a failure toasts instead of failing silently.
 *
 * @param questionId - the question whose answer thread this manages
 * @param expanded - whether the thread is open (gates the answers fetch)
 * @param onAnswered - called after an answer is posted/deleted (roll-up aggregates)
 * @returns {@link UseQuestionAnswersResult}
 */
export const useQuestionAnswers = (
    questionId: string,
    expanded: boolean,
    onAnswered?: () => void,
): UseQuestionAnswersResult => {
    const runGraphQL = useGraphQLWithToast()
    const answersSwr = useQueryContentCommentsSwr(questionId, expanded)
    const createSwr = useMutateCreateCommentSwr()
    const updateSwr = useMutateUpdateCommentSwr()
    const deleteSwr = useMutateDeleteCommentSwr()
    const reactSwr = useMutateReactToCommentSwr()
    const acceptSwr = useMutateAcceptAnswerSwr()

    // nested reply-to-reply subtrees: loaded on demand and kept in local state —
    // same non-paginated, non-realtime shape as the top-level answers list, since
    // there is no shared cache key another surface could revalidate a subtree from
    const [answerRepliesByParent, setAnswerRepliesByParent] = useState<Record<string, Array<CommentNode>>>({})

    const loadReplies = useCallback(async (parentId: string) => {
        const response = await queryContentComments({
            request: { parentCommentId: parentId, limit: 50 },
        })
        const replies = response.data?.contentComments.data?.comments ?? []
        setAnswerRepliesByParent((prev) => ({ ...prev, [parentId]: replies }))
    }, [])

    const onReply = useCallback(async (parentId: string, body: string) => {
        const success = await runGraphQL(async () => {
            const response = await createSwr.trigger({ parentCommentId: parentId, body })
            if (!response.data?.createComment) {
                throw new Error(response.error?.message)
            }
            return response.data.createComment
        })
        if (success) {
            if (parentId === questionId) {
                void answersSwr.mutate()
            } else {
                await loadReplies(parentId)
            }
            onAnswered?.()
        }
    }, [runGraphQL, createSwr, questionId, answersSwr, loadReplies, onAnswered])

    const onEdit = useCallback(async (commentId: string, body: string) => {
        const success = await runGraphQL(async () => {
            const response = await updateSwr.trigger({ commentId, body })
            if (!response.data?.updateComment) {
                throw new Error(response.error?.message)
            }
            return response.data.updateComment
        })
        if (success) {
            void answersSwr.mutate()
        }
    }, [runGraphQL, updateSwr, answersSwr])

    const onDelete = useCallback(async (commentId: string) => {
        const success = await runGraphQL(async () => {
            const response = await deleteSwr.trigger({ commentId })
            if (!response.data?.deleteComment) {
                throw new Error(response.error?.message)
            }
            return response.data.deleteComment
        })
        if (success) {
            void answersSwr.mutate()
            onAnswered?.()
        }
    }, [runGraphQL, deleteSwr, answersSwr, onAnswered])

    const onReactComment = useCallback(async (commentId: string, type: ReactionType | null) => {
        const success = await runGraphQL(async () => {
            const response = await reactSwr.trigger({ commentId, type })
            if (!response.data?.reactToComment) {
                throw new Error(response.error?.message)
            }
            return response.data.reactToComment
        })
        if (success) {
            void answersSwr.mutate()
        }
    }, [runGraphQL, reactSwr, answersSwr])

    const onReactQuestion = useCallback(async (type: ReactionType | null) => {
        const success = await runGraphQL(async () => {
            const response = await reactSwr.trigger({ commentId: questionId, type })
            if (!response.data?.reactToComment) {
                throw new Error(response.error?.message)
            }
            return response.data.reactToComment
        })
        if (success) {
            // the question's reaction summary lives in the roll-up list, not the answer
            // thread — revalidate the parent list so the updated counts show
            onAnswered?.()
        }
    }, [runGraphQL, reactSwr, questionId, onAnswered])

    const onAcceptAnswer = useCallback(async (commentId: string, accepted: boolean) => {
        const success = await runGraphQL(async () => {
            const response = await acceptSwr.trigger({ commentId, accepted })
            if (!response.data?.acceptAnswer?.success) {
                throw new Error(response.error?.message)
            }
            return response.data.acceptAnswer
        })
        if (success) {
            // reload the thread (accepted flag flips + any sibling gets cleared) and
            // let the roll-up refresh its answered aggregates
            void answersSwr.mutate()
            onAnswered?.()
        }
    }, [runGraphQL, acceptSwr, answersSwr, onAnswered])

    const onLoadReplies = useCallback((parentId: string) => {
        void loadReplies(parentId)
    }, [loadReplies])

    return {
        answers: answersSwr.data ?? [],
        isLoadingAnswers: answersSwr.isLoading,
        answerRepliesByParent,
        onReply,
        onEdit,
        onDelete,
        onReactComment,
        onReactQuestion,
        onAcceptAnswer,
        onLoadReplies,
    }
}
