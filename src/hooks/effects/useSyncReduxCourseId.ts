import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setCourseDisplayId } from "@/redux/slices"

export const useSyncReduxCourseId = () => {
    /** The dispatch. */
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()
    /** The useEffect to navigate to the course. */
    useEffect(
        () => {
        /** If the pathname is not a course path, set the course id to null. */
            if (params.courseId) {
                dispatch(setCourseDisplayId(params.courseId as string))
            }
        }, [pathname, params.id]
    )
}