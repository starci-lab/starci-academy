import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { useAppDispatch } from "@/redux/hooks"
import { setSelectedTaskId } from "@/redux/slices/milestone"

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
                return
            }
            // Clear when we've left the capstone task surface — WITHOUT this, a task
            // id set on `personal-project/tasks/[taskId]` lingers into every other
            // learn tab (mind-map, leaderboard, flashcards…), and the content-AI scope
            // then wrongly resolves to 🎯 Task there (grounding on an unrelated
            // capstone, opening the wrong session, hiding the widen-to-course escape).
            // Mirrors `useSyncReduxFoundationId`.
            if (!pathname.includes("/personal-project")) {
                dispatch(setSelectedTaskId(undefined))
            }
        },
        [dispatch, pathname, params.taskId],
    )
}
