import React from "react"
import { CircleDashedIcon, CubeIcon, PlugsIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCardAccordion, type SurfaceCardAccordionItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { FeedbackEmpty } from "@sb-components/composites/feedback/Feedback/Feedback"
import { ListRow } from "@sb-components/composites/lists/List/List"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `PlaygroundResourcePanel`: the RIGHT pane of the playground screen —
 * the live workspace. Nothing until the paired machine reports in, then the
 * resource snapshot the socket sent, grouped by kind.
 *
 * REUSE, NOT A NEW ACCORDION/LIST (the exact mistake this task exists to avoid
 * — see `ContentModeNav`'s file header). This block draws no card frame, no
 * collapsible row, no list row of its own: `SurfaceCard.Accordion` is the SAME
 * composite `SubmissionFindingsList`/`ChallengeBrief` use for a bounded card of
 * collapsible sections, `List.Row` is the SAME row `ContentRelatedList`'s rows
 * are built from, `Feedback.Empty` is the SAME centered placeholder every other
 * pre-content block in this catalog uses for "nothing here yet". The only new
 * code is the DOMAIN: what a resource snapshot looks like and how to read it.
 *
 * WHAT THIS BLOCK OWNS (§14d.1):
 *   • `groupByKind` — the flat socket snapshot has no grouping of its own; the
 *     block buckets it, in FIRST-SEEN kind order (no hardcoded priority table —
 *     the agent can report any kind string, so ordering by arrival is the only
 *     order that doesn't silently drop an unrecognized one to the bottom).
 *   • `toneForStatus` — a status→chip-tone heuristic over FREE-FORM CLI text
 *     ("Up 2 hours", "Exited (0)", "Restarting (1) 4 seconds ago"...). This is
 *     why the status chip is the bare `Chip` atom and NOT `EnumChip`: `EnumChip`
 *     requires an exhaustive map keyed by a CLOSED set of known values, and the
 *     agent can report whatever the underlying CLI prints. A heuristic that
 *     degrades to `tone="neutral"` on anything it doesn't recognize is the only
 *     safe contract here — a closed map would throw or silently mislabel the
 *     first status word the CLI changes.
 *   • The panel's own header wording ("Tài nguyên") — fixed, not a prop. This
 *     panel always shows the same thing (the paired machine's resources), so
 *     there is no second caller who would ever need to relabel it — a `label`
 *     prop here would just be a pre-formatted string with one call site (§14d.1).
 *
 * ⭐ JUDGEMENT CALL — ONE LEAF, THREE STATES, NOT THREE LEAVES (§14d.2 / §11f).
 * `notConnected`, `connected`-but-empty, and `connected`-with-resources all draw
 * the exact same SHAPE: a header row over a body region. Only what fills the
 * body region changes (an invitation to pair, an invitation to wait, or the
 * grouped accordion) — the same call `SubmissionFindingsList` makes for its own
 * loading/empty/populated states inside one accordion frame. A caller flipping
 * `connection` from `"notConnected"` to `"connected"` is not a different block
 * appearing, it's the SAME panel updating what it has to say.
 *
 * ⭐ WHY TWO SEPARATE `Feedback.Empty` CALLS INSTEAD OF ONE SHARED ELSE-BRANCH.
 * "Not connected" and "connected, nothing yet" are different FACTS or a learner
 * would wrongly read "empty" as "broken" right after pairing succeeds — pairing
 * worked, the first snapshot just hasn't arrived. Distinct icon + copy per state
 * keeps that reassurance instead of collapsing both into one generic "no data".
 *
 * NEVER SKELETONISED. There is no `isSkeleton` prop: the "waiting for the first
 * snapshot" `Feedback.Empty` already IS the loading state for this panel (the
 * socket has nothing to shimmer — it either has no snapshot yet or a real one).
 * Adding a second flag on top would just be two ways to say the same thing.
 * ─────────────────────────────────────────────────────────────────────────────
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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** The panel's own fixed header wording — see the file header for why this isn't a prop. */
const PANEL_LABEL = "Tài nguyên"

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
const groupToAccordionItem = (group: PlaygroundResourceGroup, showAnatomy: boolean): SurfaceCardAccordionItem => ({
    id: group.kind,
    title: titleCaseKind(group.kind),
    titleEnd: (
        <Chip
            tone="default"
            text={String(group.resources.length)}
            anatPart={showAnatomy ? "Chip" : undefined}
        />
    ),
    body: (
        <StackV
            gap="flush"
            anatPart={showAnatomy ? "StackV" : undefined}
            body={group.resources.map((resource, index) => (
                <ListRow
                    key={`${group.kind}:${resource.name}`}
                    title={resource.name}
                    meta={(
                        <Chip
                            tone={toneForStatus(resource.status)}
                            text={resource.status}
                            anatPart={showAnatomy ? "Chip" : undefined}
                        />
                    )}
                    divider={index < group.resources.length - 1}
                    showAnatomy={showAnatomy}
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
    showAnatomy = false,
    anatPart,
}: PlaygroundResourcePanelProps) => {
    const isConnected = connection === "connected"
    const hasResources = isConnected && resources.length > 0

    const groups = hasResources ? groupByKind(resources) : []

    const body = !isConnected ? (
        <FeedbackEmpty
            icon={PlugsIcon}
            title="Chưa ghép máy"
            description="Ghép máy để xem tài nguyên đang chạy trong workspace."
            anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
        />
    ) : !hasResources ? (
        <FeedbackEmpty
            icon={CircleDashedIcon}
            title="Đang chờ dữ liệu"
            description="Máy đã ghép xong, đang chờ ảnh chụp tài nguyên đầu tiên."
            anatPart={showAnatomy ? "FeedbackEmpty" : undefined}
        />
    ) : (
        <SurfaceCardAccordion
            items={groups.map((group) => groupToAccordionItem(group, showAnatomy))}
            allowsMultipleExpanded
            defaultExpandedKeys={new Set(groups.map((group) => group.kind))}
            anatPart={showAnatomy ? "SurfaceCardAccordion" : undefined}
            showAnatomy={showAnatomy}
        />
    )

    const headerRow = (
        <StackH
            gap="related"
            justify="between"
            align="center"
            anatPart={showAnatomy ? "StackH" : undefined}
            body={
                <>
                    <Typography
                        size="sm"
                        weight="medium"
                        prefixIcon={CubeIcon}
                        text={PANEL_LABEL}
                        showAnatomy={showAnatomy}
                    />
                    {/* A count of zero (or no snapshot at all) is not news — see `ContentModeNav`'s
                        "a count of zero is not news" convention — so it only appears once there's
                        something real to count. */}
                    {hasResources ? (
                        <Typography
                            size="xs"
                            color="muted"
                            tabularNums
                            text={String(resources.length)}
                            showAnatomy={showAnatomy}
                        />
                    ) : null}
                </>
            }
        />
    )

    return (
        <StackV
            gap="grouped"
            anatPart={anatPart}
            body={
                <>
                    {headerRow}
                    {body}
                </>
            }
        />
    )
}

export { PlaygroundResourcePanel }
