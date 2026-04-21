import { useAppSelector } from "@/redux"
import { SidebarTab } from "@/redux/slices"
import { pathConfig } from "@/resources"
import { useLocale } from "next-intl"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"

/**
 * useSidebar is a hook that is used to navigate to the correct path based on the sidebar state.
 */
export const useSidebar = () => {
    const router = useRouter()
    const pathname = usePathname()
    const locale = useLocale()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const moduleDisplayId = useAppSelector((state) => state.module.displayId)
    const sidebar = useAppSelector((state) => state.sidebar.sidebar)

    useEffect(() => {
        // if (!courseDisplayId) return
        // if (!pathname.includes("/learn")) return
        // let targetPath = ""
        // switch (sidebar.tab) {
        // case SidebarTab.MindMap:
        //     targetPath = pathConfig().locale(locale).course(courseDisplayId).learn().mindMap().build()
        //     break
        // // case SidebarTab.Modules:
        // //     targetPath = pathConfig().locale(locale).course(courseDisplayId).learn().module().build()
        // //     break
        // case SidebarTab.Cv:
        //     targetPath = pathConfig().locale(locale).course(courseDisplayId).learn().cv().build()
        //     break
        // case SidebarTab.PersonalProject:
        //     targetPath = pathConfig().locale(locale).course(courseDisplayId).learn().personalProject().build()
        //     break
        // case SidebarTab.Leaderboard:
        //     targetPath = pathConfig().locale(locale).course(courseDisplayId).learn().leaderboard().build()
        //     break
        // default:
        //     break
        // }
        // if (!targetPath || pathname === targetPath) return
        // router.push(targetPath)
    }, [sidebar, courseDisplayId, moduleDisplayId, locale, pathname])
}
