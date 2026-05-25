"use client"

import React from "react"
import { MarkdownContent } from "@/components/reuseable"
import type { CodeImplementationEntity } from "@/modules/types"
import { Chip } from "@heroui/react"
import { useTranslations } from "next-intl"

export interface ImplementationCardProps {
    /** One implementation guide row from `content.codeImplementations`. */
    item: CodeImplementationEntity
}

/**
 * Renders guide and example for one target language.
 * @param props.item - Code implementation entity for this card.
 */
export const ImplementationCard = ({ item }: ImplementationCardProps) => {
    const t = useTranslations()

    return (
        <article className="rounded-xl border border-default-200 p-4 flex flex-col gap-4">
            <Chip variant="secondary" color="accent" size="sm" className="w-fit">
                <Chip.Label>{item.lang}</Chip.Label>
            </Chip>
            <div>
                <h3 className="text-sm font-semibold mb-2">
                    {t("content.codeImplementation.guideHeading")}
                </h3>
                <MarkdownContent markdown={item.guide} />
            </div>
            <div>
                <h3 className="text-sm font-semibold mb-2">
                    {t("content.codeImplementation.exampleHeading")}
                </h3>
                <MarkdownContent markdown={item.example} />
            </div>
        </article>
    )
}
