import { useAppDispatch, useAppSelector } from "@/redux"
import { ContentTab, setContentTab } from "@/redux/slices"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * On mount, reads the `?tab=` search param and syncs the active content tab into Redux.
 * Normalises legacy `codeExplaining`/`CodeImplementation` values to `CodeExplainings`.
 * @returns void
 */
export const useSetTabQuery = () => {
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()
    const tab = useAppSelector((state) => state.tabs.contentTab)
    const isSyncingFromUrlRef = useRef(false)

    // URL Redux (allow on mount)
    useEffect(() => {
        const rawTab = searchParams.get("tab")
        if (!rawTab) return
        const tabFromUrl =
            rawTab === ContentTab.LessonVideos
            || rawTab === "codeExplaining"
            || rawTab === ContentTab.CodeImplementation
                ? ContentTab.CodeExplainings
                : (rawTab as ContentTab)
        if (tabFromUrl === tab) return
        isSyncingFromUrlRef.current = true
        dispatch(setContentTab(tabFromUrl))
    }, [searchParams])
}