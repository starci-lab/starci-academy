import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    BookOpenIcon,
    CodeIcon,
    FileTsIcon,
    FlagIcon,
    PuzzlePieceIcon,
    TrophyIcon,
} from "@phosphor-icons/react"
import { SegmentedToggle, type SegmentedToggleOption } from "./SegmentedToggle"

const meta: Meta<typeof SegmentedToggle> = {
    title: "Primitives/Navigation/SegmentedToggle",
    component: SegmentedToggle,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof SegmentedToggle>

const CATEGORY_OPTIONS: Array<SegmentedToggleOption<string>> = [
    { value: "total", label: "Tổng", icon: <TrophyIcon /> },
    { value: "challenge", label: "Challenge", icon: <PuzzlePieceIcon /> },
    { value: "reading", label: "Reading", icon: <BookOpenIcon /> },
    { value: "milestone", label: "Milestone", icon: <FlagIcon /> },
]

const LANGUAGE_OPTIONS: Array<SegmentedToggleOption<string>> = [
    { value: "typescript", label: "TypeScript", icon: <FileTsIcon /> },
    { value: "java", label: "Java", icon: <CodeIcon /> },
    { value: "csharp", label: "C#", icon: <CodeIcon /> },
]

const TAB_OPTIONS: Array<SegmentedToggleOption<string>> = [
    { value: "account", label: "Account" },
    { value: "learning", label: "Learning" },
    { value: "ai", label: "AI" },
    { value: "billing", label: "Billing", isDisabled: true },
]

/** Owns selection state so the story is interactive (the primitive is fully controlled). */
const Controlled = <T extends string>(props: {
    options: Array<SegmentedToggleOption<T>>
    initialValue: T
    size?: "sm" | "md"
    fullWidth?: boolean
    ariaLabel: string
}) => {
    const [value, setValue] = useState<T>(props.initialValue)
    return (
        <SegmentedToggle
            options={props.options}
            value={value}
            onChange={setValue}
            size={props.size}
            fullWidth={props.fullWidth}
            ariaLabel={props.ariaLabel}
        />
    )
}

/** Default: `md` size, no icons, middle option selected. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <Controlled options={TAB_OPTIONS.slice(0, 3)} initialValue="learning" ariaLabel="Select settings tab" />
        </div>
    ),
}

/** Leading icons — mirrors the `LeaderboardCategoryRail` `chips` variant (category + viewer XP rail). */
export const WithIcons: Story = {
    render: () => (
        <div className="p-8">
            <Controlled options={CATEGORY_OPTIONS} initialValue="total" ariaLabel="Select leaderboard category" />
        </div>
    ),
}

/** Selected pill — accent-soft tint + accent ring; unselected stays a plain `border-default` pill (no hover-bg, §7). */
export const Selected: Story = {
    render: () => (
        <div className="p-8">
            <Controlled options={LANGUAGE_OPTIONS} initialValue="java" ariaLabel="Select language" size="sm" />
        </div>
    ),
}

/** `isDisabled` on one option — dimmed + non-interactive, stays visible in place (e.g. an unreleased tab). */
export const WithDisabled: Story = {
    render: () => (
        <div className="p-8">
            <Controlled options={TAB_OPTIONS} initialValue="account" ariaLabel="Select settings tab" />
        </div>
    ),
}

/** `fullWidth` — the row stretches edge-to-edge, each pill sharing it equally (`flex-1`); mirrors `SettingsLayout`'s mobile pill nav. */
export const FullWidth: Story = {
    render: () => (
        <div className="p-8">
            <Controlled options={TAB_OPTIONS.slice(0, 3)} initialValue="ai" ariaLabel="Select settings tab" fullWidth />
        </div>
    ),
}

/** `size="sm"` — the compact scale (text-xs, `size-4` icons). */
export const Small: Story = {
    render: () => (
        <div className="p-8">
            <Controlled options={CATEGORY_OPTIONS} initialValue="challenge" ariaLabel="Select leaderboard category" size="sm" />
        </div>
    ),
}

/** `isSkeleton` — a row of pill placeholders sized to the real pill box, same count as `options`. */
export const SkeletonState: Story = {
    render: () => (
        <div className="p-8">
            <SegmentedToggle
                options={TAB_OPTIONS.slice(0, 3)}
                value="account"
                onChange={() => {}}
                ariaLabel="Select settings tab"
                isSkeleton
            />
        </div>
    ),
}
