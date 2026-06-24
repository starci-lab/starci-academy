import {
    mutateSendChatMessage,
    type SendChatMessageRequest,
} from "@/modules/api"
import useSWRMutation from "swr/mutation"

type MutateSendChatMessageResult = Awaited<ReturnType<typeof mutateSendChatMessage>>

/**
 * SWR mutation wrapper for {@link mutateSendChatMessage} (Bearer from Keycloak).
 * Sends a chat message to a conversation.
 */
export const useMutateSendChatMessageSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateSendChatMessageResult,
        Error,
        string,
        SendChatMessageRequest
    >(
        "MUTATE_SEND_CHAT_MESSAGE_SWR",
        async (_key, { arg }) => {
            return mutateSendChatMessage({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
