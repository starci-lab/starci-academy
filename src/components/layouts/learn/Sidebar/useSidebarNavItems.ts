"use client"

import { Code as CodeIcon, CurlyBrackets as BracketsCurlyIcon, GraduationCap as GraduationCapIcon, HandOk as HandshakeIcon, Layers as StackIcon, LayoutCells as CardsIcon, MapPin as MapPinLineIcon, Persons as UsersIcon, Sparkles as SparkleIcon } from "@gravity-ui/icons"
import {
    useCallback,
    useMemo,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
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

    /** Record the active sidebar tab in Redux (routing is handled in {@link onSelect}). */
    const onSelectSidebarTab = useCallback(
        (tab: SidebarTab) => {
            dispatch(setSidebar({ tab, extraId: undefined }))
        },
        [dispatch],
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
                label: t("flashcard.title"),
                value: "flashcards",
                tab: SidebarTab.Flashcards,
                icon: CardsIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().flashcards().build(),
            },
            {
                label: t("codingPractice.title"),
                value: "practice",
                tab: SidebarTab.Practice,
                icon: CodeIcon,
                url: pathConfig().locale(locale).course(courseDisplayId).learn().practice().build(),
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

    /** Route on selection: update Redux tab, then navigate once to the row URL. */
    const onSelect = useCallback(
        (item: SidebarNavItem) => {
            onSelectSidebarTab(item.tab)
            if (!item.url) {
                return
            }
            router.push(item.url)
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
