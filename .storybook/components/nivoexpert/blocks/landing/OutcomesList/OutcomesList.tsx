import { CheckCircleIcon, SparkleIcon } from "@phosphor-icons/react"
import { IconTile } from "@sb-components/atoms/display/IconTile/IconTile"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { EmptyState } from "@sb-components/composites/feedback/EmptyState/EmptyState"
import { Container } from "@sb-components/frames/Container/Container"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `OutcomesList` -- the landing's "what you'll learn" section: a scannable grid of
 * skill/habit/career-gain bullets, each a success-toned check glyph beside one line
 * of copy. Grounded in the expert's own config copy -- the real `Brand`/`Course`
 * shape carries no `outcomes` field, so this block never derives or fabricates a
 * bullet; zero items is a real, honest state for a tenant who has not written any
 * yet. Built on the shared HeroUI atom system (`Typography` / `IconTile` /
 * `EmptyState`).
 */

/** One outcome bullet -- already-resolved copy, never generated here. */
export interface OutcomesListItem {
    /** Stable React key. */
    id: string
    /** The bullet's own text, verbatim from wherever the expert authored it. */
    text: string
}

/** Already-resolved copy `OutcomesList` renders. */
export interface OutcomesListLabels {
    /** Accent eyebrow above the title. */
    eyebrow: string
    /** The section title (e.g. "What you'll learn"). */
    title: string
    /** Optional supporting intro line under the title. */
    intro?: string
    /** Empty-state title, shown when the expert has not authored any outcomes yet. */
    emptyTitle: string
    /** Empty-state supporting line. */
    emptyDescription: string
}

/** Props for {@link OutcomesList}. */
export interface OutcomesListProps {
    /** The outcome bullets, in display order. Empty is a real, honest state -- see the file header. */
    items: Array<OutcomesListItem>
    /**
     * `true` -> the first fetch of the expert's own copy is in flight: the section
     * keeps a fixed placeholder-bullet shape while every line shimmers.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: OutcomesListLabels
}

/** How many placeholder bullets the loading mirror draws while `items` hasn't landed. */
const SKELETON_ITEM_COUNT = 6

/** Placeholder bullets -- sized like real copy so the shimmer mirrors the loaded shape. */
const SKELETON_ITEMS: Array<OutcomesListItem> = Array.from({ length: SKELETON_ITEM_COUNT }, (_unused, index) => ({
    id: `skeleton-${index}`,
    text: "One outcome the reader will walk away with",
}))

/** Props for one outcome bullet row. */
interface OutcomeRowProps {
    /** The bullet this row renders. */
    item: OutcomesListItem
    /** `true` -> the row shimmers as a loading mirror. */
    isSkeleton: boolean
}

/**
 * One bullet row: a success-toned check glyph beside one line of copy. The SAME
 * shape drives the loaded and loading rows -- `isSkeleton` mirrors, it does not
 * branch to a second shape.
 */
const OutcomeRow = ({ item, isSkeleton }: OutcomeRowProps) => (
    <StackH
        principle="flex-action" gap={3}
        align="start"
        isSkeleton={isSkeleton}
        items={[
            () => <IconTile icon={CheckCircleIcon} tone="success" size="sm" isSkeleton={isSkeleton} />,
            () => <Typography size="base" isSkeleton={isSkeleton} text={item.text} />,
        ]}
    />
)

/**
 * The outcomes section. See the file header for why zero items is a real state
 * and why this block never derives its own bullet copy.
 *
 * @param props - {@link OutcomesListProps}
 */
const OutcomesList = ({ items, isSkeleton = false, labels }: OutcomesListProps) => {
    const isEmpty = !isSkeleton && items.length === 0
    const rows = isSkeleton ? SKELETON_ITEMS : items

    return (
        <section data-tier="block" data-component="OutcomesList" className="px-6 py-16">
            <Container
                size="lg"
                padding={1}
                body={() => (
                    <StackV
                        principle="marketing-beat" gap={8}
                        items={[
                            () => (
                                <StackV
                                    principle="sibling-stack" gap={3}
                                    align="center"
                                    items={[
                                        () => <Typography size="sm" weight="bold" color="accent" align="center" text={labels.eyebrow} />,
                                        () => <Typography size="h2" weight="bold" align="center" text={labels.title} />,
                                        ...(labels.intro
                                            ? [() => <Typography size="sm" color="muted" align="center" text={labels.intro as string} />]
                                            : []),
                                    ]}
                                />
                            ),
                            () =>
                                isEmpty ? (
                                    <EmptyState icon={SparkleIcon} title={labels.emptyTitle} description={labels.emptyDescription} />
                                ) : (
                                    <Grid
                                        principle="block-boundary" columns={{ base: 1, md: 2 }}
                                        items={rows.map((item) => ({
                                            key: item.id,
                                            content: () => <OutcomeRow item={item} isSkeleton={isSkeleton} />,
                                        }))}
                                    />
                                ),
                        ]}
                    />
                )}
            />
        </section>
    )
}

export { OutcomesList }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "OutcomesList" } as const
