/**
 * Privacy Policy — structured content rendered natively by {@link import("../LegalPage").LegalPage}
 * with Typography (NO markdown). Grounded in what StarCi Academy actually collects/processes (auth,
 * learning, payment via gateways, GitHub link + encrypted token, cookies/GA, self-hosted + cloud AI
 * grading) and aligned with Vietnam's Decree 13/2023/ND-CP (PDPD). Provided as a starting template —
 * have a lawyer review before relying on it.
 */

import type {
    LegalDocument,
} from "./types"

/** "Last updated" date shown in the page header (ISO; display formatted by the page). */
export const PRIVACY_LAST_UPDATED = "2026-06-21"

const vi: LegalDocument = {
    intro: "StarCi Academy (\"StarCi\", \"we\") respects your privacy. This policy describes how we collect, use, store and protect personal data when you use the platform at academy.starci.org, in line with Decree 13/2023/ND-CP on personal data protection.",
    sections: [
        {
            heading: "1. Data we collect",
            items: [
                { label: "Account information:", text: "email, display name, username, avatar — when you sign up or sign in with Google / GitHub." },
                { label: "Learning data:", text: "course progress, challenge submissions and scores, review history (flashcards), your profile (bio, links, pinned projects), and any CV you upload for feedback." },
                { label: "Payment data:", text: "purchases of courses or plans, processed by payment gateways (PayOS, Sepay for VND; Stripe, PayPal, NOWPayments for international). We never store your card number — only the transaction record (id, amount, status)." },
                { label: "GitHub account:", text: "your GitHub username when you link it. If you submit a private repository for AI grading, the access token you provide is encrypted at rest, used only temporarily to clone the repo, and never shown again." },
                { label: "Technical data:", text: "IP address, browser and device type, and cookies (see section 5)." },
            ],
        },
        {
            heading: "2. How we use it",
            paragraphs: [
                "We process data to: provide and run the learning service; grade work and evaluate projects with AI; process payments and manage plans; personalise your learning path; improve the product through analytics; keep the platform secure and prevent fraud; and contact you for support.",
            ],
        },
        {
            heading: "3. Legal basis",
            paragraphs: [
                "We process data based on your consent and to perform a contract (providing the service you signed up for). For analytics cookies, we only collect after you consent.",
            ],
        },
        {
            heading: "4. Sharing with third parties",
            paragraphs: [
                "We do not sell your personal data. We share only the minimum necessary with the parties that help us run the service:",
            ],
            items: [
                { label: "Authentication & sign-in:", text: "Keycloak, Google, GitHub." },
                { label: "Payments:", text: "PayOS, Sepay, Stripe, PayPal, NOWPayments." },
                { label: "Analytics:", text: "Google Analytics (only with your consent)." },
                { label: "AI grading:", text: "grading mostly runs on self-hosted models on our own servers; when needed we also use OpenAI or Google (Gemini), in which case the submitted work / repo content is sent to those services for grading." },
                { label: "Infrastructure:", text: "the server and storage services that run the platform." },
            ],
        },
        {
            heading: "5. Cookie",
            paragraphs: [
                "Essential cookies (sign-in, security, language preference) are always on so the system works. Analytics cookies (Google Analytics) turn on only when you consent via the cookie banner. You can change your choice at any time.",
            ],
        },
        {
            heading: "6. Cross-border data transfers",
            paragraphs: [
                "Some providers (Google Analytics, AI services, a few payment gateways) process data outside Vietnam. When you use those services, the related data may be transferred and stored abroad; we share only the minimum necessary.",
            ],
        },
        {
            heading: "7. Retention",
            paragraphs: [
                "We keep data for as long as your account is active and as required by law. When it is no longer needed, data is deleted or anonymised.",
            ],
        },
        {
            heading: "8. Security",
            paragraphs: [
                "Session refresh tokens are stored in HttpOnly cookies; we apply CSRF protection; secrets (GitHub tokens, your own AI keys) are encrypted with AES-256-GCM at rest. Passwords are handled by the authentication system — we never see your password.",
            ],
        },
        {
            heading: "9. Your rights (under Decree 13/2023)",
            paragraphs: [
                "You have the right to: be informed about the processing of your data; give or withdraw consent; access, view and correct your data; request deletion; restrict or object to processing; and lodge a complaint with the competent authority. To exercise these rights, contact us by email as set out in section 12.",
            ],
        },
        {
            heading: "10. Children",
            paragraphs: [
                "The platform is for people aged 16 and over. Anyone under 16 needs the consent of a parent or guardian under Decree 13/2023.",
            ],
        },
        {
            heading: "11. Changes to this policy",
            paragraphs: [
                "We may update this policy as needed. Material changes will be announced, and the \"Last updated\" date at the top of the page always reflects the current version.",
            ],
        },
        {
            heading: "12. Contact",
            paragraphs: [
                "For any question about privacy or personal data, contact: cuongnvtse160875@gmail.com.",
            ],
        },
    ],
}

