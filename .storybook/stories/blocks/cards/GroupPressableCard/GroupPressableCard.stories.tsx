import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Typography } from "@heroui/react"
import { CaretRightIcon } from "@phosphor-icons/react"
import { GroupPressableCard, type GroupPressableCardItem } from "./GroupPressableCard"
import type { VerdictBandVariant } from "../verdict-band"

const meta: Meta<typeof GroupPressableCard> = {
    title: "Primitives/Card/GroupPressableCard",
    component: GroupPressableCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof GroupPressableCard>

/**
 * Mock-content chuẩn cho MỌI story: khi ô `content` là một card có children bên
 * trong, đổ bằng ProfileCard — avatar + title + description (fixture chuẩn, neo
 * `AsyncContent`). Avatar đi TRONG `content` (slot `icon` chỉ cho icon thường).
 */
const profileTile = (initials: string, title: string, description: string) => (
    <div className="flex flex-row items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">{title}</span>
            <span className="truncate text-xs text-muted">{description}</span>
        </div>
    </div>
)

const MENTORS = [
    { initials: "SC", title: "StarCi Academy", description: "Học fullstack, system design và DevOps theo lộ trình phỏng vấn." },
    { initials: "QN", title: "Thầy Quang", description: "Mentor fullstack — review dự án và mock interview." },
    { initials: "MM", title: "Mia Mia English", description: "Luyện đề và học cụm từ theo phương pháp SM-2." },
    { initials: "DV", title: "DevOps Lab", description: "Thực hành 4-cloud với credentials thật." },
]

const profileItems: Array<GroupPressableCardItem> = MENTORS.map((m) => ({
    key: m.initials,
    onPress: () => {},
    label: m.title,
    content: profileTile(m.initials, m.title, m.description),
}))

/** Default: mỗi ô mở một đích riêng; cả grid là đường phụ trên màn hình (không phím tắt). Content = ProfileCard. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <GroupPressableCard ariaLabel="Mentors" columns={{ base: 1, sm: 2 }} items={profileItems} />
            </div>
        </div>
    ),
}

/**
 * `item.selected` — grid CHỌN (single-select): ô được chọn có **ring accent** bao quanh
 * (tương đương dấu check của row). Dùng khi grid là bộ chọn (chọn mentor/gói/avatar…),
 * không phải grid hành động.
 */
export const Selected: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <GroupPressableCard
                    ariaLabel="Chọn mentor"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems.map((item, index) => ({ ...item, selected: index === 1 }))}
                />
            </div>
        </div>
    ),
}

/**
 * `keyboardShortcut` — cả group là hành động CHÍNH của màn hình: phím số `1`–`N` chọn ô
 * không cần chuột. Bấm 1 đến 4 để chọn. Content = ProfileCard (thống nhất mock).
 */
export const KeyboardShortcut: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <GroupPressableCard
                    ariaLabel="Chọn mentor bằng phím số"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems}
                    keyboardShortcut
                />
            </div>
        </div>
    ),
}

/** All items `isDisabled` — một submit đang chạy: cả group bị khoá (phím tắt dừng), các ô vẫn hiện. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <GroupPressableCard
                    ariaLabel="Mentors"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems.map((item) => ({ ...item, isDisabled: true }))}
                />
            </div>
        </div>
    ),
}

const VERDICTS: Array<VerdictBandVariant> = ["success", "warning", "danger", "accent"]

/**
 * `withVerdict` mỗi ô — một dải TÍN HIỆU DATA bên trái mỗi tile (cùng band canonical với
 * `SectionCard`/`SurfaceListCardItem`), phủ lên content ProfileCard.
 */
export const Verdict: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <GroupPressableCard
                    ariaLabel="Mentors theo trạng thái"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems.map((item, index) => ({
                        ...item,
                        withVerdict: { enable: true, variant: VERDICTS[index] },
                    }))}
                />
            </div>
        </div>
    ),
}

/**
 * `@sm:col-start-2` — một pager card lẻ ghim vào cột phải (card trước bị thiếu). Dùng biến
 * CONTAINER đúng bước grid đạt 2 cột nên không rơi vào track ẩn. Thu hẹp cửa sổ: nó vẫn full-width ở 1 cột.
 */
export const PagerPinRight: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <GroupPressableCard
                    ariaLabel="Đi tới nội dung trước hoặc sau"
                    columns={{ base: 1, sm: 2 }}
                    items={[
                        {
                            key: "next",
                            href: "#",
                            className: "@sm:col-start-2",
                            content: (
                                <div className="flex items-center justify-between gap-3">
                                    <Typography type="body-sm" weight="medium">Next content</Typography>
                                    {/* Caret điều hướng: phosphor CaretRightIcon size-3 muted, KHÔNG trượt (§5a/§5b). */}
                                    <CaretRightIcon className="size-3 shrink-0 text-muted" aria-hidden focusable="false" />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}

/** STATE loading — `isSkeleton` tự vẽ mirror grid GENERIC (dot + 1 vạch, không giả định shape content), giữ đúng columns/gap/tile-chrome. Không Skeleton rời ngoài. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-2xl">
                <GroupPressableCard
                    ariaLabel="Mentors"
                    columns={{ base: 1, sm: 2 }}
                    items={profileItems}
                    isSkeleton
                />
            </div>
        </div>
    ),
}
