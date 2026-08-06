import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `SectionHeading` — the shared landing section header: accent eyebrow, `h2`
 * title, optional intro. `align` is the one thing that varies between the
 * centered marketing sections and a left-aligned header, so it is the leaf.
 */

/** How the heading's contents align. */
export type SectionHeadingAlign = "start" | "center"

/** Props for {@link SectionHeading}. */
export interface SectionHeadingProps {
    /** Optional accent-toned kicker above the title. */
    eyebrow?: string
    /** The section title. */
    title: string
    /** Optional supporting intro line below the title. */
    intro?: string
    /** Horizontal alignment. Defaults to `center`. */
    align?: SectionHeadingAlign
}

/**
 * The section header. See the file header for why `align` is the one leaf.
 *
 * @param props - {@link SectionHeadingProps}
 */
const SectionHeading = ({ eyebrow, title, intro, align = "center" }: SectionHeadingProps) => (
    <div data-tier="block" data-component="SectionHeading">
        <StackV
            gap={3}
            align={align === "center" ? "center" : "start"}
            principle="sibling-stack"
            items={[
                ...(eyebrow ? [() => <Typography size="sm" weight="semibold" color="accent" align={align} text={eyebrow} />] : []),
                () => <Typography size="h2" weight="bold" align={align} text={title} />,
                ...(intro ? [() => <Typography size="base" color="muted" align={align} text={intro} />] : []),
            ]}
        />
    </div>
)

export { SectionHeading }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "SectionHeading" } as const
