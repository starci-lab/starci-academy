import type {
    ContentEntity,
} from "@/modules/types"
import {
    ContentKind,
} from "../enums"

/**
 * Derive a content row's {@link ContentKind} from its premium flag. Premium
 * content is badged with a star but stays readable (short teaser), so there is
 * no locked state here.
 * @param content - content row being rendered
 */
export const getContentKind = (
    content: Pick<ContentEntity, "isPremium">,
): ContentKind => (
    content.isPremium
        ? ContentKind.Premium
        : ContentKind.Normal
)
