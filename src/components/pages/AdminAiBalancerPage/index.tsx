"use client"

import React, {
    useCallback,
    useEffect,
    useMemo,
} from "react"
import {
    Button,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    TopBar,
} from "./TopBar"
import {
    ProviderSection,
} from "./ProviderSection"
import {
    AdminAiBalancerSkeleton,
} from "./AdminAiBalancerSkeleton"
import { useQueryAiBalancerHealthSwr } from "@/hooks/swr/api/graphql/queries/useQueryAiBalancerHealthSwr"
import { useAppSelector } from "@/redux/hooks"
import { Box } from "@/components/frames/Box"

/**
 * Admin dashboard for live AI balancer API key health (Redis ping cache + pool).
 *
 * Requires admin API key in Redux (same gate as other admin tools) and an
 * authenticated session for the GraphQL query. Polls every 10s.
 */
export const AdminAiBalancerPage = () => {
    const apiKey = useAppSelector((state) => state.admin.apiKey)
    const router = useRouter()
    const t = useTranslations("admin.aiBalancer")
    const {
        data,
        error,
        isLoading,
        isValidating,
        mutate,
    } = useQueryAiBalancerHealthSwr()

    useEffect(() => {
        if (!apiKey) {
            router.replace("../../admin")
        }
    }, [
        apiKey,
        router,
    ])

    const sortedProviders = useMemo(
        () => [
            ...(data?.providers ?? []),
        ].sort((left, right) => left.provider.localeCompare(right.provider)),
        [
            data?.providers,
        ],
    )

    const onRefresh = useCallback(
        () => {
            void mutate()
        },
        [
            mutate,
        ],
    )

    const ready = !isLoading && !!data && !error

    return (
        <Box identity={{ tier: "page", component: "AdminAiBalancerPage" }} principle="card-padding" className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 pb-12"
            explain="Card body inset — not page-pad, because this is the surface padding of a card rather than the page chrome.">
            <Box principle="center-measure" className="mx-auto max-w-5xl"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
                <Box principle="block-boundary" className="flex flex-col gap-6"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups.">
                    <TopBar />
                    <div className="space-y-2">
                        <h1 className="text-2xl font-bold text-white">
                            {t("title")}
                        </h1>
                        <p className="text-sm text-slate-400">
                            {t("subtitle")}
                        </p>
                        {isValidating ? (
                            <p className="text-xs text-indigo-300">
                                {t("refreshing")}
                            </p>
                        ) : null}
                    </div>
                    {!ready ? (
                        <AdminAiBalancerSkeleton />
                    ) : (
                        <Box principle="block-boundary" className="flex flex-col gap-6"
                            explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups.">
                            {sortedProviders.map((providerHealth) => (
                                <ProviderSection
                                    key={providerHealth.provider}
                                    providerHealth={providerHealth}
                                />
                            ))}
                            {sortedProviders.length === 0 ? (
                                <p className="text-center text-sm text-slate-400">
                                    {t("empty")}
                                </p>
                            ) : null}
                        </Box>
                    )}
                    {error ? (
                        <p className="text-center text-sm text-rose-300">
                            {t("error")}
                        </p>
                    ) : null}
                    <Box principle="center-measure" className="mx-auto"
                        explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-indigo-300"
                            onPress={onRefresh}
                        >
                            {t("refreshNow")}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}
