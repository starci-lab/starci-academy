import type { Meta, StoryObj } from "@storybook/nextjs"
import { Logo } from "@sb-components/atoms/display/Logo/Logo"

const meta: Meta<typeof Logo.Base> = {
    title: "Atoms/Display/Logo",
    component: Logo.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Logo.Base>

export const DefaultH9: Story = {
    render: () => (
        <div className="p-8">
            <Logo.Base className="h-9" />
        </div>
    ),
}

export const LockupH10: Story = {
    render: () => (
        <div className="p-8">
            <Logo.Base className="h-10" />
        </div>
    ),
}

export const SplashH14: Story = {
    render: () => (
        <div className="p-8">
            <Logo.Base className="h-14" />
        </div>
    ),
}

export const OnDarkSurface: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex w-fit items-center rounded-lg bg-neutral-950 p-8">
                <Logo.Base className="h-10" />
            </div>
        </div>
    ),
}
