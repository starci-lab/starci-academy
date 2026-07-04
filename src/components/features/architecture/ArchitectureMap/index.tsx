"use client"

import React, { useMemo } from "react"
import dynamic from "next/dynamic"
import { Button, Chip, Skeleton, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { SegmentedControl } from "@/components/blocks/navigation/SegmentedControl"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_POD_MAP } from "../pods"
import { buildLiveScene } from "./scene"
import { buildPodOverviewScene } from "./pod-scene"
import { buildPodDetailScene } from "./pod-detail-scene"
import { buildFutureScene } from "./future-scene"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** The R3F canvas is heavy + client-only — lazy so it never ships in the RSC
 *  bundle and never mounts during SSR. */
const ArchitectureScene = dynamic(
    () => import("@/components/blocks/marketing/ArchitectureScene").then((mod) => mod.ArchitectureScene),
    {
        ssr: false,
        loading: () => <Skeleton className="h-[440px] w-full rounded-3xl sm:h-[560px]" />,
    },
)

/** Which era the map shows: today's live system, or the future roadmap. */
export type ArchitectureEra = "present" | "future"

/** Which present-day layout: pods grouped by capability, or every node flat. */
export type ArchitectureLayout = "pods" | "everything"

/** Props for {@link ArchitectureMap}. */
export interface ArchitectureMapProps extends WithClassNames<undefined> {
    /** Live health keyed by component name, or `null` before the first probe resolves. */
    healthByName: HealthByName | null
    /** Currently selected node id — highlighted with a ring on the map (member / flat node). */
    selectedId: string
    /** Click-to-select a component node — kept in sync with the rail via `?node=`. */
    onSelectNode: (id: string) => void
    /** Drilled-into pod id, or `null` for the pod overview. */
    pod: string | null
    /** Drill into a pod (or `null` to return to overview) — synced with `?pod=`. */
    onSelectPod: (id: string | null) => void
}

/**
 * The live 3D architecture map. Three views, driven by two toggles + a drill-down:
 *
 *  - **Hiện tại · theo nhóm** (default): the pod OVERVIEW — 8 capability pods
 *    around the Core, each toned by its live roll-up. Clicking a pod drills into
 *    its sub-scene (`?pod=`).
 *  - **Hiện tại · toàn bộ**: the flat 17-node scene (power-user god-view).
 *  - **Tương lai**: the microservices roadmap (Coming soon — no live status).
 *
 * In a pod detail view, clicking a member selects it (`?node=`) so the
 * dissection panel + rail stay in sync; a back affordance clears `?pod=`. Every
 * scene builder is a pure data function fed i18n'd labels here.
 *
 * @param props - {@link ArchitectureMapProps}
 */
export const ArchitectureMap = ({
    healthByName,
    selectedId,
    onSelectNode,
    pod,
    onSelectPod,
    className,
}: ArchitectureMapProps) => {
    const t = useTranslations("architecture")

    const [era, setEra] = React.useState<ArchitectureEra>("present")
    const [layout, setLayout] = React.useState<ArchitectureLayout>("pods")

    // stable per-scene i18n label bags (memoised on t so scene builders stay pure)
    const podLabels = useMemo(
        () => ({
            podName: (nameKey: string) => t(`pod.${nameKey}.name`),
            podSub: (nameKey: string) => {
                const value = t(`pod.${nameKey}.sub`)
                return value || undefined
            },
            core: t("map.core"),
            coreSub: t("map.coreSub"),
            checking: t("status.checking"),
            up: t("status.up"),
            degraded: t("status.degraded"),
        }),
        [t],
    )
    const memberLabels = useMemo(
        () => ({
            checking: t("status.checking"),
            unknown: t("status.unknown"),
            degraded: t("status.degraded"),
            down: t("status.down"),
        }),
        [t],
    )
    const flatLabels = useMemo(
        () => ({
            ...memberLabels,
            client: t("map.client"),
            clientSub: t("map.clientSub"),
            gateway: t("map.gateway"),
            gatewaySub: t("map.gatewaySub"),
            core: t("map.core"),
            coreSub: t("map.coreSub"),
        }),
        [memberLabels, t],
    )
    const futureLabels = useMemo(
        () => ({
            bus: t("future.bus"),
            busSub: t("future.busSub"),
            service: (key: string) => t(`future.${key}`),
        }),
        [t],
    )

    // the pod detail view only applies in present · pods mode with a valid pod
    const activePod = era === "present" && layout === "pods" && pod && ARCHITECTURE_POD_MAP[pod] ? pod : null

    const data = useMemo(() => {
        if (era === "future") return buildFutureScene(futureLabels)
        if (layout === "everything") return buildLiveScene(healthByName, flatLabels)
        if (activePod) return buildPodDetailScene(activePod, healthByName, { ...memberLabels, core: podLabels.core, coreSub: podLabels.coreSub })
        return buildPodOverviewScene(healthByName, podLabels)
    }, [era, layout, activePod, healthByName, futureLabels, flatLabels, memberLabels, podLabels])

    // in the future scene nothing is selectable (roadmap, not live); in overview,
    // clicking a pod drills in; in pod-detail / flat, clicking selects a component.
    const handleSelect = (id: string) => {
        if (era === "future") return
        if (layout === "pods" && !activePod) {
            if (ARCHITECTURE_POD_MAP[id]) onSelectPod(id)
            return
        }
        onSelectNode(id)
    }

    // the map ring highlight: the drilled pod in overview, else the selected node
    const highlightId = era === "future" ? undefined : layout === "pods" && !activePod ? (pod ?? undefined) : selectedId

    const caption = era === "future" ? t("future.caption") : activePod ? t(`pod.${ARCHITECTURE_POD_MAP[activePod].nameKey}.name`) : t("mapCaption")

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* toolbar: era switch (present ⇄ future) + present-only layout switch */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <SegmentedControl
                    ariaLabel={t("view.eraAria")}
                    value={era}
                    onChange={setEra}
                    items={[
                        { value: "present", label: t("view.present") },
                        { value: "future", label: t("view.future") },
                    ]}
                    className="w-full max-w-xs"
                />
                {era === "present" ? (
                    <SegmentedControl
                        ariaLabel={t("view.layoutAria")}
                        value={layout}
                        onChange={setLayout}
                        items={[
                            { value: "pods", label: t("view.grouped") },
                            { value: "everything", label: t("view.everything") },
                        ]}
                        className="w-full max-w-xs"
                    />
                ) : (
                    <Chip size="sm" className="bg-accent/10 text-accent">
                        <Chip.Label>{t("future.comingSoon")}</Chip.Label>
                    </Chip>
                )}
            </div>

            {/* back affordance when drilled into a pod */}
            {activePod ? (
                <Button
                    variant="tertiary"
                    size="sm"
                    className="self-start"
                    onPress={() => onSelectPod(null)}
                >
                    <ArrowLeftIcon aria-hidden focusable="false" className="size-4" />
                    {t("view.backToOverview")}
                </Button>
            ) : null}

            <ArchitectureScene
                data={data}
                selectedId={highlightId}
                onSelectNode={handleSelect}
                caption={caption}
            />
        </div>
    )
}
