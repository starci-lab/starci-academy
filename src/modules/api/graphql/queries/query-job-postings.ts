import { createAuthApolloClient } from "../clients"
import type { QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    JobPostingsRequest,
    QueryJobPostingsResponse,
} from "./types/job-postings"

const query1 = gql`
  query JobPostings($request: JobPostingsRequest!) {
    jobPostings(request: $request) {
      success
      message
      error
      data {
        total
        items {
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
            logoUrl
            websiteUrl
          }
        }
      }
    }
  }
`

export enum QueryJobPostings {
    Query1 = "query1",
}

const queryMap: Record<QueryJobPostings, DocumentNode> = {
    [QueryJobPostings.Query1]: query1,
}

/** Default page size for the job board list. */
export const defaultJobPostingsLimit = 20

/**
 * Fetches a page of job postings — public, no auth. Mirrors `jobPostings`
 * (queries/job-postings/job-postings); list at `data.jobPostings.data.items`.
 */
export const queryJobPostings = async ({
    query = QueryJobPostings.Query1,
    request,
    headers,
    debug,
    signal,
}: QueryParams<QueryJobPostings, JobPostingsRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        headers,
        debug,
        signal,
    })

    return apollo.query<QueryJobPostingsResponse>({
        query: queryMap[query],
        variables: {
            request: request ?? {},
        },
    })
}
