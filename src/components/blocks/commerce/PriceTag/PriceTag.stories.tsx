import type { Meta, StoryObj } from "@storybook/nextjs"
import { PriceTag } from "./index"

const meta: Meta<typeof PriceTag> = {
    title: "Blocks/PriceTag",
    component: PriceTag,
    parameters: {
        layout: "centered",
    },
}

export default meta

type Story = StoryObj<typeof PriceTag>

/** Plain price, no discount, no breakdown — the baseline case. */
export const Default: Story = {
    args: {
        discounted: 1990000,
    },
}

/** Discounted price with the list price struck through and a −X% success chip. */
export const WithDiscount: Story = {
    args: {
        discounted: 1490000,
        original: 1990000,
    },
}

/** Hovering the chip opens a tooltip breaking the saving into phase tier + loyalty → you pay. */
export const WithBreakdown: Story = {
    args: {
        discounted: 1290000,
        original: 1990000,
        breakdown: {
            phase: 1590000,
            phaseLabel: "Early-bird",
            loyaltyPercent: 15,
            loyaltyNote: "đã sở hữu 2 khóa",
        },
    },
}

/** Breakdown with no phase label and no loyalty note — the minimal breakdown shape. */
export const WithBreakdownMinimal: Story = {
    args: {
        discounted: 1690000,
        original: 1990000,
        breakdown: {
            phase: 1690000,
            loyaltyPercent: 0,
        },
    },
}

/** Small size — used inline in dense rows (e.g. list items). */
export const SizeSmall: Story = {
    args: {
        discounted: 1490000,
        original: 1990000,
        size: "sm",
    },
}

/** Medium size — the default scale used in most cards. */
export const SizeMedium: Story = {
    args: {
        discounted: 1490000,
        original: 1990000,
        size: "md",
    },
}

/** Large size — used on hero/checkout surfaces where the price is the focal point. */
export const SizeLarge: Story = {
    args: {
        discounted: 1490000,
        original: 1990000,
        size: "lg",
    },
}

/** USD currency formatting. */
export const CurrencyUsd: Story = {
    args: {
        discounted: 79,
        original: 129,
        currency: "USD",
    },
}
