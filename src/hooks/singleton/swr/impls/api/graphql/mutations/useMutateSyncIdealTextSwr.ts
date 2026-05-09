import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

export const useMutateSyncIdealTextSwr = () => {
    const { mutateSyncIdealTextSwr } = use(SwrContext)!
    return mutateSyncIdealTextSwr
}
