import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Input, Label, ScrollShadow, Tabs, TextField, Typography } from "@heroui/react"
import { CheckIcon } from "@phosphor-icons/react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ModalShell.Base` — the dialog scaffold khung:
 * `Modal > Backdrop > Container > Dialog > CloseTrigger + Header? + Body + Footer?`.
 * Named slots `header`/`body`/`footer` are the main road; `children` is
 * shorthand for `body`. `footer` replaces the hand-rolled
 * `<div className="flex justify-end gap-2">` every caller used to nest inside
 * the body.
 */
const meta: Meta<typeof ModalShell.Base> = {
    title: "Composites/Layout/ModalShell/ModalShell.Base",
    component: ModalShell.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ModalShell.Base>

// DOM thật: Modal > Backdrop > Container > Dialog > CloseTrigger + Header?(Title·Description
// hoặc custom `header`) + Body + Footer?. CloseTrigger/Body luôn có mặt; Title+Description chỉ ở
// nhánh header đơn giản, Header (opaque) chỉ ở nhánh custom, Footer chỉ khi truyền slot `footer`.
const TITLE_DESC_FOOTER_PARTS: Array<AnatomyNode> = [
    { name: "Modal.CloseTrigger", tier: "heroui", role: "the close button, in the upper-right corner" },
    { name: "Typography.Base", tier: "atom", role: "the modal's title, bold body text", storyId: "atoms-text-typography-typography-base--plain" },
    { name: "Typography.Base", tier: "atom", role: "the description line under the title, muted body-sm text", storyId: "atoms-text-typography-typography-base--plain" },
    { name: "Modal.Body", tier: "heroui", role: "the modal's body content" },
    { name: "Modal.Footer", tier: "heroui", role: "the bottom CTA row, right-aligned with a gap-2 seam" },
]

const CUSTOM_HEADER_PARTS: Array<AnatomyNode> = [
    { name: "Modal.CloseTrigger", tier: "heroui", role: "the close button, in the upper-right corner" },
    { name: "Modal.Header", tier: "heroui", role: "an arbitrary caller-built header node, replacing Title and Description" },
    { name: "Modal.Body", tier: "heroui", role: "the modal's body content" },
]

const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Modal.CloseTrigger", tier: "heroui", role: "the close button, in the upper-right corner" },
    { name: "Typography.Base", tier: "atom", role: "the modal's title, bold body text", storyId: "atoms-text-typography-typography-base--plain" },
    { name: "Modal.Body", tier: "heroui", role: "the modal's body content" },
]

/** Controlled wrapper — opens on mount; the trigger reopens after a close. Mirrors the legacy story helper. */
const ControlledModal = ({
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
    /** Shorthand body. Omit when the leaf passes the `body` slot instead. */
    children?: React.ReactNode
    leaf: string
    parts: Array<AnatomyNode>
    reason?: React.ReactNode
    /** The data condition that produces this leaf's one state. */
    stateName: string
    /** Why this state exists / what changes in it. */
    why?: React.ReactNode
    code?: string
} & Omit<React.ComponentProps<typeof ModalShell.Base>, "isOpen" | "onOpenChange" | "children">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>{label}</Label>
                <Typography type="body-sm" color="muted">{hint}</Typography>
            </div>
            <Button variant="secondary" size="sm" className="self-start" onClick={() => setIsOpen(true)}>
                {trigger}
            </Button>
            <BlockAnatomy
                name="ModalShell.Base"
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
                            <ModalShell.Base isOpen={isOpen} onOpenChange={setIsOpen} showAnatomy {...rest}>
                                {children}
                            </ModalShell.Base>
                        ),
                    },
                ]}
            />
        </div>
    )
}

/** Props for the `BorderedList` demo wrapper below. */
interface BorderedListProps {
    /** rows nested inside the bordered surface-in-surface list */
    children: React.ReactNode
}

// TODO: swap for SurfaceCard.List local when ported — bordered surface-in-surface list.
const BorderedList = ({ children }: BorderedListProps) => (
    <div className="overflow-hidden rounded-3xl border border-default bg-surface">{children}</div>
)

/** Props for the `BorderedRow` demo row below. */
interface BorderedRowProps {
    /** row title, left-aligned */
    title: React.ReactNode
    /** optional trailing content, right-aligned */
    meta?: React.ReactNode
}

const BorderedRow = ({ title, meta }: BorderedRowProps) => (
    <div className="flex items-center justify-between gap-3 border-b border-separator px-4 py-3 last:border-b-0">
        <Typography type="body-sm">{title}</Typography>
        {meta ? <span className="shrink-0">{meta}</span> : null}
    </div>
)

/** Props for the `CheckList` demo wrapper below. */
interface CheckListProps {
    /** row labels rendered with a leading check mark */
    items: Array<string>
}

