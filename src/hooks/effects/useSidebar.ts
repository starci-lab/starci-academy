import { useAppDispatch } from "@/redux"
import { setSidebar, SidebarTab } from "@/redux/slices"
import { useLocale } from "next-intl"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"

/**
 * useSidebar is a hook that is used to navigate to the correct path based on the sidebar state.
 */
export const useSidebar = () => {
    const dispatch = useAppDispatch()
    const pathname = usePathname()
    const locale = useLocale()
    const hasSyncedFromUrlRef = useRef(false)

    useEffect(() => {
        if (hasSyncedFromUrlRef.current) return
        if (!pathname.includes(`/${locale}/courses/`) || !pathname.includes("/learn")) return
        hasSyncedFromUrlRef.current = true

        if (pathname.includes("/mind-map")) {
            dispatch(setSidebar({ tab: SidebarTab.MindMap, extraId: undefined }))
            return
        }
        if (pathname.includes("/modules")) {
            dispatch(setSidebar({ tab: SidebarTab.Modules, extraId: undefined }))
            return
        }
        if (pathname.includes("/cv")) {
            dispatch(setSidebar({ tab: SidebarTab.Cv, extraId: undefined }))
            return
        }
        if (pathname.includes("/personal-project")) {
            dispatch(setSidebar({ tab: SidebarTab.PersonalProject, extraId: undefined }))
            return
        }
        if (pathname.includes("/leaderboard")) {
            dispatch(setSidebar({ tab: SidebarTab.Leaderboard, extraId: undefined }))
            return
        }
    }, [dispatch, locale, pathname])
}
