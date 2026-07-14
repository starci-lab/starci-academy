import type { Meta, StoryObj } from "@storybook/nextjs"
import { UserCell } from "./index"

const meta: Meta<typeof UserCell> = {
    title: "Blocks/UserCell",
    component: UserCell,
    args: {
        username: "levan.dev",
        displayName: "Le Van",
        avatar: null,
        handle: "@levan.dev",
        size: "sm",
    },
}

export default meta

type Story = StoryObj<typeof UserCell>

/** Base state: avatar (generated fallback) + display name + handle. */
export const Default: Story = {}

/** No `displayName` supplied — the primary label falls back to `username`. */
export const NoDisplayName: Story = {
    args: {
        username: "tranthib92",
        displayName: undefined,
        handle: "@tranthib92",
    },
}

/** No `handle` — only the primary name line renders. */
export const NoHandle: Story = {
    args: {
        username: "nguyenvana",
        displayName: "Nguyen Van A",
        handle: undefined,
    },
}

/** Uploaded avatar URL present — `UserAvatar` prefers it over the generated fallback. */
export const WithUploadedAvatar: Story = {
    args: {
        username: "phamthic",
        displayName: "Pham Thi C",
        avatar: "https://i.pravatar.cc/150?img=47",
        handle: "@phamthic",
    },
}

/** `size="md"` — larger avatar preset for denser-content contexts (e.g. profile headers). */
export const MediumSize: Story = {
    args: {
        username: "hoangvane",
        displayName: "Hoang Van E",
        handle: "@hoangvane",
        size: "md",
    },
}

/** Right-aligned `trailing` slot — e.g. a role/status label next to the cell. */
export const WithTrailing: Story = {
    args: {
        username: "dothif",
        displayName: "Do Thi F",
        handle: "@dothif",
        trailing: (
            <span className="text-xs font-medium text-warning">Admin</span>
        ),
    },
}

/** Long name/handle truncate instead of overflowing the row (`min-w-0` + `truncate`). */
export const LongNameTruncation: Story = {
    args: {
        username: "very.long.username.for.testing.truncation",
        displayName: "Nguyen Thi Truncation Test With A Very Long Display Name",
        handle: "@very.long.username.for.testing.truncation.overflow",
    },
    decorators: [
        (Story) => (
            <div className="w-48">
                <Story />
            </div>
        ),
    ],
}
