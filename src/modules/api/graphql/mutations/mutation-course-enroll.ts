import type { PaymentType } from "@/modules/types"
import { createApolloClient } from "../clients"
import type { GraphQLResponse } from "../types"
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

/** Variables for {@link CourseEnrollRequest} on the schema. */
export interface MutateCourseEnrollVariables {
    request: {
        courseId: string
        paymentType: PaymentType
        payosReturnUrl?: string
        payosCancelUrl?: string
    }
}

export interface MutateCourseEnrollParams {
    mutation?: MutationCourseEnroll
    variables: MutateCourseEnrollVariables
    /** Required: mutation is guarded by Keycloak. */
    token?: string
    getAccessToken?: () => string | undefined
    refreshAccessToken?: (minValiditySeconds?: number) => Promise<boolean>
    minValiditySeconds?: number
    /** When `true`, logs the Apollo link chain flow to console. */
    debug?: boolean
}

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
    variables,
    token,
    getAccessToken,
    refreshAccessToken,
    minValiditySeconds,
    debug,
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
    })

    return apollo.mutate<MutateCourseEnrollResponse>({
        mutation: mutationMap[mutation],
        variables,
    })
}
