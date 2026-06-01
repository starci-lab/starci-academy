import { SocketIoContext } from "../SocketIoContext"
import { use } from "react"

/**
 * Access the `/content_discussion` Socket.IO socket from {@link SocketIoContext}.
 * @returns the content-discussion socket instance.
 */
export const useContentDiscussionSocketIo = () => {
    const { contentDiscussionSocketIo } = use(SocketIoContext)!
    return contentDiscussionSocketIo
}
