"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { useQueryCourseSwr } from "@/hooks"
import {
    Accordion,
    Skeleton,
    cn,
} from "@heroui/react"
import type {
    WithClassNames,
} from "@/modules/types"
import _ from "lodash"

/**
 * QnA props — only class-name plumbing (self-contained section).
 */
export type QnAProps = WithClassNames<undefined>

/**
 * Course Q&A accordion container.
 *
 * Pulls the Q&A entries from redux + the load flag from SWR, sorts them by
 * display order, and renders a skeleton while loading. `"use client"` for the
 * redux selector and the interactive HeroUI `Accordion`.
 */
export const QnA = ({ className }: QnAProps) => {
    const course = useAppSelector((state) => state.course.entity)
    const { isLoading } = useQueryCourseSwr()
    const t = useTranslations()
    const qnas = useMemo(() => {
        return _.cloneDeep(course?.qnas ?? []).sort(
            (prev, next) => prev.sortIndex - next.sortIndex)
    }, [course])
    return (
        <div className={cn(className)}>
            <div className="text-lg font-semibold text-start">{t("qna.title")}</div>
            <div className="h-3" />
            {
                isLoading ? (
                    <Accordion variant="surface">
                        {Array.from({ length: 2 }).map((_, index) => (
                            <Accordion.Item
                                key={index}
                                aria-label={t("qna.questionAria", { index: index + 1 })}
                            >
                                <Accordion.Heading><Accordion.Trigger>
                                    <Skeleton className="h-[14px] w-[40%] rounded-3xl my-[3px]" />
                                </Accordion.Trigger></Accordion.Heading>
                                <Accordion.Panel>{""}</Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                ) : (
                    <Accordion variant="surface">
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
                                    </Accordion.Trigger>
                                </Accordion.Heading>
                                <Accordion.Panel>
                                    <Accordion.Body>
                                        <span
                                            className="text-sm text-muted text-start"
                                            dangerouslySetInnerHTML={{ __html: qna.answer }}
                                        />
                                    </Accordion.Body>
                                </Accordion.Panel>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                )
            }
        </div>
    )
}
