import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryUserPersonalTaskAttemptsSwr = () => {
    const { queryUserPersonalTaskAttemptsSwr } = use(SwrContext)!
    return queryUserPersonalTaskAttemptsSwr
}
