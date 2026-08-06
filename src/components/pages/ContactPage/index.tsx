"use client"

import React from "react"
import {
    Typography,
} from "@heroui/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { ContactChannels } from "./ContactChannels"
import { ContactForm } from "./ContactForm"
import { ContactFaq } from "./ContactFaq"
import { LabeledCard } from "@/components/blocks/cards/LabeledCard"
import { PageContainer } from "@/components/blocks/layout/PageContainer"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Grid } from "@/components/frames/Grid"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link Contact}. */
export type ContactPageProps = WithClassNames<undefined>

/**
 * Contact page (`/[locale]/contact`). Founder-led routing: a header with an honest
 * response-time line, the real direct channels + founder card on the left, a
 * working message form (emailed to the team) on the right, and a contact-specific
 * FAQ that deflects + cross-links the funnel FAQ. Pure composition — blocks +
 * features only, no styling (placement classes only).
 *
 * @param props - optional className (placement only).
 */
export const ContactPage = ({ className }: ContactPageProps) => {
    const t = useTranslations()
    return (
        <PageContainer className={className}>
            <div className="flex flex-col gap-10">
                <StackV
                    gap={3}
                    principle="sibling-stack"
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
