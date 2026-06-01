import {
    ArticleIcon,
    StarIcon,
} from "@phosphor-icons/react"
import type {
    Icon,
} from "@phosphor-icons/react"
import {
    ContentKind,
} from "./enums"

/**
 * Phosphor icon rendered beside each module content row, keyed by its
 * {@link ContentKind}: article for free content, star for premium.
 */
export const MODULE_CONTENT_KIND_ICON_MAP: Record<ContentKind, Icon> = {
    /** Free content → article glyph. */
    [ContentKind.Normal]: ArticleIcon,
    /** Premium content → star. */
    [ContentKind.Premium]: StarIcon,
}
