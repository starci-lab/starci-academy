import type { IconComponent } from "@/types"
import { Envelope as EnvelopeIcon, Smartphone as PhoneIcon } from "@gravity-ui/icons"
import {
    ContactChannelKind,
} from "./enums"

/** Icon component rendered inside each contact-channel card. */
export const CONTACT_CHANNEL_ICON_MAP: Record<ContactChannelKind, IconComponent> = {
    [ContactChannelKind.Email]: EnvelopeIcon,
    [ContactChannelKind.Phone]: PhoneIcon,
}
