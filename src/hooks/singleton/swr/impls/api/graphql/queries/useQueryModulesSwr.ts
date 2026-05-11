import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useQueryModulesSwr = () => {
    const { queryModulesSwr } = use(SwrContext)!
    return queryModulesSwr
}
