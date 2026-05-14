import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setSelectedTaskId } from "@/redux/slices"

/**
 * Syncs `milestone.selectedTaskId` from the URL `tasks/[taskId]` segment.
 */
export const useSyncReduxTaskId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()

    useEffect(
        () => {
            const taskId = typeof params.taskId === "string"
                ? params.taskId
                : Array.isArray(params.taskId)
                    ? params.taskId[0]
                    : undefined
            if (taskId) {
                dispatch(setSelectedTaskId(taskId))
            }
        },
        [dispatch, pathname, params.taskId],
    )
}
