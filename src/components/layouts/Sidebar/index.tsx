"use client"

import { cn, ListBox, ScrollShadow } from "@heroui/react"
import React, { useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import {
    BracketsCurlyIcon,
    ReadCvLogoIcon,
    GraduationCapIcon,
    MapPinLineIcon,
    UsersIcon,
    SparkleIcon,
    StackIcon,
    HandshakeIcon,
} from "@phosphor-icons/react"
import type { Icon } from "@phosphor-icons/react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { SidebarTab, setSidebar } from "@/redux/slices"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"

type SidebarNavItem = {
    /** Visible label. */
    label: string
    /** Stable list key. */
    value: string
    /** Sidebar tab enum value. */
    tab: SidebarTab
    /** Phosphor icon component. */
    icon: Icon
    /** Navigation target. */
    url?: string
}

/**
 * Course learn sidebar: flat nav items; foundations opens the category grid page.
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

    const onSelectSidebarTab = (tab: SidebarTab) => {
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
        default:
            return
        }
    }

    const items = useMemo((): Array<SidebarNavItem> => [
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
    ], [course?.modules?.length, courseDisplayId, locale, moduleId, t])

    return (
        <div className="sticky top-16 self-start border-r ">
            <ScrollShadow
                hideScrollBar
                className="min-h-[calc(100vh-4rem)] overflow-y-auto pr-1 p-3"
                size={40}
            >
                {items.map((item) => (
                    <ListBox
                        key={item.value}
                        selectedKeys={selectedSidebar.tab === item.tab ? [item.value] : []}
                        selectionMode="single"
                    >
                        <ListBox.Item
                            className={cn(
                                selectedSidebar.tab === item.tab
                                    ? "text-accent bg-accent/10"
                                    : "",
                            )}
                            onPress={() => {
                                onSelectSidebarTab(item.tab)
                                if (item.url) {
                                    router.replace(item.url)
                                }
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <item.icon className="size-5 shrink-0" />
                                <span className="hidden sm:inline">{item.label}</span>
                            </div>
                        </ListBox.Item>
                    </ListBox>
                ))}
            </ScrollShadow>
        </div>
    )
}

