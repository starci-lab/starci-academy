import type { IconComponent } from "@/types"
import { FileText as ArticleIcon, Star as StarIcon } from "@gravity-ui/icons"
import {
    ContentKind,
} from "./enums"

/**
 * Icon rendered beside each module content row, keyed by its
 * {@link ContentKind}: article for free content, star for premium.
 */
export const MODULE_CONTENT_KIND_ICON_MAP: Record<ContentKind, IconComponent> = {
    /** Free content → article glyph. */
    [ContentKind.Normal]: ArticleIcon,
    /** Premium content → star. */
    [ContentKind.Premium]: StarIcon,
}
