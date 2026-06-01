"use client"

import {
    useCallback,
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    BracketsCurlyIcon,
    ReadCvLogoIcon,
    GraduationCapIcon,
    MapPinLineIcon,
    UsersIcon,
    SparkleIcon,
    StackIcon,
    HandshakeIcon,
    CardsIcon,
} from "@phosphor-icons/react"
import {
    useRouter,
} from "next/navigation"
import {
    useAppDispatch,
    useAppSelector,
} from "@/redux"
import {
    SidebarTab,
    setSidebar,
} from "@/redux/slices"
import {
    pathConfig,
} from "@/resources/path"
import type {
    SidebarNavItem,
} from "./types"

/**
 * Result of {@link useSidebarNavItems}.
 */
export interface UseSidebarNavItemsResult {
    /** Ordered nav entries for the course-learn sidebar. */
    items: Array<SidebarNavItem>
    /** Currently active sidebar tab (for row highlighting). */
    selectedTab: SidebarTab
    /** Fired with the chosen entry: switches tab then routes to its URL. */
    onSelect: (item: SidebarNavItem) => void
}

/**
 * Builds the course-learn sidebar nav entries plus the select handler.
 *
 * Shared by the desktop {@link Sidebar} and the mobile drawer so both render the
 * exact same items + routing without duplicating the redux/route wiring.
 * @returns {@link UseSidebarNavItemsResult} entries, active tab, and select callback.
 */
export const useSidebarNavItems = (): UseSidebarNavItemsResult => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    // course catalog drives the module-count label on the "modules" row
    const course = useAppSelector((state) => state.course.entity)
    // display id is the slug used to build every learn sub-route
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    // active module id keeps the "modules" row pointing at the current module
    const moduleId = useAppSelector((state) => state.module.id)
    // active tab from redux highlights the matching row
    const selectedSidebar = useAppSelector((state) => state.sidebar.sidebar)

    /** Dispatch the active tab and route to the matching learn sub-page. */
    const onSelectSidebarTab = useCallback(
        (tab: SidebarTab) => {
            // record the active tab so the row highlight survives navigation
            dispatch(setSidebar({ tab, extraId: undefined }))
            // without a course slug there is no route to build — bail out
            if (!courseDisplayId) return
            // shared base builder for every learn destination
            const learn = pathConfig().locale(locale).course(courseDisplayId).learn()
            // map each tab to its concrete sub-route
            switch (tab) {
            case SidebarTab.MindMap:
                router.push(learn.mindMap().build())
                return
            case SidebarTab.Modules:
                router.push(learn.module(moduleId).build())
                return
            case SidebarTab.Cv:
                router.push(learn.cv().build())
                return
            case SidebarTab.PersonalProject:
                router.push(learn.personalProject().build())
                return
            case SidebarTab.Leaderboard:
                router.push(learn.leaderboard().build())
                return
            case SidebarTab.Foundations:
                router.push(learn.foundations().build())
                return
            case SidebarTab.Headhuntings:
                router.push(learn.headhuntings().build())
                return
            case SidebarTab.Quizlet:
                router.push(learn.quiz().build())
                return
            default:
                return
            }
        },
        [
            dispatch,
            courseDisplayId,
            locale,
            moduleId,
            router,
        ],
    )

    // build the ordered nav entries; memoized so rows keep stable identity
    const items = useMemo<Array<SidebarNavItem>>(
        () => [
            {
                label: t("mindMap.title"),
                value: "mind-map",
                tab: SidebarTab.MindMap,
                icon: MapPinLineIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().mindMap().build(),
            },
            {
                label: t("modules.title", { count: course?.modules?.length ?? 0 }),
                value: "modules",
                tab: SidebarTab.Modules,
                icon: BracketsCurlyIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleId).build(),
            },
            {
                label: t("foundations.title"),
                value: "foundations",
                tab: SidebarTab.Foundations,
                icon: StackIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().foundations().build(),
            },
            {
                label: t("headhuntings.title"),
                value: "headhuntings",
                tab: SidebarTab.Headhuntings,
                icon: HandshakeIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().headhuntings().build(),
            },
            {
                label: t("quiz.title"),
                value: "quiz",
                tab: SidebarTab.Quizlet,
                icon: CardsIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().quiz().build(),
            },
            {
                label: t("cv.title"),
                value: "cv",
                tab: SidebarTab.Cv,
                icon: ReadCvLogoIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().cv().build(),
            },
            {
                label: t("finalProject.title"),
                value: "personal-project",
                tab: SidebarTab.PersonalProject,
                icon: GraduationCapIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().personalProject().build(),
            },
            {
                label: t("leaderboard.title"),
                value: "leaderboard",
                tab: SidebarTab.Leaderboard,
                icon: UsersIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().leaderboard().build(),
            },
            {
                label: t("starciAi.title"),
                value: "starci-ai",
                tab: SidebarTab.StarciAi,
                icon: SparkleIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().starciAi().build(),
            },
        ],
        [
            course?.modules?.length,
            courseDisplayId,
            locale,
            moduleId,
            t,
        ],
    )

    /** Route on selection: switch tabs, then replace with the row's URL. */
    const onSelect = useCallback(
        (item: SidebarNavItem) => {
            // flip the active tab (also routes via the tab switch)
            onSelectSidebarTab(item.tab)
            // replace (not push) so the sidebar nav does not stack history entries
            if (item.url) {
                router.replace(item.url)
            }
        },
        [
            onSelectSidebarTab,
            router,
        ],
    )

    return {
        items,
        selectedTab: selectedSidebar.tab,
        onSelect,
    }
}
