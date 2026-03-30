"use client"
import React from "react"
import { Link, Spacer } from "@heroui/react"
import { LightbulbFilamentIcon, PencilSimpleLineIcon, WarningCircleIcon } from "@phosphor-icons/react"
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
import { useQueryCourseEnrollmentStatusSwr } from "@/hooks/singleton/swr"
import { usePaymentDisclosure } from "@/hooks/singleton"

/**
 * The props for the Course component.
 */
export interface CourseProps {
    /** The course. */
    course?: CourseEntity
    /** The loading state. */
    isLoading: boolean
}

export const Course = ({ course, isLoading }: CourseProps) => {
    const { onOpen } = usePaymentDisclosure()
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const enrollmentPayload = enrollmentSwr.data?.courseEnrollmentStatus?.data
    const isEnrolled = enrollmentPayload?.isEnrolled === true
    const enrollmentCount = enrollmentPayload?.enrollmentCount ?? 0

    return (
        <div>
            {
                isLoading ? (
                    <StarCiSkeleton disableAnimation className="w-30 h-5 rounded-md" />
                ) : (
                    <StarCiBreadcrumb>
                        <StarCiBreadcrumbItem>
                            <Link href="/">Home</Link>
                        </StarCiBreadcrumbItem>
                        <StarCiBreadcrumbItem>
                            <Link href="/courses">Courses</Link>
                        </StarCiBreadcrumbItem>
                        <StarCiBreadcrumbItem>
                            <Link href={`/courses/${course?.id}`}>
                                {course?.title}
                            </Link>
                        </StarCiBreadcrumbItem>
                    </StarCiBreadcrumb>
                )
            }
            <Spacer y={6} />
            <div className="text-4xl font-bold">{
                isLoading ? 
                    <StarCiSkeleton disableAnimation className="w-60 h-10 rounded-md" /> 
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
                                    <StarCiSkeleton disableAnimation className="h-[14px] w-[60%] rounded-md !bg-secondary-500/10 my-[3px]" />
                                    <StarCiSkeleton disableAnimation className="h-[14px] w-[50%] rounded-md !bg-secondary-500/10 my-[3px]" />
                                    <StarCiSkeleton disableAnimation className="h-[14px] w-[40%] rounded-md !bg-secondary-500/10 my-[3px]" />
                                </div>
                            ) : (
                                <span className="text-sm" dangerouslySetInnerHTML={{ __html: course?.description ?? "" }} />
                            )
                        }
                    </StarCiAlert>
                    <Spacer y={6} />
                    <StarCiAlert title="Prerequisites" icon={<WarningCircleIcon size={24} />} className="text-sm" color="warning" variant="faded">
                        {
                            isLoading ? (
                                <div className="w-full">
                                    <StarCiSkeleton disableAnimation className="h-[14px] w-[60%] rounded-md !bg-warning-500/10 my-[3px]" />
                                    <StarCiSkeleton disableAnimation className="h-[14px] w-[50%] rounded-md !bg-warning-500/10 my-[3px]" />
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
                            <StarCiButton 
                                color="primary" 
                                size="lg" 
                                startContent={<PencilSimpleLineIcon className="w-5 h-5" />}
                                className="w-full"
                                isDisabled={isEnrolled}
                                onPress={onOpen}
                            >
                                Enroll
                            </StarCiButton>
                            <Spacer y={4} />
                            <div className="text-sm text-foreground-500">
                                {enrollmentCount} users have enrolled
                            </div>
                        </div>
                    </StarCiCardFooter>
                </StarCiCard>
            </div>
        </div>
    )
}