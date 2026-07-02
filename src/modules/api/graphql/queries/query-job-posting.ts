import { createAuthApolloClient } from "../clients"
import type { QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryJobPostingResponse } from "./types/job-posting"

const query1 = gql`
  query JobPosting($displayId: String!) {
    jobPosting(displayId: $displayId) {
      success
      message
      error
      data {
        id
        title
        displayId
        description
        requirements
        location
        workMode
        employmentType
        salaryMin
        salaryMax
        applyMethod
        applyUrl
        applyEmail
        source
        expiresAt
        companyId
        orderIndex
        sortIndex
        createdAt
        updatedAt
        company {
          id
          displayId
          title
          description
          logoUrl
          websiteUrl
          address
          phone
          email
          facebookUrl
          linkedinUrl
        }
      }
    }
  }
`

export enum QueryJobPosting {
    Query1 = "query1",
}

const queryMap: Record<QueryJobPosting, DocumentNode> = {
    [QueryJobPosting.Query1]: query1,
}

/** Request for the `jobPosting` query — a single scalar `displayId` argument. */
export interface JobPostingRequest {
    /** The posting's display id (route param). */
    displayId: string
}

/**
 * Fetches one job posting by display id — public, no auth. Mirrors `jobPosting`
 * (queries/job-postings/job-posting); throws server-side (surfaced via
 * `success:false`) when the display id has no match.
 */
export const queryJobPosting = async ({
    query = QueryJobPosting.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryJobPosting, JobPostingRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryJobPostingResponse>({
        query: queryMap[query],
        variables: {
            displayId: request?.displayId,
        },
    })
}
