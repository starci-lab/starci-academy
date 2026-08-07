"use client"

import React from "react"
import {
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import { ContactChannels } from "./ContactChannels"
import { ContactForm } from "./ContactForm"
import { ContactFaq } from "./ContactFaq"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { PageContainer } from "@/components/blocks/layout/PageContainer"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Grid } from "@/components/frames/Grid"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link Contact}. */
export type ContactPageProps = Record<string, never>
/**
 * Contact page (`/[locale]/contact`). Founder-led routing: a header with an honest
 * response-time line, the real direct channels + founder card on the left, a
 * working message form (emailed to the team) on the right, and a contact-specific
 * FAQ that deflects + cross-links the funnel FAQ. Pure composition — blocks +
 * features only, no styling (placement classes only).
 *
 * @param props - optional className (placement only).
 */
export const ContactPage = () => {
    const t = useTranslations()
    return (
        <PageContainer>
            <div className="flex flex-col gap-10">
                <StackV
                    gap={3}
                    principle="sibling-stack"
                    explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                    items={[
                        () => (
                            <PageHeader
                                title={t("contact.title")}
                                description={t("contact.intro")}
                            />
                        ),
                        () => (
                            <Typography type="body-sm" color="muted">
                                {t("contact.responseTime")}
                            </Typography>
                        ),
                    ]}
                />

                <Grid
                    columns={{ base: 1, lg: 2 }}
                    principle="block-boundary"
                    explain="Block-to-block spacing — not group-boundary, because this separates major blocks rather than nested section groups."
                    items={[
                        { key: "channels", content: () => <ContactChannels /> },
                        {
                            key: "form",
                            content: () => (
                                <LabeledCard label={t("contact.form.title")}>
                                    <ContactForm />
                                </LabeledCard>
                            ),
                        },
                    ]}
                />

                <ContactFaq />
            </div>
        </PageContainer>
    )
}
