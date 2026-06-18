import { SparkleIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Chip,
    Typography,
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
        <div className={cn("rounded-3xl border bg-background p-4 transition-shadow hover:shadow-md", className)}>
            {/* Card Header */}
            <div className="flex items-center gap-3">
                {TASK_ICON_MAP[model.taskKind] ?? (
                    <SparkleIcon
                        aria-hidden
                        focusable="false"
                        className="size-6 text-muted"
                    />
                )}
                <div className="flex flex-1 flex-col">
                    <Typography type="body" weight="semibold">{model.label}</Typography>
                    <Typography type="body-xs" color="muted">{model.description}</Typography>
                </div>
            </div>

            <div className="h-4" />

            {/* Active Model */}
            <div className="rounded-2xl bg-accent/5 border border-accent/20 p-4">
                <Typography type="body-xs" weight="semibold" className="mb-2 uppercase tracking-wide text-accent">
                    Mô hình đang sử dụng
                </Typography>
                <div className="flex items-center gap-3">
                    <Typography type="body-sm" weight="bold" className="font-mono">
                        {model.activeModel.model}
                    </Typography>
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
            <div className="flex flex-col gap-2">
                <Typography type="body-xs" weight="semibold" color="muted">
                    Chuỗi dự phòng
                </Typography>
                <div className="flex flex-wrap gap-2">
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
