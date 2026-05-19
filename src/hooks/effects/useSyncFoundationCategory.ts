import { useAppDispatch, useAppSelector } from "@/redux"
import { setFoundation, setFoundationCategory, setFoundations } from "@/redux/slices"
import { useEffect } from "react"

/**
 * Resolves the active foundation category entity from loaded categories + display id.
 */
export const useSyncFoundationCategory = () => {
    const dispatch = useAppDispatch()
    const categories = useAppSelector((state) => state.foundation.categories)
    const categoryDisplayId = useAppSelector((state) => state.foundation.categoryDisplayId)
    const category = useAppSelector((state) => state.foundation.category)

    useEffect(() => {
        if (!categoryDisplayId || !categories?.length) {
            return
        }
        const selected = categories.find((item) => item.displayId === categoryDisplayId)
        if (selected?.id !== category?.id) {
            dispatch(setFoundations(undefined))
            dispatch(setFoundation(undefined))
            dispatch(setFoundationCategory(selected))
        }
    }, [categories, category?.id, categoryDisplayId, dispatch])
}
