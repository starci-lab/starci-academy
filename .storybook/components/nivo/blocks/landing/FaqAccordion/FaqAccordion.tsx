import { Accordion } from "@sb-components/atoms/navigation/Accordion/Accordion"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Container } from "@sb-components/frames/Container/Container"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { SectionHeading } from "@sb-components/nivo/blocks/landing/SectionHeading/SectionHeading"

/**
 * BLOCK — `FaqAccordion`: the landing's Q/A section — a `SectionHeading` over
 * the shared `Accordion` atom. Static marketing copy (proposal §2, row 15 —
 * REAL, no vision badge), so only the accordion's own rows carry
 * `isSkeleton`; the heading text is always known up front, the same split
 * `DashboardShell` makes for its top bar.
 *
 * Leaf set: `Default` (prop `items` — the content leaf, §12g.2) + `Skeleton`
 * (prop `isSkeleton`).
 */

/** One FAQ entry's resolved copy. */
export interface FaqAccordionItem {
    /** Stable id — also the key used by `Accordion`. */
    id: string
    /** The question, shown in the trigger row. */
    question: string
    /** The answer, revealed on expand. */
    answer: string
}

/** Props for {@link FaqAccordion}. */
export interface FaqAccordionProps {
    /** Optional accent-toned kicker above the section title. */
    eyebrow?: string
    /** The section title (e.g. "Frequently asked questions"). */
    title: string
    /** Optional supporting intro line below the title. */
    intro?: string
    /** The FAQ entries, in display order. */
    items: Array<FaqAccordionItem>
    /** `true` → the accordion rows render their collapsed-row skeleton mirror. */
    isSkeleton?: boolean
}

/**
 * The FAQ block. See the file header for why only the accordion rows — not
 * the heading — carry `isSkeleton`.
 *
 * @param props - {@link FaqAccordionProps}
 */
const FaqAccordion = ({ eyebrow, title, intro, items, isSkeleton = false }: FaqAccordionProps) => (
    <div data-tier="block" data-component="FaqAccordion">
        <Container
            size="md"
            padding={1}
            body={() => (
                <StackV
                    gap={8}
                    items={[
                        () => <SectionHeading eyebrow={eyebrow} title={title} intro={intro} />,
                        () => (
                            <Accordion
                                isSkeleton={isSkeleton}
                                items={items.map((item) => ({
                                    key: item.id,
                                    title: <Typography size="base" weight="semibold" text={item.question} />,
                                    content: <Typography size="sm" color="muted" text={item.answer} />,
                                }))}
                            />
                        ),
                    ]}
                />
            )}
        />
    </div>
)

export { FaqAccordion }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "FaqAccordion" } as const
