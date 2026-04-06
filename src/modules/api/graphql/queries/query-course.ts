
import { CourseEntity } from "@/modules/types"
import { createApolloClient } from "../clients"
import type { GraphQLResponse, QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

const query1 = gql`
  query Course($request: CourseRequest!) {
    course(request: $request) {
      success
      message
      error
      data {
        id
        displayId
        title
        slug
        description
        cdnUrl
        coverImageUrl
        originalPrice
        currentPhase
        pricingPhases {
          id
          price
          phase
          slotAvailable
          orderIndex
        }
        prerequisites {
          id
          text
          orderIndex
        }
        valuePropositions {
          id
          text
          orderIndex
        }
        modules {
          id
          displayId
          title
          description
          orderIndex
          previewContents {
            id
            orderIndex
            text
          }
        }
        qnas {
          id
          question
          answer
          orderIndex
        }
      }
    }
  }
`

export enum QueryCourse {
    Query1 = "query1",
}

const queryMap: Record<QueryCourse, DocumentNode> = {
    [QueryCourse.Query1]: query1,
}

/** Apollo variables for `course(input: CourseInput!)`. */
export interface QueryCourseRequest {
    /** The display id. */
    displayId?: string
    /** The id. */
    id?: string
}


export interface QueryCourseResponse {
    course: GraphQLResponse<CourseEntity>
}

/**
 * Fetches one course by id via Apollo.
 *
 * @param params - Document key, GraphQL variables, and optional bearer token
 * @returns Apollo query result; entity at `data.course.data.data`
 */
export const queryCourse = async ({
    query = QueryCourse.Query1,
    request,
    token,
}: QueryParams<QueryCourse, QueryCourseRequest>) => {
    const apollo = createApolloClient({
        auth: Boolean(token),
        cache: false,
        token,
    })

    return apollo.query<QueryCourseResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
