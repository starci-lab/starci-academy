import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setSelectedMilestoneId } from "@/redux/slices"

/**
 * Syncs `milestone.selectedMilestoneId` from the `[milestoneId]` route param into Redux on navigation.
 * @returns void
 */
export const useSyncReduxMilestoneId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()
    useEffect(
        () => {
            if (params.milestoneId) {
                dispatch(setSelectedMilestoneId(params.milestoneId as string))
            }
        }, [pathname, params.milestoneId]
    )
}
