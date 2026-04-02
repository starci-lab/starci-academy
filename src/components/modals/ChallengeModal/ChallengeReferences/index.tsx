"use client"

import type { ChallengeReferenceEntity } from "@/modules/types"
import { ReferenceLinks } from "@/components/reuseable/ReferenceLinks"
import React from "react"

export interface ChallengeReferencesProps {
    references: Array<ChallengeReferenceEntity>
}

/**
 * Lists external links for module content inside ContentModal.
 */
export const ChallengeReferences = ({ references }: ChallengeReferencesProps) => {
    return (
        <ReferenceLinks
            references={references}
            titleKey="reference.title"
        />
    )
}
