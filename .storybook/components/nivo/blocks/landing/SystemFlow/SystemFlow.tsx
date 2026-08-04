import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { IconTile, type IconComponent } from "@sb-components/atoms/display/IconTile/IconTile"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * `SystemFlow` — the "a lead should not stop at the form" roadmap narrative:
 * six layers of the operating loop read as one connected system. Exactly one
 * layer (AI Agent) carries the standout emphasis in the real loop, and that
 * emphasis is DATA — feeding the same six layers with no layer flagged proves
 * the highlight is never hardcoded to a position.
 */

/** One layer of the operating loop. */
export interface SystemFlowLayer {
    /** Stable React key. */
    key: string
    /** Leading glyph for the layer (e.g. a globe for "Website"). */
    icon: IconComponent
    /** The layer's short name (e.g. "Website", "CRM", "AI Agent"). */
    name: string
    /** One short line naming what the layer does (e.g. "Captures the lead"). */
    description: string
    /**
     * `true` marks this ONE layer as the system's standout — the AI layer in
     * the real loop. At most one layer should carry this; see `SurfaceCard`'s
     * own `isHighlight` for why two highlighted cards cancel each other's
     * emphasis out.
     */
    isHighlighted?: boolean
}

/** Props for {@link SystemFlow}. */
export interface SystemFlowProps {
    /** Accent-toned kicker above the title (e.g. "How nivo works"). */
    eyebrow: string
    /** The beat's headline (e.g. "A lead should not stop at the form."). */
    title: string
    /** Supporting line naming which layers are real today and which are the roadmap. */
    intro: string
    /** The operating loop's layers, in flow order. */
    layers: Array<SystemFlowLayer>
}

/** One layer tile: a centered icon over its name and description. */
const LayerTile = ({ layer }: { layer: SystemFlowLayer }) => (
    <SurfaceCard
        padding={3}
        isHighlight={layer.isHighlighted}
        body={() => (
            <StackV
                gap={2}
                align="center"
                items={[
                    () => <IconTile icon={layer.icon} tone={layer.isHighlighted ? "accent" : "default"} size="sm" />,
                    () => <Typography size="sm" weight="bold" align="center" text={layer.name} />,
                    () => <Typography size="xs" color="muted" align="center" text={layer.description} />,
                ]}
            />
        )}
    />
)

/**
 * The operating-loop diagram. See the file header for why the highlighted
 * layer and the real/roadmap split are both data, never hardcoded here.
 *
 * @param props - {@link SystemFlowProps}
 */
const SystemFlow = ({ eyebrow, title, intro, layers }: SystemFlowProps) => (
    <div data-tier="block" data-component="SystemFlow">
        <StackV
            gap={8}
            items={[
                () => <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align="center" />,
                () => (
                    <Grid
                        columns={{ base: 1, sm: 2, lg: 3 }}
                        gap={4}
                        items={layers.map((layer) => ({
                            key: layer.key,
                            content: () => <LayerTile layer={layer} />,
                        }))}
                    />
                ),
            ]}
        />
    </div>
)

export { SystemFlow }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "SystemFlow" } as const
