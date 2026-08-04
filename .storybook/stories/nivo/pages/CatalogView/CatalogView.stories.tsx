import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    CatalogView,
    type CatalogViewLabels,
    type CatalogViewProduct,
} from "@sb-components/nivo/pages/CatalogView/CatalogView"
import type { BuyConfirmModalOrder } from "@sb-components/nivo/blocks/catalog/BuyConfirmModal/BuyConfirmModal"
import type { MyOrderRow } from "@sb-components/nivo/blocks/catalog/MyOrdersList/MyOrdersList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `CatalogView` — the PAGE at `/catalog`: the two real, publicly-priced
 * products (AI Academy, nivo AI Agent), each with its tiers directly visible —
 * no tier-chooser sub-screen — above the buyer's own `MyOrdersList`, plus the
 * `BuyConfirmModal` that a tier's Choose action opens. A page is a list of
 * functions: this one NAMES `CatalogProductCard` + a `Grid` of `CatalogTierCard`
 * per product, then `MyOrdersList`, then `BuyConfirmModal` — nothing drawn
 * inline beyond the layout frames and the section heading. Grounded in the real
 * `CatalogItemEntity` (2 rows: `site_from_template`/`ai_academy`, `ai_agent`) +
 * `CatalogTierEntity` (3 tiers each) + `CatalogOrderEntity`; prices are the real
 * public numbers (Academy 0 / 299,000 / 899,000 VND per month; AI Agent
 * 490,000 / 990,000 / 2,400,000 VND per month).
 *
 * `BuyConfirmModal` is composed HERE, not left for a caller to mount elsewhere
 * — unlike `AgentOsConsole`'s overlays (opened outside the page), this page's
 * one modal is short-lived and its own tier grid is the only thing that opens
 * it, so keeping it in the same tree keeps the open/selection state next to
 * what drives it. The modal's own `isOpen`/`order` still arrive as PROPS (never
 * local state) — the connected layer (or a story's `Controlled` wrapper) owns
 * them, so this file stays a pure function of its props.
 *
 * A page's story is one complete STATE per story — `loading`, `no-orders-yet`
 * (a brand-new account, the critical case — a tier is always one press away),
 * `with-orders` — not a leaf-per-prop map.
 */
const meta: Meta<typeof CatalogView> = {
    title: "Nivo/Pages/CatalogView/CatalogView",
    component: CatalogView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CatalogView>

const LABELS: CatalogViewLabels = {
    title: "Catalog",
    subtitle: "Two foundational products — public pricing, buy now.",
    productCard: {
        orderLabel: "See plans",
        comingSoonLabel: "Coming soon",
        fromLabel: "from",
        perMonthLabel: "/ month",
        freeLabel: "Free",
        orderAriaLabel: "See plans",
    },
    tierCard: {
        selectLabel: "Choose",
        recommendedLabel: "Recommended",
        ownedLabel: "Current plan",
        perMonthLabel: "/ month",
        freeLabel: "Free",
    },
    myOrders: {
        title: "My orders",
        statusOptions: {
            pending_payment: "Pending payment",
            active: "Active",
            in_progress: "In progress",
            completed: "Completed",
            suspended: "Suspended",
            cancelled: "Cancelled",
        },
        emptyTitle: "No orders yet",
        emptyDescription: "Choose a plan above to get started — pay from your wallet or top it up with SePay/PayOS.",
    },
    buyConfirm: {
        titlePrefix: "Confirm purchase",
        payWithLabel: "Pay with",
        walletLabel: "nivo Wallet",
        perMonthLabel: "/ month",
        freeLabel: "Free",
        cancelLabel: "Cancel",
        confirmLabel: "Confirm purchase",
    },
}

const PRODUCTS: Array<CatalogViewProduct> = [
    {
        id: "academy",
        name: "AI Academy",
        categoryLabel: "Site from template",
        tagline: "Generate an academy site + your own classroom — tuition collection and an AI tutor built in.",
        isOrderWired: true,
        tiers: [
            {
                id: "academy_start",
                name: "Starter",
                description: "Academy site at your slug + one course + community + basic lead capture.",
                priceMonthlyVnd: 0,
                features: ["Academy site on nivo.vn", "1 course", "Community", "Basic lead capture"],
                isRecommended: false,
                isOwned: false,
            },
            {
                id: "academy_pro",
                name: "Professional",
                description: "Custom domain + unlimited courses + tuition collection + AI tutor + certificates.",
                priceMonthlyVnd: 299000,
                features: ["Custom domain", "Unlimited courses", "Tuition payments (SePay/PayOS)", "AI tutor", "Certificates"],
                isRecommended: true,
                isOwned: false,
            },
            {
                id: "academy_business",
                name: "Business",
                description: "Multiple experts + affiliate + Docker export / self-host + priority SLA support.",
                priceMonthlyVnd: 899000,
                features: ["Multiple experts", "Affiliate program", "Docker export / self-host", "Priority support (SLA)"],
                isRecommended: false,
                isOwned: false,
            },
        ],
    },
    {
        id: "ai_agent",
        name: "nivo AI Agent",
        categoryLabel: "Multi-agent AI assistant",
        tagline: "A team of AI agents on Zalo/Telegram/WhatsApp for Sales, Marketing, and Ops.",
        isOrderWired: true,
        tiers: [
            {
                id: "agent_basic",
                name: "Basic",
                description: "One agent on Zalo + Telegram, 1,000 messages a month.",
                priceMonthlyVnd: 490000,
                features: ["1 agent", "Zalo + Telegram", "1,000 messages / month"],
                isRecommended: false,
                isOwned: false,
            },
            {
                id: "agent_pro",
                name: "Pro",
                description: "Three agents, every channel, a knowledge base, and the test playground.",
                priceMonthlyVnd: 990000,
                features: ["3 agents", "All channels", "Knowledge base (RAG)", "Playground"],
                isRecommended: true,
                isOwned: false,
            },
            {
                id: "agent_scale",
                name: "Scale",
                description: "Unlimited agents with a priority SLA, for teams running the pod at volume.",
                priceMonthlyVnd: 2400000,
                features: ["Unlimited agents", "Priority SLA"],
                isRecommended: false,
                isOwned: false,
            },
        ],
    },
]

const ORDERS: Array<MyOrderRow> = [
    { id: "order-1", productName: "AI Academy", tierName: "Professional", status: "active", dateLabel: "02/08/2026" },
    { id: "order-2", productName: "nivo AI Agent", tierName: "Pro", status: "active", dateLabel: "15/07/2026" },
]

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the page's vertical rhythm — heading, then one section per product, then my orders" },
    Grid: { tier: "frame", role: "the three-tier row under each product's summary card" },
    CatalogProductCard: {
        tier: "block",
        role: "each product's summary — category, name, tagline, and its entry price",
        storyId: "nivo-blocks-catalog-catalogproductcard-catalogproductcard--default",
    },
    CatalogTierCard: {
        tier: "block",
        role: "one tier card per product tier — Choose opens the buy-confirm modal",
        storyId: "nivo-blocks-catalog-catalogtiercard-catalogtiercard--default",
    },
    MyOrdersList: {
        tier: "block",
        role: "the buyer's own orders, below the two product sections",
        storyId: "nivo-blocks-catalog-myorderslist-myorderslist--default",
    },
    BuyConfirmModal: {
        tier: "block",
        role: "the recap + confirm step a tier's Choose action opens",
        storyId: "nivo-blocks-catalog-buyconfirmmodal-buyconfirmmodal--default",
    },
    Typography: { tier: "atom", role: "the page heading and subtitle" },
}

/** Shared controlled wrapper — one `buyConfirm` state feeds the `orders`-driven leaves below. */
const ControlledCatalogView = ({ orders }: { orders: Array<MyOrderRow> }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [order, setOrder] = useState<BuyConfirmModalOrder | null>(null)
    const [isConfirming, setIsConfirming] = useState(false)

    return (
        <CatalogView
            products={PRODUCTS}
            orders={orders}
            onSelectTier={(productId, tierId) => {
                const product = PRODUCTS.find((candidate) => candidate.id === productId)
                const tier = product?.tiers.find((candidate) => candidate.id === tierId)
                if (product && tier) {
                    setOrder({
                        productName: product.name,
                        tierName: tier.name,
                        priceMonthlyVnd: tier.priceMonthlyVnd,
                        priceOneTimeVnd: tier.priceOneTimeVnd,
                        description: tier.description,
                    })
                    setIsOpen(true)
                }
            }}
            buyConfirm={{
                isOpen,
                order,
                walletBalanceVnd: 3200000,
                onOpenChange: setIsOpen,
                onConfirm: () => setIsConfirming(true),
                isConfirming,
            }}
            labels={LABELS}
        />
    )
}

/** STATE — the page is still loading; the skeleton mirror holds the resolved shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CatalogView"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. The skeleton mirrors the loaded shape (heading, two product sections each with a three-tier grid, then the orders card) so nothing jumps when the data resolves."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The catalog is still fetching. Both product sections and the orders card each draw their resting shape, matching the loaded layout exactly.",
                        code: "<CatalogView {...props} isSkeleton />",
                        render: (
                            <CatalogView
                                products={[]}
                                orders={[]}
                                onSelectTier={NOOP}
                                buyConfirm={{ isOpen: false, order: null, walletBalanceVnd: 0, onOpenChange: NOOP, onConfirm: NOOP }}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — a brand-new account: no orders yet, the critical case a buyer always has a way onward from. */
export const NoOrdersYet: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CatalogView"
                tier="screen"
                leaf="No orders yet"
                annotate={ANNOTATE}
                reason="The brand-new-account case: both products and all six tiers render exactly as they do for any buyer, so the way onward — choose a tier, confirm the purchase — is never hidden behind an empty state. Only `MyOrdersList` at the bottom falls to its own empty branch, pointing back up at the catalog."
                states={[
                    {
                        name: "orders = []",
                        why: "No purchase yet. The two product sections and their tiers are fully live — pressing Choose on any tier opens `BuyConfirmModal` — while the orders card underneath shows its own empty state.",
                        code: "<CatalogView products={products} orders={[]} onSelectTier={selectTier} buyConfirm={buyConfirm} labels={labels} />",
                        render: <ControlledCatalogView orders={[]} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved catalog with past orders present. */
export const WithOrders: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="CatalogView"
                tier="screen"
                leaf="With orders"
                annotate={ANNOTATE}
                reason="The full catalog: two products, each with its three tiers rendered inline (no tier-chooser sub-screen), the buyer's own two active orders underneath, and the buy-confirm modal a tier's Choose action opens — closed until then."
                states={[
                    {
                        name: "orders populated, buyConfirm closed",
                        why: "Both products with all six tiers, the recommended tier on each highlighted, and two active orders (AI Academy Professional, nivo AI Agent Pro) already on the account.",
                        code: `<CatalogView
    products={products /* 2 products × 3 tiers */}
    orders={orders}
    onSelectTier={selectTier}
    buyConfirm={buyConfirm}
    labels={labels}
/>`,
                        render: <ControlledCatalogView orders={ORDERS} />,
                    },
                ]}
            />
        </div>
    ),
}