const en: LegalDocument = {
    intro: "StarCi Academy (\"StarCi\", \"we\") respects your privacy. This policy explains how we collect, use, store, and protect personal data when you use the platform at academy.starci.org, in line with Vietnam's Decree 13/2023/ND-CP on personal data protection.",
    sections: [
        {
            heading: "1. Data we collect",
            items: [
                { label: "Account information:", text: "email, display name, username, avatar — when you register or sign in with Google / GitHub." },
                { label: "Learning data:", text: "course progress, challenge submissions and scores, flashcard review history, your profile (bio, links, pinned projects), and any CV you upload for review." },
                { label: "Payment data:", text: "purchases of courses or plans, processed by payment gateways (PayOS, Sepay for VND; Stripe, PayPal, NOWPayments for international). We do not store your card numbers — only transaction records (id, amount, status)." },
                { label: "GitHub account:", text: "your GitHub username when you link it. If you submit a private repository for AI grading, an access token you provide is encrypted at rest, used only transiently to clone the repo, and never shown again." },
                { label: "Technical data:", text: "IP address, browser and device type, and cookies (see section 5)." },
            ],
        },
        {
            heading: "2. How we use it",
            paragraphs: [
                "We process data to: provide and operate the learning service; grade work and evaluate projects with AI; process payments and manage plans; personalize your learning path; improve the product through analytics; secure the service and prevent abuse; and contact you for support.",
            ],
        },
        {
            heading: "3. Legal basis",
            paragraphs: [
                "We process data based on your consent and to perform our contract (delivering the service you sign up for). For analytics cookies, we only collect after you consent.",
            ],
        },
        {
            heading: "4. Sharing with third parties",
            paragraphs: [
                "We do not sell your personal data. We share only the minimum necessary with providers that help run the service:",
            ],
            items: [
                { label: "Authentication & sign-in:", text: "Keycloak, Google, GitHub." },
                { label: "Payments:", text: "PayOS, Sepay, Stripe, PayPal, NOWPayments." },
                { label: "Analytics:", text: "Google Analytics (only with your consent)." },
                { label: "AI grading:", text: "grading runs primarily on a model self-hosted on our servers; when needed we also use OpenAI or Google (Gemini), in which case submission / repo content is sent to those services for grading." },
                { label: "Infrastructure:", text: "the server and storage services that run the platform." },
            ],
        },
        {
            heading: "5. Cookies",
            paragraphs: [
                "Necessary cookies (sign-in, security, language) are always on so the system works. Analytics cookies (Google Analytics) turn on only when you consent via the cookie banner. You can change your choice at any time.",
            ],
        },
        {
            heading: "6. International transfers",
            paragraphs: [
                "Some providers (Google Analytics, AI services, some payment gateways) process data outside Vietnam. When you use these services, related data may be transferred and stored abroad; we share only the minimum necessary.",
            ],
        },
        {
            heading: "7. Retention",
            paragraphs: [
                "We keep data for as long as your account is active and as required by law. When no longer needed, data is deleted or anonymized.",
            ],
        },
        {
            heading: "8. Security",
            paragraphs: [
                "Session refresh tokens are stored in an HttpOnly cookie; we apply CSRF protection; secrets (your GitHub token, your own AI keys) are encrypted with AES-256-GCM at rest. Passwords are managed by the authentication system — we never see your password.",
            ],
        },
        {
            heading: "9. Your rights (under Decree 13/2023)",
            paragraphs: [
                "You have the right to: be informed about processing; consent or withdraw consent; access, view, and correct your data; request deletion; restrict or object to processing; and lodge a complaint with the competent authority. To exercise these rights, contact us at the email in section 12.",
            ],
        },
        {
            heading: "10. Children",
            paragraphs: [
                "The platform is for people aged 16 and over. Those under 16 need the consent of a parent or guardian under Decree 13/2023.",
            ],
        },
        {
            heading: "11. Changes to this policy",
            paragraphs: [
                "We may update this policy when needed. Significant changes will be announced, and the \"Last updated\" date at the top always reflects the current version.",
            ],
        },
        {
            heading: "12. Contact",
            paragraphs: [
                "For any question about privacy or personal data, contact: cuongnvtse160875@gmail.com.",
            ],
        },
    ],
}

/** Privacy Policy per locale. */
export const PRIVACY_POLICY: Record<string, LegalDocument> = { vi, en }
