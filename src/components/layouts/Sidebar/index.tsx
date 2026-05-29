"use client"

import React, {
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
import {
    SidebarNavList,
} from "./SidebarNavList"

/**
 * Course learn sidebar.
 *
 * Container: owns redux selectors, builds the nav entries, and routes on
 * selection; renders the presentational {@link SidebarNavList}. Foundations
 * opens the category grid page. `"use client"` for hooks + navigation.
 */
export const Sidebar = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const moduleId = useAppSelector((state) => state.module.id)
    const selectedSidebar = useAppSelector((state) => state.sidebar.sidebar)

    /** Dispatch the active tab and route to the matching learn sub-page. */
    const onSelectSidebarTab = useCallback(
        (tab: SidebarTab) => {
            dispatch(setSidebar({ tab, extraId: undefined }))
            if (!courseDisplayId) return
            const learn = pathConfig().locale(locale).course(courseDisplayId).learn()
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
    const onSelectItem = useCallback(
        (item: SidebarNavItem) => {
            onSelectSidebarTab(item.tab)
            if (item.url) {
                router.replace(item.url)
            }
        },
        [
            onSelectSidebarTab,
            router,
        ],
    )

    return (
        <div className="sticky top-16 self-start border-r ">
            <SidebarNavList
                items={items}
                selectedTab={selectedSidebar.tab}
                onSelect={onSelectItem}
            />
        </div>
    )
}
