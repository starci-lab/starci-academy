import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setModuleId } from "@/redux/slices"

export const useSyncReduxModuleId = () => {
    /** The dispatch. */
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()
    /** The useEffect to navigate to the course. */
    useEffect(
        () => {
        /** If the pathname is not a course path, set the course id to null. */
            if (params.moduleId) {
                dispatch(setModuleId(params.moduleId as string))
            }
        }, [pathname, params.id]
    )
}