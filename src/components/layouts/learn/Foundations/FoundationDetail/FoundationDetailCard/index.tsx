"use client"

import React from "react"
import { cn } from "@heroui/react"
import type {
    FoundationEntity,
} from "@/modules/types"
import type { WithClassNames } from "@/modules/types/base/class-name"
import {
    FoundationCardBody,
} from "../../shared/FoundationCardBody"
import {
    FoundationItemThumbnail,
} from "../../FoundationItemThumbnail"
import {
    FoundationMeta,
} from "../../shared/FoundationMeta"

/** Props for {@link FoundationDetailCard}. */
export interface FoundationDetailCardProps extends WithClassNames<undefined> {
    /** Foundation row to render in full. */
    foundation: FoundationEntity
}

/**
 * Full content card for a single foundation: thumbnail, title, meta, description, body.
 *
 * Presentational: renders the supplied foundation, no logic.
 * @param props - the foundation entity to render
 */
export const FoundationDetailCard = ({
    foundation,
    className,
}: FoundationDetailCardProps) => {
    return (
        <div className={cn("card card--default max-w-2xl overflow-hidden rounded-xl border border-divider/60", className)}>
            <FoundationItemThumbnail
                thumbnailUrl={foundation.thumbnailUrl}
                title={foundation.title}
                size="detail"
            />
            <div className="p-4 pt-2">
                <h1 className="text-2xl font-bold">{foundation.title}</h1>
                <div className="mt-2">
                    <FoundationMeta foundation={foundation} />
                </div>
                {
                    foundation.description ? (
                        <div className="text-muted mt-2 text-sm">{foundation.description}</div>
                    ) : null
                }
                <div className="h-6" />
                <FoundationCardBody foundation={foundation} />
            </div>
        </div>
    )
}
