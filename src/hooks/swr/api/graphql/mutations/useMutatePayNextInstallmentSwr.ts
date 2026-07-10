import useSWRMutation from "swr/mutation"
import { mutatePayNextInstallment } from "@/modules/api/graphql/mutations/mutation-pay-next-installment"
import { type PayNextInstallmentRequest } from "@/modules/api/graphql/mutations/types/pay-next-installment"

type MutatePayNextInstallmentResult = Awaited<ReturnType<typeof mutatePayNextInstallment>>

/**
 * SWR mutation wrapper for {@link mutatePayNextInstallment} (Bearer from Keycloak).
 */
export const useMutatePayNextInstallmentSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutatePayNextInstallmentResult,
        Error,
        string,
        PayNextInstallmentRequest
    >(
        "MUTATE_PAY_NEXT_INSTALLMENT_SWR",
        async (_key, { arg }) => {
            return mutatePayNextInstallment({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
