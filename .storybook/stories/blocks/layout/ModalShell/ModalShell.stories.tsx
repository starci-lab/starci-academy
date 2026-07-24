import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Input, Label, ScrollShadow, Tabs, TextField, Typography } from "@heroui/react"
import { CheckIcon } from "@phosphor-icons/react"
import { ModalShell } from "./ModalShell"

const meta: Meta<typeof ModalShell> = {
    title: "Primitives/Layouts/ModalShell",
    component: ModalShell,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ModalShell>

/** Controlled wrapper — opens on mount; the trigger reopens after a close. Mirrors the legacy story helper. */
const ControlledModal = ({
    label,
    trigger,
    hint,
    children,
    ...rest
}: {
    label: string
    trigger: string
    hint: string
    children: React.ReactNode
} & Omit<React.ComponentProps<typeof ModalShell>, "isOpen" | "onOpenChange" | "children">) => {
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
            <ModalShell isOpen={isOpen} onOpenChange={setIsOpen} {...rest}>
                {children}
            </ModalShell>
        </div>
    )
}

// TODO: swap for SurfaceListCard local when ported — bordered surface-in-surface list.
const BorderedList = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-hidden rounded-3xl border border-default bg-surface">{children}</div>
)
const BorderedRow = ({ title, meta }: { title: React.ReactNode; meta?: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-3 border-b border-separator px-4 py-3 last:border-b-0">
        <Typography type="body-sm">{title}</Typography>
        {meta ? <span className="shrink-0">{meta}</span> : null}
    </div>
)

// TODO: swap for CrossListCard local (bordered, mark="check") when ported — bordered check list.
const CheckList = ({ items }: { items: Array<string> }) => (
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

/** Confirm modal / simple form: `title` (+ optional `description`) → the block renders the header stack + pr-8. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <ControlledModal
                label="Title + description"
                trigger="Open modal"
                hint="header→plain = gap-3. Title + description rendered by the block in the header (pr-8); body holds only the CTA."
                title="Confirm unenrollment"
                description="You will lose all your learning progress for this course. This action cannot be undone."
                bodyClassName="flex flex-col gap-3"
            >
                <div className="flex justify-end gap-2">
                    <Button variant="secondary" size="sm">Close</Button>
                    <Button variant="danger" size="sm">Unenroll</Button>
                </div>
            </ControlledModal>
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

/** Leading tabs: `bodyStartsWithTabs` → header→tabs gap-3; the tab strip stands apart and does not scroll with the body. */
export const WithLeadingTabs: Story = {
    render: () => (
        <div className="p-8">
            <ControlledModal
                label="Body leading with tabs"
                trigger="Open modal with tabs"
                hint="Fixed Tabs (no scroll). The panel at h-72: long content scrolls, short still fills the frame."
                title="Notification settings"
                bodyStartsWithTabs
                bodyClassName="flex flex-col gap-3"
            >
                <LeadingTabsDemo />
            </ControlledModal>
        </div>
    ),
}

/** Plain body clusters: header→body gap-3; inside — cluster gap-3 + footer/CTA gap-3. Nested list is bordered. */
export const PlainFormClusters: Story = {
    render: () => (
        <div className="p-8">
            <ControlledModal
                label="Body grouped (gap-3) · cluster related (gap-2)"
                trigger="Open cluster form modal"
                hint="Description in the header; body holds only the list + CTA. Surface-in-surface: label outside + bordered check list."
                title="Unlock the course"
                description="Buy once to unlock every lesson, exercise, and support in the course."
            >
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Included</Label>
                        <CheckList items={["The full learning path", "AI grading", "Course community"]} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="tertiary" size="sm">Later</Button>
                        <Button variant="primary" size="sm">Continue to payment</Button>
                    </div>
                </div>
            </ControlledModal>
        </div>
    ),
}
