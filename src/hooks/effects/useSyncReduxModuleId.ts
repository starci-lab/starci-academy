import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setModuleId } from "@/redux/slices"

/**
 * Syncs `module.moduleId` from the `[moduleId]` route param into Redux on navigation.
 * @returns void
 */
export const useSyncReduxModuleId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()
    useEffect(
        () => {
            if (params.moduleId) {
                dispatch(setModuleId(params.moduleId as string))
            }
        }, [pathname, params.moduleId]
    )
}