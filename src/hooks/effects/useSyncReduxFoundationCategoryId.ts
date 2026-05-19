import { useAppDispatch } from "@/redux"
import { setFoundationCategoryId } from "@/redux/slices"
import { useEffect } from "react"
import { useParams, usePathname } from "next/navigation"

/**
 * Syncs foundation category id from route params; clears on the hub page.
 */
export const useSyncReduxFoundationCategoryId = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const params = useParams()

    useEffect(() => {
        if (params.categoryId) {
            dispatch(setFoundationCategoryId(params.categoryId as string))
            return
        }

        if (!pathname.includes("/foundations")) {
            dispatch(setFoundationCategoryId(undefined))
            return
        }

        const afterFoundations = pathname.split("/foundations")[1] ?? ""
        const hasCategorySegment = /^\/[^/]+/.test(afterFoundations)
        if (!hasCategorySegment) {
            dispatch(setFoundationCategoryId(undefined))
        }
    }, [dispatch, params.categoryId, pathname])
}
