"use client"

import React from "react"
import {
    Breadcrumbs,
    Button,
    Typography,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    pathConfig,
} from "@/resources/path"
import {
    PRIVACY_LAST_UPDATED,
    PRIVACY_POLICY,
    TERMS_LAST_UPDATED,
    TERMS_OF_SERVICE,
} from "@/resources/legal"
import type {
    LegalSection,
} from "@/resources/legal"
import { PageContainer } from "@/components/blocks/layout/PageContainer"
import { PageHeader } from "@/components/blocks/layout/PageHeader"
import { Box } from "@/components/frames/Box"
import { StackV } from "@/components/frames/Stack"

/** Which legal document this page renders. */
export type LegalKind = "terms" | "privacy"

/** Props for {@link LegalPage}. */
export interface LegalPageProps {
    /** Selects the legal document (and its `legal.*` header copy) to render. */
    kind: LegalKind
}

/** Props for the in-page {@link Section} renderer. */
interface SectionProps {
    /** One numbered legal section from the structured document. */
    section: LegalSection
}

/**
 * Renders one numbered section: heading + body paragraphs + an optional bullet
 * list whose items may carry a bold lead label. Plain Typography — no markdown.
 */
const Section = ({ section }: SectionProps) => {
    const sectionItems = [
        () => <Typography.Heading level={4} weight="semibold">{section.heading}</Typography.Heading>,
        ...(section.paragraphs?.map((paragraph) => () => (
            <Typography key={paragraph} type="body" color="muted" className="leading-relaxed">
                {paragraph}
            </Typography>
        )) ?? []),
        ...(section.items
            ? [() => (
                <ul data-principle="sibling-stack" className="flex flex-col gap-2">
                    {section.items!.map((item) => (
                        <li key={item.label ?? item.text} data-principle="icon-text" className="flex gap-2">
                            <span className="mt-2 size-1.5 shrink-0 rounded-full bg-default-400" aria-hidden />
                            <Typography type="body" color="muted" className="leading-relaxed">
                                {item.label ? (
                                    <span className="font-semibold text-foreground">{`${item.label} `}</span>
                                ) : null}
                                {item.text}
                            </Typography>
                        </li>
                    ))}
                </ul>
            )]
            : []),
    ]
    return (
        <StackV as="section" gap={4} items={sectionItems} />
    )
}

/**
 * Shared legal document page (`/terms`, `/privacy`): a 3-tier reading column —
 * breadcrumb → `PageHeader` (title + description + last-updated) → the document
 * rendered NATIVELY from structured content (numbered sections of paragraphs and
 * bullet lists) with Typography. No markdown. Document picked by `kind` + the
 * active locale (falls back to `vi`); copy lives in `legal/content/{privacy,terms}.ts`.
 *
 * @param props - {@link LegalPageProps}
 */
export const LegalPage = ({ kind }: LegalPageProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const docs = kind === "privacy" ? PRIVACY_POLICY : TERMS_OF_SERVICE
    const doc = docs[locale] ?? docs.vi
    const lastUpdatedIso = kind === "privacy" ? PRIVACY_LAST_UPDATED : TERMS_LAST_UPDATED
    // local-midnight parse avoids a timezone day-shift; localized long date
    const lastUpdated = new Date(`${lastUpdatedIso}T00:00:00`).toLocaleDateString(
        locale === "vi" ? "vi-VN" : "en-GB",
        { day: "numeric", month: "long", year: "numeric" },
    )

    const docItems = [
        () => (
            <Typography type="body" className="leading-relaxed">
                {doc.intro}
            </Typography>
        ),
        ...doc.sections.map((section) => () => (
            <Section key={section.heading} section={section} />
        )),
    ]

    return (
        <PageContainer>
            <Box principle="center-measure" className="mx-auto max-w-3xl"
                explain="Caps reading width so long copy does not stretch edge-to-edge across the viewport.">
                <StackV gap={7} principle="layout-split"
                    explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                    items={[
                        () => (
                            <PageHeader
                                breadcrumb={(
                                    <Breadcrumbs>
                                        <Breadcrumbs.Item onPress={() => router.push(pathConfig().locale().build())}>
                                            {t("nav.home")}
                                        </Breadcrumbs.Item>
                                        <Breadcrumbs.Item>
                                            {t(`legal.${kind}.title`)}
                                        </Breadcrumbs.Item>
                                    </Breadcrumbs>
                                )}
                                title={t(`legal.${kind}.title`)}
                                description={t(`legal.${kind}.description`)}
                                meta={(
                                    <Typography type="body-xs" color="muted">
                                        {t("legal.lastUpdated", { date: lastUpdated })}
                                    </Typography>
                                )}
                            />
                        ),
                        () => <StackV gap={7} principle="layout-split"
                            explain="Major layout split — not block-boundary, because this separates primary page regions rather than adjacent blocks."
                            items={docItems} />,
                        () => (
                            <Button
                                variant="tertiary"
                                size="sm"
                                className="self-start"
                                onPress={() => router.push(pathConfig().locale().course().build())}
                            >
                                {`${t("cart.browseCourses")} →`}
                            </Button>
                        ),
                    ]} />
            </Box>
        </PageContainer>
    )
}
