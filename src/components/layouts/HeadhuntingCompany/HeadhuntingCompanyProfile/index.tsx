"use client"

import { Link } from "@heroui/react"
import type { HeadhuntingCompanyEntity } from "@/modules/types"
import { useTranslations } from "next-intl"
import { useMemo } from "react"
import type { HeadhuntingCompanyContactLink } from "../types"
import { buildHeadhuntingCompanyContactLinks } from "../utils"

export interface HeadhuntingCompanyProfileProps {
    /** Headhunting company from Redux. */
    company: HeadhuntingCompanyEntity | undefined
}

/**
 * Company profile block: logo, title, description, and contact links.
 * @param props.company - Headhunting company entity to display.
 */
export const HeadhuntingCompanyProfile = ({ company }: HeadhuntingCompanyProfileProps) => {
    const t = useTranslations()

    const contactLinks = useMemo(
        (): Array<HeadhuntingCompanyContactLink> => buildHeadhuntingCompanyContactLinks(company),
        [company],
    )

    if (!company) {
        return null
    }

    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-start">
            {company.logoUrl ? (
                <img
                    src={company.logoUrl}
                    alt={company.title}
                    className="h-16 w-auto max-w-[200px] object-contain"
                />
            ) : null}
            <div className="flex-1">
                <h1 className="text-2xl font-bold">{company.title}</h1>
                {company.description ? (
                    <p className="text-muted mt-2 text-sm">{company.description}</p>
                ) : null}
                {contactLinks.length > 0 ? (
                    <ul className="mt-4 space-y-2 text-sm">
                        {contactLinks.map((link) => (
                            <li key={link.labelKey}>
                                <span className="text-muted font-medium">{t(link.labelKey)}: </span>
                                {link.href ? (
                                    <Link
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-accent"
                                    >
                                        {link.value}
                                    </Link>
                                ) : (
                                    <span>{link.value}</span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </div>
    )
}
