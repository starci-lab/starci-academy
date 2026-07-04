import useSWRMutation from "swr/mutation"
import { mutateCoursesCheckout } from "@/modules/api/graphql/mutations/mutation-courses-checkout"
import { type CoursesCheckoutRequest } from "@/modules/api/graphql/mutations/types/cart"

type MutateCoursesCheckoutResult = Awaited<ReturnType<typeof mutateCoursesCheckout>>

/**
 * SWR mutation wrapper for {@link mutateCoursesCheckout} (Bearer from Keycloak).
 */
export const useMutateCoursesCheckoutSwr = () => {
    /** The SWR mutation. */
    const swr = useSWRMutation<
        MutateCoursesCheckoutResult,
        Error,
        string,
        CoursesCheckoutRequest
    >(
        "MUTATE_COURSES_CHECKOUT_SWR",
        async (_key, { arg }) => {
            return mutateCoursesCheckout({
                request: arg,
            })
        }
    )
    /** Return the SWR mutation. */
    return swr
}
