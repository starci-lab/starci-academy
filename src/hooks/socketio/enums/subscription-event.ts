/** Socket.IO subscription event names (server → client). */
export enum SubscriptionEvent {
    GlobalSearch = "autocomplete.global_search.subscription",
    /** Must match the backend `SubscriptionEvent.JobStatusUpdated` string. */
    JobStatusUpdated = "job_notifications.job_status_updated.subscription",
    /** A comment was created on a content (must match backend). */
    CommentCreated = "content_discussion.comment_created.subscription",
    /** A comment was edited (must match backend). */
    CommentUpdated = "content_discussion.comment_updated.subscription",
    /** A comment was soft-deleted (must match backend). */
    CommentDeleted = "content_discussion.comment_deleted.subscription",
    /** A content's aggregate reactions changed (must match backend). */
    ContentReactionChanged = "content_discussion.content_reaction_changed.subscription",
    /** A comment's aggregate reactions changed (must match backend). */
    CommentReactionChanged = "content_discussion.comment_reaction_changed.subscription",
    /** A streamed token chunk for an AI Lab run (must match backend). */
    AiLabRunChunk = "ai_lab.run_chunk.subscription",
    /** A chat message was created in a conversation (must match backend). */
    ChatMessageCreated = "community_chat.message_created.subscription",
    /** A streamed token chunk for a content-AI answer (must match backend). */
    ContentAiChunk = "content_ai.chunk.subscription",
    /** Per-model AI latency snapshot broadcast on `/system_health` (must match backend). */
    AiModelHealth = "system_health.ai_model_health.subscription",
    /** A streamed token chunk for a RAG Playground run (must match backend). */
    RagPlaygroundRunChunk = "rag_playground.run_chunk.subscription",
    /** A streamed token chunk for the mock interviewer's next turn (must match backend). */
    MockInterviewChunk = "mock_interview.chunk.subscription",
}
