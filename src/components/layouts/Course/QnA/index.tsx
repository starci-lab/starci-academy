"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks/singleton"
import {
    Accordion,
    Skeleton,
} from "@heroui/react"
import _ from "lodash"

export const QnA = () => {
    const course = useAppSelector((state) => state.course.entity)
    const { isLoading } = useQueryCourseSwr()
    const t = useTranslations()
    const qnas = useMemo(() => {
        return _.cloneDeep(course?.qnas ?? []).sort(
            (prev, next) => prev.orderIndex - next.orderIndex)
    }, [course])
    return (
        <div>
            <div className="text-lg font-medium text-start text-foreground-500">{t("qna.title")}</div>
            <div className="h-3" />
            {
                isLoading ? (
                    <Accordion className="px-0 border border-divider rounded-2xl">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <Accordion.Item
                                key={index}
                                aria-label={t("qna.questionAria", { index: index + 1 })}
                            >
                                <Accordion.Heading><Accordion.Trigger>
                                    <Skeleton className="h-[14px] w-[40%] rounded-lg my-[3px]" />
                                </Accordion.Trigger></Accordion.Heading>
                                <Accordion.Panel>{""}</Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : (
                    <Accordion className="px-0 border border-divider rounded-2xl">
                        {qnas.map((qna) => (
                            <Accordion.Item
                                key={qna.id}
                                aria-label={qna.question}
                            >
                                <Accordion.Heading>
                                    <Accordion.Trigger>
                                        <span
                                            className="text-sm font-medium text-start"
                                            dangerouslySetInnerHTML={{
                                                __html: qna.question,
                                            }}
                                        />
                                    </Accordion.Trigger></Accordion.Heading>
                                <Accordion.Panel className="p-3">
                                    <span
                                        className="text-sm text-muted text-start"
                                        dangerouslySetInnerHTML={{ __html: qna.answer }}
                                    />
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )
            }
        </div>
    )
}
