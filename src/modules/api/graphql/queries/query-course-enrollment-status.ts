import { createAuthApolloClient } from "../clients"
import { type GraphQLResponse, type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Payload inside `courseEnrollmentStatus.data` after the standard API wrapper. */
export interface CourseEnrollmentStatusData {
    isEnrolled: boolean
}

const query1 = gql`
  query CourseEnrollmentStatus($request: CourseEnrollmentStatusRequest!) {
    courseEnrollmentStatus(request: $request) {
      success
      message
      error
      data {
        isEnrolled
      }
    }
  }
`

export enum QueryCourseEnrollmentStatus {
    Query1 = "query1",
}

const queryMap: Record<QueryCourseEnrollmentStatus, DocumentNode> = {
    [QueryCourseEnrollmentStatus.Query1]: query1,
}

export interface QueryCourseEnrollmentStatusRequest {
    courseId: string
}

export type QueryCourseEnrollmentStatusParams = QueryParams<QueryCourseEnrollmentStatus, QueryCourseEnrollmentStatusRequest>
export interface QueryCourseEnrollmentStatusResponse {
    courseEnrollmentStatus: GraphQLResponse<CourseEnrollmentStatusData>
}

/**
 * Enrollment summary for a course: total count and optional `isEnrolled` when a Bearer token is sent.
 *
 * Mirrors `ref/course-enrollment-status/course-enrollment-status.resolver.ts`.
 */
export const queryCourseEnrollmentStatus = async ({
    query = QueryCourseEnrollmentStatus.Query1,
    request,
    debug,
    signal,
}: QueryCourseEnrollmentStatusParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    }
    )
    return apollo.query<QueryCourseEnrollmentStatusResponse>(
        {
            query: queryMap[query],
            variables: {
                request,
            },
        }
    )
}
