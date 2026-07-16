import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button, Typography } from "@heroui/react"

import { CheckListCard, CheckListItem } from "@/components/blocks/cards/CheckListCard"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { SurfaceListCard, SurfaceListCardRow } from "@/components/blocks/cards/SurfaceListCard"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import { ControlledModal, LeadingTabsDemo } from "./components"

const meta: Meta<typeof ModalShell> = {
    title: "Core/Layout/ModalShell",
    component: ModalShell,
}
export default meta
type Story = StoryObj<typeof ModalShell>

/**
 * Spacing inside modal (three tiers):
 * 1. header→body — from ModalShell: plain = gap-4; category tabs (first child =
 *    Tabs/TabBar) = `bodyStartsWithTabs` → gap-3. Does not apply to a TabsCard pill
 *    in a form. Simple header: `title` (+ optional `description`) — Typography
 *    body bold + body-sm muted.
 * 2. tabs→panel — from caller: gap-4; the Tabs strip is not inside the scroller.
 *    Fixed-height panel: long → scroll, short → hold the height.
 * 3. inside cluster — from caller: gap-3; separate footer/CTA = gap-4.
 */

/** Use for a confirm modal / simple form: pass `title` (+ optional `description`) — the block renders the header stack + pr-8. Header→plain = gap-4. */
export const Default: Story = {
    parameters: {
        usage: "Use when you need to BLOCK the user to make them answer one question before moving on — confirming an irreversible action, or a short form. `title` + optional `description` live in the header (body bold + body-sm muted); the body holds only the form/CTA. Header→body defaults to gap-4. If you only need to notify and move on, use a toast; if the content is read alongside the page, use a Drawer.",
    },
    render: () => (
        <ControlledModal
            label="Title + description"
            trigger="Open modal"
            hint="header→plain = gap-4. Title + description are rendered by the block in the header (pr-8); the body holds only the CTA."
            title="Confirm unenrollment"
            description="You will lose all your learning progress for this course. This action cannot be undone."
            bodyClassName="flex flex-col gap-4"
        >
            <div className="flex justify-end gap-2">
                <Button variant="secondary" size="sm">Close</Button>
                <Button variant="danger" size="sm">Unenroll</Button>
            </div>
        </ControlledModal>
    ),
}

/** Use when `title`/`description` aren't enough — you need a non-standard header (chip, `body-xs` identity line, custom layout). If title (+ description) is enough, use the Default story; don't reach for `header`. */
export const CustomHeader: Story = {
    parameters: {
        usage: "Use when `title` + `description` aren't enough — you need a non-standard header (chip, `body-xs` identity line, custom layout). If title (+ an explanatory description) is enough, use the Default story. Because the caller builds the header, it must leave room for the close button ITSELF (`pr-8`).",
    },
    render: () => (
        <ControlledModal
            label="Custom header"
            trigger="Open modal with custom header"
            hint="differs from the title/description branch in that the header is a caller-built node, so it must leave room for the close button ITSELF — that's why there's pr-8 in this example."
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
    ),
}

/**
 * Use when content is taller than the screen: `scroll="inside"` + max-h-[85vh] (the shell attaches it).
 * A list inside a modal = surface-in-surface → `SurfaceListCard bordered`, no bare
 * `border-b` rows on the body.
 */
export const ScrollableBody: Story = {
    parameters: {
        usage: "Use when content is taller than the screen — `scroll=\"inside\"` keeps the header still and scrolls the body within `max-h-[85vh]`. List rule: inside a modal/drawer use `SurfaceListCard bordered` (surface-in-surface — shadow is invisible on a surface background, so it needs a border). Don't scatter bare border-b rows on the body.",
    },
    render: () => (
        <ControlledModal
            label="Scrollable body + surface list"
            trigger="Open long scrolling modal"
            hint="scroll=inside → shell attaches max-h-[85vh]. A list nested in a modal uses SurfaceListCard bordered (surface-in-surface)."
            title="Transaction history"
            size="lg"
            scroll="inside"
        >
            <SurfaceListCard bordered>
                {Array.from({ length: 12 }).map((_, index) => (
                    <SurfaceListCardRow
                        key={index}
                        title={`Transaction #${1000 + index}`}
                        meta={
                            <Typography type="body-sm" color="muted">
                                1.200.000đ
                            </Typography>
                        }
                    />
                ))}
            </SurfaceListCard>
        </ControlledModal>
    ),
}

/**
 * Category tabs: first child = the Tabs strip (does not scroll with the body).
 * - header→tabs = gap-3 (`bodyStartsWithTabs`)
 * - tabs→panel = gap-4 (`bodyClassName`)
 * - fixed-height panel (`h-72`): long → scroll; short → still holds the height (switching tabs doesn't shift the layout)
 */
export const WithLeadingTabs: Story = {
    parameters: {
        usage: "Category tabs: `bodyStartsWithTabs` — header→tabs = gap-3. The Tabs strip stands apart and does NOT scroll with the body. The panel below at a fixed height (`h-72` + `ScrollShadow`): long content scrolls within the frame, short content still holds the frame (switching tabs doesn't resize the modal). `bodyClassName=\"flex flex-col gap-4\"` between tabs and panel. Each tab has a `Tabs.Indicator`. Form: `TextField` Label + Input, cluster gap-3.",
    },
    render: () => (
        <ControlledModal
            label="Body leading with tabs"
            trigger="Open modal with tabs"
            hint="Fixed Tabs (no scroll). The panel below at h-72: long content scrolls, short content still fills the frame — switching tabs doesn't shift the height."
            title="Notification settings"
            bodyStartsWithTabs
            bodyClassName="flex flex-col gap-4"
        >
            <LeadingTabsDemo />
        </ControlledModal>
    ),
}

/**
 * Plain body: header→body gap-4. Inside the body — cluster gap-3; separate footer/CTA gap-4.
 * Surface-in-surface list: `LabeledCard frameless` + `CheckListCard bordered`
 * (border XOR shadow — like SurfaceListCard; no className hacks).
 * Explanatory copy goes in `description` (header), not stuffed into the body.
 */
export const PlainFormClusters: Story = {
    parameters: {
        usage: "Plain content (no tabs): `title` + `description` in the header; body = cluster gap-3 + footer/CTA gap-4. A list inside a modal = surface-in-surface: `LabeledCard frameless` (label outside) + `CheckListCard bordered` (BORDER instead of shadow, because shadow is invisible on the modal body). On a page, drop `bordered`. Don't hand-roll ul/border/shadow-none. Don't turn on `bodyStartsWithTabs`.",
    },
    render: () => (
        <ControlledModal
            label="Cluster gap-3 + CTA gap-4"
            trigger="Open cluster form modal"
            hint="Description in the header; body holds only the list + CTA. Surface-in-surface: LabeledCard frameless + CheckListCard bordered."
            title="Unlock the course"
            description="Buy once to unlock every lesson, exercise, and support in the course."
        >
            <div className="flex flex-col gap-4">
                <LabeledCard label="Included" frameless>
                    <CheckListCard bordered>
                        {["The full learning path", "AI grading", "Course community"].map((item) => (
                            <CheckListItem key={item}>
                                <Typography type="body-sm">{item}</Typography>
                            </CheckListItem>
                        ))}
                    </CheckListCard>
                </LabeledCard>
                <div className="flex justify-end gap-2">
                    <Button variant="tertiary" size="sm">Later</Button>
                    <Button variant="primary" size="sm">Continue to payment</Button>
                </div>
            </div>
        </ControlledModal>
    ),
}
