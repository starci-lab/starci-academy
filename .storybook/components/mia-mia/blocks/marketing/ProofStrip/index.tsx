import React from "react"
import { cn } from "../../../_cn"

/** One value-over-label proof cell. */
export interface ProofItem {
    /** Stable key. */
    key: string
    /** The headline figure (e.g. `39`, `Mia`, `Live`). */
    value: string
    /** What the figure counts. */
    label: string
}

/** Props for {@link ProofStrip}. */
export interface ProofStripProps {
    /** The proof cells, laid two-up on mobile and four-up from `md`. */
    items: ProofItem[]
}

/**
 * The full-bleed proof bar: a pink band of value-over-label cells, vertically ruled on
 * wider screens. It sits directly under the hero to back the promise with numbers.
 * Presentational and props-only; the caller supplies the figures. Colour is `var(--nb-*)`.
 *
 * @param props - {@link ProofStripProps}
 * @see Story: .storybook/stories/mia-mia/blocks/marketing/ProofStrip/ProofStrip.stories
 */
export const ProofStrip = ({ items }: ProofStripProps) => (
    <section className="border-y-2 border-[var(--nb-ink)] bg-[var(--nb-pink)] text-white">
        <div className="mx-auto grid max-w-6xl grid-cols-2 md:grid-cols-4">
            {items.map((item, i) => (
                <div
                    key={item.key}
                    className={cn(
                        "flex flex-col gap-1 px-6 py-6 text-center",
                        i < items.length - 1 && "md:border-r-2 md:border-white/40",
                    )}
                >
                    <div className="text-3xl font-extrabold leading-none">{item.value}</div>
                    <div className="font-semibold opacity-95">{item.label}</div>
                </div>
            ))}
        </div>
    </section>
)
