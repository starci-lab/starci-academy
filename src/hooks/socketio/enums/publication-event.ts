/** Socket.IO publication event names (client → server). */
export enum PublicationEvent {
    GlobalSearch = "autocomplete.global_search.publication",
    SubscribeJobNotification = "job_notifications.subscribe_job_notification.publication",
    /** Join a content's discussion room (must match backend). */
    SubscribeContentDiscussion = "content_discussion.subscribe.publication",
    /** Subscribe to an AI Lab run's token stream (must match backend). */
    SubscribeAiLabRun = "ai_lab.subscribe_run.publication",
    /** Abort an in-flight AI Lab run (must match backend). */
    AbortAiLabRun = "ai_lab.abort_run.publication",
    /** Join a chat conversation's room (must match backend). */
    SubscribeCommunityChat = "community_chat.subscribe.publication",
    /** Ask StarCi AI about a content and stream the answer (must match backend). */
    AskContentAi = "content_ai.ask.publication",
    /** Abort an in-flight content-AI answer stream (must match backend). */
    AbortContentAi = "content_ai.abort.publication",
    /** Ask the mock interviewer for its next turn and stream it back (must match backend). */
    AskMockInterviewTurn = "mock_interview.ask.publication",
    /** Abort an in-flight mock-interviewer turn stream (must match backend). */
    AbortMockInterviewTurn = "mock_interview.abort.publication",
    /**
     * Join a Playground BYOM session's room (browser side) — must match the
     * exact event name the BE gateway uses (`browser:subscribe`), NOT the
     * `<namespace>.<action>.publication` convention used elsewhere in this
     * enum; the local CLI agent is a separate, non-browser client of the same
     * gateway and this string is shared with it.
     */
    SubscribePlaygroundByom = "browser:subscribe",
    /** Ping the connected CLI agent to measure round-trip latency (must match backend `agent:ping`). */
    PlaygroundByomPing = "agent:ping",
    /** Ask the agent to report resources NOW so the current step verifies immediately (must match backend `verify:now`). */
    PlaygroundByomVerifyNow = "verify:now",
    /** Ask the connected agent to index a code source into an ephemeral RAG collection (must match backend `rag:index`). */
    PlaygroundByomRagIndex = "rag:index",
    /** Ask the connected agent to answer a question over the indexed code (must match backend `rag:ask`). */
    PlaygroundByomRagAsk = "rag:ask",
}
