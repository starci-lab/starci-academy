import { useAppDispatch, useAppSelector } from "@/redux"
import { setFoundation, setFoundationCategory, setFoundations } from "@/redux/slices"
import { useEffect } from "react"

/**
 * Resolves the active foundation category entity from loaded categories + category id.
 */
export const useSyncFoundationCategory = () => {
    const dispatch = useAppDispatch()
    const categories = useAppSelector((state) => state.foundation.categories)
    const categoryId = useAppSelector((state) => state.foundation.categoryId)
    const category = useAppSelector((state) => state.foundation.category)

    useEffect(() => {
        if (!categoryId || !categories?.length) {
            return
        }
        const selected = categories.find((item) => item.id === categoryId)
        if (selected?.id !== category?.id) {
            dispatch(setFoundations(undefined))
            dispatch(setFoundation(undefined))
            dispatch(setFoundationCategory(selected))
        }
    }, [categories, category?.id, categoryId, dispatch])
}
