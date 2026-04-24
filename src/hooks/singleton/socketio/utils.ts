import { publicEnv } from "@/resources/env"
import { Manager } from "socket.io-client"

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
        }
    )
}