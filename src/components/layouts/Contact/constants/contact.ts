import {
    ContactChannelKind,
} from "../enums"
import type {
    ContactChannel,
    SupportHoursRow,
} from "../types"

/**
 * Contact channels rendered as info cards in the left column.
 * (A "Visit Us" address channel exists in the design but is intentionally
 * omitted until a physical location is published.)
 */
export const CONTACT_CHANNELS: Array<ContactChannel> = [
    {
        kind: ContactChannelKind.Email,
        label: "Email Us",
        value: "hello@starci.academy",
        desc: "We usually respond within 24 hours.",
    },
    {
        kind: ContactChannelKind.Phone,
        label: "Call Us",
        value: "+(84) 969 998 024",
        desc: "Mon-Fri from 9am to 6pm.",
    },
]

/** Selectable subjects for the contact form's subject dropdown. */
export const CONTACT_SUBJECTS: Array<string> = [
    "General Inquiry",
    "Course Support",
    "Partnership",
]

/** Support-hours table rows shown under the contact channels. */
export const SUPPORT_HOURS: Array<SupportHoursRow> = [
    {
        day: "Monday - Friday",
        hours: "9:00 AM - 6:00 PM",
    },
    {
        day: "Saturday",
        hours: "10:00 AM - 4:00 PM",
    },
    {
        day: "Sunday",
        hours: "Closed",
        closed: true,
    },
]
