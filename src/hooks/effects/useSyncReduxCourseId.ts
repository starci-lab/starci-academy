import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setCourseDisplayId } from "@/redux/slices"

export const useSyncReduxCourseId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()
    useEffect(
        () => {
            if (params.courseId) {
                dispatch(setCourseDisplayId(params.courseId as string))
            }
        }, [pathname, params.courseId]
    )
}