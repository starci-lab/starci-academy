import { ArrowRightIcon } from "@phosphor-icons/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { Container } from "@sb-components/frames/Container/Container"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import {
    OperatingLoopVisual,
    type OperatingLoopVisualNode,
} from "@sb-components/nivo/blocks/landing/OperatingLoopVisual/OperatingLoopVisual"

/**
 * `OperatingLoopHero` — the V2 landing's dark, premium full-fold hero: the
 * Big-Idea headline, three CTAs, the {@link OperatingLoopVisual} flow rail,
 * and a floating Cloud-White mini dashboard card. It has one resting shape —
 * all three CTAs always show — so the one leaf renders that default.
 */

/** One hero CTA — a visible label plus the callback it fires. */
export interface OperatingLoopHeroCta {
    /** Visible button label. */
    label: string
    /** Fired when the CTA is pressed — the caller owns the destination. */
    onPress: () => void
}

/** One short trust-microcopy fragment shown under the CTA row. */
export interface OperatingLoopHeroTrustPoint {
    /** Stable id — also the React key. */
    id: string
    /** Visible fragment (e.g. "AI supports, people stay accountable"). */
    label: string
}

/** One KPI cell of the floating mini dashboard card. */
export interface OperatingLoopHeroMetric {
    /** Stable id — also the React key. */
    id: string
    /** Muted label under the value (e.g. "Leads this week"). */
    label: string
    /** The value shown — a placeholder em-dash while illustrative, a real figure once wired. */
    value: string
}

/** Props for {@link OperatingLoopHero}. */
export interface OperatingLoopHeroProps {
    /** Accent-toned kicker above the headline. */
    eyebrow: string
    /** The Big-Idea headline. */
    headline: string
    /** Supporting flow-sentence copy below the headline. */
    description: string
    /** The single north-star PRIMARY — always into the catalog. */
    primaryCta: OperatingLoopHeroCta
    /** SECONDARY — the Lead-Leakage-Audit path for an unsure reader. */
    secondaryCta: OperatingLoopHeroCta
    /** Tertiary, quietest CTA — a demo preview. */
    tertiaryCta: OperatingLoopHeroCta
    /** Short trust-microcopy fragments under the CTA row. */
    trustPoints: Array<OperatingLoopHeroTrustPoint>
    /** The flow rail's stages, forwarded to {@link OperatingLoopVisual}. */
    flowNodes: Array<OperatingLoopVisualNode>
    /** Which flow stage glows crimson, forwarded to {@link OperatingLoopVisual}. */
    activeFlowNodeId: string
    /** Mini dashboard card title (e.g. "Growth Dashboard"). */
    dashboardTitle: string
    /** Small badge on the dashboard card (e.g. "AI insight"). */
    dashboardBadgeLabel: string
    /** The dashboard card's KPI cells — illustrative values, never fabricated metrics. */
    dashboardMetrics: Array<OperatingLoopHeroMetric>
}

/** One KPI cell of the mini dashboard: a muted label over a bold value. */
const DashboardMetric = ({ metric }: { metric: OperatingLoopHeroMetric }) => (
    <StackV
        gap={1}
        items={[
            () => <Typography size="xs" color="muted" text={metric.label} />,
            () => <Typography size="lg" weight="bold" text={metric.value} />,
        ]}
    />
)

/**
 * The floating Cloud-White mini dashboard card — forces `"light"` so it reads
 * as a real product surface on the dark hero rather than a themed panel.
 */
const MiniDashboardCard = ({
    title,
    badgeLabel,
    metrics,
}: {
    title: string
    badgeLabel: string
    metrics: Array<OperatingLoopHeroMetric>
}) => (
    // Forces the light palette on this one subtree regardless of the dark hero
    // around it (see the file header) — a plain wrapper, not the shared
    // `classNames` prop (that union is positioning-only, §`_allowed-class-name`),
    // the same way `HeroBanner`/`Footer` hand-write their own root chrome.
    <div className="light">
        <SurfaceCard
            padding={4}
            header={() => (
                <StackH
                    gap={4}
                    justify="between"
                    principle="content-row"
                    items={[
                        () => <Typography size="sm" weight="semibold" text={title} />,
                        () => <Chip tone="accent" text={badgeLabel} />,
                    ]}
                />
            )}
            body={() => (
                <Cluster
                    gap={5}
                    justify="between"
                    principle="group-boundary"
                    items={metrics.map((metric) => () => <DashboardMetric metric={metric} />)}
                />
            )}
        />
    </div>
)

