import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateReviewCvSwr = () => {
    const { mutateReviewCvSwr } = use(SwrContext)!
    return mutateReviewCvSwr
}
