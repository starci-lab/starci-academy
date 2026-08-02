import React from "react"
import { CircleDashedIcon, CubeIcon, PlugsIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardAccordion, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { ListRow } from "@sb-components/composites/lists/List/List"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `PlaygroundResourcePanel` — the right pane of the playground screen, the live
 * workspace: nothing until the paired machine reports in, then the resource
 * snapshot the socket sent, grouped by kind. Reuses `SurfaceCard.Accordion`,
 * `List.Row`, and `EmptyState` rather than inventing its own. Status uses `Chip`,
 * not `EnumChip`, because it is free-form CLI text ("Up 2 hours", "Exited (0)"): a
 * `toneForStatus` heuristic degrades to neutral on anything unrecognized. One shape,
 * three states (not-connected, connected-empty, connected-with-resources) — a header
 * row over a body region whose fill changes.
 */

/** Whether the playground's paired machine is reachable right now. */
export type PlaygroundConnectionState = "notConnected" | "connected"

/** One resource line as the socket reports it — flat, ungrouped, free-form status text. */
export interface PlaygroundResourceEntry {
    /** What kind of resource this is (`"Container"`, `"Image"`, `"Pod"`...) — the block's own group key. */
    kind: string
    /** The resource's name/id as the agent reports it — assumed unique within its `kind`. */
    name: string
    /** Free-form status text straight from the CLI (`"Up 2 hours"`, `"Exited (0)"`...). */
    status: string
}

/** Props for {@link PlaygroundResourcePanel}. */
export interface PlaygroundResourcePanelProps {
    /** Whether the paired machine is reachable right now. */
    connection: PlaygroundConnectionState
    /**
     * The flat resource snapshot as the socket reports it. Ignored while
     * `connection === "notConnected"`. Empty while connected means the machine
     * paired but hasn't reported a snapshot yet.
     */
    resources: Array<PlaygroundResourceEntry>
}

/** The panel's own fixed header wording — see the file header for why this isn't a prop. */
const PANEL_LABEL = "Resources"

/** One resource kind bucket, in first-seen order. */
interface PlaygroundResourceGroup {
    kind: string
    resources: Array<PlaygroundResourceEntry>
}

/**
 * Buckets the flat snapshot by `kind`, preserving each kind's FIRST-SEEN order —
 * see the file header for why there's no hardcoded kind priority table.
 */
const groupByKind = (resources: ReadonlyArray<PlaygroundResourceEntry>): Array<PlaygroundResourceGroup> => {
    const order: Array<string> = []
    const byKind = new Map<string, Array<PlaygroundResourceEntry>>()
    for (const resource of resources) {
        if (!byKind.has(resource.kind)) {
            byKind.set(resource.kind, [])
            order.push(resource.kind)
        }
        byKind.get(resource.kind)?.push(resource)
    }
    return order.map((kind) => ({ kind, resources: byKind.get(kind) ?? [] }))
}

/** First letter uppercased only — the kind arrives as one word from the agent (`"container"`, `"pod"`...). */
const titleCaseKind = (kind: string): string => (kind.length === 0 ? kind : kind[0].toUpperCase() + kind.slice(1))

// Checked in this ORDER: a status can contain more than one signal word (e.g.
// "unhealthy" contains "healthy"), so the negative buckets are matched first —
// see the file header for why this heuristic exists instead of a closed enum.
const DANGER_STATUS = /\b(exited|dead|error|failed?|crash(ed)?|unhealthy|stopped)\b/i
const WARNING_STATUS = /\b(restarting|creating|pending|paused|starting|stopping|degraded)\b/i
const SUCCESS_STATUS = /\b(running|ready|active|healthy|up)\b/i

/** Free-form CLI status text → chip tone. Unrecognized text degrades to `"default"`, never throws. */
const toneForStatus = (status: string): ChipTone => {
    if (DANGER_STATUS.test(status)) return "danger"
    if (WARNING_STATUS.test(status)) return "warning"
    if (SUCCESS_STATUS.test(status)) return "success"
    return "default"
}

/** Builds one kind group's accordion row: trigger = kind + count, panel = one `List.Row` per resource. */
const groupToAccordionItem = (group: PlaygroundResourceGroup): SurfaceCardAccordionItem => ({
    id: group.kind,
    title: titleCaseKind(group.kind),
    titleEnd: () => (
        <Chip
            tone="default"
            text={String(group.resources.length)}

        />
    ),
    body: () => (
        <StackV
            gap={1}
            pattern="sibling-stack"

            items={group.resources.map((resource, index) => () => (
                <ListRow
                    title={resource.name}
                    meta={() => (
                        <Chip
                            tone={toneForStatus(resource.status)}
                            text={resource.status}

                        />
                    )}
                    divider={index < group.resources.length - 1}

                />
            ))}
        />
    ),
})

/**
 * The playground's live-workspace pane. See the file header for the full
 * contract (grouping, the status heuristic, and the one-leaf/three-state call).
 *
 * @param props - {@link PlaygroundResourcePanelProps}
 */
const PlaygroundResourcePanel = ({
    connection,
    resources,
}: PlaygroundResourcePanelProps) => {
    const isConnected = connection === "connected"
    const hasResources = isConnected && resources.length > 0

    const groups = hasResources ? groupByKind(resources) : []

    const body = !isConnected ? (
        <EmptyState
            icon={PlugsIcon}
            title="Not paired yet"
            description="Pair a machine to see the resources running in your workspace."

        />
    ) : !hasResources ? (
        <EmptyState
            icon={CircleDashedIcon}
            title="Waiting for data"
            description="Machine paired — waiting for the first resource snapshot."

        />
    ) : (
        <SurfaceCardAccordion
            items={groups.map((group) => groupToAccordionItem(group))}
            allowsMultipleExpanded
            defaultExpandedKeys={new Set(groups.map((group) => group.kind))}


        />
    )

    const headerRow = (
        <StackH
            gap={3}
            pattern="value-row"
            justify="between"
            align="center"

            items={[
                () => (
                    <Typography
                        size="sm"
                        weight="medium"
                        prefixIcon={CubeIcon}
                        text={PANEL_LABEL}

                    />
                ),
                // A count of zero (or no snapshot at all) is not news — see `ContentModeNav`'s
                // "a count of zero is not news" convention — so it only appears once there's
                // something real to count.
                ...(hasResources ? [() => (
                    <Typography
                        size="xs"
                        color="muted"
                        tabularNums
                        text={String(resources.length)}

                    />
                )] : []),
            ]}
        />
    )

    return (
        <StackV
            gap={4}

            items={[
                () => headerRow,
                () => body,
            ]}
        />
    )
}

export { PlaygroundResourcePanel }
