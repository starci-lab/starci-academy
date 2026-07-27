import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Input, Label, ScrollShadow, Tabs, TextField, Typography } from "@heroui/react"
import { CheckIcon } from "@phosphor-icons/react"
import { ModalShell } from "@sb-components/layouts/layout/ModalShell/ModalShell"
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
    title: "Layouts/Layout/ModalShell/ModalShell.Base",
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
    { name: "CloseTrigger", tier: "primitive", role: "nút đóng (góc phải trên)" },
    { name: "Title", tier: "primitive", role: "tiêu đề modal (body, bold)" },
    { name: "Description", tier: "primitive", role: "mô tả dưới tiêu đề (body-sm muted)" },
    { name: "Body", tier: "primitive", role: "nội dung thân modal" },
    { name: "Footer", tier: "primitive", role: "hàng CTA đáy (Modal.Footer: justify-end gap-2)" },
]

const CUSTOM_HEADER_PARTS: Array<AnatomyNode> = [
    { name: "CloseTrigger", tier: "primitive", role: "nút đóng (góc phải trên)" },
    { name: "Header", tier: "primitive", role: "node header tuỳ ý do caller dựng — thay thế Title/Description" },
    { name: "Body", tier: "primitive", role: "nội dung thân modal" },
]

const TITLE_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "CloseTrigger", tier: "primitive", role: "nút đóng (góc phải trên)" },
    { name: "Title", tier: "primitive", role: "tiêu đề modal (body, bold)" },
    { name: "Body", tier: "primitive", role: "nội dung thân modal" },
]

/** Controlled wrapper — opens on mount; the trigger reopens after a close. Mirrors the legacy story helper. */
const ControlledModal = ({
    label,
    trigger,
    hint,
    children,
    leaf,
    parts,
    note,
    reason,
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
    note?: React.ReactNode
    reason?: React.ReactNode
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
            <BlockAnatomy name="ModalShell.Base" tier="primitive" leaf={leaf} parts={parts} note={note} reason={reason} code={code}>
                <ModalShell.Base isOpen={isOpen} onOpenChange={setIsOpen} showAnatomy {...rest}>
                    {children}
                </ModalShell.Base>
            </BlockAnatomy>
        </div>
    )
}

// TODO: swap for SurfaceCard.List local when ported — bordered surface-in-surface list.
const BorderedList = ({ children }: { children: React.ReactNode }) => (
    <div className="overflow-hidden rounded-3xl border border-default bg-surface">{children}</div>
)
const BorderedRow = ({ title, meta }: { title: React.ReactNode; meta?: React.ReactNode }) => (
    <div className="flex items-center justify-between gap-3 border-b border-separator px-4 py-3 last:border-b-0">
        <Typography type="body-sm">{title}</Typography>
        {meta ? <span className="shrink-0">{meta}</span> : null}
    </div>
)

// TODO: swap for SurfaceCard.CrossList local (bordered, mark="check") when ported.
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
                reason="Khung modal gom CloseTrigger·Header·Body·Footer về một chỗ, chuẩn hoá luôn khoảng cách header→body→footer (mt-4) thay vì để mỗi modal tự chế."
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
                note="`header` opaque thay thế Title/Description — chính caller phải tự chừa pr-8 cho CloseTrigger. Không truyền `footer` → không có part Footer."
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
                note="Không description, không footer → chỉ Title trong Header. scroll=inside chỉ đổi max-height của Container, không đổi part."
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
                leaf="WithLeadingTabs"
                parts={TITLE_ONLY_PARTS}
                note="bodyStartsWithTabs chỉ đổi gap Header→Body (gap-3 thay vì gap-4) — không thêm part mới."
                code={`<ModalShell.Base title="Notification settings" bodyStartsWithTabs bodyClassName="flex flex-col gap-3">
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
                note="Cùng nhánh header đơn giản như Default — Body giờ chỉ còn cluster list, CTA nằm ở Footer (state khác, không phải part khác)."
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
