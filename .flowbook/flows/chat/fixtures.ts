/** Plain fixture data for the chat prototype — no component imports, no JSX. */

export const SAMPLE_QUESTION = "Làm sao để endpoint thanh toán an toàn khi client tự retry?"

/** The lesson passage a learner highlighted to ask about (selection side-thread). */
export const SELECTED_PASSAGE =
    "Một request được coi là idempotent nếu gọi nhiều lần cho cùng kết quả như gọi một lần."

/** A retrieval "source" row, shaped like the app's in-chat tool result. */
export interface MockSource {
    kind: "content" | "challenge" | "flashcard"
    title: string
    breadcrumb: string
    /** True → the learner must enrol before opening it (renders the enrol badge). */
    locked?: boolean
}

export const SOURCES: Array<MockSource> = [
    {
        kind: "content",
        title: "Idempotency keys cho payment API",
        breadcrumb: "Module 11 · Webhooks & Delivery",
    },
    {
        kind: "challenge",
        title: "Thiết kế endpoint charge an toàn khi retry",
        breadcrumb: "Module 11 · Challenges",
        locked: true,
    },
]

/** Past conversations for the history view (title + "<origin> · <turns>"). */
export const SESSIONS: Array<{ title: string; meta: string }> = [
    { title: "Idempotency & retry", meta: "Idempotent APIs · 6 lượt" },
    { title: "Kafka vs RabbitMQ", meta: "Message queues · 12 lượt" },
    { title: "nginx reverse proxy", meta: "Cả khoá · 3 lượt" },
]
