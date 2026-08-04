import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    StickyEnrolBar,
    type StickyEnrolBarLabels,
    type StickyEnrolBarOffer,
} from "@sb-components/nivoexpert/blocks/landing/StickyEnrolBar/StickyEnrolBar"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `StickyEnrolBar` — the mobile sticky bottom CTA bar: the primary offer's title
 * + real price pinned to the viewport bottom, one always-reachable Enrol button
 * beside it. `isVisible` is CALLER-CONTROLLED (same convention as the shared
 * `BackToTop` atom) — this block owns no scroll listener of its own, so both the
 * shown and hidden look stay demoable here with no real scroll behind them. Built
 * on the shared HeroUI atom system (`Typography` / `Button`).
 */
const meta: Meta<typeof StickyEnrolBar> = {
    title: "NivoExpert/Blocks/Landing/StickyEnrolBar/StickyEnrolBar",
    component: StickyEnrolBar,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof StickyEnrolBar>

const LABELS: StickyEnrolBarLabels = {
    freeLabel: "Free",
    ctaLabel: "Enrol now",
}

const OFFER: StickyEnrolBarOffer = {
    title: "Launch in Eight Sessions",
    priceText: "$129",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Typography: { tier: "atom", role: "the offer's title and real price line" },
    Button: { tier: "atom", role: "the bar's one Enrol CTA — disabled while the bar is hidden" },
}

/**
 * `renderClassName` here holds a fixed-height RELATIVE box so the fixed-positioned
 * bar has somewhere legible to sit inside the canvas instead of pinning to the
 * real browser viewport edge, the way it would in the shipped page.
 */
const STAGE_CLASSNAME = "relative mx-auto h-40 w-full max-w-sm overflow-hidden rounded-2xl border border-default bg-background"

/** LEAF — one shape; the offer / isVisible / isSkeleton are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="StickyEnrolBar"
                tier="block"
                leaf="Sticky bar"
                annotate={ANNOTATE}
                renderClassName={STAGE_CLASSNAME}
                reason="`isVisible` is a CONTROLLED prop, not a self-managed scroll listener — the caller (the landing shell / connected layer) owns the scroll-threshold decision, mirroring the shared `BackToTop` atom's own contract. The bar hides itself past the `@app-md` container step: on a wide viewport the hero/offer CTA is already on screen, so a second floating bar there would only compete with it."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The offer hasn't resolved yet: title and price shimmer, the CTA stops accepting presses.",
                        code: "<StickyEnrolBar offer={offer} onEnrol={onEnrol} isVisible isSkeleton labels={labels} />",
                        render: <StickyEnrolBar offer={OFFER} onEnrol={() => {}} isVisible isSkeleton labels={LABELS} />,
                    },
                    {
                        name: "isVisible = true",
                        why: "Past the caller's own scroll threshold (e.g. once the hero's own CTA scrolls out of view) — the bar slides into view and its CTA is reachable.",
                        code: "<StickyEnrolBar offer={offer} onEnrol={onEnrol} isVisible labels={labels} />",
                        render: <StickyEnrolBar offer={OFFER} onEnrol={() => {}} isVisible labels={LABELS} />,
                    },
                    {
                        name: "isVisible = false",
                        why: "Above the caller's scroll threshold (e.g. the hero's own CTA is still on screen) — the bar sits off-screen and its CTA stops accepting presses/focus, so it never competes with the CTA already visible.",
                        code: "<StickyEnrolBar offer={offer} onEnrol={onEnrol} isVisible={false} labels={labels} />",
                        render: <StickyEnrolBar offer={OFFER} onEnrol={() => {}} isVisible={false} labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}
