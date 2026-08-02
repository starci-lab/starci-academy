import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography as HeroTypography } from "@heroui/react"
import { ContentAiChatDrawer, type ContentAiChatDrawerMode } from "@sb-components/starci/overlays/drawers/ContentAiChatDrawer/ContentAiChatDrawer"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContentAiChatDrawer` — the global "ask StarCi AI" chat panel in drawer
 * presentation. Presentational overlay only: `isOpen`/`onOpenChange` are plain
 * props, the overlay-store wiring lives in the mounting layout. Two structural
 * leaves by header shape: the mode switch present (desktop, where rail⇄drawer
 * is a real choice) versus absent (forced mobile). Which title text shows
 * (caller-supplied vs the block's fallback) is a data state. The chat body is a
 * placeholder (`SurfaceCard` + `EmptyState`) standing in for the real
 * `ChatThread`/`ChatComposer` blocks.
 */
const meta: Meta<typeof ContentAiChatDrawer> = {
    title: "StarCi/Overlays/Drawers/ContentAiChatDrawer/ContentAiChatDrawer",
    component: ContentAiChatDrawer,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentAiChatDrawer>

/** Parts common to every leaf: the shell's own heroui chrome + this block's header row. */
const SHELL_PARTS: Array<AnatomyNode> = [
    { name: "Drawer.CloseTrigger", tier: "heroui", role: "the close button, in the upper-right corner" },
    { name: "Drawer.Header", tier: "heroui", role: "wraps this block's own custom header row (title + optional mode switch)" },
    { name: "StackH", tier: "frame", role: "the horizontal row holding the title and the mode switch, owning the seam and the pr-8 room for the close button", storyId: "frames-stack-stackh--default" },
    { name: "Typography", tier: "atom", role: "the drawer's title — the caller's lesson/course title, or the block's fixed fallback wording", storyId: "atoms-text-typography-typography--plain" },
]

const MODE_SWITCH_PART: AnatomyNode = {
    name: "ButtonRadioGroup",
    tier: "atom",
    role: "the rail⇄drawer presentation switch, icon-only, single-select",
    storyId: "composites-buttons-buttonradiogroup--default",
}

const BODY_PARTS: Array<AnatomyNode> = [
    { name: "Drawer.Body", tier: "heroui", role: "the drawer's scrollable body region" },
    { name: "SurfaceCard", tier: "composite", role: "the bounded face standing in for the real chat panel's outer shell", storyId: "composites-cards-surfacecard-surfacecard--default" },
    { name: "EmptyState", tier: "composite", role: "the scope-cut gap message — icon + honest title/description — replacing ChatThread/ChatComposer", storyId: "composites-feedback-emptystate-emptystate--description" },
]

/** Controlled wrapper — opens on mount; the trigger reopens after a close. Mirrors `DrawerShell`'s own story helper. */
const ControlledDrawer = ({
    label,
    hint,
    leaf,
    parts,
    reason,
    stateName,
    why,
    code,
    title,
    placement,
    mode: initialMode,
    withModeSwitch,
}: {
    label: string
    hint: string
    leaf: string
    parts: Array<AnatomyNode>
    reason?: string
    stateName: string
    why: string
    code: string
    title?: string
    placement?: "right" | "bottom"
    mode?: ContentAiChatDrawerMode
    withModeSwitch: boolean
}) => {
    const [isOpen, setIsOpen] = useState(true)
    const [mode, setMode] = useState<ContentAiChatDrawerMode>(initialMode ?? "drawer")
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <div className="flex flex-col gap-2">
                <Label>{label}</Label>
                <HeroTypography type="body-sm" color="muted">{hint}</HeroTypography>
            </div>
            <Button variant="secondary" size="sm" className="self-start" onClick={() => setIsOpen(true)}>
                Open drawer
            </Button>
            <BlockAnatomy
                name="ContentAiChatDrawer"
                tier="block"
                leaf={leaf}
                parts={parts}
                reason={reason}
                states={[
                    {
                        name: stateName,
                        why,
                        code,
                        render: (
                            <ContentAiChatDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                placement={placement}
                                title={title}
                                mode={withModeSwitch ? mode : undefined}
                                onModeChange={withModeSwitch ? setMode : undefined}
                               
                            />
                        ),
                    },
                ]}
            />
        </div>
    )
}

/** LEAF 1 — mode switch present: title supplied, then the fixed fallback wording. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="flex flex-col gap-8">
            <ControlledDrawer
                label="Desktop — mode switch shown, title supplied"
                hint="mode + onModeChange both passed → the rail⇄drawer switch renders beside the title."
                leaf="Default"
                parts={[...SHELL_PARTS, MODE_SWITCH_PART, ...BODY_PARTS]}
                reason="DrawerShell's own title/description path only stacks two text lines vertically, with no room for a trailing control, so this block builds the title + switch as one custom row through DrawerShell's `header` slot instead."
                stateName='title = "Packaging an app with Docker", mode = "drawer"'
                why="The caller's real lesson title renders bold and truncates rather than wrapping, and the switch sits opposite it on the same row, both inside the pr-8 room the shell's close button needs."
                code={`<ContentAiChatDrawer
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    title="Packaging an app with Docker"
    mode={mode}
    onModeChange={setMode}
/>`}
                title="Packaging an app with Docker"
                withModeSwitch
            />
            <ControlledDrawer
                label="Desktop — mode switch shown, title omitted"
                hint="Same structure as above (STATE, not a new leaf) — `title` left unset resolves to the block's own fixed fallback wording, same idiom as ContentAiFab's fixed ARIA_LABEL."
                leaf="Default"
                parts={[...SHELL_PARTS, MODE_SWITCH_PART, ...BODY_PARTS]}
                stateName='title = undefined → fallback "Ask StarCi AI"'
                why="Nothing about the DOM shape changes from the state above — only which string the same Typography leaf renders — which is why this is a second state of the Default leaf rather than its own leaf."
                code={"<ContentAiChatDrawer isOpen={isOpen} onOpenChange={setIsOpen} mode={mode} onModeChange={setMode} />"}
                withModeSwitch
            />
        </div>
    ),
}

/** LEAF 2 — mode switch absent: mode/onModeChange both omitted, matching the forced-mobile shape (`placement="bottom"`). */
export const NoModeSwitch: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ControlledDrawer
                label="Mobile — forced drawer, no mode switch"
                hint='mode + onModeChange both omitted → the switch does not render at all (not disabled). placement="bottom" mirrors what the caller passes on a phone.'
                leaf="NoModeSwitch"
                parts={[...SHELL_PARTS, ...BODY_PARTS]}
                reason="A phone only ever shows the drawer, so a rail⇄drawer switch with nothing left to choose between would be dead chrome — the caller drops both props together instead of disabling a control that can't do anything."
                stateName='mode = undefined, onModeChange = undefined, placement = "bottom"'
                why="The ButtonRadioGroup node is gone from the tree entirely (a real structural loss, not a dimmed/disabled control), so the title's row is the only thing left in the header, and the panel now slides up from the bottom edge instead of in from the right."
                code={`<ContentAiChatDrawer
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    title="Packaging an app with Docker"
    placement="bottom"
/>`}
                title="Packaging an app with Docker"
                placement="bottom"
                withModeSwitch={false}
            />
        </div>
    ),
}
