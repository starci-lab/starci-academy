import { publicEnv } from "@/resources/env"
import { Manager } from "socket.io-client"

/**
 * Creates a single Socket.IO {@link Manager} for the API WebSocket base URL.
 */
export const createManager = () => {
    return new Manager(
        publicEnv().api.socketIo,
        {
            transports: ["websocket"],
            reconnection: false,
            autoConnect: false,
            reconnectionAttempts: Infinity,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        },
    )
}
