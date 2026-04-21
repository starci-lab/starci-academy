"use client"

import { cn, ListBox, ScrollShadow } from "@heroui/react"
import _ from "lodash"
import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
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
    const dispatch = useAppDispatch()
    const course = useAppSelector((state) => state.course.entity)
    const selectedSidebar = useAppSelector((state) => state.sidebar.sidebar)
    const items = useMemo(() => [
        {
            label: t("mindMap.title"),
            value: "mind-map",
            tab: SidebarTab.MindMap,
            icon: MapPinLineIcon,
            isAccordion: false,
        },
        {
            label: t("modules.title", { count: course?.modules?.length ?? 0 }),
            value: "modules",
            tab: SidebarTab.Modules,
            icon: BracketsCurlyIcon,
            isAccordion: true,
            items:_.cloneDeep(course?.modules ?? [])
                .sort((prev, next) => prev.orderIndex - next.orderIndex)
                .map((module, index) => ({
                    key: module.id,
                    label: module.title,
                    orderIndex: index,
                }
                )
                )
        },
        {
            label: t("cv.title"),
            value: "cv",
            tab: SidebarTab.Cv,
            icon: ReadCvLogoIcon,
            isAccordion: false,
        },
        {
            label: t("finalProject.title"),
            value: "personal-project",
            tab: SidebarTab.PersonalProject,
            icon: GraduationCapIcon,
            isAccordion: false,
        },
        {
            label: t("leaderboard.title"),
            value: "leaderboard",
            tab: SidebarTab.Leaderboard,
            icon: UsersIcon,
            isAccordion: false,
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
                },
            ]
        },
    ], [t, course?.modules])
    return (
        <div className="sticky top-16 self-start border-r border-divider">
            <ScrollShadow
                hideScrollBar
                className="max-h-[calc(100vh-4rem)] overflow-y-auto pr-1 p-6"
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
                                onSelectSubItem={(extraId) => dispatch(setSidebar({ tab: item.tab, extraId }))}
                                extraId={selectedSidebar.extraId}
                            />
                        )
                    }
                    return <ListBox key={item.value}
                        selectedKeys={selectedSidebar.tab === item.tab ? [selectedSidebar.extraId ?? ""] : []}
                        selectionMode="single"
                    >
                        <ListBox.Item
                            className={cn("", selectedSidebar.tab === item.tab ? "text-accent bg-accent/10" : "")}
                            onPress={() => dispatch(setSidebar({ tab: item.tab, extraId: undefined }))}
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