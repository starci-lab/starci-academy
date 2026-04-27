import type { PaymentType } from "@/modules/types"
import { createApolloClient } from "../clients"
import {
    type GraphQLResponse,
    type MutateParams,
    type QueryVariables,
} from "../types"
import { DocumentNode, gql } from "@apollo/client"

/** Payload inside `courseEnroll.data` after the standard API wrapper. */
export interface CourseEnrollData {
    checkoutUrl: string
    transactionId: string
    referenceId: string
    amount: number
}

const mutation1 = gql`
  mutation CourseEnroll($request: CourseEnrollRequest!) {
    courseEnroll(request: $request) {
      success
      message
      error
      data {
        checkoutUrl
        transactionId
        referenceId
        amount
      }
    }
  }
`

export enum MutationCourseEnroll {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationCourseEnroll, DocumentNode> = {
    [MutationCourseEnroll.Mutation1]: mutation1,
}

/** GraphQL `CourseEnrollRequest` body. */
export interface CourseEnrollRequest {
    courseId: string
    paymentType: PaymentType
    payosReturnUrl?: string
    payosCancelUrl?: string
}

/** Apollo variables bag for {@link courseEnroll}. */
export type MutateCourseEnrollVariables = QueryVariables<CourseEnrollRequest>

export type MutateCourseEnrollParams = MutateParams<MutationCourseEnroll, CourseEnrollRequest>

export interface MutateCourseEnrollResponse {
    courseEnroll: GraphQLResponse<CourseEnrollData>
}

/**
 * Starts course checkout (PayOS or Sepay): creates preflight row and returns checkout URL / ids.
 *
 * Mirrors `ref/course-enroll/course-enroll.resolver.ts` (`courseEnroll`).
 */
export const mutateCourseEnroll = async ({
    mutation = MutationCourseEnroll.Mutation1,
    request,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
    signal,
}: MutateCourseEnrollParams) => {
    const hasAuth = Boolean(token) || Boolean(getAccessToken)
    if (!hasAuth) {
        throw new Error("Not authenticated")
    }
    const apollo = createApolloClient({
        auth: true,
        cache: false,
        token,
        getAccessToken,
        refreshAccessToken,
        minValiditySeconds,
        debug,
        signal,
    })

    return apollo.mutate<MutateCourseEnrollResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
