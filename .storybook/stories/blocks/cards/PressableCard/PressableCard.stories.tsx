import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { RocketLaunchIcon } from "@phosphor-icons/react"
import { PressableCard } from "./PressableCard"

const meta: Meta<typeof PressableCard> = {
    title: "Primitives/Card/PressableCard",
    component: PressableCard,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof PressableCard>

/** Generic navigation-tile content — a leading icon tile + title + subtitle. */
const NavTileContent = () => (
    <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft">
            <RocketLaunchIcon className="size-5 text-accent-soft-foreground" aria-hidden focusable="false" />
        </div>
        <div className="flex flex-col">
            <span className="text-sm font-medium text-foreground">Fullstack Mastery roadmap</span>
            <span className="text-xs text-muted">12 modules · 48 lessons</span>
        </div>
    </div>
)

/** Generic option-card content — used for "pick a card" demos. */
const OptionCardContent = ({ label, price }: { label: string; price: string }) => (
    <div className="flex flex-col gap-1">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="text-xs text-muted">{price}</span>
    </div>
)

/** Default: a nav tile — the whole card is ONE press target and its children are its accessible name. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <PressableCard onPress={() => {}}>
                    <NavTileContent />
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
                    <NavTileContent />
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
                    label="Open the Fullstack Mastery path"
                    actions={(
                        <>
                            <Button size="sm" variant="secondary" onPress={() => {}}>Continue</Button>
                            <Button size="sm" variant="tertiary" isIconOnly aria-label="More options" onPress={() => {}}>⋯</Button>
                        </>
                    )}
                >
                    <NavTileContent />
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
                    <OptionCardContent label="12-month plan (out of slots)" price="3,490,000đ" />
                </PressableCard>
            </div>
        </div>
    ),
}
