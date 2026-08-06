import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { DotLabel } from "@sb-components/composites/text/DotLabel/DotLabel"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LeadLeakageMap` — the honest stage list showing where a lead's journey
 * usually breaks down. Feeding different `stages` arrays proves the leak
 * highlighting is derived from data, never hardcoded into the block.
 */

/** One stage of the lead's journey. */
export interface LeadLeakageMapStage {
    /** Stable React key. */
    key: string
    /** The stage's label (e.g. "Visitor lands on the website"). */
    label: string
    /** `true` marks this stage as a point where leads actually fall through. */
    isLeak?: boolean
    /** Already-resolved trailing callout text for a leak stage (e.g. "LEAK"). Required alongside `isLeak`. */
    leakLabel?: string
}

/** Props for {@link LeadLeakageMap}. */
export interface LeadLeakageMapProps {
    /** The map's own small header (e.g. "Where does a lead usually leak?"). */
    title: string
    /** The stages, in journey order. */
    stages: Array<LeadLeakageMapStage>
}

/** One stage row: a dot + label, with an optional trailing leak callout. */
const StageRow = ({ stage }: { stage: LeadLeakageMapStage }) => (
    <StackH
        gap={4}
        justify="between"
        align="center"
        principle="content-row"
        items={[
            () => (
                <DotLabel
                    color={stage.isLeak ? "bg-warning" : "bg-accent"}
                    tone={stage.isLeak ? "warning" : "default"}
                    label={stage.label}
                />
            ),
            ...(stage.isLeak && stage.leakLabel
                ? [() => <Typography size="xs" weight="bold" color="warning" text={stage.leakLabel as string} />]
                : []),
        ]}
    />
)

/**
 * The lead-leakage stage list. See the file header for why leak highlighting
 * is derived from the passed `stages`, never hardcoded.
 *
 * @param props - {@link LeadLeakageMapProps}
 */
const LeadLeakageMap = ({ title, stages }: LeadLeakageMapProps) => (
    <div data-tier="block" data-component="LeadLeakageMap">
        <SurfaceCard
            padding={3}
            label={title}
            subtleLabel
            body={() => (
                <StackV
                    gap={3}
                    items={stages.map((stage) => () => <StageRow stage={stage} />)}
                />
            )}
        />
    </div>
)

export { LeadLeakageMap }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LeadLeakageMap" } as const
