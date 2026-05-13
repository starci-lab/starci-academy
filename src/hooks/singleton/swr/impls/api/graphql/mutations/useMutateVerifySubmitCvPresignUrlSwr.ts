import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateVerifySubmitCvPresignUrlSwr = () => {
    const { mutateVerifySubmitCvPresignUrlSwr } = use(SwrContext)!
    return mutateVerifySubmitCvPresignUrlSwr
}
