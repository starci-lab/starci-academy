import type {
    ContentReferenceEntity,
} from "@/modules/types"

/**
 * Reference rows shown beneath a public content article, pre-sorted by
 * {@link ContentReferenceEntity.sortIndex}.
 */
export type ContentDetailReferences = Array<ContentReferenceEntity>
