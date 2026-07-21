import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    CheckCircleIcon,
    RocketLaunchIcon,
    WarningIcon,
} from "@phosphor-icons/react"
import { IconTile } from "./IconTile"

const meta: Meta<typeof IconTile> = {
    title: "Primitives/Identity/IconTile",
    component: IconTile,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof IconTile>

// Stable local data-URI cover so the image-fill state renders without an external host.
const COVER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='128' height='128'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%23FB59A7'/%3E%3Cstop offset='1' stop-color='%234F46E5'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='128' height='128' fill='url(%23g)'/%3E%3C/svg%3E"

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<BookOpenIcon />} />
        </div>
    ),
}

export const ToneAccent: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<RocketLaunchIcon />} tone="accent" />
        </div>
    ),
}

export const ToneSuccess: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<CheckCircleIcon />} tone="success" />
        </div>
    ),
}

export const ToneWarning: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<WarningIcon />} tone="warning" />
        </div>
    ),
}

export const ToneDanger: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<WarningIcon />} tone="danger" />
        </div>
    ),
}

export const ToneNeutral: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<BookOpenIcon />} tone="neutral" />
        </div>
    ),
}

export const SizeSm: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<BookOpenIcon />} size="sm" />
        </div>
    ),
}

export const SizeMd: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<BookOpenIcon />} size="md" />
        </div>
    ),
}

export const SizeLg: Story = {
    render: () => (
        <div className="p-8">
            <IconTile icon={<BookOpenIcon />} size="lg" />
        </div>
    ),
}

export const WithCoverImage: Story = {
    render: () => (
        <div className="p-8">
            <IconTile
                icon={<BookOpenIcon />}
                src={COVER}
                alt="Fullstack Mastery track"
                size="lg"
            />
        </div>
    ),
}

export const BrokenCoverFallsBackToIcon: Story = {
    render: () => (
        <div className="p-8">
            <IconTile
                icon={<BookOpenIcon />}
                src="https://invalid.starci.example/not-found.jpg"
                alt="Cover image failed to load"
                size="lg"
                tone="neutral"
            />
        </div>
    ),
}
