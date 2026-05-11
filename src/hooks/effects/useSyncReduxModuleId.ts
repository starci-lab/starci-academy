import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setModuleId } from "@/redux/slices"

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