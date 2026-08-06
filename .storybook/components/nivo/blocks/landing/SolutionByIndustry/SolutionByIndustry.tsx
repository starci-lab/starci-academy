import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * `SolutionByIndustry` — the "every industry needs a different playbook"
 * roadmap beat: one card per industry line the operating loop is heading
 * toward. Exactly one card (`nivo Academy`) is buyable today, and that is
 * DATA (`isAvailableToday`) — feeding the same six industries with the flag
 * cleared everywhere proves the "available today" badge is never hardcoded
 * to a fixed card.
 */

/** One industry's solution line. */
export interface SolutionByIndustryItem {
    /** Stable React key. */
    key: string
    /** The industry's name (e.g. "nivo Academy", "nivo B2B Service"). */
    industry: string
    /** Already-resolved status badge text (e.g. "Available today", "Not buyable yet"). */
    statusLabel: string
    /**
     * `true` marks this ONE industry as buyable today (only `nivo Academy` in
     * the real catalog) — renders `statusLabel` in the success tone instead
     * of the roadmap warning tone. At most one item should carry this.
     */
    isAvailableToday?: boolean
    /** The industry's pain point, in the visitor's own words (e.g. "Enrollment leads fall through"). */
    painPoint: string
    /** The system that would answer it, as a short flow line (e.g. "Website → CRM → automation → dashboard"). */
    systemLine: string
}

/** Props for {@link SolutionByIndustry}. */
export interface SolutionByIndustryProps {
    /** Accent-toned kicker above the title. */
    eyebrow: string
    /** The beat's headline (e.g. "Every industry needs a different playbook."). */
    title: string
    /** Supporting line naming which industry is real today and which are the roadmap. */
    intro: string
    /** The industry cards, in display order. */
    items: Array<SolutionByIndustryItem>
}

/** One industry card: name + status badge, its pain point, and the system line that answers it. */
const IndustryCard = ({ item }: { item: SolutionByIndustryItem }) => (
    <SurfaceCard
        padding={3}
        body={() => (
            <StackV
                gap={3}
                principle="sibling-stack"
                items={[
                    () => (
                        <StackH
                            gap={2}
                            align="center"
                            justify="between"
                            items={[
                                () => <Typography size="base" weight="bold" text={item.industry} />,
                                () => <Chip tone={item.isAvailableToday ? "success" : "warning"} text={item.statusLabel} />,
                            ]}
                        />
                    ),
                    () => <Typography size="sm" weight="semibold" text={item.painPoint} />,
                    () => <Typography size="xs" color="muted" text={item.systemLine} />,
                ]}
            />
        )}
    />
)

/**
 * The industry-solution grid. See the file header for why only one card
 * carries the "available today" badge and the rest read as the roadmap.
 *
 * @param props - {@link SolutionByIndustryProps}
 */
const SolutionByIndustry = ({ eyebrow, title, intro, items }: SolutionByIndustryProps) => (
    <div data-tier="block" data-component="SolutionByIndustry">
        <StackV
            gap={8}
            principle="marketing-beat"
            items={[
                () => <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align="center" />,
                () => (
                    <Grid
                        columns={{ base: 1, md: 3 }}
                        principle="content-row"
                        items={items.map((item) => ({
                            key: item.key,
                            content: () => <IndustryCard item={item} />,
                        }))}
                    />
                ),
            ]}
        />
    </div>
)

export { SolutionByIndustry }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "SolutionByIndustry" } as const