/** The hero's text half: eyebrow, headline, description, the 3-CTA row, and trust microcopy. */
const HeroCopy = ({
    eyebrow,
    headline,
    description,
    primaryCta,
    secondaryCta,
    tertiaryCta,
    trustPoints,
}: Pick<OperatingLoopHeroProps, "eyebrow" | "headline" | "description" | "primaryCta" | "secondaryCta" | "tertiaryCta" | "trustPoints">) => (
    <StackV
        gap={6}
        principle="block-boundary"
        items={[
            () => <Typography size="sm" weight="semibold" color="accent" text={eyebrow} />,
            () => <Typography size="h1" weight="bold" text={headline} />,
            () => <Typography size="base" color="muted" text={description} />,
            () => (
                <Cluster
                    gap={3}
                    items={[
                        () => (
                            <Button
                                variant="primary"
                                size="lg"
                                label={primaryCta.label}
                                suffixIcon={ArrowRightIcon}
                                iconSlide
                                onPress={primaryCta.onPress}
                            />
                        ),
                        () => (
                            <Button
                                variant="secondary"
                                size="lg"
                                label={secondaryCta.label}
                                onPress={secondaryCta.onPress}
                            />
                        ),
                        () => (
                            <Button
                                variant="ghost"
                                size="lg"
                                label={tertiaryCta.label}
                                onPress={tertiaryCta.onPress}
                            />
                        ),
                    ]}
                />
            ),
            () => (
                <Cluster
                    gap={4}
                    separator
                    principle="content-row"
                    items={trustPoints.map((point) => () => (
                        <Typography size="xs" color="muted" text={point.label} />
                    ))}
                />
            ),
        ]}
    />
)

/** The hero's visual half: the flow rail over the floating mini dashboard card. */
const HeroVisual = ({
    flowNodes,
    activeFlowNodeId,
    dashboardTitle,
    dashboardBadgeLabel,
    dashboardMetrics,
}: Pick<OperatingLoopHeroProps, "flowNodes" | "activeFlowNodeId" | "dashboardTitle" | "dashboardBadgeLabel" | "dashboardMetrics">) => (
    <StackV
        gap={6}
        items={[
            () => <OperatingLoopVisual nodes={flowNodes} activeNodeId={activeFlowNodeId} />,
            () => (
                <MiniDashboardCard
                    title={dashboardTitle}
                    badgeLabel={dashboardBadgeLabel}
                    metrics={dashboardMetrics}
                />
            ),
        ]}
    />
)

/**
 * The V2 landing's dark Operating Loop hero. See the file header for why it
 * forces `"dark"` and has one resting shape.
 *
 * @param props - {@link OperatingLoopHeroProps}
 */
const OperatingLoopHero = ({
    eyebrow,
    headline,
    description,
    primaryCta,
    secondaryCta,
    tertiaryCta,
    trustPoints,
    flowNodes,
    activeFlowNodeId,
    dashboardTitle,
    dashboardBadgeLabel,
    dashboardMetrics,
}: OperatingLoopHeroProps) => (
    <section
        data-tier="block"
        data-component="OperatingLoopHero"
        className="dark bg-background px-6 py-20 text-foreground"
    >
        <Container
            size="xl"
            padding={1}
            body={() => (
                <Grid
                    columns={{ base: 1, lg: 2 }}
                    principle="layout-split"
                    items={[
                        {
                            key: "copy",
                            content: () => (
                                <HeroCopy
                                    eyebrow={eyebrow}
                                    headline={headline}
                                    description={description}
                                    primaryCta={primaryCta}
                                    secondaryCta={secondaryCta}
                                    tertiaryCta={tertiaryCta}
                                    trustPoints={trustPoints}
                                />
                            ),
                        },
                        {
                            key: "visual",
                            content: () => (
                                <HeroVisual
                                    flowNodes={flowNodes}
                                    activeFlowNodeId={activeFlowNodeId}
                                    dashboardTitle={dashboardTitle}
                                    dashboardBadgeLabel={dashboardBadgeLabel}
                                    dashboardMetrics={dashboardMetrics}
                                />
                            ),
                        },
                    ]}
                />
            )}
        />
    </section>
)

export { OperatingLoopHero }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OperatingLoopHero" } as const
