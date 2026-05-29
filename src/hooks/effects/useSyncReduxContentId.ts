import { useAppDispatch } from "@/redux"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"
import { setContentId } from "@/redux/slices"

/**
 * Syncs `content.contentId` from the `[contentId]` route param into Redux on navigation.
 * @returns void
 */
export const useSyncReduxContentId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()
    useEffect(
        () => {
            if (params.contentId) {
                dispatch(setContentId(params.contentId as string))
            }
        }, [pathname, params.contentId]
    )
}