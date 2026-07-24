import type { Meta, StoryObj } from "@storybook/nextjs"
import { Avatar, AvatarFallback, Button } from "@heroui/react"
import { PressableCard } from "./PressableCard"

const meta: Meta<typeof PressableCard> = {
    title: "Primitives/Cards/PressableCard",
    component: PressableCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PressableCard>

/**
 * Fixture chuẩn (C-fixture) = ProfileCard (avatar + title + description). LƯU Ý:
 * `PressableCard` tự vẽ khung card (surface/rounded-3xl/p-3/shadow-surface), nên
 * ở đây KHÔNG bọc thêm `Card`/`CardContent` ngoài — chỉ giữ row bên trong, tránh
 * card-in-card.
 */
const ProfileRow = () => (
    <div className="flex items-center gap-3">
        <Avatar className="size-10 shrink-0">
            <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div className="flex min-w-0 flex-col">
            <span className="truncate text-sm font-medium">StarCi Academy</span>
            <span className="truncate text-xs text-muted">
                Học fullstack, system design và DevOps theo lộ trình phỏng vấn.
            </span>
        </div>
    </div>
)

/** Default: a nav tile — the whole card is ONE press target and its children are its accessible name. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <PressableCard onPress={() => {}}>
                    <ProfileRow />
                </PressableCard>
            </div>
        </div>
    ),
}

/** `href` — the whole card is a single accessible link (navigates on click). */
export const AsLink: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <PressableCard href="#">
                    <ProfileRow />
                </PressableCard>
            </div>
        </div>
    ),
}

/**
 * `actions` + `label` — a second, independent press area inside the card (stretched-link):
 * a transparent whole-card overlay UNDER the actions, so the CTA + menu stay separately clickable.
 */
export const WithActions: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <PressableCard
                    onPress={() => {}}
                    label="Open the StarCi Academy profile"
                    actions={(
                        <>
                            <Button size="sm" variant="secondary" onPress={() => {}}>Continue</Button>
                            <Button size="sm" variant="tertiary" isIconOnly aria-label="More options" onPress={() => {}}>⋯</Button>
                        </>
                    )}
                >
                    <ProfileRow />
                </PressableCard>
            </div>
        </div>
    ),
}

/** `isDisabled` — a temporarily-unavailable option: dimmed + non-interactive, still visible so its existence reads. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <PressableCard isDisabled onPress={() => {}}>
                    <ProfileRow />
                </PressableCard>
            </div>
        </div>
    ),
}

/** Đang tải — `isSkeleton` tự vẽ mirror (khối icon + 2 dòng chữ), không cần Skeleton rời. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <PressableCard isSkeleton>
                    <ProfileRow />
                </PressableCard>
            </div>
        </div>
    ),
}
