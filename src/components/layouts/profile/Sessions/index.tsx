"use client"

import {
    ArrowRightFromSquare as RevokeIcon,
    Clock as ClockIcon,
    Display as DisplayIcon,
    GeoPin as GeoPinIcon,
    Smartphone as SmartphoneIcon,
} from "@gravity-ui/icons"
import React, {
    useCallback,
    useState,
} from "react"
import {
    Breadcrumbs,
    Button,
    Chip,
    Separator,
    Spinner,
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useQueryMySessionsSwr,
    useMutateRevokeSessionSwr,
} from "@/hooks"
import type {
    LoginSession,
} from "@/modules/api"
import {
    pathConfig,
} from "@/resources"
import {
    SubPageHeader,
} from "@/components/reuseable"

/**
 * Sessions / devices feature container.
 *
 * Lists the current user's active login sessions (devices) and lets them log
 * out any device except the one making the request. Owns the page chrome
 * (breadcrumb + header) and the loading gate; revoking optimistically
 * revalidates the list. Mounted by `/profile/sessions`.
 */
export const Sessions = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const {
        data: sessions,
        isLoading,
        error,
        mutate,
    } = useQueryMySessionsSwr()
    const { trigger: triggerRevoke } = useMutateRevokeSessionSwr()

    // the session id currently being revoked (drives the per-row spinner)
    const [revokingId, setRevokingId] = useState<string | null>(null)

    /** Navigate to the home page (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [
            router,
        ],
    )
    /** Navigate to the profile hub (breadcrumb parent + back target). */
    const onNavigateProfile = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    /** Revoke a device session, then revalidate the list. */
    const onRevoke = useCallback(
        async (sessionId: string) => {
            setRevokingId(sessionId)
            try {
                await triggerRevoke({
                    sessionId,
                })
                // refresh so the logged-out device drops off the list
                await mutate()
            } finally {
                setRevokingId(null)
            }
        },
        [
            triggerRevoke,
            mutate,
        ],
    )

    /** Format an ISO timestamp for the current locale. */
    const formatSeen = useCallback(
        (iso: string) => {
            // tolerate a bad/missing date rather than throwing in render
            const date = new Date(iso)
            if (Number.isNaN(date.getTime())) {
                return ""
            }
            return date.toLocaleString(locale)
        },
        [
            locale,
        ],
    )

    // gate only the data-dependent list; chrome renders immediately
    const ready = !isLoading && !!sessions && !error

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateProfile}>
                    {t("nav.profile")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    <span>{t("sessions.title")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>
            <SubPageHeader
                title={t("sessions.title")}
                description={t("sessions.subtitle")}
                onBack={onNavigateProfile}
            />

            {ready ? (
                sessions.length === 0 ? (
                    <div className="rounded-large bg-default/40 p-6 text-center text-sm text-muted">
                        {t("sessions.empty")}
                    </div>
                ) : (
                    <div className="flex flex-col overflow-hidden rounded-large">
                        {sessions.map((session: LoginSession, index: number) => {
                            // pick a device glyph from the coarse device class
                            const isMobile =
                                session.deviceType === "mobile"
                                || session.deviceType === "tablet"
                            const DeviceIcon = isMobile ? SmartphoneIcon : DisplayIcon
                            // headline = "Browser on OS", falling back gracefully
                            const headline = [
                                session.browser,
                                session.os,
                            ]
                                .filter(Boolean)
                                .join(" • ") || t("sessions.unknownDevice")
                            return (
                                <React.Fragment key={session.id}>
                                    <div
                                        className={cn(
                                            "flex items-center gap-3 bg-default/40 p-4",
                                        )}
                                    >
                                        <DeviceIcon className="size-5 shrink-0 text-accent" />
                                        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <span className="truncate font-medium text-foreground">{headline}</span>
                                                {session.current ? (
                                                    <Chip
                                                        color="accent"
                                                        variant="soft"
                                                        size="sm"
                                                    >
                                                        {t("sessions.thisDevice")}
                                                    </Chip>
                                                ) : null}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-muted">
                                                {session.location ? (
                                                    <span className="flex items-center gap-1.5">
                                                        <GeoPinIcon className="size-3.5" />
                                                        {session.location}
                                                    </span>
                                                ) : null}
                                                {session.ipAddress ? (
                                                    <span>{session.ipAddress}</span>
                                                ) : null}
                                                <span className="flex items-center gap-1.5">
                                                    <ClockIcon className="size-3.5" />
                                                    {formatSeen(session.lastSeenAt)}
                                                </span>
                                            </div>
                                        </div>
                                        {!session.current ? (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-danger"
                                                isDisabled={revokingId === session.sessionId}
                                                onPress={() => onRevoke(session.sessionId)}
                                                aria-label={t("sessions.revoke")}
                                            >
                                                {revokingId === session.sessionId ? (
                                                    <Spinner
                                                        color="current"
                                                        size="sm"
                                                    />
                                                ) : (
                                                    <RevokeIcon className="size-4" />
                                                )}
                                                {t("sessions.revoke")}
                                            </Button>
                                        ) : null}
                                    </div>
                                    {index !== sessions.length - 1 ? <Separator /> : null}
                                </React.Fragment>
                            )
                        })}
                    </div>
                )
            ) : (
                <div className="flex justify-center p-12">
                    <Spinner size="lg" />
                </div>
            )}
        </div>
    )
}
