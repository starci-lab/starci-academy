"use client"

import React, { useCallback, useMemo } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Chip, cn } from "@heroui/react"
import { ClockIcon, StarIcon, SwordIcon, XIcon } from "@phosphor-icons/react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import { pathConfig } from "@/resources/path"
import { getContentChallengeCount } from "@/modules/types"
import type { MindMapDetailsSelection } from "../context"

/** Props for {@link ContentDetailsDrawer}. */
export interface ContentDetailsDrawerProps {
    /** Selected lesson, or null when the drawer is closed. */
    selection: MindMapDetailsSelection | null
    /** Closes the drawer. */
    onClose: () => void
}

/**
 * Right-side details drawer for a mind-map lesson. Shows title, description, meta and a
 * "start lesson" CTA — clicking a content opens this instead of navigating away.
 */
export const ContentDetailsDrawer = ({ selection, onClose }: ContentDetailsDrawerProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)

    /** Resolve the selected content from the loaded course tree. */
    const content = useMemo(() => {
        if (!selection || !course?.modules) {
            return null
        }
        const module = course.modules.find((candidate) => candidate.id === selection.moduleId)
        return module?.contents?.find((candidate) => candidate.id === selection.contentId) ?? null
    }, [selection, course])

    const onStart = useCallback(() => {
        if (!selection || !courseDisplayId) {
            return
        }
        // only NOW navigate to the lesson page (via the explicit CTA)
        router.push(
            pathConfig()
                .locale(locale)
                .course(courseDisplayId)
                .learn()
                .module(selection.moduleId)
                .content(selection.contentId)
                .build(),
        )
    }, [
        router,
        locale,
        courseDisplayId,
        selection,
    ])

    const isOpen = Boolean(selection)

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* backdrop — click to close, map stays visible behind */}
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />
                    {/* sliding right panel */}
                    <motion.aside
                        className={cn(
                            "fixed inset-y-0 right-0 z-50 flex w-full max-w-[440px] flex-col",
                            "border-l bg-background shadow-2xl dark:border-zinc-700",
                        )}
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 320, damping: 34 }}
                    >
                        {/* header */}
                        <div className="flex items-start justify-between gap-3 border-b px-6 py-5 dark:border-zinc-700">
                            <div className="min-w-0">
                                {content?.isPremium && (
                                    <Chip color="warning" variant="soft" size="sm" className="mb-2">
                                        <StarIcon className="size-4" weight="fill" />
                                        <Chip.Label>{t("content.mindMapPremium")}</Chip.Label>
                                    </Chip>
                                )}
                                <h2 className="text-pretty text-xl font-bold leading-snug text-foreground">
                                    {content?.title ?? ""}
                                </h2>
                            </div>
                            <button
                                type="button"
                                aria-label={t("content.mindMapClose")}
                                onClick={onClose}
                                className="shrink-0 rounded-full p-1.5 text-muted outline-none transition-colors hover:bg-black/5 focus-visible:ring-2 focus-visible:ring-accent/40 dark:hover:bg-white/10"
                            >
                                <XIcon className="size-5" />
                            </button>
                        </div>

                        {/* body */}
                        <div className="flex-1 overflow-y-auto px-6 py-5">
                            <div className="flex flex-wrap items-center gap-2">
                                <Chip variant="tertiary" color="default" size="sm" className="text-muted">
                                    <ClockIcon className="size-4" />
                                    <Chip.Label>
                                        {t("content.minutesRead", { minutes: content?.minutesRead ?? 0 })}
                                    </Chip.Label>
                                </Chip>
                                <Chip variant="tertiary" color="default" size="sm" className="text-muted">
                                    <SwordIcon className="size-4" />
                                    <Chip.Label>
                                        {t("content.challengeCount", {
                                            count: getContentChallengeCount(content ?? {}),
                                        })}
                                    </Chip.Label>
                                </Chip>
                            </div>

                            <div className="h-4" />

                            <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                                {content?.description?.trim() || t("content.mindMapDetailsEmpty")}
                            </p>
                        </div>

                        {/* footer CTA */}
                        <div className="border-t px-6 py-4 dark:border-zinc-700">
                            <button
                                type="button"
                                onClick={onStart}
                                className="w-full rounded-2xl bg-accent px-4 py-3 text-center text-sm font-semibold text-accent-foreground outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-accent/50"
                            >
                                {t("content.mindMapStartLesson")}
                            </button>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    )
}
