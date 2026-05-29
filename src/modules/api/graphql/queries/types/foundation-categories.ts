import type { FoundationCategoryEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `foundationCategories` query. */
export interface QueryFoundationCategoriesResponse {
    /** Top-level `foundationCategories` field wrapping the standard API response containing the array of categories. */
    foundationCategories: GraphQLResponse<Array<FoundationCategoryEntity>>
}
