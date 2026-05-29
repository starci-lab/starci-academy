import { SwrContext } from "../../../../SwrContext"
import { use } from "react"

/**
 * Access the SWR mutation singleton for syncing the personal project idea text.
 * @returns the SWR mutation handle from {@link SwrContext}.
 */
export const useMutateSyncIdealTextSwr = () => {
    const { mutateSyncIdealTextSwr } = use(SwrContext)!
    return mutateSyncIdealTextSwr
}
