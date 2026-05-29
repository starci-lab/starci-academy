import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for exchanging the OAuth code for tokens.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateExchangeCodeForTokenSwr = () => {
    const { mutateExchangeCodeForTokenSwr } = use(SwrContext)!
    return mutateExchangeCodeForTokenSwr
}
