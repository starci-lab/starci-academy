import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setSelectedMilestoneId } from "@/redux/slices"

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
