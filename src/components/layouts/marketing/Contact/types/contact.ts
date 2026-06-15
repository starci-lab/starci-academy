import type {
    ContactChannelKind,
} from "../enums"

/**
 * A single contact channel shown as an info card (email, phone, ...).
 */
export interface ContactChannel {
    /** Channel kind; keys the icon lookup map. */
    kind: ContactChannelKind
    /** Short heading for the card (e.g. "Email Us"). */
    label: string
    /** Primary value, e.g. the address or number. */
    value: string
    /** Supporting line describing the channel (hours, response time, ...). */
    desc: string
}

/**
 * One row in the support-hours table (day label + opening hours).
 */
export interface SupportHoursRow {
    /** Day or day-range label (e.g. "Monday - Friday"). */
    day: string
    /** Opening hours text, or a closed marker. */
    hours: string
    /** Whether this row represents a closed day (renders muted/italic). */
    closed?: boolean
}
