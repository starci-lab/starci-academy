"use client"

import React from "react"
import {
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    PageContainer,
    PageHeader,
} from "@/components/blocks"

/** Which legal document this page renders. */
export type LegalKind = "terms" | "privacy"

/** Props for {@link LegalPage}. */
export interface LegalPageProps {
    /** Selects the i18n group under `legal.*` to render. */
    kind: LegalKind
}

/**
 * Shared stub page for the legal documents (`/terms`, `/privacy`). Honest
 * placeholder: a real header + a short "being finalized" body + a line pointing
 * questions at the founder email. Pure composition (PageContainer + PageHeader);
 * swap the i18n body for the full policy when it exists.
 *
 * @param props - {@link LegalPageProps}
 */
export const LegalPage = ({ kind }: LegalPageProps) => {
    const t = useTranslations()
    return (
        <PageContainer>
            <div className="flex flex-col gap-10">
                <PageHeader
                    title={t(`legal.${kind}.title`)}
                    description={t(`legal.${kind}.description`)}
                />
                <div className="flex max-w-2xl flex-col gap-4">
                    <Typography type="body" color="muted">
                        {t(`legal.${kind}.body`)}
                    </Typography>
                    <Typography type="body-sm" color="muted">
                        {t("legal.contactNote")}
                    </Typography>
                </div>
            </div>
        </PageContainer>
    )
}
