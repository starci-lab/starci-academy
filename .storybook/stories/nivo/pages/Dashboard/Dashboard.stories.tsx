import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    Dashboard,
    type DashboardLabels,
    type DashboardUser,
} from "@sb-components/nivo/pages/Dashboard/Dashboard"
import type { InvoiceListLabels, InvoiceRow } from "@sb-components/nivo/blocks/billing/InvoiceList/InvoiceList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Dashboard` — the PAGE a signed-in user lands on: an identity summary above a
 * capped list of recent invoices (the `InvoiceList` block). A page's story is one
 * complete STATE per story — `loading`, `content`, `empty-invoices` — not a
 * leaf-per-prop map. Grounded in the real `UserEntity` + `InvoiceEntity`.
 */
const meta: Meta<typeof Dashboard> = {
    title: "Nivo/Pages/Dashboard/Dashboard",
    component: Dashboard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Dashboard>

const NOOP = () => {}

const LABELS: DashboardLabels = {
    greeting: "Welcome back",
}

const INVOICE_LABELS: InvoiceListLabels = {
    title: "Recent invoices",
    payLabel: "Pay",
    statusOptions: { unpaid: "Unpaid", paid: "Paid", cancelled: "Cancelled" },
    emptyTitle: "No invoices yet",
    emptyDescription: "Invoices for the products you order will appear here.",
}

const USER: DashboardUser = {
    username: "Le Quang",
    email: "quang@nivo.vn",
    avatarUrl: null,
}

const INVOICES: Array<InvoiceRow> = [
    { id: "inv-1", itemName: "AI Academy — Professional", amountVnd: 299000, status: "unpaid", dateLabel: "01/08/2026" },
    { id: "inv-2", itemName: "nivo AI Agent — Pro", amountVnd: 990000, status: "paid", dateLabel: "24/07/2026" },
    { id: "inv-3", itemName: "AI Academy — Business", amountVnd: 899000, status: "cancelled", dateLabel: "12/07/2026" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the page's vertical rhythm and the identity column" },
    StackH: { tier: "frame", role: "the identity summary row (avatar beside name + email)" },
    SurfaceCard: { tier: "composite", role: "the invoices card and its skeleton mirror" },
    Avatar: { tier: "atom", role: "the user avatar (initials fallback when no image)" },
    Typography: { tier: "atom", role: "the greeting, name, and email" },
    InvoiceList: {
        tier: "block",
        role: "the recent-invoices list, capped to five",
        storyId: "nivo-blocks-billing-invoicelist-invoicelist--default",
    },
}

/** STATE — the page is still loading; the skeleton mirror holds the resolved shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Dashboard"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. The skeleton mirrors the loaded shape (identity row + a three-row invoices card) so nothing jumps when the data resolves."
                states={[
                    {
                        name: "isLoading = true",
                        why: "The dashboard is still fetching. The identity row and the invoices card each draw their resting shape, matching the loaded layout exactly.",
                        code: "<Dashboard {...props} isLoading />",
                        render: (
                            <Dashboard
                                user={USER}
                                invoices={INVOICES}
                                onPayInvoice={NOOP}
                                labels={LABELS}
                                invoiceLabels={INVOICE_LABELS}
                                isLoading
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved dashboard with recent invoices present. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Dashboard"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason="The resolved dashboard: the identity summary on top, then the recent-invoices block capped to five. The page composes the `InvoiceList` block rather than rebuilding the invoice row inline — a page reaching for the row shape directly would be a block that's missing."
                states={[
                    {
                        name: "user set, invoices present",
                        why: "The full landing page: the greeting + name + email, then the three most recent invoices across every status, with the unpaid one exposing its Pay action.",
                        code: `<Dashboard
    user={user}
    invoices={invoices /* capped to 5 */}
    onPayInvoice={pay}
    labels={labels}
    invoiceLabels={invoiceLabels}
/>`,
                        render: (
                            <Dashboard
                                user={USER}
                                invoices={INVOICES}
                                onPayInvoice={NOOP}
                                labels={LABELS}
                                invoiceLabels={INVOICE_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a signed-in user who has no invoices yet. */
export const EmptyInvoices: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Dashboard"
                tier="screen"
                leaf="Empty invoices"
                annotate={ANNOTATE}
                reason="A brand-new account: the identity summary renders normally, but the embedded `InvoiceList` falls to its own empty branch. The page doesn't special-case emptiness — the block it composes owns that state."
                states={[
                    {
                        name: "invoices = []",
                        why: "The user exists but has ordered nothing, so the invoices card shows its intentional empty state under the identity summary rather than a blank panel.",
                        code: "<Dashboard user={user} invoices={[]} … />",
                        render: (
                            <Dashboard
                                user={USER}
                                invoices={[]}
                                onPayInvoice={NOOP}
                                labels={LABELS}
                                invoiceLabels={INVOICE_LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
