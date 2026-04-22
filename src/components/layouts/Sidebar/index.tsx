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
    SparkleIcon
} from "@phosphor-icons/react"
import { useAppDispatch, useAppSelector } from "@/redux"
import { SidebarTab, setSidebar } from "@/redux/slices"
import { SidebarAccordion } from "./Accordion"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"

/**
 * @interface SidebarProps
 * @property {string} courseId - The ID of the course
 */
export interface SidebarProps {
    courseId: string
}
/**
 * @component Sidebar
 */
export const Sidebar = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const moduleDisplayId = useAppSelector((state) => state.module.displayId)
    const selectedSidebar = useAppSelector((state) => state.sidebar.sidebar)
    const onSelectSidebarTab = (tab: SidebarTab, extraId?: string) => {
        dispatch(setSidebar({ tab, extraId }))
        if (!courseDisplayId) return
        switch (tab) {
        case SidebarTab.MindMap:
            router.push(pathConfig().locale(locale).course(courseDisplayId).learn().mindMap().build())
            return
        case SidebarTab.Modules:
            router.push(pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleDisplayId).build())
            return
        case SidebarTab.Cv:
            router.push(pathConfig().locale(locale).course(courseDisplayId).learn().cv().build())
            return
        case SidebarTab.PersonalProject:
            router.push(pathConfig().locale(locale).course(courseDisplayId).learn().personalProject().build())
            return
        case SidebarTab.Leaderboard:
            router.push(pathConfig().locale(locale).course(courseDisplayId).learn().leaderboard().build())
            return
        default:
            return
        }
    }
    const items = useMemo(() => [
        {
            label: t("mindMap.title"),
            value: "mind-map",
            tab: SidebarTab.MindMap,
            icon: MapPinLineIcon,
            isAccordion: false,
            url: pathConfig().locale(locale).course(courseDisplayId).learn().mindMap().build(),
        },
        {
            label: t("modules.title", { count: course?.modules?.length ?? 0 }),
            value: "modules",
            tab: SidebarTab.Modules,
            icon: BracketsCurlyIcon,
            isAccordion: false,
            url: pathConfig().locale(locale).course(courseDisplayId).learn().module(moduleDisplayId).build(),
        },
        {
            label: t("cv.title"),
            value: "cv",
            tab: SidebarTab.Cv,
            icon: ReadCvLogoIcon,
            isAccordion: false,
            url: pathConfig().locale(locale).course(courseDisplayId).learn().cv().build(),
        },
        {
            label: t("finalProject.title"),
            value: "personal-project",
            tab: SidebarTab.PersonalProject,
            icon: GraduationCapIcon,
            isAccordion: false,
            url: pathConfig().locale(locale).course(courseDisplayId).learn().personalProject().build(),
        },
        {
            label: t("leaderboard.title"),
            value: "leaderboard",
            tab: SidebarTab.Leaderboard,
            icon: UsersIcon,
            isAccordion: false,
            url: pathConfig().locale(locale).course(courseDisplayId).learn().leaderboard().build(),
        },
        {
            label: t("starciAi.title"),
            value: "starci-ai",
            tab: SidebarTab.StarciAi,
            icon: SparkleIcon,
            isAccordion: true,
            items: [
                {
                    key: "starci-ai-1",
                    label: t("starciAi.title"),
                    orderIndex: 0,
                    url: pathConfig().locale(locale).course(courseDisplayId).learn().starciAi().build(),
                },
            ],
            url: pathConfig().locale(locale).course(courseDisplayId).learn().starciAi().build(),
        },
    ], [t, courseDisplayId, locale])
    return (
        <div className="sticky top-16 self-start border-r border-divider">
            <ScrollShadow
                hideScrollBar
                className="min-h-[calc(100vh-4rem)] overflow-y-auto pr-1 p-3"
                size={40}
            >
                {items.map((item) => {
                    if (item.isAccordion) {
                        return (
                            <SidebarAccordion
                                key={item.value}
                                label={item.label}
                                icon={item.icon}
                                items={item.items ?? []}
                                onSelectSubItem={(extraId) => onSelectSidebarTab(item.tab, extraId)}
                                extraId={selectedSidebar.extraId}
                            />
                        )
                    }
                    return <ListBox key={item.value}
                        selectedKeys={selectedSidebar.tab === item.tab ? [selectedSidebar.extraId ?? ""] : []}
                        selectionMode="single"
                    >
                        <ListBox.Item
                            className={cn("", selectedSidebar.tab === item.tab && selectedSidebar.extraId === undefined ? "text-accent bg-accent/10" : "")}
                            onPress={() => {
                                onSelectSidebarTab(item.tab, undefined)
                                router.replace(item.url ?? "")
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <item.icon className="size-5 shrink-0" />
                                <span className="hidden sm:inline">{item.label}</span>
                            </div>
                        </ListBox.Item>
                    </ListBox>
                })}
            </ScrollShadow>
        </div>
    )
}