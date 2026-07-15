"use client"

import React from "react"
import { Alert, Button, Link, Skeleton, Typography } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { ArrowRightIcon, ArrowUpRightIcon } from "@phosphor-icons/react"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { ResizableRail } from "@/components/blocks/layout/ResizableRail"
import { ResponsiveBreadcrumb } from "@/components/blocks/navigation/ResponsiveBreadcrumb"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { pathConfig } from "@/resources/path"
import { ArchitectureRail } from "./ArchitectureRail"
import { ArchitectureMobileNav } from "./ArchitectureRail/ArchitectureMobileNav"
import { ArchitectureMap } from "./ArchitectureMap"
import { NodeDissectionPanel } from "./NodeDissectionPanel"
import { CurlTester } from "./CurlTester"
import { useArchitectureNode } from "./hooks/useArchitectureNode"
import { useSystemHealthPoll } from "./hooks/useSystemHealthPoll"

/** Public GitHub repo backing this live atlas — the "don't trust me, go read it" link. */
const BACKEND_REPO_URL = "https://github.com/starci-lab/starci-academy-backend"

/**
 * `/architecture` — the public "System Atlas": a live, interactive tour of
 * StarCi's real backend. Laid out docs-style like {@link import("../practice").Practice}:
 * a persistent left {@link ArchitectureRail} (every probed component, grouped
 * "StarCi's own system" vs "external dependencies", each row carrying a live
 * status dot) beside a padded work pane — the 3D {@link ArchitectureMap}, the
 * selected node's {@link NodeDissectionPanel}, and a {@link CurlTester} anyone
 * can run to prove the platform is really answering. Below `lg` the rail folds
 * into {@link ArchitectureMobileNav} chip rows.
 *
 * Honesty rule (see `system-map-conceptual-nodes-not-containers`): every dot on
 * this page traces to a REAL probe from the public `systemHealthStatus` query —
 * before the first sweep resolves every node reads "checking…" (gray/pulse),
 * never a synthesized green. The map keeps rendering with `healthByName: null`
 * during that window (its own nodes render "checking"), so only a genuine fetch
 * failure (no cache to fall back to) swaps in the error state below.
 */
export const Architecture = () => {
    const t = useTranslations("architecture")
    const tGlobal = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const { node, setNode } = useArchitectureNode()
    const { healthByName, isLoading, error, refresh } = useSystemHealthPoll()

    const onOpenCourses = () => router.push(pathConfig().locale(locale).course().build())

    return (
        // single column on mobile/tablet; rail + content side-by-side from lg up
        <div className="flex w-full flex-col items-start lg:flex-row">
            {/* docs-style left rail — sticks under the navbar, viewport-tall, drag-resizable */}
            <ResizableRail
                className="hidden shrink-0 lg:sticky lg:top-16 lg:flex lg:h-[calc(100dvh-4rem)] lg:flex-col lg:self-start"
                storageKey="starci.architecture.rail.width"
                defaultWidth={300}
                minWidth={256}
                maxWidth={420}
                ariaLabel={t("rail.ariaLabel")}
            >
                <ArchitectureRail
                    className="min-h-0 lg:flex-1"
                    healthByName={healthByName}
                    selectedId={node}
                    onSelect={setNode}
                />
            </ResizableRail>

            {/* content column — owns the canonical p-6 reading padding */}
            <div className="min-h-0 min-w-0 flex-1 p-6">
                <div className="mx-auto flex max-w-5xl flex-col gap-10">
                    <PageHeader
                        breadcrumb={(
                            <ResponsiveBreadcrumb
                                items={[
                                    {
                                        key: "home",
                                        label: tGlobal("nav.home"),
                                        onPress: () => router.push(pathConfig().locale().build()),
                                    },
                                    {
                                        key: "current",
                                        label: t("title"),
                                    },
                                ]}
                            />
                        )}
                        title={t("title")}
                        description={t("subtitle")}
                        actions={(
                            <div className="flex flex-wrap items-center gap-2">
                                <Link href={BACKEND_REPO_URL} target="_blank" rel="noopener noreferrer">
                                    <Button variant="tertiary" size="sm">
                                        {t("header.viewSource")}
                                        <ArrowUpRightIcon className="size-4" aria-hidden />
                                    </Button>
                                </Link>
                                <Button variant="primary" size="sm" onPress={onOpenCourses}>
                                    {t("header.viewCourse")}
                                    <ArrowRightIcon className="size-4" aria-hidden />
                                </Button>
                            </div>
                        )}
                    />

                    <div className="flex flex-col gap-6">
                        {/* mobile: component chips (the rail is desktop-only) */}
                        <ArchitectureMobileNav healthByName={healthByName} selectedId={node} onSelect={setNode} />

                        {/* the topology map ALWAYS renders — it's static structure, valuable
                            even when the health API is unreachable. Only the very first load
                            (no data yet, not failed) shows a skeleton; a genuine fetch failure
                            surfaces as a small inline note above the map (nodes fall back to the
                            honest "checking…"/"unknown" tones), never hides the whole diagram. */}
                        {isLoading && !healthByName && !error ? (
                            <Skeleton className="h-[440px] w-full rounded-3xl sm:h-[560px]" />
                        ) : (
                            <>
                                {error && !healthByName ? (
                                    <Alert status="default">
                                        <Alert.Indicator />
                                        <Alert.Content>
                                            <Alert.Title>{t("map.errorDescription")}</Alert.Title>
                                        </Alert.Content>
                                        <Button variant="tertiary" size="sm" onPress={refresh}>{t("map.retry")}</Button>
                                    </Alert>
                                ) : null}
                                <ArchitectureMap
                                    healthByName={healthByName}
                                    selectedId={node}
                                    onSelectNode={setNode}
                                />
                            </>
                        )}

                        <NodeDissectionPanel nodeId={node} healthByName={healthByName} />

                        <LabeledCard label={t("curl.heading")}>
                            <CurlTester />
                        </LabeledCard>

                        {/* course-CTA band — closes the loop: this real, live system is
                            exactly what the courses teach you to build → go learn to build it */}
                        <div className="flex flex-col items-start gap-3 rounded-3xl bg-accent-soft p-6 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex flex-col gap-1">
                                <Typography type="body" weight="semibold">{t("courseCta.title")}</Typography>
                                <Typography type="body-sm" color="muted">{t("courseCta.body")}</Typography>
                            </div>
                            <Button variant="primary" size="lg" className="shrink-0" onPress={onOpenCourses}>
                                {t("courseCta.cta")}
                                <ArrowRightIcon className="size-5" aria-hidden />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
