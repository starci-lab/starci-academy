"use client"
import React from "react"
import {
    Alert,
    Breadcrumbs,
    Button,
    Card,
    Skeleton,
} from "@heroui/react"
import { BookOpenIcon, PencilSimpleLineIcon } from "@phosphor-icons/react"
import { Modules } from "./Modules"
import { Stepper } from "./Stepper"
import { ValuePropositions } from "./ValuePropositions"
import { QnA } from "./QnA"
import { useQueryCourseEnrollmentStatusSwr, usePaymentOverlayState, useQueryCourseSwr } from "@/hooks/singleton"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/redux"
import { pathConfig } from "@/resources"

export const Course = () => {
    const { onOpen } = usePaymentOverlayState()
    const enrollmentSwr = useQueryCourseEnrollmentStatusSwr()
    const enrollmentPayload = enrollmentSwr.data?.courseEnrollmentStatus?.data
    const isEnrolled = enrollmentPayload?.isEnrolled === true
    const enrollmentCount = enrollmentPayload?.enrollmentCount ?? 0
    const course = useAppSelector((state) => state.course.entity)
    const t = useTranslations()
    const router = useRouter()
    const { isLoading } = useQueryCourseSwr()
    const locale = useLocale()
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    return (
        <div className="p-3 max-w-[1280px] mx-auto">
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
                        <Breadcrumbs.Item>
                            <span>{course?.title}</span>
                        </Breadcrumbs.Item>
                    </Breadcrumbs>
                )
            }
            <div className="h-12" />
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
                <div className="order-2 md:order-1 md:col-span-3 flex min-w-0 flex-col">
                    {isLoading ? (
                        <Skeleton className="h-10 w-60 max-w-full" />
                    ) : (
                        <h1 className="text-4xl font-bold">{course?.title}</h1>
                    )}
                    {isLoading ? (
                        <div className="mt-3 space-y-2">
                            <Skeleton className="h-[14px] w-[60%] max-w-full" />
                            <Skeleton className="h-[14px] w-[50%] max-w-full" />
                            <Skeleton className="h-[14px] w-[40%] max-w-full" />
                        </div>
                    ) : (
                        <div
                            className="text-sm text-muted mt-3"
                            dangerouslySetInnerHTML={{ __html: course?.description ?? "" }}
                        />
                    )}
                    <div className="h-6 shrink-0" />
                    <Alert status="warning" className="text-sm">
                        <Alert.Indicator />
                        <Alert.Content className="gap-1">
                            {isLoading ? (
                                <Alert.Description className="w-full">
                                    <Skeleton className="h-[14px] w-[60%] !bg-warning-500/10 my-[3px]" />
                                    <Skeleton className="h-[14px] w-[50%] !bg-warning-500/10 my-[3px]" />
                                </Alert.Description>
                            ) : (
                                <>
                                    <Alert.Title>{t("course.prerequisites")}</Alert.Title>
                                    <Alert.Description>
                                        <ul className="list-disc list-inside text-start w-full">
                                            {course?.prerequisites?.map((prerequisite) => (
                                                <li key={prerequisite.id} className="text-sm">
                                                    <span dangerouslySetInnerHTML={{ __html: prerequisite.text ?? "" }} />
                                                </li>
                                            ))}
                                        </ul>
                                    </Alert.Description>
                                </>
                            )}
                        </Alert.Content>
                    </Alert>
                    <div className="h-6" />
                    <Modules />
                    <div className="h-6" />
                    <QnA />
                </div>
                <Card className="order-1 md:order-2 md:col-span-2 w-full bg-inherit border  h-fit shrink-0 p-0">
                    <Card.Content>
                        <img
                            className="w-full h-full object-cover"
                            alt={course?.title ?? ""}
                            loading="lazy"
                            src={course?.coverImageUrl ?? ""}
                        />
                        <div className="p-3">
                            <Stepper />
                            <div className="h-12" />
                            <ValuePropositions />
                        </div>
                    </Card.Content>
                    <Card.Footer className="px-3 pb-3">
                        <div className="w-full">
                            {
                                !isEnrolled ? (
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="w-full"
                                        isDisabled={isEnrolled}
                                        onPress={onOpen}
                                    >
                                        <PencilSimpleLineIcon className="w-5 h-5" />
                                        {t("course.enroll")}
                                    </Button>
                                ) : (
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="w-full"
                                        isDisabled={!isEnrolled}
                                        onPress={() => router.push(
                                            pathConfig()
                                                .locale(locale)
                                                .course(courseDisplayId)
                                                .learn()
                                                .module(
                                                    course?.modules?.[0]?.displayId ?? ""
                                                ).build()
                                        )
                                        }
                                    >
                                        <BookOpenIcon className="w-5 h-5" />
                                        {t("course.continueLearning")}
                                    </Button>
                                )}
                            <div className="h-12" />
                            <div className="text-sm text-foreground-500">
                                {t("course.usersEnrolled", { count: enrollmentCount })}
                            </div>
                        </div>
                    </Card.Footer>
                </Card>
            </div>
        </div>
    )
}