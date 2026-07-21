import type { Meta, StoryObj } from "@storybook/nextjs"
import { Typography } from "@heroui/react"
import { CaretRightIcon, GearIcon } from "@phosphor-icons/react"
import { GroupPressableCard, type GroupPressableCardItem } from "./GroupPressableCard"

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

const settingsItems: Array<GroupPressableCardItem> = ["Edit profile", "Appearance", "Security", "Notifications"].map((title) => ({
    key: title,
    onPress: () => {},
    className: "flex items-center gap-3",
    content: (
        <>
            <GearIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
            <Typography type="body-sm" weight="medium" truncate>{title}</Typography>
        </>
    ),
}))

/** SM-2 grade tile content — a value + label + hint, mirroring a flashcard rating option. */
const rateTile = (grade: number, label: string, hint: string) => (
    <div className="flex flex-col gap-1 text-center">
        <span className="text-sm font-semibold text-foreground">{grade + 1}. {label}</span>
        <span className="text-xs text-muted">{hint}</span>
    </div>
)

const ratingItems: Array<GroupPressableCardItem> = [
    { grade: 0, label: "Forgot", hint: "Review now" },
    { grade: 1, label: "Hard", hint: "In 10 minutes" },
    { grade: 2, label: "Good", hint: "In 1 day" },
    { grade: 3, label: "Easy", hint: "In 4 days" },
].map((o) => ({
    key: o.label,
    onPress: () => {},
    label: `${o.label} — ${o.hint}`,
    content: rateTile(o.grade, o.label, o.hint),
}))

/** Default: each cell opens its own destination; the whole grid is a secondary path on the screen (no shortcut). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <GroupPressableCard ariaLabel="Settings pages" columns={{ base: 1, sm: 2 }} items={settingsItems} />
            </div>
        </div>
    ),
}

/**
 * `keyboardShortcut` — the group is the screen's PRIMARY action (a flashcard rating bar):
 * number keys 1–N drive it without the mouse. Try pressing 1 to 4.
 */
export const KeyboardShortcut: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <GroupPressableCard
                    ariaLabel="Rate how well you remembered this card"
                    columns={{ base: 2, sm: 4 }}
                    items={ratingItems}
                    keyboardShortcut
                />
            </div>
        </div>
    ),
}

/** All items `isDisabled` — a submit is in flight: the whole group is locked (and the shortcut stops), options still visible. */
export const Disabled: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <GroupPressableCard
                    ariaLabel="Settings pages"
                    columns={{ base: 1, sm: 2 }}
                    items={settingsItems.map((item) => ({ ...item, isDisabled: true }))}
                />
            </div>
        </div>
    ),
}

/**
 * `withVerdict` per item — a LEFT DATA-signal band on each tile (e.g. the SM-2 recall tier),
 * the same canonical band as `SectionCard`/`SurfaceListCardItem`.
 */
export const Verdict: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <GroupPressableCard
                    ariaLabel="Chủ đề theo mức ghi nhớ"
                    columns={{ base: 1, sm: 2 }}
                    items={[
                        { key: "a", onPress: () => {}, withVerdict: { enable: true, variant: "success" }, content: <Typography type="body-sm" weight="medium">Shell & hệ thống file</Typography> },
                        { key: "b", onPress: () => {}, withVerdict: { enable: true, variant: "warning" }, content: <Typography type="body-sm" weight="medium">Redirect & pipe</Typography> },
                        { key: "c", onPress: () => {}, withVerdict: { enable: true, variant: "danger" }, content: <Typography type="body-sm" weight="medium">Quyền file cơ bản</Typography> },
                        { key: "d", onPress: () => {}, withVerdict: { enable: true, color: "amber-500" }, content: <Typography type="body-sm" weight="medium">Cron & scheduling</Typography> },
                    ]}
                />
            </div>
        </div>
    ),
}

/**
 * `@sm:col-start-2` — a lone pager card pinned to the right column (previous card missing).
 * Uses the CONTAINER variant at the SAME step the grid actually reaches 2 columns, so it never
 * lands in an implicit, content-sized track. Narrow the window: it stays full-width at 1 column.
 */
export const PagerPinRight: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <GroupPressableCard
                    ariaLabel="Go to previous or next content"
                    columns={{ base: 1, sm: 2 }}
                    items={[
                        {
                            key: "next",
                            href: "#",
                            className: "@sm:col-start-2",
                            content: (
                                <div className="flex items-center justify-end gap-2">
                                    <Typography type="body-sm" weight="medium">Next content</Typography>
                                    <CaretRightIcon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                                </div>
                            ),
                        },
                    ]}
                />
            </div>
        </div>
    ),
}
