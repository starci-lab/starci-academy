"use client"

import React from "react"
import { Card, Link } from "@heroui/react"
import type { ContentEntity } from "@/modules/types"

export interface ContentCardProps {
    /** Content row rendered inside module grid. */
    content: ContentEntity
    /** Navigate to selected content detail. */
    onPress: () => void
}

/**
 * Content card shown in module overview grid.
 * @param {ContentCardProps} props Card props.
 */
export const ContentCard = ({ content, onPress }: ContentCardProps) => {
    return (
        <Card>
            <div>
                <Link className="text-base font-semibold text-foreground" onPress={onPress}>
                    {content.title}
                </Link>
                <div className="h-2" />
                <div className="line-clamp-3 text-sm text-muted">{content.description}</div>
            </div>
        </Card>
    )
}
