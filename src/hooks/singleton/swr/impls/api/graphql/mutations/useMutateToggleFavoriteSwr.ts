import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateToggleFavoriteSwr = () => {
    const { mutateToggleFavoriteSwr } = use(SwrContext)!
    return mutateToggleFavoriteSwr
}
