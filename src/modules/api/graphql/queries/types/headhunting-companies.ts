import type { HeadhuntingCompanyEntity } from "@/modules/types"
import type { GraphQLResponse } from "../../types"

/** Apollo response shape for the `headhuntingCompanies` query. */
export interface QueryHeadhuntingCompaniesResponse {
    /** Top-level `headhuntingCompanies` field wrapping the standard API response containing the array of companies. */
    headhuntingCompanies: GraphQLResponse<Array<HeadhuntingCompanyEntity>>
}
