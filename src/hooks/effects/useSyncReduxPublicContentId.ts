import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setPublicContentDisplayId } from "@/redux/slices"

export const useSyncReduxPublicContentId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()
    useEffect(
        () => {
            if (params.contentId) {
                dispatch(setPublicContentDisplayId(params.contentId as string))
            }
        }, [pathname, params.contentId]
    )
}
