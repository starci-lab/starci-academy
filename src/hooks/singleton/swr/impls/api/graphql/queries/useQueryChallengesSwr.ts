import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryChallengesSwr = () => {
    const { queryChallengesSwr } = use(SwrContext)!
    return queryChallengesSwr
}
