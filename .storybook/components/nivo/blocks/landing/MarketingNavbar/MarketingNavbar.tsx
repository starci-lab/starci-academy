import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackH } from "@sb-components/frames/Stack/Stack"

/**
 * `MarketingNavbar` — the public landing top bar: wordmark + in-page anchors +
 * a secondary sign-in button (no primary — that lives in the hero). It has one
 * resting shape, so the one leaf renders its default state.
 */

/** One in-page section anchor in the nav. */
export interface MarketingNavbarAnchor {
    /** The section id this anchor scrolls to (rendered as `#id`). */
    id: string
    /** Visible anchor label. */
    label: string
}

/** Props for {@link MarketingNavbar}. */
export interface MarketingNavbarProps {
    /** The brand wordmark shown at the far left. */
    wordmark: string
    /** In-page section anchors, in scroll order. */
    anchors: Array<MarketingNavbarAnchor>
    /** Visible label for the sign-in button. */
    signInLabel: string
    /** Fired when sign-in is pressed — the caller opens the auth surface. */
    onSignIn: () => void
}

/**
 * The landing top bar. See the file header for why sign-in is the only action
 * and the primary CTA is left to the hero.
 *
 * @param props - {@link MarketingNavbarProps}
 */
const MarketingNavbar = ({ wordmark, anchors, signInLabel, onSignIn }: MarketingNavbarProps) => (
    <header
        data-tier="block"
        data-component="MarketingNavbar"
        className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-default bg-background px-6"
    >
        <StackH
            gap={8}
            align="center"
            items={[
                () => <Typography size="lg" weight="bold" color="accent" text={wordmark} />,
                () => (
                    <Cluster
                        gap={6}
                        items={anchors.map((anchor) => () => (
                            <Typography
                                size="sm"
                                color="muted"
                                isLink
                                href={`#${anchor.id}`}
                                text={anchor.label}
                            />
                        ))}
                    />
                ),
            ]}
        />

        <Button variant="secondary" size="sm" label={signInLabel} onPress={onSignIn} />
    </header>
)

export { MarketingNavbar }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "MarketingNavbar" } as const
