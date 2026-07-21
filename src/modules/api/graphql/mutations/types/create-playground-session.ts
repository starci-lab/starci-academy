import type { GraphQLResponse } from "../../types"

/**
 * How much hand-holding the learner wants for this session.
 * - `Guided` — every step shows its full command hint (default, beginner-friendly).
 * - `Free` — the learner only sees each step's goal; the server redacts
 *   `commandHint` to `null` so they type the commands themselves.
 *
 * Wire values mirror the sibling `RagPlaygroundSourceKind` convention (lowercase).
 */
export enum PlaygroundSessionMode {
    Guided = "guided",
    Free = "free",
}

/** Request body for the `createPlaygroundSession` mutation. */
export interface CreatePlaygroundSessionRequest {
    /** The playground exercise being started. */
    playgroundId: string
    /** Chosen guidance level — gates whether the server sends command hints. */
    mode: PlaygroundSessionMode
}

/** Payload inside `createPlaygroundSession.data` after the standard API wrapper. */
export interface CreatePlaygroundSessionData {
    /** Id of the persisted session — subscribe to this on the `/playground-byom` socket. */
    id: string
    /** Short code the learner enters into the local CLI agent to pair it with this session. */
    pairingCode: string
    /**
     * When {@link pairingCode} stops being accepted by the pairing gateway
     * (ISO-8601, server-derived). The Setup surface counts down to this instant
     * and offers a fresh code once passed — do NOT recompute it client-side from
     * a local TTL copy, or the countdown drifts from the server's real cutoff.
     */
    pairingCodeExpiresAt: string
}

/** Apollo response shape for `createPlaygroundSession`. */
export interface MutateCreatePlaygroundSessionResponse {
    /** Top-level `createPlaygroundSession` field wrapping the standard API response. */
    createPlaygroundSession: GraphQLResponse<CreatePlaygroundSessionData>
}