// TODO: swap for SurfaceCard.CrossList local (bordered, mark="check") when ported.
const CheckList = ({ items }: CheckListProps) => (
    <div className="overflow-hidden rounded-3xl border border-default bg-surface">
        {items.map((item) => (
            <div key={item} className="flex items-center gap-2 border-b border-separator px-4 py-3 last:border-b-0">
                <CheckIcon className="size-4 shrink-0 text-success-soft-foreground" aria-hidden focusable="false" />
                <Typography type="body-sm">{item}</Typography>
            </div>
        ))}
    </div>
)

/** Leading tabs: a FIXED tab strip (no scroll), panel below at a fixed height — long scrolls, short holds the frame. */
const LeadingTabsDemo = () => {
    const [tab, setTab] = useState<"email" | "push">("email")
    return (
        <>
            <Tabs
                selectedKey={tab}
                onSelectionChange={(key) => setTab(String(key) as "email" | "push")}
            >
                <Tabs.ListContainer>
                    <Tabs.List aria-label="Notification channel">
                        <Tabs.Tab id="email">
                            Email
                            <Tabs.Indicator />
                        </Tabs.Tab>
                        <Tabs.Tab id="push">
                            Push
                            <Tabs.Indicator />
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs.ListContainer>
            </Tabs>

            <ScrollShadow hideScrollBar offset={8} className="h-72 overflow-y-auto">
                {tab === "email" ? (
                    <div className="flex min-h-full flex-col gap-3">
                        <Typography type="body-sm" color="muted">
                            Choose the channel for notifications when a new lesson arrives.
                        </Typography>
                        {[
                            { id: "notify-email", label: "Notification email", value: "you@email.com" },
                            { id: "notify-email-cc", label: "Secondary email (CC)", value: "cc@email.com" },
                            { id: "notify-email-subject", label: "Subject template", value: "[StarCi] New lesson" },
                            { id: "notify-email-reply", label: "Reply-to", value: "" },
                            { id: "notify-email-footer", label: "Email signature", value: "" },
                            { id: "notify-email-digest", label: "Weekly digest sent at", value: "" },
                        ].map((field) => (
                            <TextField key={field.id} variant="secondary">
                                <Label htmlFor={field.id}>{field.label}</Label>
                                <Input id={field.id} defaultValue={field.value} placeholder={field.label} />
                            </TextField>
                        ))}
                    </div>
                ) : (
                    <div className="flex min-h-full flex-col gap-3">
                        <Typography type="body-sm" color="muted">
                            Push notifications on the browser or registered devices.
                        </Typography>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-device">Device name</Label>
                            <Input id="notify-device" placeholder="Personal laptop" />
                        </TextField>
                        <TextField variant="secondary">
                            <Label htmlFor="notify-push-token">Push token</Label>
                            <Input id="notify-push-token" placeholder="fcm_…" />
                        </TextField>
                    </div>
                )}
            </ScrollShadow>
        </>
    )
}

/** Confirm modal: `title` + `description` + `footer` — all three regions are slots, the caller writes no layout div. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <ControlledModal
                label="Title + description + footer"
                trigger="Open modal"
                hint="Cả 3 vùng đều là slot. Nút CTA truyền TRẦN vào `footer` — Modal.Footer đã tự justify-end gap-2."
                title="Confirm unenrollment"
                description="You will lose all your learning progress for this course. This action cannot be undone."
                leaf="Default"
                parts={TITLE_DESC_FOOTER_PARTS}
                reason="The shell gathers CloseTrigger, Header, Body, and Footer into one scaffold and standardizes the header-to-body-to-footer spacing (mt-4) instead of leaving every modal to hand-roll its own."
                stateName="title, description, and footer all set"
                why="CloseTrigger, Title, Description, Body, and Footer all render as named slots, so the caller writes no layout div anywhere in the modal. The CTA pair passed bare into `footer` picks up the row's own right-aligned gap-2 layout instead of being wrapped by hand."
                code={`<ModalShell.Base
  title="Confirm unenrollment"
  description="You will lose all your learning progress. This cannot be undone."
  body={<Typography color="muted">Your submissions and grades will be removed too.</Typography>}
  footer={<Button variant="danger">Unenroll</Button>}
/>`}
                body={(
                    <Typography type="body-sm" color="muted">
                        Your submissions and grades for this course will be removed as well.
                    </Typography>
                )}
                footer={(
                    <>
                        <Button variant="secondary" size="sm">Close</Button>
                        <Button variant="danger" size="sm">Unenroll</Button>
                    </>
                )}
            />
        </div>
    ),
}

/** Custom header: a caller-built node (chip, identity line) — it must leave room for the close button itself (`pr-8`). */
export const CustomHeader: Story = {
    render: () => (
        <div className="p-8">
            <ControlledModal
                label="Custom header"
                trigger="Open modal with custom header"
                hint="the header is a caller-built node, so it must leave room for the close button ITSELF — hence pr-8."
                header={
                    <div className="flex flex-col gap-1 pr-8">
                        <Typography type="body" weight="bold">Invite students</Typography>
                        <Typography type="body-xs" color="muted">Fullstack Mastery course</Typography>
                    </div>
                }
                leaf="CustomHeader"
                parts={CUSTOM_HEADER_PARTS}
                stateName="header set (custom node), footer = undefined"
                why="Header replaces Title and Description with one opaque node the caller assembled itself, and no Footer slot renders since none was passed. Because the header is caller-built it must leave its own room for the close button, which is why the node carries `pr-8` rather than the shell adding it automatically."
                code={`<ModalShell.Base header={<InviteHeader />}>
  <Typography color="muted">Enter student emails, one address per line.</Typography>
</ModalShell.Base>`}
            >
                <Typography type="body-sm" color="muted">
                    Enter student emails, one address per line.
                </Typography>
            </ControlledModal>
        </div>
    ),
}

