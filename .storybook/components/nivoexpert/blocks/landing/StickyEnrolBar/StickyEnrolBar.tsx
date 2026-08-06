import { cn } from "@heroui/react"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `StickyEnrolBar` -- the mobile sticky bottom CTA bar: the primary offer's title
 * + real price pinned to the viewport bottom, one always-reachable Enrol button
 * beside it. `isVisible` is CALLER-CONTROLLED (same convention as the shared
 * `BackToTop` atom) -- this block owns no scroll listener of its own, so both the
 * shown and hidden look stay demoable here with no real scroll behind them. Built
 * on the shared HeroUI atom system (`Typography` / `Button`).
 */

/** The offer this bar restates -- a subset of the real `Course`. */
export interface StickyEnrolBarOffer {
    /** `Course.title` -- the course this bar pushes. */
    title: string
    /** `Course.priceText`, verbatim. Null renders `labels.freeLabel` -- a copy decision, not a fabricated price. */
    priceText?: string | null
}

/** Already-resolved copy `StickyEnrolBar` renders. */
export interface StickyEnrolBarLabels {
    /** Price text shown when `offer.priceText` is null. */
    freeLabel: string
    /** The bar's one CTA label. */
    ctaLabel: string
}

/** Props for {@link StickyEnrolBar}. */
export interface StickyEnrolBarProps {
    /** The offer this bar restates. */
    offer: StickyEnrolBarOffer
    /** Fires on the CTA press -- the caller routes to enrolment / scrolls to the offer section. */
    onEnrol: () => void
    /**
     * `true` -> the bar slides up into view and its CTA accepts presses; `false` ->
     * it slides off-screen and stops accepting presses/focus. Caller-controlled --
     * see the file header for why this block owns no scroll listener of its own.
     */
    isVisible: boolean
    /** `true` -> the offer hasn't resolved yet: title/price shimmer and the CTA stops accepting presses. */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: StickyEnrolBarLabels
}

/**
 * The sticky bar. See the file header for why visibility is caller-controlled
 * and why it hides itself past the `@app-md` container step.
 *
 * @param props - {@link StickyEnrolBarProps}
 */
const StickyEnrolBar = ({ offer, onEnrol, isVisible, isSkeleton = false, labels }: StickyEnrolBarProps) => (
    <div
        data-tier="block"
        data-component="StickyEnrolBar"
        aria-hidden={!isVisible}
        className={cn(
            "fixed inset-x-0 bottom-0 z-40 border-t border-default bg-surface p-4 shadow-lg @app-md:hidden",
            "transition-[translate] duration-200 ease-out motion-reduce:transition-none",
            isVisible ? "translate-y-0" : "pointer-events-none translate-y-full",
        )}
    >
        <StackH
            principle="content-row" gap={4}
            justify="between"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <StackV
                        gap={1}
                        isSkeleton={isSkeleton}
                        classNames={["min-w-0"]}
                        items={[
                            () => <Typography size="sm" weight="semibold" truncate isSkeleton={isSkeleton} text={offer.title} />,
                            () => <Typography size="sm" color="accent" isSkeleton={isSkeleton} text={offer.priceText ?? labels.freeLabel} />,
                        ]}
                    />
                ),
                () => (
                    <Button
                        variant="primary"
                        size="md"
                        label={labels.ctaLabel}
                        onPress={onEnrol}
                        isDisabled={!isVisible}
                        isSkeleton={isSkeleton}
                    />
                ),
            ]}
        />
    </div>
)

export { StickyEnrolBar }

/** Source-level tier marker -- lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "StickyEnrolBar" } as const
