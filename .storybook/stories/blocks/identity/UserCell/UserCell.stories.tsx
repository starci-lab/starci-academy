import type { Meta, StoryObj } from "@storybook/nextjs"
import { Chip } from "@heroui/react"
import { UserCell } from "@sb-components/blocks/identity/UserCell/UserCell"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof UserCell> = {
    title: "Primitives/Identity/UserCell",
    component: UserCell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof UserCell>

// Stable local data-URI "photo" so the uploaded-image path renders without an external host.
const PHOTO =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect width='96' height='96' fill='%23DB2777'/%3E%3Ccircle cx='48' cy='38' r='18' fill='white'/%3E%3Cpath d='M16 90a32 32 0 0 1 64 0z' fill='white'/%3E%3C/svg%3E"

// leaf WITH handle (Small/Medium/RealAvatar/LongNameNarrow): avatar + tên + @handle.
const WITH_HANDLE_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar (uploaded→generated→initials fallback)" },
    { name: "Typography", tier: "primitive", role: "tên hiển thị (displayName ?? username)" },
    { name: "Typography", tier: "primitive", role: "@handle (muted) — khi có `handle`" },
]

// leaf NO HANDLE: chỉ avatar + tên, bỏ dòng handle.
const BASE_PARTS: Array<AnatomyNode> = [
    { name: "UserAvatar", tier: "primitive", role: "avatar (uploaded→generated→initials fallback)" },
    { name: "Typography", tier: "primitive", role: "tên hiển thị (displayName ?? username)" },
]

// leaf WITH TRAILING: thêm slot phải (vd Chip trạng thái).
const WITH_TRAILING_PARTS: Array<AnatomyNode> = [
    ...WITH_HANDLE_PARTS,
    { name: "Trailing", tier: "primitive", role: "slot phải (vd Chip vai trò), đẩy về mép phải bằng ml-auto" },
]

export const Small: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="UserCell" tier="primitive" leaf="Small" parts={WITH_HANDLE_PARTS}>
                <UserCell
                    username="levan.dev"
                    displayName="Ethan Vaughn"
                    avatar={null}
                    handle="@levan.dev"
                    size="sm"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

export const Medium: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="UserCell" tier="primitive" leaf="Medium" parts={WITH_HANDLE_PARTS}>
                <UserCell
                    username="levan.dev"
                    displayName="Ethan Vaughn"
                    avatar={null}
                    handle="@levan.dev"
                    size="md"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

export const NoHandle: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="UserCell" tier="primitive" leaf="NoHandle" parts={BASE_PARTS} note="Không truyền `handle` → dòng @handle không render, chỉ còn avatar + tên.">
                <UserCell
                    username="jamesanderson"
                    displayName="James Anderson"
                    avatar={null}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

export const RealAvatar: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="UserCell" tier="primitive" leaf="RealAvatar" parts={WITH_HANDLE_PARTS} note="avatar thật (uploaded) — UserAvatar tự ưu tiên ảnh upload trước fallback.">
                <UserCell
                    username="sophiachen"
                    displayName="Sophia Chen"
                    avatar={PHOTO}
                    handle="@sophiachen"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

export const WithTrailing: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="UserCell" tier="primitive" leaf="WithTrailing" parts={WITH_TRAILING_PARTS}>
                <UserCell
                    username="emmafoster"
                    displayName="Emma Foster"
                    avatar={null}
                    handle="@emmafoster"
                    trailing={<Chip size="sm" variant="soft" color="warning">Admin</Chip>}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

export const LongNameNarrow: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-48">
                <BlockAnatomy name="UserCell" tier="primitive" leaf="LongNameNarrow" parts={WITH_HANDLE_PARTS} note="tên/handle dài trong khung hẹp — cả hai dòng truncate (min-w-0), cùng composition với Small.">
                    <UserCell
                        username="very.long.username.for.testing.truncation"
                        displayName="Alexandra Wellington-Fairchild With An Exceptionally Long Display Name For Testing Truncation"
                        avatar={null}
                        handle="@very.long.username.for.testing.truncation.overflow"
                        showAnatomy
                    />
                </BlockAnatomy>
            </div>
        </div>
    ),
}
