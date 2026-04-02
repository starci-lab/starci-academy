"use client"

import React, { useMemo } from "react"
import { Spacer } from "@heroui/react"
import type { QnaEntity } from "@/modules/types"
import { useTranslations } from "next-intl"
import {
    StarCiAccordion,
    StarCiAccordionItem,
    StarCiSkeleton,
} from "@/components/atomic"

export interface QnAProps {
    qnas?: Array<QnaEntity>
    isLoading: boolean
}

export const QnA = ({ qnas, isLoading }: QnAProps) => {
    const t = useTranslations()
    const rows = useMemo(() => {
        return [...(qnas ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [qnas])

    if (rows.length === 0) {
        return null
    }

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
                        {rows.map((row) => (
                            <StarCiAccordionItem
                                key={row.id}
                                aria-label={row.question}
                                title={
                                    <span
                                        className="text-sm font-medium text-start"
                                        dangerouslySetInnerHTML={{
                                            __html: row.question,
                                        }}
                                    />
                                }
                            >
                                <div
                                    className="text-sm text-foreground-600 pb-2 text-start"
                                    dangerouslySetInnerHTML={{ __html: row.answer }}
                                />
                            </StarCiAccordionItem>
                        ))}
                    </StarCiAccordion>
                )
            }
        </div>
    )
}
