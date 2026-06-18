import { FileTextIcon, StarIcon } from "@phosphor-icons/react"
import {
    ContentKind,
} from "./enums"

/**
 * Icon rendered beside each module content row, keyed by its
 * {@link ContentKind}: article for free content, star for premium.
 */
export const MODULE_CONTENT_KIND_ICON_MAP: Record<ContentKind, typeof FileTextIcon> = {
    /** Free content → article glyph. */
    [ContentKind.Normal]: FileTextIcon,
    /** Premium content → star. */
    [ContentKind.Premium]: StarIcon,
}
