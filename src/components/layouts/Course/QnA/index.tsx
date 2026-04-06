"use client"

import React, { useMemo } from "react"
import { Spacer } from "@heroui/react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks/singleton"
import {
    StarCiAccordion,
    StarCiAccordionItem,
    StarCiSkeleton,
} from "@/components/atomic"
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
            <Spacer y={3} />
            {
                isLoading ? (
                    <StarCiAccordion className="px-0">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <StarCiAccordionItem
                                key={index}
                                aria-label={t("qna.questionAria", { index: index + 1 })}
                                title={<StarCiSkeleton className="h-[14px] w-[40%] rounded-lg my-[3px]" />}
                            >
                            </StarCiAccordionItem>
                        ))}
                    </StarCiAccordion>
                ) : (
                    <StarCiAccordion className="px-0">
                        {qnas.map((qna) => (
                            <StarCiAccordionItem
                                key={qna.id}
                                aria-label={qna.question}
                                title={
                                    <span
                                        className="text-sm font-medium text-start"
                                        dangerouslySetInnerHTML={{
                                            __html: qna.question,
                                        }}
                                    />
                                }
                            >
                                <div
                                    className="text-sm text-foreground-600 pb-2 text-start"
                                    dangerouslySetInnerHTML={{ __html: qna.answer }}
                                />
                            </StarCiAccordionItem>
                        ))}
                    </StarCiAccordion>
                )
            }
        </div>
    )
}
