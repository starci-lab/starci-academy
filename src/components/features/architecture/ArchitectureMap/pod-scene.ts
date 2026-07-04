import type {
    ArchitectureEdge,
    ArchitectureNode,
    ArchitectureSceneData,
} from "@/components/blocks/marketing/ArchitectureScene/types"
import type { HealthByName } from "../hooks/useSystemHealthPoll"
import { ARCHITECTURE_PODS, computePodStatus } from "../pods"

/** Resolver for the pod name/sub i18n keys + the roll-up badge labels — passed
 *  in so the scene builder stays a pure data function (no `useTranslations`). */
export interface PodSceneLabels {
    /** `architecture.pod.<nameKey>.name`. */
    podName: (nameKey: string) => string
    /** `architecture.pod.<nameKey>.sub` (may be empty). */
    podSub: (nameKey: string) => string | undefined
    /** Core API node name (`architecture.map.core`). */
    core: string
    /** Core API sub-label (`architecture.map.coreSub`). */
    coreSub: string
    /** Roll-up badge texts. */
    checking: string
    up: string
    degraded: string
}

/** The overview node id for the central Core API. */
export const OVERVIEW_CORE_ID = "core"

/** Distance (board.cell units) from Core to each ring pod — a touch wider than
 *  perfect edge-tiling so the hex form + floating labels stay legible with 8
 *  pods around the ring. */
const RING_D = 3.35

/**
 * Builds the pod OVERVIEW scene: the central `Core API` container with the 8
 * functional pods arranged in a ring around it, each hex pod toned by its live
 * roll-up ({@link computePodStatus}) — gray "checking" before the first probe,
 * then green / yellow / red per the threshold rules. One edge Core → each pod.
 *
 * The pod ids are the scene node ids (`payment`, `auth`, …) so clicking a pod
 * can drive the `?pod=` URL directly.
 *
 * @param healthByName - Latest poll result, or `null` before the first resolve.
 * @param labels - i18n'd names + badge texts.
 */
export const buildPodOverviewScene = (
    healthByName: HealthByName | null,
    labels: PodSceneLabels,
): ArchitectureSceneData => {
    const count = ARCHITECTURE_PODS.length
    // start at +90° (top) and go clockwise so the ring reads evenly around Core
    const nodes: Array<ArchitectureNode> = [
        {
            id: OVERVIEW_CORE_ID,
            name: labels.core,
            sub: labels.coreSub,
            cell: [0, 0],
            kind: "container",
            tone: "normal",
        },
        ...ARCHITECTURE_PODS.map((pod, index): ArchitectureNode => {
            const angle = (Math.PI / 2) - (index / count) * Math.PI * 2
            const rollup = computePodStatus(pod.members, healthByName, labels)
            return {
                id: pod.id,
                name: labels.podName(pod.nameKey),
                sub: labels.podSub(pod.nameKey),
                cell: [
                    Number((RING_D * Math.cos(angle)).toFixed(3)),
                    Number((RING_D * -Math.sin(angle)).toFixed(3)),
                ],
                kind: "pod",
                tone: rollup.tone,
                status: rollup.status,
            }
        }),
    ]

    const edges: Array<ArchitectureEdge> = ARCHITECTURE_PODS.map((pod) => ({
        from: OVERVIEW_CORE_ID,
        to: pod.id,
        flow: true,
    }))

    return {
        board: { cols: [-4, 4], rows: [-4, 4], cell: 1 },
        camera: { position: [12, 11, 12], zoom: 30 },
        nodes,
        edges,
    }
}
