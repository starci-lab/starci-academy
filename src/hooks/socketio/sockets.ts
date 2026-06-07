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
