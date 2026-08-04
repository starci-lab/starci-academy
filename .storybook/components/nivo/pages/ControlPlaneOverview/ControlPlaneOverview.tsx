import type { ReactNode } from "react"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { KpiRow, type KpiRowItem } from "@sb-components/nivo/blocks/dashboard/KpiRow/KpiRow"
import {
    OperatingLoopRail,
    type OperatingLoopRailNode,
} from "@sb-components/nivo/blocks/dashboard/OperatingLoopRail/OperatingLoopRail"
import {
    RecentActivityCard,
    type RecentActivityCardLabels,
    type RecentActivityItem,
} from "@sb-components/nivo/blocks/dashboard/RecentActivityCard/RecentActivityCard"
import {
    QuickActionsCard,
    type QuickActionItem,
    type QuickActionsCardLabels,
} from "@sb-components/nivo/blocks/dashboard/QuickActionsCard/QuickActionsCard"
import {
    ProductQuickSelector,
    type ProductQuickSelectorItem,
} from "@sb-components/nivo/blocks/dashboard/ProductQuickSelector/ProductQuickSelector"

/**
 * `ControlPlaneOverview` — the "Overview" home: the KPI row, the
 * operating-loop rail, then EITHER the onward path (a brand-new account) OR
 * the activity feed beside the quick actions (an account with something
 * running). A page's story is one complete STATE per story — `loading`,
 * `populated`, `new-account` — not a leaf-per-prop map. Grounded in the real
 * account summary and the two-product catalog.
 */

/** The heading strip above the KPI row. */
export interface ControlPlaneOverviewHeading {
    /** Page title (e.g. "Overview"). */
    title: string
    /** One-line orientation under the title. */
    subtitle: string
}

/** The operating-loop rail's data. */
export interface ControlPlaneOverviewLoop {
    /** The rail's six stages. */
    nodes: Array<OperatingLoopRailNode>
    /** Which stage ids the account currently has wired up. */
    activeNodeIds: Array<string>
}

/**
 * Which half of the page renders below the loop rail — a discriminated union
 * so the data and the shape cannot drift: a brand-new account gets the
 * onward path, an account with something running gets the activity feed +
 * quick actions, never both and never neither.
 */
export type ControlPlaneOverviewSection =
    | { kind: "new-account"; onwardPath: Array<ProductQuickSelectorItem> }
    | { kind: "populated"; activity: Array<RecentActivityItem>; quickActions: Array<QuickActionItem> }

/** Props for {@link ControlPlaneOverview}. */
export interface ControlPlaneOverviewProps {
    /** The heading strip. */
    heading: ControlPlaneOverviewHeading
    /** The KPI row's tiles. */
    kpis: Array<Omit<KpiRowItem, "isSkeleton">>
    /** The operating-loop rail's data. */
    loop: ControlPlaneOverviewLoop
    /** Which half renders below the loop rail — see {@link ControlPlaneOverviewSection}. */
    section: ControlPlaneOverviewSection
    /** Already-localized copy for the page's own sections and the blocks it composes. */
    labels: ControlPlaneOverviewLabels
    /** `true` → the page is still loading; every composed block renders its own skeleton mirror. */
    isSkeleton?: boolean
}

/** The already-resolved copy the page renders. */
export interface ControlPlaneOverviewLabels {
    /** Operating-loop rail card title (e.g. "Your operating loop"). */
    operatingLoopTitle: string
    /** Heading above the onward-path grid, shown only in the `new-account` section. */
    onwardSectionTitle: string
    /** Already-localized copy for the embedded {@link RecentActivityCard}. */
    activityLabels: RecentActivityCardLabels
    /** Already-localized copy for the embedded {@link QuickActionsCard}. */
    quickActionsLabels: QuickActionsCardLabels
}

/**
 * The overview page. See the file header for why the section below the loop
 * rail is one discriminated-union prop rather than two optional arrays.
 *
 * @param props - {@link ControlPlaneOverviewProps}
 */
const ControlPlaneOverview = ({ heading, kpis, loop, section, labels, isSkeleton = false }: ControlPlaneOverviewProps) => {
    const shell = (children: ReactNode) => (
        <div
            data-tier="page"
            data-component="ControlPlaneOverview"
            className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8"
        >
            {children}
        </div>
    )

    return shell(
        <StackV
            gap={6}
            items={[
                () => (
                    <StackV
                        gap={1}
                        isSkeleton={isSkeleton}
                        items={[
                            () => <Typography size="h2" weight="bold" isSkeleton={isSkeleton} text={heading.title} />,
                            () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={heading.subtitle} />,
                        ]}
                    />
                ),
                () => <KpiRow items={kpis} isSkeleton={isSkeleton} />,
                () => (
                    <OperatingLoopRail
                        nodes={loop.nodes}
                        activeNodeIds={loop.activeNodeIds}
                        isSkeleton={isSkeleton}
                        labels={{ title: labels.operatingLoopTitle }}
                    />
                ),
                () =>
                    section.kind === "new-account" ? (
                        <StackV
                            gap={3}
                            items={[
                                () => <Typography size="lg" weight="bold" text={labels.onwardSectionTitle} />,
                                () => <ProductQuickSelector items={section.onwardPath} />,
                            ]}
                        />
                    ) : (
                        <Grid
                            columns={{ base: 1, lg: 2 }}
                            gap={4}
                            items={[
                                {
                                    key: "activity",
                                    content: () => (
                                        <RecentActivityCard
                                            items={section.activity}
                                            isSkeleton={isSkeleton}
                                            labels={labels.activityLabels}
                                        />
                                    ),
                                },
                                {
                                    key: "quick-actions",
                                    content: () => (
                                        <QuickActionsCard
                                            items={section.quickActions}
                                            isSkeleton={isSkeleton}
                                            labels={labels.quickActionsLabels}
                                        />
                                    ),
                                },
                            ]}
                        />
                    ),
            ]}
        />,
    )
}

export { ControlPlaneOverview }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "ControlPlaneOverview" } as const
