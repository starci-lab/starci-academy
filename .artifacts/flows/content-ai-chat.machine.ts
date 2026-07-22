import { assign, setup } from "xstate"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * content-AI chat — flow SKETCH as an XState machine (design artifact, not wired).
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The point of this file is anti-drift: this ONE machine is meant to be the single
 * source for both (a) the Stately diagram (paste this file at stately.ai → the flow
 * draws itself) and (b) the real `ContentAiChat` render (`useMachine(chatMachine)` →
 * map `snapshot.value` to UI). A new screen becomes a new STATE here → it shows up in
 * the diagram automatically and the component is forced to handle it. There is no
 * hand-drawn storyboard to fall out of sync — the structure is derived, not copied.
 *
 * Grounded in the real component behavior:
 *  - four in-panel views (PanelView): chat · conversations · search · settings
 *  - two turn TYPES: a streamed text answer, and a retrieval "find X" tool result
 *  - `onSend` lazily creates a session first (which can fail → error, not silent no-op)
 *  - a done-with-"AI quota exhausted" error is the GATED state (upgrade CTA)
 *  - a highlighted passage is an overlay that changes the scope + disables intent detect
 */

/** Which grounding the next question runs against (orthogonal context, not a state). */
type Scope = "content" | "course" | "task" | "challenge" | "quiz" | "foundation"

interface ChatContext {
    /** Composer draft. */
    draft: string
    /** Open conversation (null until lazily created on first send). */
    sessionId: string | null
    /** Active grounding scope. */
    scope: Scope
    /** Highlighted lesson passage → born-archived side-thread (null = surface thread). */
    selection: string | null
    /** The last stream/submit error message (drives error vs quotaExhausted). */
    error: string | null
}

type ChatEvent =
    // composer
    | { type: "TYPE"; value: string }
    | { type: "SEND" }
    | { type: "CLEAR_DRAFT" }
    // server signals over the /content_ai socket
    | { type: "SESSION_READY"; sessionId: string }
    | { type: "SUBMIT_FAIL"; error: string }
    | { type: "DELTA"; text: string }
    | { type: "DONE"; error?: string }
    | { type: "ABORT" }
    // retrieval ("find challenges/flashcards/…") turn
    | { type: "RESULTS" }
    | { type: "TOOL_ERROR" }
    // recovery / gating
    | { type: "RETRY" }
    | { type: "UPGRADE" }
    | { type: "RESET" }
    // passage selection overlay
    | { type: "SELECT_PASSAGE"; passage: string }
    | { type: "CLEAR_PASSAGE" }
    // view switching (the panel is one surface; these never z-fight the popover)
    | { type: "OPEN_HISTORY" }
    | { type: "OPEN_SEARCH" }
    | { type: "OPEN_SETTINGS" }
    | { type: "OPEN_CHAT"; sessionId?: string }
    | { type: "BACK" }

export const chatMachine = setup({
    types: { context: {} as ChatContext, events: {} as ChatEvent },
    guards: {
        /** A turn needs text AND a grounding scope AND not mid-stream. */
        canSend: ({ context }) => context.draft.trim().length > 0,
        /** "tìm thử thách…" → a tool-search turn, NOT a streamed answer. Disabled while a
         *  passage is selected (that path is always "explain this"). */
        isRetrievalIntent: ({ context }) =>
            context.selection === null && /(tìm|find|gợi ý|liệt kê|list|show)/i.test(context.draft),
        /** A done-error that is the AI-quota-exhausted case → the gated screen. */
        isQuotaError: ({ event }) =>
            event.type === "DONE" && (event.error?.startsWith("AI quota exhausted") ?? false),
        /** Any other done-error → the generic error bubble. */
        isError: ({ event }) => event.type === "DONE" && Boolean(event.error),
    },
    actions: {
        setDraft: assign({ draft: ({ event }) => (event.type === "TYPE" ? event.value : "") }),
        clearDraft: assign({ draft: "" }),
        setSession: assign({
            sessionId: ({ context, event }) =>
                event.type === "SESSION_READY" ? event.sessionId : context.sessionId,
        }),
        setError: assign({
            error: ({ event }) =>
                event.type === "SUBMIT_FAIL" ? event.error : event.type === "DONE" ? (event.error ?? null) : null,
        }),
        clearError: assign({ error: null }),
        selectPassage: assign({
            selection: ({ event }) => (event.type === "SELECT_PASSAGE" ? event.passage : null),
        }),
        clearPassage: assign({ selection: null }),
    },
}).createMachine({
    id: "contentAiChat",
    initial: "chat",
    context: { draft: "", sessionId: null, scope: "content", selection: null, error: null },
    // passage selection + view switching are available from anywhere in the panel
    on: {
        SELECT_PASSAGE: { actions: "selectPassage" },
        CLEAR_PASSAGE: { actions: "clearPassage" },
    },
    states: {
        // ── the chat view: the turn lifecycle lives here ──────────────────
        chat: {
            initial: "idle",
            on: {
                OPEN_HISTORY: "conversations",
                OPEN_SEARCH: "search",
                OPEN_SETTINGS: "settings",
            },
            states: {
                // ready — empty thread (suggestion chips) or resting after a turn
                idle: {
                    on: {
                        TYPE: { target: "composing", actions: "setDraft" },
                    },
                },
                composing: {
                    on: {
                        TYPE: { actions: "setDraft" },
                        CLEAR_DRAFT: { target: "idle", actions: "clearDraft" },
                        SEND: [
                            { guard: "isRetrievalIntent", target: "toolSearching" },
                            { guard: "canSend", target: "submitting", actions: "clearError" },
                        ],
                    },
                },
                // lazily create the session, then start the stream (real onSend)
                submitting: {
                    on: {
                        SESSION_READY: { target: "streaming", actions: ["setSession", "clearDraft"] },
                        SUBMIT_FAIL: { target: "error", actions: "setError" },
                    },
                },
                // assistant answer streaming token-by-token over the socket
                streaming: {
                    on: {
                        DELTA: {},
                        ABORT: "idle",
                        DONE: [
                            { guard: "isQuotaError", target: "quotaExhausted", actions: "setError" },
                            { guard: "isError", target: "error", actions: "setError" },
                            { target: "idle" },
                        ],
                    },
                },
                // a "find X" retrieval turn — RAG list, not streamed prose
                toolSearching: {
                    on: {
                        RESULTS: "idle",
                        TOOL_ERROR: "idle",
                    },
                },
                // a failed send/stream — retry re-runs the same turn
                error: {
                    on: {
                        RETRY: { target: "submitting", actions: "clearError" },
                        TYPE: { target: "composing", actions: "setDraft" },
                    },
                },
                // GATED — out of AI quota; the only exits are upgrade or a new turn
                quotaExhausted: {
                    on: {
                        UPGRADE: {}, // external nav to /profile/ai-subscription
                        TYPE: { target: "composing", actions: "setDraft" },
                        RESET: { target: "idle", actions: "clearError" },
                    },
                },
            },
        },

        // ── other in-panel views (return to chat via BACK) ────────────────
        conversations: {
            on: {
                BACK: "chat",
                OPEN_CHAT: { target: "chat", actions: "setSession" },
            },
        },
        search: {
            on: { BACK: "chat" },
        },
        settings: {
            on: { BACK: "chat" },
        },
    },
})
