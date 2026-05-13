import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateGenerateSubmitCvPresignUrlSwr = () => {
    const { mutateGenerateSubmitCvPresignUrlSwr } = use(SwrContext)!
    return mutateGenerateSubmitCvPresignUrlSwr
}