/** Scrollable body: `scroll="inside"` → the shell attaches `max-h-[85vh]`; a nested list is bordered (surface-in-surface). */
export const ScrollableBody: Story = {
    render: () => (
        <div className="p-8">
            <ControlledModal
                label="Scrollable body + surface list"
                trigger="Open long scrolling modal"
                hint="scroll=inside → shell attaches max-h-[85vh]. A list nested in a modal uses a bordered surface list."
                title="Transaction history"
                size="lg"
                scroll="inside"
                leaf="ScrollableBody"
                parts={TITLE_ONLY_PARTS}
                stateName="title only, scroll = 'inside', size = 'lg'"
                why="Only Title appears in the header, with no Description or Footer beside it, and the shell caps itself at `max-h-[85vh]` so the body scrolls instead of the page. The nested transaction rows draw their own border rather than a second shadowed card, a bordered surface sitting inside this one."
                code={`<ModalShell.Base title="Transaction history" size="lg" scroll="inside">
  <BorderedList>{/* transaction rows */}</BorderedList>
</ModalShell.Base>`}
            >
                <BorderedList>
                    {Array.from({ length: 12 }).map((_, index) => (
                        <BorderedRow
                            key={index}
                            title={`Transaction #${1000 + index}`}
                            meta={<Typography type="body-sm" color="muted">1.200.000đ</Typography>}
                        />
                    ))}
                </BorderedList>
            </ControlledModal>
        </div>
    ),
}

/** Leading tabs: the strip stands apart and does not scroll with the body. */
export const WithLeadingTabs: Story = {
    render: () => (
        <div className="p-8">
            <ControlledModal
                label="Body leading with tabs"
                trigger="Open modal with tabs"
                hint="Fixed Tabs (no scroll). The panel at h-72: long content scrolls, short still fills the frame."
                title="Notification settings"
                bodyClassName="flex flex-col gap-3"
                leaf="WithLeadingTabs"
                parts={TITLE_ONLY_PARTS}
                stateName="body starts with a tab strip"
                why="The tab strip sits fixed above the body content with a tighter gap-3 seam in place of the header's usual gap-4, and it stays put instead of scrolling away with the panel underneath it. A short panel still fills the fixed-height frame while a long one scrolls inside it."
                code={`<ModalShell.Base title="Notification settings" bodyClassName="flex flex-col gap-3">
  <Tabs>{/* Email / Push panels */}</Tabs>
</ModalShell.Base>`}
            >
                <LeadingTabsDemo />
            </ControlledModal>
        </div>
    ),
}

/** Clustered body + footer: label + bordered check list in `body`, the two CTAs in `footer`. */
export const PlainFormClusters: Story = {
    render: () => (
        <div className="p-8">
            <ControlledModal
                label="Body grouped (gap-3) · cluster related (gap-2) · CTA in footer"
                trigger="Open cluster form modal"
                hint="Description in the header; body holds ONLY the list cluster; the CTA pair moved out to the footer slot."
                title="Unlock the course"
                description="Buy once to unlock every lesson, exercise, and support in the course."
                leaf="PlainFormClusters"
                parts={TITLE_DESC_FOOTER_PARTS}
                stateName="title, description, and footer all set (body = check list)"
                why="The header carries both a Title and a Description exactly as in Default, but the Body now holds only the check-list cluster while the two CTAs moved out into the Footer slot. It is the same named slots arranged differently, not a different part of the shell."
                code={`<ModalShell.Base
  title="Unlock the course"
  description="Buy once to unlock every lesson, exercise, and support."
  footer={<Button variant="primary">Continue to payment</Button>}
>
  <CheckList items={["The full learning path", "AI grading", "Course community"]} />
</ModalShell.Base>`}
                footer={(
                    <>
                        <Button variant="tertiary" size="sm">Later</Button>
                        <Button variant="primary" size="sm">Continue to payment</Button>
                    </>
                )}
            >
                <div className="flex flex-col gap-2">
                    <Label>Included</Label>
                    <CheckList items={["The full learning path", "AI grading", "Course community"]} />
                </div>
            </ControlledModal>
        </div>
    ),
}
