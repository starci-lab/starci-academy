import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Container } from "@sb-components/frames/Container/Container"
import { Grid } from "@sb-components/frames/Grid/Grid"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `Footer` — the landing footer: a brand column beside the product route links,
 * closed by a contact line. One resting shape; the leaf renders its default,
 * with the streamlined two-product catalog as the links.
 */

/** One product route link in the footer. */
export interface FooterLink {
    /** Stable id — also the React key. */
    id: string
    /** Visible link label (a product name). */
    label: string
    /** Route this link points at. */
    href: string
}

/** Props for {@link Footer}. */
export interface FooterProps {
    /** The brand wordmark. */
    wordmark: string
    /** One-line brand positioning under the wordmark. */
    tagline: string
    /** Heading above the product route links. */
    linksHeading: string
    /** The product route links, in display order. */
    links: Array<FooterLink>
    /** The muted contact / location line at the foot. */
    contact: string
}

/**
 * The landing footer. See the file header for why every route arrives as a
 * resolved href rather than being derived here.
 *
 * @param props - {@link FooterProps}
 */
const Footer = ({ wordmark, tagline, linksHeading, links, contact }: FooterProps) => (
    <footer
        data-tier="block"
        data-component="Footer"
        className="border-t border-default bg-background px-6 py-12"
    >
        <Container
            size="lg"
            padding={1}
            body={() => (
                <StackV
                    gap={8}
                    items={[
                        () => (
                            <Grid
                                columns={{ base: 1, md: 2 }}
                                gap={8}
                                items={[
                                    {
                                        key: "brand",
                                        content: () => (
                                            <StackV
                                                gap={3}
                                                items={[
                                                    () => <Typography size="base" weight="bold" color="accent" text={wordmark} />,
                                                    () => <Typography size="sm" color="muted" text={tagline} />,
                                                ]}
                                            />
                                        ),
                                    },
                                    {
                                        key: "links",
                                        content: () => (
                                            <StackV
                                                gap={3}
                                                items={[
                                                    () => <Typography size="sm" weight="semibold" text={linksHeading} />,
                                                    () => (
                                                        <StackV
                                                            gap={2}
                                                            items={links.map((link) => () => (
                                                                <Typography size="sm" color="muted" isLink href={link.href} text={link.label} />
                                                            ))}
                                                        />
                                                    ),
                                                ]}
                                            />
                                        ),
                                    },
                                ]}
                            />
                        ),
                        () => <Typography size="xs" color="muted" text={contact} />,
                    ]}
                />
            )}
        />
    </footer>
)

export { Footer }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "Footer" } as const
