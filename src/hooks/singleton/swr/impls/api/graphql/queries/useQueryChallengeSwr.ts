import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryChallengeSwr = () => {
    const { queryChallengeSwr } = use(SwrContext)!
    return queryChallengeSwr
}
