"use client"

import {
    SignOutIcon,
    DesktopIcon,
    DeviceMobileIcon,
} from "@phosphor-icons/react"
import React, {
    useCallback,
    useState,
} from "react"
import {
    Button,
    Chip,
    Spinner,
    Typography,
} from "@heroui/react"
import {
    SettingsBreadcrumb,
} from "@/components/blocks/settings/SettingsBreadcrumb"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { AsyncContent } from "@/components/blocks/async/AsyncContent"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { Box } from "@/components/frames/Box"
import { Cluster } from "@/components/frames/Cluster"
import { StackH, StackV } from "@/components/frames/Stack"
import { useQueryMySessionsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMySessionsSwr"
import { useMutateRevokeSessionSwr } from "@/hooks/swr/api/graphql/mutations/useMutateRevokeSessionSwr"
import type { LoginSession } from "@/modules/api/graphql/queries/types/my-sessions"
import { useGraphQLWithToast } from "@/modules/toast/hooks"

/**
 * SessionsPage / devices feature container.
 *
 * Lists the current user's active login sessions (devices) and lets them log
 * out any device except the one making the request. Owns the page chrome
 * (breadcrumb + header) and the loading gate; revoking optimistically
 * revalidates the list. Mounted by `/profile/sessions`.
 */
export const SessionsPage = () => {
    const t = useTranslations()
    const locale = useLocale()
    const {
        data: sessions,
        isLoading,
        error,
        mutate,
    } = useQueryMySessionsSwr()
    const { trigger: triggerRevoke } = useMutateRevokeSessionSwr()
    const runGraphQL = useGraphQLWithToast()

    // the session id currently being revoked (drives the per-row spinner)
    const [revokingId, setRevokingId] = useState<string | null>(null)


    /** Revoke a device session, then revalidate the list. */
    const onRevoke = useCallback(
        async (sessionId: string) => {
            setRevokingId(sessionId)
            try {
                const ok = await runGraphQL(async () => {
                    // `triggerRevoke` returns the raw Apollo result; unwrap the
                    // standard `{ success, message }` payload for the toast helper.
                    const result = await triggerRevoke({ sessionId })
                    return result.data!.revokeSession
                })
                if (ok) {
                    // refresh so the logged-out device drops off the list
                    await mutate()
                }
            } finally {
                setRevokingId(null)
            }
        },
        [
            runGraphQL,
            triggerRevoke,
            mutate,
        ],
    )

    /** Format an ISO timestamp as `HH:mm MMM DD, YYYY` (24h time + short month). */
    const formatSeen = useCallback(
        (iso: string) => {
            // tolerate a bad/missing date rather than throwing in render
            const date = new Date(iso)
            if (Number.isNaN(date.getTime())) {
                return ""
            }
            const hh = String(date.getHours()).padStart(2, "0")
            const mm = String(date.getMinutes()).padStart(2, "0")
            const month = date.toLocaleString(locale, { month: "short" })
            const day = String(date.getDate()).padStart(2, "0")
            return `${hh}:${mm} ${month} ${day}, ${date.getFullYear()}`
        },
        [
            locale,
        ],
    )

    const sessionList = sessions ?? []

    const skeletonItems: Array<SurfaceCardListItem> = [0, 1, 2].map((row) => ({
        key: `skeleton-${row}`,
        content: () => (
            <div className="h-12">
                <StackH
                    gap={4}
                    align="center"
                    principle="content-row"
                    explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                    items={[
                        () => <Skeleton className="size-5 shrink-0 rounded" />,
                        () => (
                            <StackV
                                gap={3}
                                principle="sibling-stack"
                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                classNames={["min-w-0", "flex-1"]}
                                items={[
                                    () => <Skeleton.Typography type="body-sm" width="1/2" />,
                                    () => <Skeleton className="h-3 w-1/3 rounded" />,
                                ]}
                            />
                        ),
                    ]}
                />
            </div>
        ),
    }))

    const sessionItems: Array<SurfaceCardListItem> = sessionList.map((session: LoginSession) => {
        const isMobile =
            session.deviceType === "mobile"
            || session.deviceType === "tablet"
        const DeviceIcon = isMobile ? DeviceMobileIcon : DesktopIcon
        const headline = [
            session.browser,
            session.os,
        ]
            .filter(Boolean)
            .join(" • ") || t("sessions.unknownDevice")

        return {
            key: session.id,
            content: () => {
                const rowItems = [
                    () => <DeviceIcon aria-hidden focusable="false" className="size-5 shrink-0 text-accent-soft-foreground" />,
                    () => (
                        <div className="flex min-w-0 flex-1 flex-col gap-0">
                            <Cluster
                                gap={3}
                                align="center"
                                principle="chip-row"
                                explain="Lets chips share one wrapping row so related tags stay together without stacking as a column."
                                items={[
                                    () => (
                                        <Typography type="body-sm" weight="medium" truncate>
                                            {headline}
                                        </Typography>
                                    ),
                                    ...(session.current
                                        ? [() => (
                                            <Chip color="accent" variant="soft" size="sm">
                                                <Chip.Label>{t("sessions.thisDevice")}</Chip.Label>
                                            </Chip>
                                        )]
                                        : []),
                                ]}
                            />
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                                {session.location ? (
                                    <Typography type="body-xs" color="muted">{session.location}</Typography>
                                ) : null}
                                {session.ipAddress ? (
                                    <Typography type="body-xs" color="muted">{session.ipAddress}</Typography>
                                ) : null}
                                <Typography type="body-xs" color="muted">{formatSeen(session.lastSeenAt)}</Typography>
                            </div>
                        </div>
                    ),
                    ...(!session.current
                        ? [() => (
                            <Box principle="push-end" className="ml-auto shrink-0"
                                explain="Pushes this peer to the trailing edge so trailing meta stays right-aligned in the row.">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-danger-soft-foreground"
                                    isDisabled={revokingId === session.sessionId}
                                    onPress={() => onRevoke(session.sessionId)}
                                    aria-label={t("sessions.revoke")}
                                >
                                    {revokingId === session.sessionId ? (
                                        <Spinner color="current" size="sm" />
                                    ) : (
                                        <SignOutIcon aria-hidden focusable="false" className="size-5" />
                                    )}
                                    {t("sessions.revoke")}
                                </Button>
                            </Box>
                        )]
                        : []),
                ]

                return (
                    <StackH gap={4} align="center" principle="content-row"
                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                        items={rowItems} />
                )
            },
        }
    })

    return (
        <div className="flex flex-col gap-10">
            <PageHeader
                breadcrumb={<SettingsBreadcrumb current={t("sessions.title")} />}
                title={t("sessions.title")}
                description={t("sessions.subtitle")}
            />

            <AsyncContent
                isLoading={isLoading && !sessions}
                skeleton={<SurfaceCardList items={skeletonItems} />}
                isEmpty={sessionList.length === 0}
                emptyContent={{ title: t("sessions.empty") }}
                error={error}
                errorContent={{
                    title: t("sessions.empty"),
                    onRetry: () => { void mutate() },
                    retryLabel: t("common.retry"),
                }}
            >
                <SurfaceCardList items={sessionItems} />
            </AsyncContent>
        </div>
    )
}
