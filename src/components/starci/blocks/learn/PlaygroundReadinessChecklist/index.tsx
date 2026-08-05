import React from "react"
import { CheckCircleIcon, CpuIcon, GearSixIcon, RobotIcon, SparkleIcon, VectorTwoIcon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@/components/composites/cards/SurfaceCard"
import { IconTile, type IconComponent } from "@/components/atoms/display/IconTile"
import { EnumChip, type EnumChipEntry } from "@/components/composites/chips/EnumChip"

/**
 * `PlaygroundReadinessChecklist` — the consolidated "Machine status" list: every
 * playground prerequisite at a glance, one row each. Reuses `SurfaceCardList`'s row
 * shape (leading tile · title · subtitle · trailing chip), `IconTile` for the
 * leading glyph, and `EnumChip` for the trailing status. The block owns the
 * ready/pending wording and maps `kind` (domain vocabulary) to an icon. Two shapes:
 * `Default` (N real rows) and the `isSkeleton` skeleton.
 */

/**
 * The prerequisites a playground session checks. Closed set — see file header.
 * `device` is the paired machine having reported its own snapshot: the infra labs
 * ask for it by name, so it is a kind here rather than an icon smuggled in as data.
 */
export type PlaygroundReadinessKind = "agent" | "engine" | "genModel" | "embedModel" | "device"

/** One row of a {@link PlaygroundReadinessChecklist}. */
export interface PlaygroundReadinessChecklistItem {
    /** Stable row key. */
    key: string
    /** Which prerequisite this row checks — drives the leading icon via {@link KIND_ICON}. */
    kind: PlaygroundReadinessKind
    /** Row title — the thing being checked (e.g. "StarCi Agent"). */
    label: string
    /** Subtitle shown when {@link PlaygroundReadinessChecklistItem.ready} is true. */
    readyDescription: string
    /** Subtitle shown when {@link PlaygroundReadinessChecklistItem.ready} is false. */
    pendingDescription: string
    /** Whether this prerequisite is satisfied. */
    ready: boolean
}

/** Props for {@link PlaygroundReadinessChecklist}. */
export interface PlaygroundReadinessChecklistProps {
    /** Rows, top to bottom. REQUIRED — repeat list = data. */
    items: Array<PlaygroundReadinessChecklistItem>
    /**
     * `true` → every atom this block composes per row (`IconTile`, `EnumChip`)
     * switches to its own shimmer, while `SurfaceCardList` mirrors the title/
     * subtitle text itself. See file header — a STATE of the one leaf, not a
     * second shape.
     */
    isSkeleton?: boolean
}

/** kind → leading icon when the row is NOT ready — the block's own vocabulary (§14d.1). */
const KIND_ICON: Record<PlaygroundReadinessKind, IconComponent> = {
    agent: RobotIcon,
    engine: GearSixIcon,
    genModel: SparkleIcon,
    device: CpuIcon,
    embedModel: VectorTwoIcon,
}

/** The two-value readiness enum driving the trailing chip. */
type ReadinessStatus = "ready" | "pending"

/** status → chip label/color — fixed Vietnamese copy this block owns (§14d.1). */
const READINESS_CHIP_MAP: Record<ReadinessStatus, EnumChipEntry> = {
    ready: { label: "Ready", color: "success" },
    pending: { label: "Pending", color: "default" },
}

/** Builds one row's fixed `SurfaceCardList` shape from a checklist item. */
const checklistRow = (
    item: PlaygroundReadinessChecklistItem,
    isSkeleton: boolean,
): SurfaceCardListItem => {
    const status: ReadinessStatus = item.ready ? "ready" : "pending"
    return {
        key: item.key,
        leading: () => (
            <IconTile
                // circle-check, not a bare tick — icon.md §2: every "done / passed"
                // mark is `CheckCircleIcon`. Carried over from the ported source.
                icon={item.ready ? CheckCircleIcon : KIND_ICON[item.kind]}
                tone={item.ready ? "success" : "default"}
                size="sm"
                isSkeleton={isSkeleton}

            />
        ),
        title: item.label,
        subtitle: item.ready ? item.readyDescription : item.pendingDescription,
        trailing: () => (
            <EnumChip
                value={status}
                map={READINESS_CHIP_MAP}
                isSkeleton={isSkeleton}

            />
        ),
    }
}

/**
 * The "Machine status" list itself. See the file header for the reuse contract,
 * why this block now owns its own wording where the ported source did not, and
 * the single-leaf/one-state-axis read of `isSkeleton`.
 *
 * @param props - {@link PlaygroundReadinessChecklistProps}
 */
const PlaygroundReadinessChecklist = ({
    items,
    isSkeleton = false,
}: PlaygroundReadinessChecklistProps) => (
    <div>
        <SurfaceCardList
            items={items.map((item) => checklistRow(item, isSkeleton))}


        />
    </div>
)

export { PlaygroundReadinessChecklist }
