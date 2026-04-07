"use client"
import React, { useMemo } from "react"
import { Link, Spacer } from "@heroui/react"
import { 
    StarCiBreadcrumb, 
    StarCiBreadcrumbItem, 
    StarCiSkeleton,
    StarCiTab,
    StarCiTabs
} from "@/components/atomic"
import { useLocale, useTranslations } from "next-intl"
import { ModuleSidebar } from "./ModuleSidebar"
import { LearnTab, setLearnTab } from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"
import { BookOpenIcon, TrophyIcon, UsersIcon, VideoIcon } from "@phosphor-icons/react"
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
            value: LearnTab.Foundations,
            icon: BookOpenIcon
        },
        {
            label: t("challenge.title"),
            value: LearnTab.Challenges,
            icon: TrophyIcon
        },
        {
            label: t("leaderboard.topAchievers"),
            value: LearnTab.TopAchievers,
            icon: UsersIcon
        }
    ], [t])
    const router = useRouter()
    const renderContent = () => {
        switch (learnTab) {
        case LearnTab.LessonVideos:
            return <LessonVideoSection />
        case LearnTab.Foundations:
            return <ContentSection />
        case LearnTab.Challenges:
            return <ChallengeSection />
        case LearnTab.TopAchievers:
            return <div/>
        }
    }
    return (
        <div>
            {
                isLoading ? (
                    <StarCiSkeleton className="w-30 h-5" />
                ) : (
                    <StarCiBreadcrumb>
                        <StarCiBreadcrumbItem>
                            <Link href="/">{t("nav.home")}</Link>
                        </StarCiBreadcrumbItem>
                        <StarCiBreadcrumbItem>
                            <Link href="/courses">{t("nav.courses")}</Link>
                        </StarCiBreadcrumbItem>
                        <StarCiBreadcrumbItem>
                            <Link onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).build())}>
                                {course?.title}
                            </Link>
                        </StarCiBreadcrumbItem>
                        <StarCiBreadcrumbItem>
                            <Link onPress={() => router.push(pathConfig().locale(locale).course(courseDisplayId).learn().build())}>
                                {t("nav.learn")}
                            </Link>
                        </StarCiBreadcrumbItem>
                    </StarCiBreadcrumb>
                )
            }
            <Spacer y={6} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">  
                    {
                        (isModuleLoading || !module) ? (
                            <StarCiSkeleton className="w-60 my-1 h-5 hidden sm:block" />
                        ) : (
                            <div className="text-xl font-bold hidden sm:block">{module?.title}</div>
                        )
                    }    
                    <Spacer y={4} className="hidden sm:block" />
                    {
                        (isModuleLoading || !module) ? (
                            <div className="w-full hidden sm:block">
                                <StarCiSkeleton className="h-[14px] w-[60%] my-[3px]" />
                                <StarCiSkeleton className="h-[14px] w-[50%] my-[3px]" />
                                <StarCiSkeleton className="h-[14px] w-[40%] my-[3px]" />
                            </div>
                        ) : (
                            <div className="text-sm text-foreground-500 hidden sm:block">{module?.description}</div>
                        )
                    }
                    <Spacer y={6} className="hidden sm:block" />
                    <StarCiTabs 
                        color="primary"
                        variant="underlined"
                        selectedKey={learnTab} 
                        onSelectionChange={(value) => dispatch(setLearnTab(value as LearnTab))}
                    >
                        {
                            tabs.map((tab) => (
                                <StarCiTab title={
                                    <div className="flex items-center justify-center gap-2 w-full">
                                        <tab.icon className="size-5 shrink-0" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </div>} key={tab.value} value={tab.value}
                                />
                            ))
                        }
                    </StarCiTabs>
                    <Spacer y={6} />
                    {renderContent()}
                </div>
                <div className="hidden sm:block">
                    <ModuleSidebar />
                </div>
            </div>
        </div>
    )
}