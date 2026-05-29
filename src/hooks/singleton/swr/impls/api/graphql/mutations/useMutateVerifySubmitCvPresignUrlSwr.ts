import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for verifying the CV pre-signed upload URL.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateVerifySubmitCvPresignUrlSwr = () => {
    const { mutateVerifySubmitCvPresignUrlSwr } = use(SwrContext)!
    return mutateVerifySubmitCvPresignUrlSwr
}
