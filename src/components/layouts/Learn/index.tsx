"use client"
import React, { useMemo } from "react"
import { Link, Spacer } from "@heroui/react"
import { CourseEntity } from "@/modules/types"
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
import { VideoLessionSection } from "./VideoLessionSection"

/**
 * The props for the Course component.
 */
export interface LearnProps {
    /** The course. */
    course?: CourseEntity
    /** The loading state. */
    isLoading: boolean
}

export const Learn = ({ course, isLoading }: LearnProps) => {
    const t = useTranslations()
    const dispatch = useAppDispatch()
    const module = useAppSelector((state) => state.course.module)
    const learnTab = useAppSelector((state) => state.tabs.learnTab)
    const tabs = useMemo(() => [
        {
            label: t("course.modules.lessonVideos"),
            value: LearnTab.LessonVideos,
            icon: VideoIcon
        },
        {
            label: t("course.modules.foundations"),
            value: LearnTab.Foundations,
            icon: BookOpenIcon
        },
        {
            label: t("course.modules.challenges"),
            value: LearnTab.Challenges,
            icon: TrophyIcon
        },
        {
            label: t("course.modules.topAchievers"),
            value: LearnTab.TopAchievers,
            icon: UsersIcon
        }
    ], [t])
    const renderContent = () => {
        switch (learnTab) {
        case LearnTab.LessonVideos:
            return <VideoLessionSection videoLessons={module?.lessonVideos || []} />
        case LearnTab.Foundations:
            return <div/>
        case LearnTab.Challenges:
            return <div/>
        case LearnTab.TopAchievers:
            return <div/>
        }
    }
    return (
        <div>
            {
                isLoading ? (
                    <StarCiSkeleton disableAnimation className="w-30 h-5 rounded-md" />
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
                    <div className="text-xl font-bold">
                        {module?.title}
                    </div>
                    <Spacer y={4} />
                    <div className="text-sm text-foreground-500">
                        {module?.description}
                    </div>
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
                <ModuleSidebar modules={course?.modules} />
            </div>
        </div>
    )
}