"use client"

import type { ContentReferenceEntity } from "@/modules/types"
import { ReferenceLinks } from "@/components/reuseable/ReferenceLinks"
import React from "react"

export interface ContentReferencesProps {
    references: Array<ContentReferenceEntity>
}

/**
 * Lists external links for module content inside ContentModal.
 */
export const ContentReferences = ({ references }: ContentReferencesProps) => {
    return (
        <ReferenceLinks
            references={references}
            titleKey="course.modules.referencesTitle"
        />
    )
}
