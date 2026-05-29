import {
    EnvelopeIcon,
    PhoneIcon,
} from "@phosphor-icons/react"
import type {
    Icon,
} from "@phosphor-icons/react"
import {
    ContactChannelKind,
} from "./enums"

/** Phosphor icon component rendered inside each contact-channel card. */
export const CONTACT_CHANNEL_ICON_MAP: Record<ContactChannelKind, Icon> = {
    [ContactChannelKind.Email]: EnvelopeIcon,
    [ContactChannelKind.Phone]: PhoneIcon,
}
