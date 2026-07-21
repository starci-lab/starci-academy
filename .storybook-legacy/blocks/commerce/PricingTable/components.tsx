import type { PricingTableTier } from "@/components/blocks/commerce/PricingTable"

/** Three plans sharing one feature set so the labels line up across columns. */
export const threeTiers: PricingTableTier[] = [
    {
        id: "free",
        name: "Free",
        price: "0₫",
        description: "Try it out and get familiar with the platform.",
        ctaLabel: "Start for free",
        features: [
            { label: "Access to intro lessons", included: true },
            { label: "Grading with the in-house model", included: true },
            { label: "Grading with the premium model", included: false },
            { label: "Unlimited mock interviews", included: false },
            { label: "Priority email support", included: false },
        ],
    },
    {
        id: "pro",
        name: "Professional",
        price: "299.000₫",
        period: "/month",
        description: "For serious learners who want to level up fast.",
        ctaLabel: "Choose Professional",
        isHighlighted: true,
        features: [
            { label: "Access to intro lessons", included: true },
            { label: "Grading with the in-house model", included: true },
            { label: "Grading with the premium model", included: true },
            { label: "Unlimited mock interviews", included: true },
            { label: "Priority email support", included: false },
        ],
    },
    {
        id: "team",
        name: "Team",
        price: "899.000₫",
        period: "/month",
        description: "For study groups or small businesses.",
        ctaLabel: "Contact sales",
        features: [
            { label: "Access to intro lessons", included: true },
            { label: "Grading with the in-house model", included: true },
            { label: "Grading with the premium model", included: true },
            { label: "Unlimited mock interviews", included: true },
            { label: "Priority email support", included: true },
        ],
    },
]
