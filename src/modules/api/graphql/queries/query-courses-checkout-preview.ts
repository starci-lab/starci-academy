import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type {
    CoursesCheckoutPreviewRequest,
    QueryCoursesCheckoutPreviewResponse,
} from "./types/courses-checkout-preview"

const query1 = gql`
  query CoursesCheckoutPreview($request: CoursesCheckoutPreviewRequest!) {
    coursesCheckoutPreview(request: $request) {
      success
      message
      error
      data {
        lines {
          courseId
          listVnd
          chargedVnd
          listUsd
          chargedUsd
          discountPercent
        }
        totalListVnd
        totalChargedVnd
        savingsVnd
        totalListUsd
        totalChargedUsd
        bundleBonusPercent
        itemCount
      }
    }
  }
`

export enum QueryCoursesCheckoutPreview {
    Query1 = "query1",
}

const queryMap: Record<QueryCoursesCheckoutPreview, DocumentNode> = {
    [QueryCoursesCheckoutPreview.Query1]: query1,
}

/** Params for {@link queryCoursesCheckoutPreview}. */
export interface QueryCoursesCheckoutPreviewParams {
    /** Which document variant to run. */
    query?: QueryCoursesCheckoutPreview
    /** Ids of the cart courses to price together. */
    courseIds: Array<string>
    /** Apollo debug flag. */
    debug?: boolean
    /** Abort signal. */
    signal?: AbortSignal
}

/**
 * Pre-checkout price for a MULTI-course cart: per-course list vs charged prices
 * (progressive loyalty + a multi-course bundle bonus), the summed totals, and the
 * saving. Every amount is display-ready (test-divided VND / charm-rounded USD).
 * Mirrors backend `coursesCheckoutPreview` — drives the cart total + the payment
 * modal so both show the identical real charged amount.
 */
export const queryCoursesCheckoutPreview = async ({
    query = QueryCoursesCheckoutPreview.Query1,
    courseIds,
    debug,
    signal,
}: QueryCoursesCheckoutPreviewParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    const request: CoursesCheckoutPreviewRequest = { courseIds }
    return apollo.query<QueryCoursesCheckoutPreviewResponse>({
        query: queryMap[query],
        variables: {
            request,
        },
    })
}
