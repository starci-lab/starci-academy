import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryTalentCandidatesRequest, QueryTalentCandidatesResponse } from "./types/talent-candidates"

const query1 = gql`
  query TalentCandidates($courseId: ID!, $limit: Int, $offset: Int) {
    talentCandidates(courseId: $courseId, limit: $limit, offset: $offset) {
      success
      message
      error
      data {
        user {
          id
          username
          displayName
          bio
          avatar
          roleTitle
          openToWork
        }
        track {
          courseId
          courseTitle
          courseSlug
          capstoneScore
          interviewScore
          cvScore
          depthScore
          band
          isQualified
        }
      }
    }
  }
`

export enum QueryTalentCandidates {
    Query1 = "query1",
}

const queryMap: Record<QueryTalentCandidates, DocumentNode> = {
    [QueryTalentCandidates.Query1]: query1,
}

/**
 * Fetches recruiter-marketplace candidates for ONE track (`courseId`), ranked by
 * that track's `depthScore` DESC — never a cross-track composite. Mirrors the
 * `talentCandidates` query; list at `data.talentCandidates.data` (each item =
 * `{ user, track }`, with the track's `band` / `isQualified` for badges).
 */
export const queryTalentCandidates = async ({
    query = QueryTalentCandidates.Query1,
    request,
    debug,
    signal,
}: QueryParams<QueryTalentCandidates, QueryTalentCandidatesRequest>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryTalentCandidatesResponse>({
        query: queryMap[query],
        variables: {
            courseId: request?.courseId,
            limit: request?.limit,
            offset: request?.offset,
        },
    })
}
