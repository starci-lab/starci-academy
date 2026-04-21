import { useAppDispatch, useAppSelector } from "@/redux"
import { ContentTab, setContentTab } from "@/redux/slices"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Sync tab between Redux and URL (?tab=...)
 */
export const useSetTabQuery = () => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const tab = useAppSelector((state) => state.tabs.contentTab)
    const isSyncingFromUrlRef = useRef(false)

    // URL Redux (allow on mount)
    useEffect(() => {
        const tabFromUrl = searchParams.get("tab") as ContentTab | null
        if (!tabFromUrl) return
        if (tabFromUrl === tab) return
        isSyncingFromUrlRef.current = true
        dispatch(setContentTab(tabFromUrl))
    }, [searchParams])
}