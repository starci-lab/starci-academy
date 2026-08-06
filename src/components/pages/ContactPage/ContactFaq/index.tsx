"use client"

import React from "react"
import {
    Accordion,
    Link,
    Typography,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { CONTACT_FAQ_INDEXES } from "@/resources/contact"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link ContactFaq}. */
export type ContactFaqProps = WithClassNames<undefined>

/**
 * Contact-specific FAQ — deflects the common reasons people reach out (reply time,
 * login, billing, partnership) before they fill the form. Cross-links to the
 * funnel FAQ on the home page for "is this course right for me" questions instead
 * of duplicating it. Self-contained (reads its own i18n).
 *
 * @param props - optional className (placement only).
 */
export const ContactFaq = ({ className }: ContactFaqProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const bodyItems = [
        () => (
            <Accordion variant="surface">
                {CONTACT_FAQ_INDEXES.map((index) => (
                    <Accordion.Item
                        key={index}
                        aria-label={t(`contact.faq.q${index}`)}
                    >
                        <Accordion.Heading>
                            <Accordion.Trigger>
                                <Typography type="body-sm" weight="medium">
                                    {t(`contact.faq.q${index}`)}
                                </Typography>
                            </Accordion.Trigger>
                        </Accordion.Heading>
                        <Accordion.Panel>
                            <Accordion.Body>
                                <Typography type="body-sm" color="muted">
                                    {t(`contact.faq.a${index}`)}
                                </Typography>
                            </Accordion.Body>
                        </Accordion.Panel>
                    </Accordion.Item>
                ))}
            </Accordion>
        ),
        () => (
            <Link href={`/${locale}#faq`}>
                {t("contact.faq.landingLink")}
            </Link>
        ),
    ]
    return (
        <LabeledCard
            identity={{ tier: "block", component: "ContactFaq" }}
            label={t("contact.faq.title")}
            className={className}
        >
            <StackV gap={5} principle="group-boundary"
                explain="Section group spacing — not sibling-stack, because these blocks are distinct groups rather than same-kind peers."
                items={bodyItems}  />
        </LabeledCard>
    )
}
