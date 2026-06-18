"use client"

import React from "react"
import {
    cn,
} from "@heroui/react"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryAiModelsSwr,
} from "@/hooks"
import {
    AsyncContent,
} from "@/components/blocks"
import type { WithClassNames } from "@/modules/types"
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

/** Props for {@link StarciAi}. */
export interface StarciAiProps extends WithClassNames<undefined> {
    /** Reserved — no caller data props. */
    readonly _reserved?: undefined
}

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
export const StarciAi = ({ className }: StarciAiProps) => {
    const aiModelsSwr = useQueryAiModelsSwr()
    const models = useAppSelector((state) => state.aiModels.models)

    return (
        <div className={cn("mx-auto flex max-w-4xl flex-col gap-6 p-6", className)}>
            <div className="flex flex-col gap-2">
                <StarciAiHeader />
                <TierBadge />
            </div>

            <KeyPoolStatus />

            <AsyncContent
                isLoading={aiModelsSwr.isLoading || !aiModelsSwr.data}
                error={aiModelsSwr.error}
                skeleton={<StarciAiSkeleton />}
            >
                <div className="flex flex-col gap-6">
                    {models.map((model) => (
                        <ModelCard
                            key={model.taskKind}
                            model={model}
                        />
                    ))}
                </div>
            </AsyncContent>
        </div>
    )
}
