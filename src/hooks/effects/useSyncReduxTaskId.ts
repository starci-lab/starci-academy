import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setSelectedTaskId } from "@/redux/slices"

export const useSyncReduxTaskId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()

    useEffect(
        () => {
            if (params.taskId) {
                dispatch(setSelectedTaskId(params.taskId as string))
            }
        }, [pathname, params.taskId]
    )
}
