import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Container } from "@sb-components/frames/Container/Container"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `LandingFooter` -- closes the tenant landing: the expert's brand name beside
 * the same in-page anchors the nav offers, over a quiet "made with nivo"
 * mark. One resting shape; the leaf renders its default. Formalises the
 * `<footer>` markup (a quiet "made with nivo" mark) duplicated across the
 * three retiring presets (`app/landings/Classic.tsx`, `Bold.tsx`, `Minimal.tsx`)
 * into one component the single `TenantLandingShell` renders once.
 *
 * HeroUI: composes the house `Typography` atom and `Container`/`Cluster`/
 * `StackV` frames -- the same vocabulary `nivo/blocks/landing/Footer` builds
 * its own footer from. Every colour resolves through `apps/expert`'s
 * `--nivo-*` -> HeroUI bridge (`globals.css`), so this fixture renders
 * correctly with no host `:root` override present.
 */

/** One in-page anchor link in the footer's link row. */
export interface LandingFooterLink {
    /** Stable id -- also the React key. */
    id: string
    /** Visible link label (e.g. an anchor into the catalog or lead-capture section). */
    label: string
    /** In-page anchor href this link points at (e.g. `"#courses"`). */
    href: string
}

/** Props for {@link LandingFooter}. */
export interface LandingFooterProps {
    /** The expert's display name (`Brand.displayName`), shown first in the link row. */
    brandName: string
    /** The in-page anchor links, in display order -- the same anchors the nav offers. */
    links: Array<LandingFooterLink>
    /** The quiet closing mark line (e.g. "Made with nivo"). */
    markLabel: string
}

/**
 * The landing footer. See the file header for why every link arrives as a
 * resolved href rather than being derived here, and why there is no
 * `isSkeleton`.
 *
 * @param props - {@link LandingFooterProps}
 */
const LandingFooter = ({ brandName, links, markLabel }: LandingFooterProps) => (
    <footer data-tier="block" data-component="LandingFooter" className="border-t border-default bg-background px-6 py-10">
        <Container
            size="lg"
            padding={1}
            body={() => (
                <StackV
                    gap={2}
                    align="center"
                    items={[
                        () => (
                            <Cluster
                                gap={3}
                                justify="center"
                                separator
                                items={[
                                    () => <Typography size="sm" weight="semibold" text={brandName} />,
                                    ...links.map((link) => () => (
                                        <Typography size="sm" color="muted" isLink href={link.href} text={link.label} />
                                    )),
                                ]}
                            />
                        ),
                        () => <Typography size="xs" color="muted" align="center" text={markLabel} />,
                    ]}
                />
            )}
        />
    </footer>
)

export { LandingFooter }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "LandingFooter" } as const
