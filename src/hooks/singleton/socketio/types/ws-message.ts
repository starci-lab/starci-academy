/** Message for sending a success or error WS message. */
export interface SocketIoMessage<T = unknown> {
    /** Message */
    message: string
    /** Data */
    data?: T
    /** Success */
    success: boolean
    error?: string
}
