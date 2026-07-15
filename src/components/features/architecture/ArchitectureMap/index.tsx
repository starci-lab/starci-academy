"use client"

import React, { useMemo } from "react"
import dynamic from "next/dynamic"
import { Chip, Skeleton, cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import { TabsCard } from "@/components/blocks/navigation/TabsCard"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_MODULE_MAP } from "../modules"
import { buildLiveScene } from "./scene"
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

/** Props for {@link ArchitectureMap}. */
export interface ArchitectureMapProps extends WithClassNames<undefined> {
    /** Live health keyed by component name, or `null` before the first probe resolves. */
    healthByName: HealthByName | null
    /** Currently selected node id — highlighted with a ring on the map. */
    selectedId: string
    /** Click-to-select a node — kept in sync with the rail via `?node=`. */
    onSelectNode: (id: string) => void
}

/**
 * The live 3D architecture ATLAS — one flat isometric board, no pods, no drill.
 * Two eras via a single toggle:
 *
 *  - **Hiện tại** (default): the live atlas — all 17 infra/external components
 *    (live status dot) PLUS the 10 feature modules the Core API splits into
 *    (neutral, no dot — no health probe exists for them). Selecting a module
 *    brightens the infra it runs on ({@link buildLiveScene}); selecting infra
 *    highlights it. Everything on one grid, one tile per node.
 *  - **Tương lai**: the microservices roadmap (Coming soon — no live status).
 *
 * The `?node=` selection is shared with the rail + dissection panel. Every scene
 * builder is a pure data function fed i18n'd labels here.
 *
 * @param props - {@link ArchitectureMapProps}
 */
export const ArchitectureMap = ({ healthByName, selectedId, onSelectNode, className }: ArchitectureMapProps) => {
    const t = useTranslations("architecture")

    const [era, setEra] = React.useState<ArchitectureEra>("present")

    // stable per-scene i18n label bags (memoised on t so scene builders stay pure)
    const flatLabels = useMemo(
        () => ({
            checking: t("status.checking"),
            unknown: t("status.unknown"),
            degraded: t("status.degraded"),
            down: t("status.down"),
            client: t("map.client"),
            clientSub: t("map.clientSub"),
            gateway: t("map.gateway"),
            gatewaySub: t("map.gatewaySub"),
            moduleName: (id: string) => t(`module.${id}.name`),
            moduleSub: (id: string) => {
                const value = t(`module.${id}.sub`)
                return value || undefined
            },
        }),
        [t],
    )
    const futureLabels = useMemo(
        () => ({
            bus: t("future.bus"),
            busSub: t("future.busSub"),
            service: (key: string) => t(`future.${key}`),
        }),
        [t],
    )

    const data = useMemo(
        () => (era === "future" ? buildFutureScene(futureLabels) : buildLiveScene(healthByName, flatLabels, selectedId)),
        [era, healthByName, flatLabels, futureLabels, selectedId],
    )

    // nothing is selectable in the future (roadmap) scene
    const handleSelect = (id: string) => {
        if (era === "future") return
        onSelectNode(id)
    }

    const highlightId = era === "future" ? undefined : selectedId

    const caption = era === "future"
        ? t("future.caption")
        : ARCHITECTURE_MODULE_MAP[selectedId]
            ? t("map.moduleHint")
            : t("map.atlasHint")

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            {/* era switch (present ⇄ future) — no pod/layout toggle anymore */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <TabsCard
                    variant="primary"
                    className="w-full max-w-xs"
                    leftTabs={{
                        selectedKey: era,
                        ariaLabel: t("view.eraAria"),
                        onSelectionChange: (key) => setEra(String(key) as typeof era),
                        items: [
                            { key: "present", label: t("view.present") },
                            { key: "future", label: t("view.future") },
                        ],
                    }}
                />
                {era === "future" ? (
                    <Chip size="sm" className="bg-accent-soft text-accent-soft-foreground">
                        <Chip.Label>{t("future.comingSoon")}</Chip.Label>
                    </Chip>
                ) : null}
            </div>

            <ArchitectureScene
                data={data}
                selectedId={highlightId}
                onSelectNode={handleSelect}
                caption={caption}
            />
        </div>
    )
}
