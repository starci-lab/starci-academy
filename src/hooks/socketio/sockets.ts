import { createManager } from "./utils"
import type { Socket } from "socket.io-client"

/**
 * Module-level singleton Socket.IO instances (created once on import, `autoConnect: false`).
 *
 * The socket.io client is itself a singleton — like SWR's keyed cache — so there is no need for a
 * React context/provider. The connection lifecycle (connect on auth, listeners, dispatch to Redux)
 * runs ONCE in {@link SocketIoSideEffects}; consumers get the socket via the accessor hooks just to
 * `.emit()`. Separate managers keep one connection per namespace, matching the previous behavior.
 */
const jobNotificationsManager = createManager()
/** The `/job_notifications` namespace socket. */
export const jobNotificationsSocket: Socket = jobNotificationsManager.socket("/job_notifications")

const contentDiscussionManager = createManager()
/** The `/content_discussion` namespace socket. */
export const contentDiscussionSocket: Socket = contentDiscussionManager.socket("/content_discussion")

const aiLabManager = createManager()
/** The `/ai_lab` namespace socket (playground prompt token streaming). */
export const aiLabSocket: Socket = aiLabManager.socket("/ai_lab")

const communityChatManager = createManager()
/** The `/community_chat` namespace socket (per-conversation message realtime). */
export const communityChatSocket: Socket = communityChatManager.socket("/community_chat")

const contentAiManager = createManager()
/** The `/content_ai` namespace socket (grounded lesson Q&A answer token streaming). */
export const contentAiSocket: Socket = contentAiManager.socket("/content_ai")

const mockInterviewManager = createManager()
/** The `/mock_interview` namespace socket (mock interviewer turn token streaming). */
export const mockInterviewSocket: Socket = mockInterviewManager.socket("/mock_interview")

const systemHealthManager = createManager()
/**
 * The `/system_health` namespace socket — PUBLIC (no auth). Broadcasts the
 * per-model AI latency snapshot (`AiModelHealth`) to every client; the pickers
 * subscribe to live-update their health indicator.
 */
export const systemHealthSocket: Socket = systemHealthManager.socket("/system_health")

const ragPlaygroundManager = createManager()
/**
 * The `/rag_playground` namespace socket — PUBLIC (no auth). Streams the
 * answer token-by-token for a run prepared by the `askRagPlayground` mutation
 * (anonymous marketing demo, local self-hosted model).
 */
export const ragPlaygroundSocket: Socket = ragPlaygroundManager.socket("/rag_playground")

const playgroundByomManager = createManager()
/**
 * The `/playground_byom` namespace socket — relays "bring your own machine"
 * command/output/resource traffic between the browser and the learner's local
 * CLI agent for the course-scoped hands-on Docker/K8s Playground. UNAUTHENTICATED
 * on the gateway (the CLI agent has no Keycloak session — gated by a short-lived
 * pairing code instead of a JWT, see `PlaygroundByomGateway` on the backend); the
 * browser side may still attach the usual bearer token via {@link createManager},
 * the gateway simply ignores it.
 */
export const playgroundByomSocket: Socket = playgroundByomManager.socket("/playground_byom")
