import { Sparkles as SparkleIcon } from "@gravity-ui/icons"
import React from "react"
import {
    Chip,
    cn,
} from "@heroui/react"
import type {
    AiActiveModel,
    WithClassNames,
} from "@/modules/types"
import {
    PROVIDER_COLOR_MAP,
    PROVIDER_LABEL_MAP,
    TASK_ICON_MAP,
} from "../map"
import {
    FallbackChoice,
} from "./FallbackChoice"

/** Props for {@link ModelCard}. */
export interface ModelCardProps extends WithClassNames<undefined> {
    /** One task-kind's active model configuration + fallback chain. */
    model: AiActiveModel
}

/**
 * Card showing a single task kind's active model and its fallback chain.
 *
 * Presentational (render-only); receives one {@link AiActiveModel} as a prop.
 */
export const ModelCard = ({
    model,
    className,
}: ModelCardProps) => {
    return (
        <div className={cn("rounded-3xl border bg-background p-5 transition-shadow hover:shadow-md", className)}>
            {/* Card Header */}
            <div className="flex items-center gap-3">
                {TASK_ICON_MAP[model.taskKind] ?? (
                    <SparkleIcon
                        className="size-6 text-muted"
                    />
                )}
                <div className="flex-1">
                    <div className="text-base font-semibold">{model.label}</div>
                    <div className="text-xs text-muted">{model.description}</div>
                </div>
            </div>

            <div className="h-4" />

            {/* Active Model */}
            <div className="rounded-2xl bg-accent/5 border border-accent/20 p-4">
                <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent">
                    Mô hình đang sử dụng
                </div>
                <div className="flex items-center gap-3">
                    <div className="font-mono text-sm font-bold">
                        {model.activeModel.model}
                    </div>
                    <Chip
                        size="sm"
                        color={PROVIDER_COLOR_MAP[model.activeModel.provider] ?? "default"}
                        variant="primary"
                    >
                        {PROVIDER_LABEL_MAP[model.activeModel.provider] ?? model.activeModel.provider}
                    </Chip>
                </div>
            </div>

            <div className="h-3" />

            {/* Fallback chain */}
            <div>
                <div className="mb-2 text-xs font-semibold text-muted">
                    Chuỗi dự phòng
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {model.fallbackChain.map((choice, index) => (
                        <FallbackChoice
                            key={`${choice.model}-${index}`}
                            choice={choice}
                            index={index}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
