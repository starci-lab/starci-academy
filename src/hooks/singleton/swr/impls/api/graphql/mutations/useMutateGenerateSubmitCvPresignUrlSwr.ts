import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for generating a pre-signed CV upload URL.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateGenerateSubmitCvPresignUrlSwr = () => {
    const { mutateGenerateSubmitCvPresignUrlSwr } = use(SwrContext)!
    return mutateGenerateSubmitCvPresignUrlSwr
}
