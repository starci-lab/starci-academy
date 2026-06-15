"use client"

import React from "react"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryAiModelsSwr,
} from "@/hooks"
import {
    StarciAiHeader,
} from "./Header"
import {
    TierBadge,
} from "./TierBadge"
import {
    ModelCard,
} from "./ModelCard"
import {
    KeyPoolStatus,
} from "./KeyPoolStatus"
import {
    StarciAiSkeleton,
} from "./StarciAiSkeleton"

/**
 * StarCI AI feature container.
 *
 * Owns data fetching (the `aiModels` SWR query) and reads the cached model list
 * from redux, then renders its children. The recommended-tier badge is a
 * self-contained section that reads its own tier from redux. Mounted by the
 * `/[locale]/courses/[courseId]/learn/starci-ai` route.
 *
 * Client component: relies on redux selectors and a client SWR hook.
 */
export const StarciAi = () => {
    const aiModelsSwr = useQueryAiModelsSwr()
    const models = useAppSelector((state) => state.aiModels.models)

    // loading gate (per .claude/design/06-skeleton.md): skeleton while loading, or
    // before the query settles with data, or on error — never flash an empty list.
    if (aiModelsSwr.isLoading || !aiModelsSwr.data || !!aiModelsSwr.error) {
        return <StarciAiSkeleton />
    }

    return (
        <div className="mx-auto max-w-4xl p-6">
            <StarciAiHeader />

            <TierBadge />

            <div className="h-6" />

            <KeyPoolStatus />

            <div className="h-8" />

            <div className="flex flex-col gap-5">
                {models.map((model) => (
                    <ModelCard
                        key={model.taskKind}
                        model={model}
                    />
                ))}
            </div>
        </div>
    )
}
