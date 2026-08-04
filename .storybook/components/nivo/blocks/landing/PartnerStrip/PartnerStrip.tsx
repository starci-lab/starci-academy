import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * `PartnerStrip` — the "partner nivo is not just a reseller" ecosystem beat:
 * a centered header over a wrapping row of ecosystem chips. Feeding a
 * shorter chip list proves the row reflows on real data, not a fixed
 * four-chip layout.
 */

/** One ecosystem chip. */
export interface PartnerStripChip {
    /** Stable React key. */
    key: string
    /** The chip's label (e.g. "Partner Program", "White-label"). */
    label: string
}

/** Props for {@link PartnerStrip}. */
export interface PartnerStripProps {
    /** Accent-toned kicker above the title. */
    eyebrow: string
    /** The beat's headline (e.g. "Partner nivo is not just a reseller."). */
    title: string
    /** Supporting line naming that the ecosystem is opening up (roadmap framing). */
    intro: string
    /** The ecosystem chips, in display order. */
    chips: Array<PartnerStripChip>
}

/**
 * The ecosystem strip. See the file header for why the roadmap framing lives
 * in `intro`, never a badge this block invents.
 *
 * @param props - {@link PartnerStripProps}
 */
const PartnerStrip = ({ eyebrow, title, intro, chips }: PartnerStripProps) => (
    <div data-tier="block" data-component="PartnerStrip">
        <StackV
            gap={6}
            items={[
                () => <SectionHeading eyebrow={eyebrow} title={title} intro={intro} align="center" />,
                () => (
                    <Cluster
                        gap={3}
                        justify="center"
                        items={chips.map((chip) => () => <Chip tone="default" text={chip.label} />)}
                    />
                ),
            ]}
        />
    </div>
)

export { PartnerStrip }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "PartnerStrip" } as const
