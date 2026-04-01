import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryModuleSwr = () => {
    const { queryModuleSwr } = use(SwrContext)!
    return queryModuleSwr
}
