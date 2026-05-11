import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryAiModelsSwr = () => {
    const { queryAiModelsSwr } = use(SwrContext)!
    return queryAiModelsSwr
}
