import { createAuthApolloClient } from "../clients"
import {
    type QueryParams,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type {
    QueryMyPickableCvAchievementsResponse,
} from "./types/pickable-cv-achievements"

const query1 = gql`
  query MyPickableCvAchievements {
    myPickableCvAchievements {
      success
      message
      error
      data {
        milestoneTaskAttempts {
          id
          taskTitle
          milestoneTitle
          courseTitle
          score
        }
      }
    }
  }
`

export enum QueryMyPickableCvAchievements {
    Query1 = "query1",
}

const queryMap: Record<QueryMyPickableCvAchievements, DocumentNode> = {
    [QueryMyPickableCvAchievements.Query1]: query1,
}

/**
 * The signed-in user's pickable StarCi capstone projects — feeds the CV block
 * editor's "pick from StarCi" combobox. Verified content by construction.
 */
export const queryMyPickableCvAchievements = async ({
    query = QueryMyPickableCvAchievements.Query1,
    debug,
    signal,
    headers,
}: QueryParams<QueryMyPickableCvAchievements, undefined>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
        headers,
    })

    return apollo.query<QueryMyPickableCvAchievementsResponse>({
        query: queryMap[query],
        fetchPolicy: "no-cache",
    })
}
