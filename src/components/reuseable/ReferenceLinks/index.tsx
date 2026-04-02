import { Link, Spacer } from "@heroui/react"
import { LinkSimpleIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import React from "react"

/** Minimal shape for content or challenge reference rows. */
export interface ReferenceLinkItem {
    id: string
    url: string
    orderIndex: number
    alias: string
}

export interface ReferenceLinksProps {
    references: Array<ReferenceLinkItem>
    /** i18n key for section title (e.g. reference.title). */
    titleKey: string
}

/**
 * Sorted list of external reference links (content or challenge).
 */
export const ReferenceLinks = ({ references, titleKey }: ReferenceLinksProps) => {
    const t = useTranslations()
    if (references.length === 0) {
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
                {references.sort((prev, next) => prev.orderIndex - next.orderIndex).map((reference) => {
                    return (
                        <li key={reference.id} className="flex flex-wrap items-center gap-2">
                            <span className="text-sm text-foreground-500">{reference.alias}</span>
                            <span className="text-sm text-foreground">•</span>
                            <Link
                                href={reference.url}
                                isExternal
                                showAnchorIcon
                                className="text-sm text-primary"
                                anchorIcon={<LinkSimpleIcon className="size-4" />}
                            >
                                {reference.url}
                            </Link>
                        </li>
                    )
                })}
            </ul>
        </>
    )
}
