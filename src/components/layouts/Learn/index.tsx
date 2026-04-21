"use client"
import React, { useMemo } from "react"
import {
    Breadcrumbs,
    Skeleton,
    Tabs,
} from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { LearnTab, setLearnTab } from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"
import { BookOpenIcon, SwordIcon, UsersIcon, VideoIcon } from "@phosphor-icons/react"
import { LessonVideoSection } from "./LessionVideoSection"
import { ChallengeSection } from "./ChallengeSection"
import { ContentSection } from "./ContentSection"
import { useQueryCourseSwr, useQueryModuleSwr } from "@/hooks/singleton"
import { pathConfig } from "@/resources"
import { useRouter } from "next/navigation"

export const Learn = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const locale = useLocale()
    const module = useAppSelector((state) => state.module.entity)
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const { isLoading: isCourseLoading } = useQueryCourseSwr()
    const { isLoading: isModuleLoading } = useQueryModuleSwr()
    const isLoading = isCourseLoading || isModuleLoading || !module || !course
    const learnTab = useAppSelector((state) => state.tabs.learnTab)
    const tabs = useMemo(() => [
        {
            label: t("lesson.videos"),
            value: LearnTab.LessonVideos,
            icon: VideoIcon
        },
        {
            label: t("content.title"),
            value: LearnTab.Contents,
            icon: BookOpenIcon
        },
        {
            label: t("challenge.title"),
            value: LearnTab.Challenges,
            icon: SwordIcon
        },
        {
            label: t("leaderboard.topAchievers"),
            value: LearnTab.TopAchievers,
            icon: UsersIcon
        }
    ], [t])
    const router = useRouter()
    return (
        <div>
            {
                isLoading ? (
                    <Skeleton className="w-30 h-5" />
                ) : (
                    <Breadcrumbs>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale().build())}>
                            {t("nav.home")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course().build())}>
                            {t("nav.courses")}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).build())}>
                            {course?.title}
                        </Breadcrumbs.Item>
                        <Breadcrumbs.Item>
                            <span>{t("nav.learn")}</span>
                        </Breadcrumbs.Item>
                    </Breadcrumbs>
                )
            }
            <div className="h-12" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
                <div className="sm:col-span-2">
                    {
                        (isModuleLoading || !module) ? (
                            <Skeleton className="w-60 my-1 h-5 hidden sm:block" />
                        ) : (
                            <div className="text-xl font-bold hidden sm:block">{module?.title}</div>
                        )
                    }
                    <div className="hidden sm:block h-6" />
                    {
                        (isModuleLoading || !module) ? (
                            <div className="w-full hidden sm:block">
                                <Skeleton className="h-[14px] w-[60%] my-[3px]" />
                                <Skeleton className="h-[14px] w-[50%] my-[3px]" />
                                <Skeleton className="h-[14px] w-[40%] my-[3px]" />
                            </div>
                        ) : (
                            <div className="text-sm text-muted hidden sm:block">{module?.description}</div>
                        )
                    }
                    <div className="hidden sm:block h-12" />
                    <Tabs
                        selectedKey={learnTab}
                        variant="secondary"
                        onSelectionChange={(value) => dispatch(setLearnTab(value as LearnTab))}
                    >
                        <Tabs.ListContainer>
                            <Tabs.List aria-label={t("module.tabListAria")}>
                                {tabs.map((tab) => (
                                    <Tabs.Tab key={tab.value} id={tab.value} className="data-[selected=true]:text-accent">
                                        <div className="flex items-center justify-center gap-2 w-full">
                                            <tab.icon className="size-5 shrink-0" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </div>
                                        <Tabs.Indicator className="bg-accent" />
                                    </Tabs.Tab>
                                ))}
                            </Tabs.List>
                        </Tabs.ListContainer>
                        <Tabs.Panel id={LearnTab.LessonVideos} className="mt-6">
                            <LessonVideoSection />
                        </Tabs.Panel>
                        <Tabs.Panel id={LearnTab.Contents} className="mt-6">
                            <ContentSection />
                        </Tabs.Panel>
                        <Tabs.Panel id={LearnTab.Challenges} className="mt-6">
                            <ChallengeSection />
                        </Tabs.Panel>
                        <Tabs.Panel id={LearnTab.TopAchievers} className="mt-6">
                            <div />
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
