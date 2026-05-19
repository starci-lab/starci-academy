import { useAppDispatch } from "@/redux"
import { setFoundationCategoryDisplayId } from "@/redux/slices"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"

/**
 * Syncs foundation category display id from route params; clears on the hub page.
 */
export const useSyncReduxFoundationCategoryDisplayId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()

    useEffect(() => {
        if (params.categoryDisplayId) {
            dispatch(setFoundationCategoryDisplayId(params.categoryDisplayId as string))
            return
        }

        if (!pathname.includes("/foundations")) {
            dispatch(setFoundationCategoryDisplayId(undefined))
            return
        }

        const afterFoundations = pathname.split("/foundations")[1] ?? ""
        const hasCategorySegment = /^\/[^/]+/.test(afterFoundations)
        if (!hasCategorySegment) {
            dispatch(setFoundationCategoryDisplayId(undefined))
        }
    }, [dispatch, params.categoryDisplayId, pathname])
}
