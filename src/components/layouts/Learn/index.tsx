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
import { useTranslations } from "next-intl"
import { ModuleSidebar } from "./ModuleSidebar"
import { LearnTab, setLearnTab } from "@/redux/slices"
import { useAppDispatch, useAppSelector } from "@/redux"
import { BookOpenIcon, TrophyIcon, UsersIcon, VideoIcon } from "@phosphor-icons/react"
import { LessonVideoSection } from "./LessionVideoSection"
import { ChallengeSection } from "./ChallengeSection"
import { ContentSection } from "./ContentSection"
import { useQueryCourseSwr, useQueryModuleSwr } from "@/hooks/singleton"


export const Learn = () => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const module = useAppSelector((state) => state.module.entity)
    const course = useAppSelector((state) => state.course.entity)
    const { isLoading: isCourseLoading } = useQueryCourseSwr()
    const { isLoading: isModuleLoading } = useQueryModuleSwr()
    const isLoading = isCourseLoading || isModuleLoading
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
                            <Link href={`/courses/${course?.id}`}>
                                {course?.title}
                            </Link>
                        </StarCiBreadcrumbItem>
                        <StarCiBreadcrumbItem>
                            <Link href={`/courses/${course?.id}/learn`}>
                                {t("nav.learn")}
                            </Link>
                        </StarCiBreadcrumbItem>
                    </StarCiBreadcrumb>
                )
            }
            <Spacer y={6} />
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">  
                    {
                        isModuleLoading ? (
                            <StarCiSkeleton className="w-60 my-1 h-5" />
                        ) : (
                            <div className="text-xl font-bold">{module?.title}</div>
                        )
                    }    
                    <Spacer y={4} />
                    {
                        isModuleLoading ? (
                            <div className="w-full">
                                <StarCiSkeleton className="h-[14px] w-[60%] my-[3px]" />
                                <StarCiSkeleton className="h-[14px] w-[50%] my-[3px]" />
                                <StarCiSkeleton className="h-[14px] w-[40%] my-[3px]" />
                            </div>
                        ) : (
                            <div className="text-sm text-foreground-500">{module?.description}</div>
                        )
                    }
                    <Spacer y={6} />
                    <StarCiTabs 
                        color="primary"
                        variant="underlined"
                        selectedKey={learnTab} 
                        onSelectionChange={(value) => dispatch(setLearnTab(value as LearnTab))}
                    >
                        {
                            tabs.map((tab) => (
                                <StarCiTab title={
                                    <div className="flex items-center gap-2">
                                        <tab.icon className="size-5" />
                                        {tab.label}
                                    </div>} key={tab.value} value={tab.value}
                                />
                            ))
                        }
                    </StarCiTabs>
                    <Spacer y={6} />
                    {renderContent()}
                </div>
                <ModuleSidebar />
            </div>
        </div>
    )
}