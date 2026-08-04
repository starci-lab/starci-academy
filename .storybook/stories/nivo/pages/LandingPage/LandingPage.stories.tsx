import type { Meta, StoryObj } from "@storybook/nextjs"
import { GlobeIcon, MagnetIcon, AddressBookIcon, FlowArrowIcon, RobotIcon, ChartLineUpIcon } from "@phosphor-icons/react"
import {
    LandingPage,
    type LandingPageAuditCta,
    type LandingPageClosing,
    type LandingPageDashboardProof,
    type LandingPageDemoFlow,
    type LandingPageFaq,
    type LandingPageHero,
    type LandingPageHumanInTheLoop,
    type LandingPagePartnerStrip,
    type LandingPagePricing,
    type LandingPageProblem,
    type LandingPageProductShowcase,
    type LandingPageQuickSelectorHeading,
    type LandingPageSolutionByIndustry,
    type LandingPageSystemFlow,
    type LandingPageSystemStory,
} from "@sb-components/nivo/pages/LandingPage/LandingPage"
import type { ProductQuickSelectorItem } from "@sb-components/nivo/blocks/landing/ProductQuickSelector/ProductQuickSelector"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `LandingPage` — the PAGE a guest lands on at `/`: the full V2 "operating
 * system" stack (brand §VII.2), reconciled to the real 2-product / 6-tier
 * catalog. A page's story is one complete STATE per story — `Content` (the
 * catalog resolved) and `Loading` (`ProductShowcase` + `PricingTeaser` in
 * their skeleton mirror; every other section is static and unaffected).
 */
