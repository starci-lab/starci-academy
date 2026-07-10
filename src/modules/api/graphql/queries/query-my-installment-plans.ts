import { createAuthApolloClient } from "../clients"
import { type QueryParams } from "../types"
import { DocumentNode, gql } from "@apollo/client"
import type { QueryMyInstallmentPlansResponse } from "./types/my-installment-plans"

const query1 = gql`
  query MyInstallmentPlans {
    myInstallmentPlans {
      success
      message
      error
      data {
        plans {
          id
          planType
          status
          nextDueAt
          minPaymentVnd
          months
          installmentsPaid
          monthlyAmountVnd
          totalAmountVnd
          markupPercent
          remainingVnd
          minPaymentPercent
          minPaymentFloorVnd
          courses {
            id
            title
          }
          createdAt
        }
      }
    }
  }
`

export enum QueryMyInstallmentPlans {
    Query1 = "query1",
}

const queryMap: Record<QueryMyInstallmentPlans, DocumentNode> = {
    [QueryMyInstallmentPlans.Query1]: query1,
}

/**
 * Fetches the current user's non-completed installment (trả góp) plans via Apollo.
 *
 * Mirrors `myInstallmentPlans` (queries/installment-plans/my-installment-plans.resolver.ts);
 * the plan list is at `data.myInstallmentPlans.data.plans`.
 */
export const queryMyInstallmentPlans = async ({
    query = QueryMyInstallmentPlans.Query1,
    debug,
    signal,
}: QueryParams<QueryMyInstallmentPlans, undefined>) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })
    return apollo.query<QueryMyInstallmentPlansResponse>({
        query: queryMap[query],
    })
}
