import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSubmitPersonalGithubUrlSwr = () => {
    const { mutateSubmitPersonalGithubUrlSwr } = use(SwrContext)!
    return mutateSubmitPersonalGithubUrlSwr
}