const meta: Meta<typeof LandingPage> = {
    title: "Nivo/Pages/LandingPage/LandingPage",
    component: LandingPage,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof LandingPage>

const NOOP = () => {}
const NOOP_ID = (_id: string) => {}

const HERO: LandingPageHero = {
    eyebrow: "AI-First business infrastructure for SMEs",
    headline: "Start from one platform product. Grow into an AI-First business system.",
    description: "nivo helps SMEs build the loop from Website to Lead to CRM to Workflow to AI Agent to Dashboard, so no lead falls through the cracks and growth is easier to measure.",
    primaryLabel: "Choose a plan",
    secondaryLabel: "Run a Lead Leakage Audit",
    tertiaryLabel: "See a demo",
    trustPoints: [
        { id: "self-hosted", label: "Self-hosted, data under your control" },
        { id: "accountable", label: "AI supports, people stay accountable" },
        { id: "start-free", label: "Start free, upgrade when ready" },
    ],
    flowNodes: [
        { id: "website", label: "Website", icon: GlobeIcon },
        { id: "lead", label: "Lead", icon: MagnetIcon },
        { id: "crm", label: "CRM", icon: AddressBookIcon },
        { id: "workflow", label: "Workflow", icon: FlowArrowIcon },
        { id: "ai-agent", label: "AI Agent", icon: RobotIcon, isAi: true },
        { id: "dashboard", label: "Dashboard", icon: ChartLineUpIcon },
    ],
    activeFlowNodeId: "ai-agent",
    dashboardTitle: "nivo · Growth Dashboard",
    dashboardBadgeLabel: "AI insight",
    dashboardMetrics: [
        { id: "leads", label: "Leads this week", value: "—" },
        { id: "followups", label: "Follow-ups sent", value: "—" },
    ],
}

const QUICK_SELECTOR_HEADING: LandingPageQuickSelectorHeading = {
    eyebrow: "Where to start",
    title: "Where do you want to start?",
    intro: "Two of these needs are buyable today; the rest are the system you grow into.",
}

const QUICK_SELECTOR_ITEMS: Array<ProductQuickSelectorItem> = [
    { key: "website", need: "I need a website or academy for my business", mapsToLabel: "→ AI Academy", ctaLabel: "See Academy plans", onPress: NOOP },
    { key: "ai-support", need: "I need an AI assistant for sales or support", mapsToLabel: "→ nivo AI Agent", ctaLabel: "See AI Agent plans", onPress: NOOP },
    { key: "ai-marketing", need: "I need AI help with marketing and follow-up", mapsToLabel: "→ nivo AI Agent", ctaLabel: "See AI Agent plans", onPress: NOOP },
    { key: "crm", need: "I need a CRM to track my pipeline", mapsToLabel: "→ CRM (roadmap)", isRoadmap: true, ctaLabel: "Run the audit instead", onPress: NOOP },
    { key: "workflow", need: "I need automated follow-up workflows", mapsToLabel: "→ Workflow (roadmap)", isRoadmap: true, ctaLabel: "Run the audit instead", onPress: NOOP },
    { key: "unsure", need: "I'm not sure where to start", mapsToLabel: "→ Lead Leakage Audit", ctaLabel: "Run the audit", onPress: NOOP },
]

const PROBLEM: LandingPageProblem = {
    eyebrow: "The core problem",
    headlineLead: "SMEs don't lack tools.",
    headlineAccent: "SMEs lack a system.",
    description: "Most SMEs already run a website, a Zalo/Facebook page, and a handful of spreadsheets — each one an island. A lead lands somewhere and nothing connects it to what happens next.",
    ctaLabel: "Run a Lead Leakage Audit",
    leakMapTitle: "Where does a lead usually leak?",
    leakMapStages: [
        { key: "visit", label: "Visitor lands on the website" },
        { key: "form", label: "Fills a contact form" },
        { key: "followup", label: "Waits for manual follow-up", isLeak: true, leakLabel: "LEAK" },
        { key: "record", label: "Gets logged somewhere (if at all)", isLeak: true, leakLabel: "LEAK" },
        { key: "nurture", label: "Nurtured consistently over time", isLeak: true, leakLabel: "LEAK" },
        { key: "close", label: "Converts to a customer" },
    ],
}

const SYSTEM_FLOW: LandingPageSystemFlow = {
    eyebrow: "How nivo works",
    title: "A lead should not stop at the form.",
    intro: "Website and AI Agent are real, buyable products today; CRM, Workflow, and Dashboard are the system this loop grows into.",
    layers: [
        { key: "website", icon: GlobeIcon, name: "Website", description: "Captures the visit" },
        { key: "lead", icon: MagnetIcon, name: "Lead", description: "Captures the contact" },
        { key: "crm", icon: AddressBookIcon, name: "CRM", description: "Keeps every lead in one place" },
        { key: "workflow", icon: FlowArrowIcon, name: "Workflow", description: "Automates the follow-up" },
        { key: "ai-agent", icon: RobotIcon, name: "AI Agent", description: "Talks to the lead directly", isHighlighted: true },
        { key: "dashboard", icon: ChartLineUpIcon, name: "Dashboard", description: "Shows where things stand" },
    ],
}

const PRODUCT_SHOWCASE: LandingPageProductShowcase = {
    labels: {
        hookLabel: "2 products · 6 plans — ready to buy today",
        eyebrow: "Products",
        title: "Start from the first two pieces of the system",
        intro: "Two platform products you can pick a plan for and run today — no account needed to look.",
        fromLabel: "from",
        perMonthLabel: "/ month",
        freeLabel: "Free",
        emptyTitle: "No products yet",
        emptyDescription: "The catalog is updating — see the full pricing page for what's open.",
        emptyCtaLabel: "See pricing",
    },
    products: [
        {
            id: "hoc-vien-ai",
            categoryLabel: "Template-generated websites",
            name: "AI Academy",
            tagline: "Spin up your own academy site and classes — with fee collection and an AI teaching assistant built in.",
            features: [
                "<slug>.nivo.vn site + courses + community",
                "Fee collection via SePay / PayOS",
                "AI teaching assistant + certificates",
            ],
            basePriceVnd: 0,
            planCountLabel: "3 plans",
            ctaLabel: "Choose an AI Academy plan",
        },
        {
            id: "ai-agent",
            categoryLabel: "Multi-agent AI assistant",
            name: "nivo AI Agent",
            tagline: "A team of AI assistants on Zalo, Telegram, and WhatsApp for sales, marketing, accounting, and operations.",
            features: [
                "Zalo + Telegram + WhatsApp",
                "1 to many agents depending on plan",
                "Knowledge base (RAG) + playground",
            ],
            basePriceVnd: 490000,
            planCountLabel: "3 plans",
            ctaLabel: "Choose an AI Agent plan",
        },
    ],
}

const PRICING: LandingPagePricing = {
    labels: {
        eyebrow: "Pricing",
        title: "Choose how to start with nivo",
        intro: "Public pricing — no account needed to view. Platform plans buy now; industry solutions need a conversation.",
        productModeLabel: "Products",
        solutionModeLabel: "Industry solutions",
        modeAriaLabel: "Toggle between products and industry solutions",
        recommendedMarker: "★",
        solutionBadgeLabel: "Roadmap",
        solutionTitle: "Industry solutions — in progress",
        solutionDescription: "The full AI-First system per industry is on the roadmap, not buyable today. Run a Lead Leakage Audit and nivo will map the right path.",
        solutionCtaLabel: "Run a Lead Leakage Audit",
        emptyTitle: "No plans yet",
        emptyDescription: "The catalog is updating — see the full pricing page for what's open.",
        emptyCtaLabel: "See pricing",
    },
    products: [
        {
            id: "hoc-vien-ai",
            name: "AI Academy",
            tiers: [
                { id: "khoi-dong", name: "Starter", priceLabel: "Free", isRecommended: false },
                { id: "chuyen-nghiep", name: "Professional", priceLabel: "299,000 VND / month", isRecommended: true },
                { id: "doanh-nghiep", name: "Business", priceLabel: "899,000 VND / month", isRecommended: false },
            ],
            ctaLabel: "See all 3 plans",
        },
        {
            id: "ai-agent",
            name: "nivo AI Agent",
            tiers: [
                { id: "co-ban", name: "Basic", priceLabel: "490,000 VND / month", isRecommended: false },
                { id: "pro", name: "Pro", priceLabel: "990,000 VND / month", isRecommended: true },
                { id: "scale", name: "Scale", priceLabel: "2,400,000 VND / month", isRecommended: false },
            ],
            ctaLabel: "See all 3 plans",
        },
    ],
}

const SOLUTION_BY_INDUSTRY: LandingPageSolutionByIndustry = {
    eyebrow: "By industry",
    title: "Every industry needs a different playbook.",
    intro: "Only nivo Academy is buyable today — the rest are the roadmap this loop is heading toward.",
    items: [
        { key: "academy", industry: "nivo Academy", statusLabel: "Available today", isAvailableToday: true, painPoint: "Enrollment leads fall through", systemLine: "Website → fee collection → AI tutor" },
        { key: "web", industry: "nivo Web", statusLabel: "Not buyable yet", painPoint: "Quotes never get a system", systemLine: "Website → CRM → automation → dashboard" },
        { key: "b2b", industry: "nivo B2B Service", statusLabel: "Not buyable yet", painPoint: "Deals stall between calls", systemLine: "Lead → CRM → workflow → pipeline" },
        { key: "booking", industry: "nivo Booking", statusLabel: "Not buyable yet", painPoint: "No-shows go untracked", systemLine: "Booking → reminders → dashboard" },
        { key: "expert", industry: "nivo Expert", statusLabel: "Not buyable yet", painPoint: "Personal brand, no backend", systemLine: "Content → lead → CRM" },
        { key: "partner", industry: "nivo Partner", statusLabel: "Not buyable yet", painPoint: "Referrals have no home", systemLine: "Partner → CRM → payout tracking" },
    ],
}

const DEMO_FLOW: LandingPageDemoFlow = {
    eyebrow: "Demo",
    title: "See how a lead flows through nivo.",
    intro: "A preview of the full operating loop — today, only the Website/AI Agent leg is a real product.",
    steps: [
        { key: "website-crm", stepNumber: 1, name: "Website → CRM", ctaLabel: "Watch this step", onPress: NOOP },
        { key: "crm-pipeline", stepNumber: 2, name: "CRM Pipeline", ctaLabel: "Watch this step", onPress: NOOP },
        { key: "workflow-followup", stepNumber: 3, name: "Workflow follow-up", ctaLabel: "Watch this step", onPress: NOOP },
        { key: "ai-sales", stepNumber: 4, name: "AI Sales Assistant", ctaLabel: "Watch this step", onPress: NOOP },
    ],
}

const HUMAN_IN_THE_LOOP: LandingPageHumanInTheLoop = {
    eyebrow: "AI + human",
    headlineLead: "AI supports.",
    headlineAccent: "People stay accountable.",
    description: "The AI Agent drafts replies and flags what needs a human — it never sends on its own. Every message a customer receives was approved by someone on your team.",
    ctaLabel: "See a live AI-Agent demo",
    cardBadgeLabel: "AI suggestion · Sales follow-up",
    cardSuggestion: "\"Hi Minh — following up on your quote request from Tuesday. Want me to send the updated pricing sheet?\"",
    cardStatus: "pending",
    cardStatusLabel: "Pending review",
    cardReviewerName: "Account owner",
}

const DASHBOARD_PROOF: LandingPageDashboardProof = {
    eyebrow: "Data proof",
    title: "Founders need to see the bottleneck — not just hear about it.",
    panelLabel: "nivo · Growth Dashboard",
    insightLabel: "AI insight",
    metrics: [
        { key: "sources", value: "Web · Zalo · Ads", label: "Leads by source" },
        { key: "response", value: "< 5 min", label: "Illustrative first-response target" },
    ],
    activityAriaLabel: "Illustrative weekly lead activity",
    activityBars: [
        { key: "mon", heightPercent: 40 },
        { key: "tue", heightPercent: 65 },
        { key: "wed", heightPercent: 50 },
        { key: "thu", heightPercent: 80 },
        { key: "fri", heightPercent: 60 },
    ],
    pipelineLabel: "Pipeline by stage",
    pipelineStages: [
        { key: "new", label: "New lead", percent: 100 },
        { key: "contacted", label: "Contacted", percent: 70 },
        { key: "qualified", label: "Qualified", percent: 45 },
        { key: "won", label: "Won", percent: 20 },
    ],
    disclaimer: "Mockup of the nivo dashboard UI — illustrative figures, not real customer data.",
}

const SYSTEM_STORY: LandingPageSystemStory = {
    eyebrow: "Before & after",
    title: "Real results come from a real system.",
    before: {
        label: "Before",
        points: [
            "Leads sit in a shared spreadsheet",
            "Follow-up depends on who remembers",
            "No view of where deals actually stall",
        ],
    },
    after: {
        label: "After the system",
        points: [
            "Every lead lands in one place automatically",
            "The AI Agent drafts the first follow-up",
            "The dashboard shows the bottleneck at a glance",
        ],
    },
    disclaimer: "Illustrative story, not tied to one customer's numbers.",
}

const AUDIT_CTA: LandingPageAuditCta = {
    eyebrow: "Quick diagnosis",
    title: "Where are you losing leads?",
    description: "A short, free audit maps your current funnel and shows exactly where leads fall through — before you commit to a plan.",
    ctaLabel: "Run a Lead Leakage Audit",
}

const PARTNER_STRIP: LandingPagePartnerStrip = {
    eyebrow: "Ecosystem",
    title: "Partner nivo is not just a reseller.",
    intro: "The partner program is opening up — roadmap, not live yet.",
    chips: [
        { key: "partner-program", label: "Partner Program" },
        { key: "white-label", label: "White-label" },
        { key: "marketplace", label: "Marketplace" },
        { key: "certified", label: "Certified Partner" },
    ],
}

const FAQ: LandingPageFaq = {
    eyebrow: "FAQ",
    title: "Quick answers",
    items: [
        { id: "sell", question: "What does nivo actually sell today?", answer: "Two platform products: AI Academy and nivo AI Agent. CRM, Workflow, and Dashboard are the system roadmap, still expanding." },
        { id: "meaning", question: "What does \"AI-First system\" mean?", answer: "Website → Lead → CRM → Workflow → AI Agent → Dashboard, joined into one operating loop. You start small with one product and connect the rest as the business is ready." },
        { id: "channels", question: "Which channels does the AI assistant cover?", answer: "Zalo and Telegram from the Basic plan; WhatsApp is added from Pro and up." },
    ],
}

const CLOSING: LandingPageClosing = {
    eyebrow: "Ready when you are",
    title: "Start from one product. Grow into the system.",
    description: "Pick a plan today — the rest of the operating loop is the roadmap you grow into.",
    primaryLabel: HERO.primaryLabel,
    secondaryLabel: HERO.secondaryLabel,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    OperatingLoopHero: { tier: "block", role: "the dark full-fold hero + flow rail + mini dashboard card", storyId: "nivo-blocks-landing-operatingloophero-operatingloophero--default" },
    OperatingLoopVisual: { tier: "block", role: "the six-stage flow rail, composed inside the hero", storyId: "nivo-blocks-landing-operatingloopvisual-operatingloopvisual--default" },
    SectionHeading: { tier: "block", role: "the quick-selector header (the block itself renders none)", storyId: "nivo-blocks-landing-sectionheading-sectionheading--align" },
    ProductQuickSelector: { tier: "block", role: "the \"where do you want to start\" intent grid", storyId: "nivo-blocks-landing-productquickselector-productquickselector--default" },
    ProblemStatement: { tier: "block", role: "the core-message beat, composing LeadLeakageMap", storyId: "nivo-blocks-landing-problemstatement-problemstatement--default" },
    LeadLeakageMap: { tier: "block", role: "the leak-stage list, composed inside ProblemStatement", storyId: "nivo-blocks-landing-leadleakagemap-leadleakagemap--default" },
    SystemFlow: { tier: "block", role: "the six-layer operating-loop diagram", storyId: "nivo-blocks-landing-systemflow-systemflow--ai-emphasis" },
    ProductShowcase: { tier: "block", role: "the two real products, side by side", storyId: "nivo-blocks-landing-productshowcase-productshowcase--default" },
    PricingTeaser: { tier: "block", role: "the product/solution pricing toggle", storyId: "nivo-blocks-landing-pricingteaser-pricingteaser--default" },
    SolutionByIndustry: { tier: "block", role: "the per-industry matrix (Academy real today)", storyId: "nivo-blocks-landing-solutionbyindustry-solutionbyindustry--availability" },
    DemoFlow: { tier: "block", role: "the numbered demo-card row", storyId: "nivo-blocks-landing-demoflow-demoflow--default" },
    HumanInTheLoop: { tier: "block", role: "the AI-accountability beat, composing AiSuggestionCard", storyId: "nivo-blocks-landing-humanintheloop-humanintheloop--default" },
    AiSuggestionCard: { tier: "block", role: "the AI-drafted suggestion, composed inside HumanInTheLoop", storyId: "nivo-blocks-landing-aisuggestioncard-aisuggestioncard--status" },
    DashboardProof: { tier: "block", role: "the illustrative dashboard UI mockup", storyId: "nivo-blocks-landing-dashboardproof-dashboardproof--default" },
    SystemStoryCard: { tier: "block", role: "the honest before/after case-study card", storyId: "nivo-blocks-landing-systemstorycard-systemstorycard--eyebrow" },
    AuditCta: { tier: "block", role: "the dark diagnostic CTA band", storyId: "nivo-blocks-landing-auditcta-auditcta--eyebrow" },
    PartnerStrip: { tier: "block", role: "the ecosystem chip row", storyId: "nivo-blocks-landing-partnerstrip-partnerstrip--default" },
    ClosingCta: { tier: "block", role: "the final beat, repeating the hero's own CTAs", storyId: "nivo-blocks-landing-closingcta-closingcta--eyebrow" },
    FaqAccordion: { tier: "block", role: "the self-contained FAQ section", storyId: "nivo-blocks-landing-faqaccordion-faqaccordion--default" },
    Container: { tier: "frame", role: "each bare section's width-capped column" },
    StackV: { tier: "frame", role: "the quick-selector header + grid rhythm" },
}

const commonProps = {
    hero: HERO,
    quickSelectorHeading: QUICK_SELECTOR_HEADING,
    quickSelectorItems: QUICK_SELECTOR_ITEMS,
    problem: PROBLEM,
    systemFlow: SYSTEM_FLOW,
    productShowcase: PRODUCT_SHOWCASE,
    pricing: PRICING,
    solutionByIndustry: SOLUTION_BY_INDUSTRY,
    demoFlow: DEMO_FLOW,
    humanInTheLoop: HUMAN_IN_THE_LOOP,
    dashboardProof: DASHBOARD_PROOF,
    systemStory: SYSTEM_STORY,
    auditCta: AUDIT_CTA,
    partnerStrip: PARTNER_STRIP,
    faq: FAQ,
    closing: CLOSING,
    onBrowseCatalog: NOOP,
    onAudit: NOOP,
    onDemo: NOOP,
    onSelectProduct: NOOP_ID,
    onViewPlans: NOOP_ID,
}

/** STATE — the resolved V2 landing with the catalog present. */
export const Content: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LandingPage"
                tier="screen"
                leaf="Content"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. The full V2 stack composes every section the approved proposal names, in its brand §VII.2 order, each REAL section showing the real 2-product / 6-tier catalog and each VISION section carrying its own honest framing in its own copy."
                states={[
                    {
                        name: "catalog resolved",
                        why: "The full landing: the hero drives into the catalog, the product showcase and pricing teaser show the real 2 products / 6 plans, and every VISION section (system flow, solution by industry, demo flow, dashboard proof, case study, partner strip) renders its own roadmap framing.",
                        code: "<LandingPage {...props} />",
                        render: <LandingPage {...commonProps} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the catalog is still loading; ProductShowcase + PricingTeaser show their skeleton mirror. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="LandingPage"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="Only ProductShowcase and PricingTeaser are derived from the catalog, so only those two regions carry a loading state — every other section (hero, quick selector, problem, system flow, solution by industry, demo flow, human-in-the-loop, dashboard proof, case study, audit, partner, closing, FAQ) is static copy that renders straight away, loading or not. The skeleton mirrors each loaded shape (two panels, two cards) so nothing jumps when the data resolves."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The catalog is still fetching: every static section renders normally while the product showcase and pricing teaser draw their resting skeleton, matching the loaded layout.",
                        code: "<LandingPage {...props} isSkeleton />",
                        render: <LandingPage {...commonProps} isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}
