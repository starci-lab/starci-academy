import type { Meta, StoryObj } from "@storybook/nextjs"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"
import { PriceTag } from "@/components/blocks/commerce/PriceTag"

/**
 * PriceTag — the single source of truth for showing a course/product price: the
 * discounted amount, the struck list price (only when there's a real saving), and a
 * `−X%` saving chip. When a `breakdown` is given, the chip renders AS a button (chip
 * style) that opens a Popover explaining the saving (phase tier + loyalty → you pay) —
 * click/tap, so it works on touch too (not hover).
 */
const meta: Meta<typeof PriceTag> = {
    title: "Features/Commerce/PriceTag",
    component: PriceTag,
    parameters: { layout: "centered" },
}

export default meta

type Story = StoryObj<typeof PriceTag>

/** Use when the course has no discount — shows the sale price only, no strikethrough, no chip. */
export const Default: Story = {
    args: { discounted: 1990000 },
    parameters: { usage: "No discount — shows the sale price only, no strikethrough or chip." },
}

/** Use when the course is on sale — struck list price + a `−X%` chip. The chip is a button; click/tap it to open the price breakdown. */
export const WithDiscount: Story = {
    args: {
        discounted: 1290000,
        original: 1990000,
        breakdown: { phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" },
    },
    parameters: {
        usage: "On sale — struck list price + a `−X%` chip. The chip is a button; click/tap it to open the price breakdown Popover.",
    },
}

/** Pick the size by context: `sm` for dense lists (course comparison rows), `md` for the default course card, `lg` for a hero / checkout page. */
export const Sizes: Story = {
    parameters: {
        usage: "Pick size by context: `sm` for dense lists, `md` for the default card, `lg` for hero/checkout.",
    },
    render: () => (
        <div className="flex flex-col items-start gap-4">
            <PriceTag
                discounted={1490000}
                original={1990000}
                size="sm"
                breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
            />
            <PriceTag
                discounted={1490000}
                original={1990000}
                size="md"
                breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
            />
            <PriceTag
                discounted={1490000}
                original={1990000}
                size="lg"
                breakdown={{ phase: 1690000, phaseLabel: "Early-bird", loyaltyPercent: 12 }}
            />
        </div>
    ),
}

/** Use for international / USD-listed courses — only the currency symbol and formatting change, no conversion. */
export const CurrencyUsd: Story = {
    args: {
        discounted: 79,
        original: 129,
        currency: "USD",
        breakdown: { phase: 99, phaseLabel: "Early-bird", loyaltyPercent: 20 },
    },
    parameters: {
        usage: "International / USD-listed courses — only the symbol and format change, no conversion.",
    },
}

/**
 * The price-breakdown Popover shown OPEN — the `play` clicks the `−X%` chip (which is a
 * button, not a hover-Tooltip) so the panel renders on the canvas / in a Chromatic snapshot
 * without needing a hover.
 */
export const BreakdownOpen: Story = {
    args: {
        discounted: 1290000,
        original: 1990000,
        breakdown: { phase: 1590000, phaseLabel: "Early-bird", loyaltyPercent: 15, loyaltyNote: "owns 2 courses" },
    },
    parameters: {
        usage: "The breakdown Popover shown open (click the `−X%` chip) — no hover needed, works on touch.",
    },
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement)
        // the chip is the only button in this story; click it to open the Popover
        await userEvent.click(canvas.getByRole("button"))
        await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument())
    },
}
