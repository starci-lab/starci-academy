import { PulseIcon } from "@phosphor-icons/react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { ProgressMeter } from "@sb-components/composites/stats/ProgressMeter/ProgressMeter"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `HealthCard` — the Agent OS console's operating-loop tile over the pod's own
 * health: a decorative pulse glyph beside a titled meter (`ProgressMeter`) plus a
 * caption UNDER the bar spelling out that the figure is ILLUSTRATIVE — the
 * proposal's business-parity rule bans a fabricated metric, and there is no real
 * operating-data pipeline behind a pod's health yet. One composition, one DATA
 * axis (`isSkeleton`) — no `empty`/`error` leaf, since the console only ever
 * mounts this once the pod is `active`.
 */

/** Props for {@link HealthCard}. */
export interface HealthCardProps {
    /**
     * The illustrative health percentage (`[0, 100]`) — NOT a real measured
     * uptime; see the file header. Ignored while `isSkeleton`.
     */
    healthPercent: number
    /**
     * `true` → the console's own first fetch is in flight: the meter's label,
     * percentage, and bar shimmer in place of the resolved value (§12b).
     * Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: HealthCardLabels
}

/** The already-resolved copy the tile renders. */
export interface HealthCardLabels {
    /** Meter title (e.g. "Pod health"). */
    title: string
    /** Caption under the bar, spelling out that the figure is illustrative. */
    illustrativeNote: string
}

/** Decorative glyph tile — static regardless of `isSkeleton`, same convention as `SurfaceCard.Nested`'s own header icon. */
const HealthIconTile = () => (
    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
        <PulseIcon aria-hidden focusable="false" className="size-5" weight="bold" />
    </div>
)

/**
 * The pod-health tile. See the file header for why the percentage is always
 * labelled illustrative and why there is no separate skeleton tree.
 *
 * @param props - {@link HealthCardProps}
 */
const HealthCard = ({ healthPercent, isSkeleton = false, labels }: HealthCardProps) => (
    <div data-tier="block" data-component="HealthCard">
        <SurfaceCard
            padding={3}
            isSkeleton={isSkeleton}
            body={() => (
                <StackH
                    gap={4}
                    principle="content-row"
                    isSkeleton={isSkeleton}
                    items={[
                        () => <HealthIconTile />,
                        () => (
                            <div className="min-w-0 flex-1">
                                {/* `ProgressMeter` discriminates `isSkeleton` at the type level
                                    (`value` required only in the live arm), so the flag is
                                    branched here rather than forwarded as a plain `boolean`. */}
                                {isSkeleton ? (
                                    <ProgressMeter isSkeleton label={labels.title} showValue color="success" />
                                ) : (
                                    <ProgressMeter value={healthPercent} label={labels.title} showValue color="success" />
                                )}
                                <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.illustrativeNote} />
                            </div>
                        ),
                    ]}
                />
            )}
        />
    </div>
)

export { HealthCard }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "HealthCard" } as const
