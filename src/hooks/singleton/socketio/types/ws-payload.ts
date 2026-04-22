import { Locale } from "next-intl"

/** Abstract socket io payload */
export interface SocketIoPayload<T = unknown> {
    /** Payload data */
    data: T
    /** The locale of the user */
    locale: Locale
}