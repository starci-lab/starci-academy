import { useAppDispatch, useAppSelector } from "@/redux"
import { ContentTab, setContentTab } from "@/redux/slices"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * Sync tab between Redux and URL (?tab=...)
 */
export const useSetTabQuery = () => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const tab = useAppSelector((state) => state.tabs.contentTab)
    const router = useRouter()

    const isSyncingFromUrlRef = useRef(false)
    const hasMountedRef = useRef(false)

    // Redux to URL (skip first mount)
    useEffect(() => {
        if (!hasMountedRef.current) return
        if (!tab) return

        if (isSyncingFromUrlRef.current) {
            isSyncingFromUrlRef.current = false
            return
        }

        const currentTab = searchParams.get("tab")
        if (currentTab === tab) return

        const newSearchParams = new URLSearchParams(searchParams)
        newSearchParams.set("tab", tab)

        router.replace(`?${newSearchParams.toString()}`)
    }, [tab])

    // URL Redux (allow on mount)
    useEffect(() => {
        const tabFromUrl = searchParams.get("tab") as ContentTab | null
        if (!tabFromUrl) return

        if (tabFromUrl === tab) return

        isSyncingFromUrlRef.current = true
        dispatch(setContentTab(tabFromUrl))
    }, [searchParams])

    // Mark mounted AFTER first render
    useEffect(() => {
        hasMountedRef.current = true
    }, [])
}