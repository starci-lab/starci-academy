import type { Meta, StoryObj } from "@storybook/nextjs"
import { BuildingOfficeIcon } from "@phosphor-icons/react"
import { RemovableToken } from "./RemovableToken"

const meta: Meta<typeof RemovableToken> = {
    title: "Primitives/Chips/RemovableToken",
    component: RemovableToken,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof RemovableToken>

/** Default: bare label, no trailing affordance — a plain read-only token. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <RemovableToken label="Acme Corp" />
        </div>
    ),
}

/**
 * WithLeadingIcon: `icon` renders a leading glyph before the label — passed
 * TRẦN (no `size-*`), the row forces it to `size-4` to match the label scale.
 */
export const WithLeadingIcon: Story = {
    render: () => (
        <div className="p-8">
            <RemovableToken
                label="Acme Corp"
                icon={<BuildingOfficeIcon aria-hidden focusable="false" />}
            />
        </div>
    ),
}

/**
 * EditAffordance: `onEdit` renders the ground-truth "Change" button (× icon +
 * text) — the `CompanySection` picked-company row, ported 1:1. Used when
 * clearing the token means "go re-pick", not "delete outright".
 */
export const EditAffordance: Story = {
    render: () => (
        <div className="p-8">
            <RemovableToken
                label="Acme Corp"
                icon={<BuildingOfficeIcon aria-hidden focusable="false" />}
                onEdit={() => {}}
                editLabel="Change"
            />
        </div>
    ),
}

/**
 * Removable: `onRemove` renders a compact trailing × (chip's own scale) — for
 * outright deleting the token (e.g. a selected filter/tag), not re-picking.
 */
export const Removable: Story = {
    render: () => (
        <div className="p-8">
            <RemovableToken label="Senior React Developer" onRemove={() => {}} removeLabel="Remove tag" />
        </div>
    ),
}

/** Disabled: both affordances are inert and the row dims. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <RemovableToken
                label="Acme Corp"
                icon={<BuildingOfficeIcon aria-hidden focusable="false" />}
                onEdit={() => {}}
                isDisabled
            />
        </div>
    ),
}

/** Loading: `isSkeleton` mirrors the row frame (border + radius) with placeholder bars. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <RemovableToken label="Acme Corp" isSkeleton />
        </div>
    ),
}
