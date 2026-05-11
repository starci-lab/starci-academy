"use client"

import React, { useMemo, useRef, useEffect, useCallback } from "react"
import { MarkdownContent, ReferenceLinks } from "@/components/reuseable"
import { useTranslations } from "next-intl"
import { useAppDispatch, useAppSelector } from "@/redux"
import { Skeleton, cn } from "@heroui/react"
import { WithClassNames } from "@/modules/types"
import _ from "lodash"
import { useQueryContentSwr } from "@/hooks/singleton"
import { mutateMarkContentAsReaded } from "@/modules/api"
import { setContentIsRead } from "@/redux/slices"

export type ContentBodyProps = WithClassNames<undefined>

export const ContentBody = ({ className }: ContentBodyProps) => {
    const t = useTranslations()
    const queryContentSwr = useQueryContentSwr()
    const content = useAppSelector((state) => state.content.entity)
    const isRead = useAppSelector((state) => state.content.isRead)
    const isLoading = queryContentSwr.isLoading || !content
    const references = useMemo(() => _.cloneDeep(content?.references ?? []).sort((prev, next) => prev.orderIndex - next.orderIndex), [content?.references])
    const dispatch = useAppDispatch()

    // Sentinel ref at bottom of content
    const sentinelRef = useRef<HTMLDivElement>(null)
    const hasMarkedRef = useRef(false)

    const markAsRead = useCallback(async () => {
        if (!content?.id || hasMarkedRef.current || isRead) return
        hasMarkedRef.current = true
        try {
            await mutateMarkContentAsReaded({
                request: {
                    contentId: content.id,
                    readed: true,
                },
            })
            dispatch(setContentIsRead(true))
        } catch {
            hasMarkedRef.current = false
        }
    }, [content?.id, isRead, dispatch])

    // Reset when content changes
    useEffect(() => {
        hasMarkedRef.current = false
    }, [content?.id])

    // IntersectionObserver: mark as read when user scrolls to bottom
    useEffect(() => {
        if (isLoading || !sentinelRef.current || isRead) return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0]?.isIntersecting) {
                    markAsRead()
                }
            },
            { threshold: 1.0 },
        )

        observer.observe(sentinelRef.current)
        return () => observer.disconnect()
    }, [isLoading, isRead, markAsRead])

    if (isLoading) {
        return (
            <>
                <Skeleton className="h-[18px] my-[17px]"/>
                <div className="my-3" />
                <Skeleton className="h-[14px] my-[3px] w-full rounded-full" />
                <Skeleton className="h-[14px] my-[3px] w-5/6 rounded-full" />
            </>
        )
    }

    return (
        <div className={cn("text-sm text-muted overflow-x-auto", className)}>
            <MarkdownContent markdown={content?.body || t("content.empty")} />
            <div className="h-6" />
            <ReferenceLinks
                references={references}
                titleKey="reference.title"
            />
            {/* Sentinel element for IntersectionObserver — triggers mark-as-read */}
            <div ref={sentinelRef} className="h-1" />
        </div>
    )
}
