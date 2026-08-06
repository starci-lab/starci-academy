"use client"

import React, { useMemo } from "react"
import { Link, Typography } from "@heroui/react"
import { useTranslations } from "next-intl"
import type { HeadhuntingCompanyContactLink } from "@/modules/types/entities/headhunting"
import { buildHeadhuntingCompanyContactLinks } from "@/modules/utils/careers/headhunting"
import { useAppSelector } from "@/redux/hooks"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * Company profile block: logo, title, description, and contact links.
 *
 * Self-contained section (single-use): reads the active company from the Redux
 * singleton itself and derives its contact links, so the container just renders
 * `<HeadhuntingCompanyProfile />`.
 */
export const HeadhuntingCompanyProfile = () => {
    const t = useTranslations()
    const company = useAppSelector((state) => state.headhunter.company)

    const contactLinks = useMemo(
        (): Array<HeadhuntingCompanyContactLink> => buildHeadhuntingCompanyContactLinks(company),
        [company],
    )

    if (!company) {
        return null
    }

    return (
        <StackH identity={{ tier: "page", component: "HeadhuntingCompanyProfile" }} gap={4} principle="content-row" at="md" align="start"
            explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
            items={[
                () => (company.logoUrl ? (
                    <img
                        src={company.logoUrl}
                        alt={company.title}
                        className="h-16 w-auto max-w-[200px] object-contain"
                    />
                ) : null),
                () => (
                    <StackV gap={4} principle="content-row" classNames={["flex-1"]}
                        explain="Keeps primary content and trailing meta on one baseline so the meta does not drop under the title."
                        items={[
                            () => <Typography type="h3" weight="bold">{company.title}</Typography>,
                            () => (company.description ? (
                                <Typography type="body-sm" color="muted">{company.description}</Typography>
                            ) : null),
                            () => (contactLinks.length > 0 ? (
                                <ul data-principle="sibling-stack" className="flex flex-col gap-2">
                                    {contactLinks.map((link) => (
                                        <StackH key={link.labelKey} as="li" gap={3} principle="identity" at="sm" align="center"
                                            explain="Keeps avatar and identity text as one peer unit so the person label stays beside the face."
                                            items={[
                                                () => (
                                                    <Typography type="body-sm" weight="medium" color="muted">
                                                        {t(link.labelKey)}:
                                                    </Typography>
                                                ),
                                                () => (link.href ? (
                                                    <Link
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-accent-soft-foreground"
                                                    >
                                                        {link.value}
                                                    </Link>
                                                ) : (
                                                    <Typography type="body-sm">{link.value}</Typography>
                                                )),
                                            ]} />
                                    ))}
                                </ul>
                            ) : null),
                        ]} />
                ),
            ]} />
    )
}
