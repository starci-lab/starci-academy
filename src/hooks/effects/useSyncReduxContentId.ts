import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setContentDisplayId } from "@/redux/slices"

export const useSyncReduxContentId = () => {
    /** The dispatch. */
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()
    /** The useEffect to navigate to the course. */
    useEffect(
        () => {
        /** If the pathname is not a course path, set the course id to null. */
            if (params.contentId) {
                dispatch(setContentDisplayId(params.contentId as string))
            }
        }, [pathname, params.contentId]
    )
}