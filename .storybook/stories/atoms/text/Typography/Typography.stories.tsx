import type { Meta } from "@storybook/nextjs"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { makeTypographyLeaves, TYPOGRAPHY_RULES } from "./_leaves"

const meta: Meta<typeof Typography> = {
    title: "Atoms/Text/Typography/Typography",
    component: Typography,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: TYPOGRAPHY_RULES } },
    },
}

export default meta

const L = makeTypographyLeaves(Typography, "Typography")

export const Plain = L.Plain
export const Colors = L.Colors
export const Bold = L.Bold
export const Link = L.Link
export const WithPrefixIcon = L.WithPrefixIcon
export const WithBothIcons = L.WithBothIcons
export const CtaArrow = L.CtaArrow
export const Truncate = L.Truncate
export const Numeric = L.Numeric
export const Loading = L.Loading
