"use client"

import React, { useMemo } from "react"
import { useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { Spacer } from "@heroui/react"
import { BookOpenIcon } from "@phosphor-icons/react"
import { ContentCard } from "./ContentCard"

/**
 * Learn tab “Content”: ordered module contents (title + body, optional thumbnail).
 */
export const ContentSection = () => {
    const t = useTranslations()
    const contents = useAppSelector((state) => state.course.module?.contents)

    const rows = useMemo(() => {
        return [...(contents ?? [])].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [contents])

    return (
        <div>
            <div className="text-sm text-foreground-500">
                {t("course.modules.contentCount", { count: rows.length })}
            </div>
            <Spacer y={3} />
            {rows.length === 0 ? (
                <div className="rounded-medium border border-dashed border-divider bg-default/30 px-6 py-12 text-center">
                    <BookOpenIcon
                        className="mx-auto mb-3 size-10 text-foreground-400"
                        aria-hidden
                    />
                    <div className="text-sm text-foreground-500">
                        {t("course.modules.contentEmpty")}
                    </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {rows.map((item) => (
                        <ContentCard key={item.id} content={item} />
                    ))}
                </div>
            )}
        </div>
    )
}
