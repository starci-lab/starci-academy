import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQuerySavedContentsSwr = () => {
    const { querySavedContentsSwr } = use(SwrContext)!
    return querySavedContentsSwr
}
