import { createApolloClient } from "../clients"
import { withAbortContext, type GraphQLOperationContext, type GraphQLResponse } from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Payload inside `courseEnrollmentStatus.data` after the standard API wrapper. */
export interface CourseEnrollmentStatusData {
    enrollmentCount: number
    isEnrolled: boolean
}

const query1 = gql`
  query CourseEnrollmentStatus($request: CourseEnrollmentStatusRequest!) {
    courseEnrollmentStatus(request: $request) {
      success
      message
      error
      data {
        enrollmentCount
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

/** Variables for {@link CourseEnrollmentStatusRequest} on the schema. */
export interface QueryCourseEnrollmentStatusVariables {
    request: {
        courseId: string
    }
}

export interface QueryCourseEnrollmentStatusParams extends GraphQLOperationContext {
    query?: QueryCourseEnrollmentStatus
    variables: QueryCourseEnrollmentStatusVariables
    /** When set, `isEnrolled` reflects the current user; omit for anonymous (count only). */
    token?: string
    /** Optional token getter (preferred over static `token` for refresh + retry flows). */
    getAccessToken?: () => string | undefined
    /** Optional refresh callback; should call `keycloak.updateToken(minValiditySeconds)`. */
    refreshAccessToken?: (minValiditySeconds?: number) => Promise<boolean>
    /** Default min-validity seconds for refresh, used by auth-refresh link. */
    minValiditySeconds?: number
    /** When `true`, logs the Apollo link chain flow to console. */
    debug?: boolean
}

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
    variables,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: QueryCourseEnrollmentStatusParams) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    const apollo = createApolloClient(
        {
            auth: hasAuth,
            cache: false,
            token,
            getAccessToken,
            refreshAccessToken,
            minValiditySeconds,
            debug,
        }
    )

    return apollo.query<QueryCourseEnrollmentStatusResponse>({
        query: queryMap[query],
        variables,
        ...withAbortContext(signal),
    })
}
