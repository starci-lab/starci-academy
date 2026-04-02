"use client"
import React from "react"
import { Link, Spacer } from "@heroui/react"
import { BookOpenIcon, LightbulbFilamentIcon, PencilSimpleLineIcon, WarningCircleIcon } from "@phosphor-icons/react"
import { CourseEntity } from "@/modules/types"
import { 
    StarCiAlert, 
    StarCiBreadcrumb, 
    StarCiBreadcrumbItem, 
    StarCiCard, 
    StarCiCardBody, 
    StarCiCardFooter, 
    StarCiSkeleton,
    StarCiButton
} from "@/components/atomic"
import { Modules } from "./Modules"
import { Stepper } from "./Stepper"
import { ValuePropositions } from "./ValuePropositions"
import { QnA } from "./QnA"
import { useQueryCourseEnrollmentStatusSwr, usePaymentDisclosure, useQueryCourseSwr } from "@/hooks/singleton"
import { useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux"

/**
 * The props for the Course component.
 */
export interface CourseProps {
    /** The course. */
    course?: CourseEntity
    /** The loading state. */
    isLoading: boolean
}

export const Course = () => {
    const { onOpen } = usePaymentDisclosure()
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const enrollmentPayload = enrollmentSwr.data?.courseEnrollmentStatus?.data
    const isEnrolled = enrollmentPayload?.isEnrolled === true
    const enrollmentCount = enrollmentPayload?.enrollmentCount ?? 0
    const courseId = useAppSelector((state) => state.course.id)
    const course = useAppSelector((state) => state.course.entity)
    const t = useTranslations()
    const router = useRouter()
    const { isLoading } = useQueryCourseSwr()

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
                            <Link href={`/courses/${courseId}`}>
                                {course?.title}
                            </Link>
                        </StarCiBreadcrumbItem>
                    </StarCiBreadcrumb>
                )
            }
            <Spacer y={6} />
            <div className="text-4xl font-bold">{
                isLoading ? 
                    <StarCiSkeleton className="w-60 h-10" /> 
                    : (
                        <div className="text-4xl font-bold">{course?.title}</div>
                    )
            }</div>
            <Spacer y={12} />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
                <div className="order-2 md:order-1 md:col-span-3">
                    <StarCiAlert icon={<LightbulbFilamentIcon size={24} />} className="text-sm" color="secondary" variant="faded">
                        {
                            isLoading ? (
                                <div className="w-full">
                                    <StarCiSkeleton className="h-[14px] w-[60%] !bg-secondary-500/10 my-[3px]" />
                                    <StarCiSkeleton className="h-[14px] w-[50%] !bg-secondary-500/10 my-[3px]" />
                                    <StarCiSkeleton className="h-[14px] w-[40%] !bg-secondary-500/10 my-[3px]" />
                                </div>
                            ) : (
                                <span className="text-sm" dangerouslySetInnerHTML={{ __html: course?.description ?? "" }} />
                            )
                        }
                    </StarCiAlert>
                    <Spacer y={6} />
                    <StarCiAlert title={t("course.prerequisites")} icon={<WarningCircleIcon size={24} />} className="text-sm" color="warning" variant="faded">
                        {
                            isLoading ? (
                                <div className="w-full">
                                    <StarCiSkeleton  className="h-[14px] w-[60%] !bg-warning-500/10 my-[3px]" />
                                    <StarCiSkeleton  className="h-[14px] w-[50%] !bg-warning-500/10 my-[3px]" />
                                </div>
                            ) : (
                                <ul className="list-disc list-inside text-warning text-start w-full">
                                    {course?.prerequisites?.map((prerequisite) => (
                                        <li key={prerequisite.id} className="text-sm text-warning">
                                            <span dangerouslySetInnerHTML={{ __html: prerequisite.content ?? "" }} />
                                        </li>
                                    ))}
                                </ul>
                            )
                        }
                    </StarCiAlert>
                    <Spacer y={12} />
                    <Modules modules={course?.modules} isLoading={isLoading} />
                    <Spacer y={12} />
                    <QnA qnas={course?.qnas} isLoading={isLoading} />
                </div>
                <StarCiCard className="order-1 md:order-2 md:col-span-2 bg-inherit border border-divider h-fit">
                    <StarCiCardBody>
                        {course ? <Stepper course={course} /> : null}
                        <Spacer y={6} />
                        <ValuePropositions
                            valuePropositions={course?.valuePropositions}
                            isLoading={isLoading}
                        />
                    </StarCiCardBody>
                    <StarCiCardFooter>
                        <div className="w-full">
                            {
                                !isEnrolled ? (
                                    <StarCiButton 
                                        color="primary" 
                                        size="lg" 
                                        startContent={<PencilSimpleLineIcon className="w-5 h-5" />}
                                        className="w-full"
                                        isDisabled={isEnrolled}
                                        onPress={onOpen}
                                    >
                                        {t("course.enroll")}
                                    </StarCiButton>
                                ) : (
                                    <StarCiButton 
                                        color="primary" 
                                        size="lg" 
                                        startContent={<BookOpenIcon className="w-5 h-5" />}
                                        className="w-full"
                                        isDisabled={!isEnrolled}
                                        onPress={() => router.push(`/courses/${courseId}/learn`)}
                                    >
                                        {t("course.continueLearning")}
                                    </StarCiButton>
                                )}
                            <Spacer y={4} />
                            <div className="text-sm text-foreground-500">
                                {t("course.usersEnrolled", { count: enrollmentCount })}
                            </div>
                        </div>
                    </StarCiCardFooter>
                </StarCiCard>
            </div>
        </div>
    )
}