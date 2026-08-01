import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Label, Typography } from "@heroui/react"
import { DrawerShell } from "@sb-components/composites/layout/DrawerShell/DrawerShell"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DrawerShell` — the panel scaffold frame:
 * `Drawer > Backdrop > Content > Dialog > CloseTrigger + Header? + Body + Footer?`.
 * Sibling of `ModalShell` — same named slots (`header`/`body`/`footer`,
 * `children` = body shorthand), differing only where the HeroUI primitive
 * differs: `placement` (which edge it slides from) instead of `size`.
 */
const meta: Meta<typeof DrawerShell> = {
    title: "Composites/Layout/DrawerShell/DrawerShell",
    component: DrawerShell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof DrawerShell>

const TITLE_DESC_FOOTER_PARTS: Array<AnatomyNode> = [
    { name: "Drawer.CloseTrigger", tier: "heroui", role: "the close button, in the upper-right corner" },
    { name: "Typography", tier: "atom", role: "the drawer's title, bold body text", storyId: "atoms-text-typography-typography--plain" },
    { name: "Typography", tier: "atom", role: "the description line under the title, muted body-sm text", storyId: "atoms-text-typography-typography--plain" },
    { name: "Drawer.Body", tier: "heroui", role: "the drawer's body content, scrolls independently" },
    { name: "Drawer.Footer", tier: "heroui", role: "the bottom CTA row, right-aligned with a gap-2 seam" },
]

const CUSTOM_HEADER_PARTS: Array<AnatomyNode> = [
    { name: "Drawer.CloseTrigger", tier: "heroui", role: "the close button, in the upper-right corner" },
    { name: "Drawer.Header", tier: "heroui", role: "an arbitrary caller-built header node, replacing Title and Description" },
    { name: "Drawer.Body", tier: "heroui", role: "the drawer's body content" },
]

/** Controlled wrapper — opens on mount; the trigger reopens after a close. */
const ControlledDrawer = ({
    label,
    trigger,
    hint,
    children,
    leaf,
    parts,
    reason,
    stateName,
    why,
    code,
    ...rest
}: {
    label: string
    trigger: string
    hint: string
    children?: React.ReactNode
    leaf: string
    parts: Array<AnatomyNode>
    reason?: React.ReactNode
    stateName: string
    why?: React.ReactNode
    code?: string
} & Omit<React.ComponentProps<typeof DrawerShell>, "isOpen" | "onOpenChange" | "children">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>{label}</Label>
                <Typography type="body-sm" color="muted">{hint}</Typography>
            </div>
            <Button variant="secondary" size="sm" className="self-start" onClick={() => setIsOpen(true)}>
                {trigger}
            </Button>
            <BlockAnatomy
                name="DrawerShell"
                tier="composite"
                leaf={leaf}
                parts={parts}
                reason={reason}
                states={[
                    {
                        name: stateName,
                        why,
                        code,
                        render: (
                            <DrawerShell isOpen={isOpen} onOpenChange={setIsOpen} showAnatomy {...rest}>
                                {children}
                            </DrawerShell>
                        ),
                    },
                ]}
            />
        </div>
    )
}

/** Right-edge panel: `title` + `description` + `footer` — all three regions are slots. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ControlledDrawer
                label="Title + description + footer, placement = right (default)"
                trigger="Open drawer"
                hint="All 3 regions are slots, same as ModalShell. The CTA button passes BARE into `footer`."
                title="Submission attempts"
                description="Every attempt you've made on this challenge, most recent first."
                leaf="Default"
                parts={TITLE_DESC_FOOTER_PARTS}
                reason="The shell gathers CloseTrigger, Header, Body, and Footer into one scaffold — same contract as ModalShell, just sliding from an edge instead of centering."
                stateName="title, description, and footer all set"
                why="CloseTrigger, Title, Description, Body, and Footer all render as named slots, so the caller writes no layout div anywhere in the panel."
                code={`<DrawerShell
  title="Submission attempts"
  description="Every attempt you've made on this challenge, most recent first."
  body={<AttemptList items={attempts} />}
  footer={<Button variant="secondary">Close</Button>}
/>`}
                body={(
                    <Typography data-tier="fixture" type="body-sm" color="muted">
                        Attempt #4 — 87/100 · Attempt #3 — 62/100 · Attempt #2 — 40/100 · Attempt #1 — 10/100
                    </Typography>
                )}
                footer={<Button data-tier="fixture" variant="secondary" size="sm">Close</Button>}
            />
        </div>
    ),
}

/** Custom header: a caller-built node, same `pr-8` room-for-close-button rule as ModalShell. */
export const CustomHeader: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <ControlledDrawer
                label="Custom header"
                trigger="Open drawer with custom header"
                hint="header is a caller-built node, so it must leave its own room for the close button — hence `pr-8`."
                header={
                    <div data-tier="fixture" className="flex flex-col gap-1 pr-8">
                        <Typography type="body" weight="bold">AI chat</Typography>
                        <Typography type="body-xs" color="muted">About this lesson</Typography>
                    </div>
                }
                leaf="CustomHeader"
                parts={CUSTOM_HEADER_PARTS}
                stateName="header set (custom node), footer = undefined"
                why="Header replaces Title and Description with one opaque node, and no Footer slot renders since none was passed."
                code={`<DrawerShell header={<ChatHeader />}>
  <ChatThread messages={messages} />
</DrawerShell>`}
            >
                <Typography type="body-sm" color="muted">
                    Ask AI about the lesson you're currently reading.
                </Typography>
            </ControlledDrawer>
        </div>
    ),
}
