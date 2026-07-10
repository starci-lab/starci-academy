import type { MutateParams } from "../types"
import { createAuthApolloClient } from "../clients"
import { DocumentNode, gql } from "@apollo/client"
import type { PayNextInstallmentRequest, MutatePayNextInstallmentResponse } from "./types/pay-next-installment"

const mutation1 = gql`
  mutation PayNextInstallment($request: PayNextInstallmentRequest!) {
    payNextInstallment(request: $request) {
      success
      message
      error
      data {
        planId
        checkoutUrl
        referenceId
        transactionId
        amount
        checkoutFields
      }
    }
  }
`

export enum MutationPayNextInstallment {
    Mutation1 = "mutation1",
}

const mutationMap: Record<MutationPayNextInstallment, DocumentNode> = {
    [MutationPayNextInstallment.Mutation1]: mutation1,
}

/** Apollo params for {@link mutatePayNextInstallment}. */
export type MutatePayNextInstallmentParams = MutateParams<
    MutationPayNextInstallment,
    PayNextInstallmentRequest
>

/**
 * Pays the current cycle of an installment (trả góp) plan.
 *
 * Mirrors `payNextInstallment` (mutations/installment-plans/pay-next-installment/pay-next-installment.resolver.ts).
 */
export const mutatePayNextInstallment = async ({
    mutation = MutationPayNextInstallment.Mutation1,
    request,
    debug,
    signal,
}: MutatePayNextInstallmentParams) => {
    const apollo = createAuthApolloClient({
        cache: false,
        debug,
        signal,
    })

    return apollo.mutate<MutatePayNextInstallmentResponse>({
        mutation: mutationMap[mutation],
        variables: { request },
    })
}
