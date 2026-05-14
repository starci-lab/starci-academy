import { SwrContext } from "@/hooks/singleton"
import { use } from "react"

/**
 * SWR for incomplete jobs (see core hook for cache key and headers).
 */
export const useQueryIncompleteJobsSwr = () => {
    const { queryIncompleteJobsSwr } = use(SwrContext)!
    return queryIncompleteJobsSwr
}
