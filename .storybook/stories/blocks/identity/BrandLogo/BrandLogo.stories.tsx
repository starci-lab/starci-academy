import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { BrandLogo } from "./BrandLogo"

const meta: Meta<typeof BrandLogo> = {
    title: "Primitives/Identity/BrandLogo",
    component: BrandLogo,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof BrandLogo>

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BrandLogo />
        </div>
    ),
}

export const OnDarkSurface: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex w-fit items-center rounded-lg bg-neutral-950 p-8">
                <BrandLogo />
            </div>
        </div>
    ),
}

export const InNavbar: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex w-full max-w-md items-center justify-between rounded-lg border border-default px-4 py-3">
                <div className="flex items-center gap-2">
                    <BrandLogo />
                    <Typography type="body-sm" weight="medium">
                        StarCi Academy
                    </Typography>
                </div>
                <Typography type="body-xs" color="muted">
                    Khoá học
                </Typography>
            </div>
        </div>
    ),
}
