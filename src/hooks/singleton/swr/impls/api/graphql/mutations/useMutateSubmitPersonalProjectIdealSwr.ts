import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSubmitPersonalProjectIdealSwr = () => {
    const { mutateSubmitPersonalProjectIdealSwr } = use(SwrContext)!
    return mutateSubmitPersonalProjectIdealSwr
}
