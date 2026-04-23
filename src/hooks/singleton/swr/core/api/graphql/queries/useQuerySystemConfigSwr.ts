import { querySystemConfig } from "@/modules/api"
import { useAppDispatch } from "@/redux"
import { setSystemConfig } from "@/redux/slices"
import useSWR from "swr"

/**
 * Loads system config and hydrates `state.system.config`.
 */
export const useQuerySystemConfigSwrCore = () => {
    const dispatch = useAppDispatch()
    const swr = useSWR(
        ["QUERY_SYSTEM_CONFIG_SWR"],
        async () => {
            const { data } = await querySystemConfig({})
            const envelope = data?.systemConfig
            const inner = envelope?.data
            if (!envelope?.success || !inner) {
                throw new Error(
                    envelope?.error ?? envelope?.message ?? "System config not found",
                )
            }
            dispatch(setSystemConfig(inner))
            return inner
        },
    )
    return swr
}
