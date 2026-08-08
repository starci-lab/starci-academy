"use client"

import React from "react"
import { Chip } from "@/components/atoms/chips/Chip"
import { useTranslations } from "next-intl"
import { MarkdownContent } from "@/components/blocks/rendering/MarkdownContent"
import type { CodeExplainingEntity } from "@/modules/types/entities/code-explaining"

/** Props for {@link ExplainingCard}. */
export interface ExplainingCardProps {
    /** One code explaining row from `content.codeExplainings`. */
    item: CodeExplainingEntity
}

/**
 * Renders one critical code snippet and its explanation.
 * @param props.item - Code explaining entity for this card.
 */
export const ExplainingCard = ({ item }: ExplainingCardProps) => {
    const t = useTranslations()

    return (
        <article className={"rounded-xl border border-default-200 p-4 flex flex-col gap-3"}>
            <div className="flex items-center gap-2">
                <Chip
                    tone="accent"
                    text={t("content.codeExplainings.indexLabel", { index: item.sortIndex })}
                />
                {item.lang ? (
                    <Chip tone="default" text={item.lang} />
                ) : null}
            </div>
            <MarkdownContent markdown={item.code} />
            <MarkdownContent markdown={item.explain} />
        </article>
    )
}
