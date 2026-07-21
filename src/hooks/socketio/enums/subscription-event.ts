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
    /** A streamed token chunk for the mock interviewer's next turn (must match backend). */
    MockInterviewChunk = "mock_interview.chunk.subscription",
    /** A live Pod/Container/Network/Service resource snapshot (must match backend). */
    PlaygroundByomResourcesReport = "resources:report",
    /** The current step was verified as complete (must match backend). */
    PlaygroundByomStepVerified = "step:verified",
    /** The learner's local CLI agent paired to this session (must match backend). */
    PlaygroundByomAgentConnected = "agent:connected",
    /** The learner's local CLI agent dropped (must match backend). */
    PlaygroundByomAgentDisconnected = "agent:disconnected",
    /** The agent's pong echo (carries the browser timestamp) for latency (must match backend `agent:pong`). */
    PlaygroundByomAgentPong = "agent:pong",
    /** The agent's one-time device (hardware/OS) snapshot (must match backend `device:info`). */
    PlaygroundByomDeviceInfo = "device:info",
    /**
     * Whether the lab's tooling is installed AND answering on the learner's
     * machine — probed by the agent (`docker info` / `kubectl`+`kind` / Ollama)
     * on pair and on every `verify:now` (must match backend `env:report`).
     * A successful pair proves nothing about the engine, so this is the only
     * honest source for the Setup surface's engine check.
     */
    PlaygroundByomEnvReport = "env:report",
    /** A streamed agent log line — lifecycle/diagnostic (must match backend `agent:log`). */
    PlaygroundByomAgentLog = "agent:log",
    /** The local Ollama runtime's serving state + loaded models (must match backend `ollama:status`). */
    PlaygroundByomOllamaStatus = "ollama:status",
    /** A streamed answer chunk for a machine-backed RAG run (must match backend `rag:answer`). */
    PlaygroundByomRagAnswer = "rag:answer",
    /** The retrieved source citations backing a machine-backed RAG answer (must match backend `rag:citations`). */
    PlaygroundByomRagCitations = "rag:citations",
    /** A machine-backed RAG lifecycle event — imported/asked/answered (must match backend `rag:event`). */
    PlaygroundByomRagEvent = "rag:event",
}
