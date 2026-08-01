/**
 * Terms of Service — structured content rendered natively by {@link import("../LegalPage").LegalPage}
 * with Typography (NO markdown). Grounded in what StarCi Academy actually offers (self-paced courses +
 * challenges + AI grading + capstone projects, paid via gateways) and Vietnamese law. Provided as a
 * starting template — have a lawyer review before relying on it.
 */

import type {
    LegalDocument,
} from "./types"

/** "Last updated" date shown in the page header (ISO; display formatted by the page). */
export const TERMS_LAST_UPDATED = "2026-06-21"

const vi: LegalDocument = {
    intro: "Welcome to StarCi Academy (academy.starci.org). By creating an account or using the platform, you agree to the Terms of Service below.",
    sections: [
        {
            heading: "1. The service",
            paragraphs: [
                "StarCi is a self-paced programming learning platform organised into tracks (Fullstack, System Design, DevOps, AI/LLM), covering lesson content, challenges, AI grading and capstone projects. We may update, add or remove features and content over time.",
            ],
        },
        {
            heading: "2. Accounts",
            paragraphs: [
                "You need an account to use most features. You are responsible for everything done under your account and must keep your credentials safe. Provide accurate information when signing up. An account is for one individual — do not share it.",
            ],
        },
        {
            heading: "3. Payments, plans and refunds",
            items: [
                { text: "Some courses and plans are paid. Prices may change by phase (e.g. pioneer / early / standard pricing) and are shown before you pay." },
                { text: "Payments are processed by third-party gateways (PayOS, Sepay, Stripe, PayPal, NOWPayments). Paying is also subject to those gateways' terms." },
                { text: "After a purchase you are granted access to the corresponding content. Refund requests are reviewed case by case; please contact us." },
            ],
        },
        {
            heading: "4. Intellectual property",
            items: [
                { text: "All course content, lessons, challenges and materials belong to StarCi (or its licensors). You may use them for your own personal learning; do not copy, redistribute, sell or publish them without permission." },
                { label: "Your code and your work stay yours.", text: "When you submit a repo for grading, you allow us to access and process it (including through AI services) solely for grading and feedback." },
            ],
        },
        {
            heading: "5. Acceptable use",
            paragraphs: [
                "You agree not to: share your account; copy or redistribute paid content; scrape data automatically; abuse the AI features or try to bypass limits; interfere with the platform's operation or security; or use the service for unlawful purposes.",
            ],
        },
        {
            heading: "6. AI grading",
            paragraphs: [
                "AI scores and feedback are indicative and meant to support learning — we do not guarantee absolute accuracy and results may vary. Scores are for learning on the platform, not an official certification.",
            ],
        },
        {
            heading: "7. Limitation of liability",
            paragraphs: [
                "The service is provided \"as is\". To the extent permitted by law, StarCi is not liable for indirect damages arising from the use of (or inability to use) the service. We work to keep the service stable but do not guarantee uninterrupted availability.",
            ],
        },
        {
            heading: "8. Suspension and termination",
            paragraphs: [
                "We may suspend or terminate accounts that breach these terms. You may stop using the service and request account deletion at any time.",
            ],
        },
        {
            heading: "9. Governing law",
            paragraphs: [
                "These terms are governed by the laws of Vietnam. Disputes will first be resolved through good-faith negotiation; failing that, by the competent Vietnamese courts.",
            ],
        },
        {
            heading: "10. Changes to these terms",
            paragraphs: [
                "We may update these terms. Material changes will be announced; continuing to use the service after an update means you accept it.",
            ],
        },
        {
            heading: "11. Contact",
            paragraphs: [
                "For any question about these terms, contact: cuongnvtse160875@gmail.com.",
            ],
        },
    ],
}

const en: LegalDocument = {
    intro: "Welcome to StarCi Academy (academy.starci.org). By creating an account or using the platform, you agree to the Terms of Service below.",
    sections: [
        {
            heading: "1. The service",
            paragraphs: [
                "StarCi is a self-paced programming learning platform (Fullstack, System Design, DevOps, AI/LLM), including lesson content, challenges, AI grading, and capstone projects. We may update, add, or remove features and content over time.",
            ],
        },
        {
            heading: "2. Accounts",
            paragraphs: [
                "You need an account for most features. You are responsible for all activity under your account and must keep your credentials secure. Provide accurate information when registering. An account is for one individual — do not share it.",
            ],
        },
        {
            heading: "3. Payments, plans, and refunds",
            items: [
                { text: "Some courses and plans are paid. Prices may vary by phase (e.g. pioneer / early-bird / regular) and are shown before you pay." },
                { text: "Payments are processed by third-party gateways (PayOS, Sepay, Stripe, PayPal, NOWPayments) and are also subject to their terms." },
                { text: "After purchase, you receive access to the corresponding content. Refund requests are reviewed case by case; please contact us." },
            ],
        },
        {
            heading: "4. Intellectual property",
            items: [
                { text: "All course content, lessons, challenges, and materials belong to StarCi (or its licensors). You may use them for personal learning; do not copy, redistribute, sell, or make them public without permission." },
                { label: "Your code and work remain yours.", text: "When you submit a repo for grading, you grant us access to process it (including via AI services) solely for grading and feedback." },
            ],
        },
        {
            heading: "5. Acceptable use",
            paragraphs: [
                "You agree not to: share accounts; copy or redistribute paid content; scrape data automatically; abuse the AI features or attempt to bypass limits; interfere with the platform's operation or security; or use the service for unlawful purposes.",
            ],
        },
        {
            heading: "6. AI grading",
            paragraphs: [
                "AI grades and feedback are indicative and for learning support — we do not guarantee absolute accuracy and results may vary. Scores are for learning on the platform, not an official certification.",
            ],
        },
        {
            heading: "7. Limitation of liability",
            paragraphs: [
                "The service is provided \"as is\". To the extent permitted by law, StarCi is not liable for indirect damages arising from use of (or inability to use) the service. We strive for stable operation but do not guarantee uninterrupted availability.",
            ],
        },
        {
            heading: "8. Suspension and termination",
            paragraphs: [
                "We may suspend or terminate accounts that violate these terms. You may stop using the service and request account deletion at any time.",
            ],
        },
        {
            heading: "9. Governing law",
            paragraphs: [
                "These terms are governed by the laws of Vietnam. Disputes are first resolved through good-faith negotiation; failing that, by the competent Vietnamese courts.",
            ],
        },
        {
            heading: "10. Changes to these terms",
            paragraphs: [
                "We may update these terms. Significant changes will be announced; continued use after an update means you accept it.",
            ],
        },
        {
            heading: "11. Contact",
            paragraphs: [
                "For any question about these terms, contact: cuongnvtse160875@gmail.com.",
            ],
        },
    ],
}

/** Terms of Service per locale. */
export const TERMS_OF_SERVICE: Record<string, LegalDocument> = { vi, en }
