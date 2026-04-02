"use client"

import { Link, Spacer } from "@heroui/react"
import { LinkSimpleIcon } from "@phosphor-icons/react"
import { useLocale, useTranslations } from "next-intl"
import React, { useMemo } from "react"

/** Minimal shape for content or challenge reference rows. */
export interface ReferenceLinkItem {
    id: string
    url: string
    orderIndex: number
    alias?: string | null
    translations?: Array<{
        locale: string
        field: string
        value: string
    }>
}

export interface ReferenceLinksProps {
    references: Array<ReferenceLinkItem>
    /** i18n key for section title (e.g. course.modules.referencesTitle). */
    titleKey: string
}

function resolveUrl(item: ReferenceLinkItem): string {
    return item.url.trim()
}

function resolveLabel(item: ReferenceLinkItem, locale: string): string {
    const tr = item.translations?.find(
        (row) => row.locale === locale && row.field === "alias",
    )
    if (tr?.value?.trim()) {
        return tr.value.trim()
    }
    if (item.alias?.trim()) {
        return item.alias.trim()
    }
    try {
        return new URL(resolveUrl(item)).hostname
    } catch {
        return resolveUrl(item)
    }
}

/**
 * Sorted list of external reference links (content or challenge).
 */
export const ReferenceLinks = ({ references, titleKey }: ReferenceLinksProps) => {
    const t = useTranslations()
    const locale = useLocale()

    const rows = useMemo(() => {
        return [...references].sort((a, b) => a.orderIndex - b.orderIndex)
    }, [references])

    if (rows.length === 0) {
        return null
    }

    return (
        <>
            <Spacer y={8} />
            <div className="text-sm font-semibold text-foreground">
                {t(titleKey)}
            </div>
            <Spacer y={2} />
            <ul className="flex flex-col gap-2">
                {rows.map((ref) => {
                    const href = resolveUrl(ref)
                    const label = resolveLabel(ref, locale)
                    return (
                        <li key={ref.id} className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-foreground-500">{label}</span>
                            <span className="text-sm text-foreground">•</span>
                            <Link
                                href={href}
                                isExternal
                                showAnchorIcon
                                className="text-sm text-primary"
                                anchorIcon={<LinkSimpleIcon className="size-4" />}
                            >
                                {href}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}
