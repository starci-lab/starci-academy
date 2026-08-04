"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { _EntityResultRow, metaForKind, type EntityResultRowProps } from "./component"

/** Props the connected {@link EntityResultRow} takes from its caller. */
export type EntityResultRowConnectedProps = Omit<EntityResultRowProps, "kindLabel" | "enrollToOpenLabel">

/**
 * One pickable RAG result row — the CONNECTED half: resolves the kind-chip
 * label + "Enrol to open" line via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link EntityResultRowConnectedProps}
 */
export const EntityResultRow = ({ item, ...props }: EntityResultRowConnectedProps) => {
    const t = useTranslations("entityResult")
    const meta = metaForKind(item.kind)

    return (
        <_EntityResultRow
            {...props}
            item={item}
            kindLabel={t(meta.chip)}
            enrollToOpenLabel={t("enrollToOpen")}
        />
    )
}
