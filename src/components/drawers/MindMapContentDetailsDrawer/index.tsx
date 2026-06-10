"use client"

import { BookOpen as BookOpenIcon, Clock as ClockIcon, Flag as SwordIcon, Lock as LockIcon, Star as StarIcon } from "@gravity-ui/icons"
import React, { useCallback, useMemo } from "react"
import { Button, Chip, Drawer, ScrollShadow } from "@heroui/react"
import { useRouter } from "next/navigation"
import { useLocale, useTranslations } from "next-intl"
import { useAppSelector } from "@/redux"
import {
    useAuthenticationOverlayState,
    useMindMapContentDetailsOverlayState,
} from "@/hooks"
import { pathConfig } from "@/resources/path"
import { getContentChallengeCount } from "@/modules/types"

/**
 * Global drawer showing a mind-map lesson's title, description and meta, with a "read details"
 * CTA that refs into the lesson page. Guests are bounced to the authentication modal first.
 *
 * Mounted once in {@link DrawerContainer}; opened via
 * `useMindMapContentDetailsOverlayState().open(selection)` from a mind-map slot node.
 */
export const MindMapContentDetailsDrawer = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const {
        isOpen,
        setOpen,
        close,
        context: selection,
    } = useMindMapContentDetailsOverlayState()
    const course = useAppSelector((state) => state.course.entity)
    const courseDisplayId = useAppSelector((state) => state.course.displayId)
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const authentication = useAuthenticationOverlayState()

    /** Resolve the selected content from the loaded course tree. */
    const content = useMemo(() => {
        if (!selection || !course?.modules) {
            return null
        }
        const module = course.modules.find((candidate) => candidate.id === selection.moduleId)
        return module?.contents?.find((candidate) => candidate.id === selection.contentId) ?? null
    }, [selection, course])

    const onStart = useCallback(() => {
        // gate: guests cannot open the lesson — bounce them to the auth modal
        if (!authenticated) {
            close()
            authentication.open()
            return
        }
        if (!selection || !courseDisplayId) {
            return
        }
        // only NOW navigate (ref into the lesson page) via the explicit CTA
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
        authenticated,
        authentication,
        close,
        router,
        locale,
        courseDisplayId,
        selection,
    ])

    if (!isOpen) {
        return null
    }

    const challengeCount = getContentChallengeCount(content ?? {})

    return (
        <Drawer>
            <Drawer.Backdrop isOpen onOpenChange={setOpen}>
                <Drawer.Content placement="right">
                    <Drawer.Dialog className="flex h-full flex-col p-0">
                        <div className="shrink-0 p-3">
                            <Drawer.CloseTrigger />
                            <Drawer.Header className="flex flex-col gap-2">
                                {content?.isPremium && (
                                    <Chip color="warning" variant="soft" size="sm" className="w-fit">
                                        <StarIcon className="size-4" />
                                        <Chip.Label>{t("content.mindMapPremium")}</Chip.Label>
                                    </Chip>
                                )}
                                <Drawer.Heading className="text-pretty text-xl font-bold leading-snug">
                                    {content?.title ?? ""}
                                </Drawer.Heading>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Chip variant="secondary" color="accent" size="sm">
                                        <ClockIcon className="size-4" />
                                        <Chip.Label>
                                            {t("content.minutesRead", { minutes: content?.minutesRead ?? 0 })}
                                        </Chip.Label>
                                    </Chip>
                                    <Chip variant="secondary" color="accent" size="sm">
                                        <SwordIcon className="size-4" />
                                        <Chip.Label>
                                            {t("content.challengeCount", { count: challengeCount })}
                                        </Chip.Label>
                                    </Chip>
                                </div>
                            </Drawer.Header>
                        </div>
                        <div className="border-b" />

                        <Drawer.Body className="flex min-h-0 flex-1 flex-col p-0">
                            <ScrollShadow className="min-h-0 flex-1 p-3" hideScrollBar>
                                <p className="whitespace-pre-line text-sm leading-relaxed text-muted">
                                    {content?.description?.trim() || t("content.mindMapDetailsEmpty")}
                                </p>
                            </ScrollShadow>
                        </Drawer.Body>
                        <div className="shrink-0 p-3">
                            <Button
                                size="lg"
                                className="w-full"
                                onPress={onStart}
                            >
                                {!authenticated ? (
                                    <LockIcon className="size-5" />
                                ) : (
                                    <BookOpenIcon className="size-5" />
                                )}
                                {t("content.mindMapReadDetails")}
                            </Button>
                        </div>
                    </Drawer.Dialog>
                </Drawer.Content>
            </Drawer.Backdrop>
        </Drawer>
    )
}
