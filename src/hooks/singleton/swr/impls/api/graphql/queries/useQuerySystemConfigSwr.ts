import { SwrContext } from "@/hooks/singleton"
import { use } from "react"

/**
 * SWR for system config (see core hook; hydrates `state.system.config`).
 */
export const useQuerySystemConfigSwr = () => {
    const { querySystemConfigSwr } = use(SwrContext)!
    return querySystemConfigSwr
}
