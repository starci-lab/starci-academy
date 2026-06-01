import {
    use,
} from "react"
import {
    SwrContext,
} from "@/hooks/singleton/swr/SwrContext"

/**
 * Accessor for the singleton {@link useQueryAiBalancerHealthSwrCore} handle.
 */
export const useQueryAiBalancerHealthSwr = () => {
    const {
        queryAiBalancerHealthSwr,
    } = use(SwrContext)!
    return queryAiBalancerHealthSwr
}
