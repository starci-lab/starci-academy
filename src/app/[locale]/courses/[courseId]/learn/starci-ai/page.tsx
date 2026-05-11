"use client"

import React from "react"
import { useAppSelector } from "@/redux"
import { useQueryAiModelsSwr } from "@/hooks/singleton"
import { Skeleton, Chip } from "@heroui/react"
import {
    SparkleIcon,
    BrainIcon,
    RobotIcon,
    LightningIcon,
} from "@phosphor-icons/react"

/** Map taskKind → icon */
const taskIcons: Record<string, React.ReactNode> = {
    grade: <LightningIcon weight="duotone" className="size-6 text-warning" />,
    reviewPersonalProject: <BrainIcon weight="duotone" className="size-6 text-accent" />,
    generateMilestone: <SparkleIcon weight="duotone" className="size-6 text-success" />,
}

/** Provider badge colors */
const providerColors: Record<string, "accent" | "success" | "warning" | "danger" | "default"> = {
    openai: "success",
    gemini: "accent",
}

const providerLabels: Record<string, string> = {
    openai: "OpenAI",
    gemini: "Google Gemini",
}

const tierLabels: Record<string, { label: string; color: "accent" | "success" | "warning" }> = {
    low: { label: "Tiết kiệm", color: "accent" },
    medium: { label: "Cân bằng", color: "warning" },
    high: { label: "Cao cấp", color: "success" },
}

const Page = () => {
    const aiModelsSwr = useQueryAiModelsSwr()
    const tier = useAppSelector((state) => state.aiModels.tier)
    const models = useAppSelector((state) => state.aiModels.models)

    if (aiModelsSwr.isLoading) {
        return (
            <div className="flex flex-col gap-4 p-6">
                <Skeleton className="h-10 w-64 rounded-2xl" />
                <div className="flex flex-col gap-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-48 w-full rounded-3xl" />
                    ))}
                </div>
            </div>
        )
    }

    const tierInfo = tierLabels[tier ?? "low"] ?? tierLabels.low

    return (
        <div className="mx-auto max-w-4xl p-6">
            {/* Header */}
            <div className="flex items-center gap-3">
                <RobotIcon weight="duotone" className="size-8 text-accent" />
                <div>
                    <div className="text-2xl font-bold">StarCI AI</div>
                    <div className="text-sm text-muted">
                        Các mô hình AI đang được sử dụng trong hệ thống
                    </div>
                </div>
            </div>

            {/* Tier badge */}
            <div className="mt-4 flex items-center gap-2">
                <span className="text-sm text-muted">Mức khuyến nghị:</span>
                <Chip size="sm" color={tierInfo.color} variant="primary">
                    {tierInfo.label}
                </Chip>
            </div>

            <div className="h-6" />

            {/* Model Cards */}
            <div className="flex flex-col gap-5">
                {models.map((m) => (
                    <div
                        key={m.taskKind}
                        className="rounded-3xl border bg-background p-5 transition-shadow hover:shadow-md"
                    >
                        {/* Card Header */}
                        <div className="flex items-center gap-3">
                            {taskIcons[m.taskKind] ?? <SparkleIcon weight="duotone" className="size-6 text-muted" />}
                            <div className="flex-1">
                                <div className="text-base font-semibold">{m.label}</div>
                                <div className="text-xs text-muted">{m.description}</div>
                            </div>
                        </div>

                        <div className="h-4" />

                        {/* Active Model */}
                        <div className="rounded-2xl bg-accent/5 border border-accent/20 p-4">
                            <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">
                                Mô hình đang sử dụng
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="font-mono text-sm font-bold">
                                    {m.activeModel.model}
                                </div>
                                <Chip
                                    size="sm"
                                    color={providerColors[m.activeModel.provider] ?? "default"}
                                    variant="primary"
                                >
                                    {providerLabels[m.activeModel.provider] ?? m.activeModel.provider}
                                </Chip>
                            </div>
                        </div>

                        <div className="h-3" />

                        {/* Fallback chain */}
                        <div>
                            <div className="mb-2 text-xs font-semibold text-muted">
                                Chuỗi dự phòng
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {m.fallbackChain.map((choice, idx) => (
                                    <div
                                        key={`${choice.model}-${idx}`}
                                        className="flex items-center gap-2 rounded-xl border px-3 py-1.5"
                                    >
                                        <span className="text-xs text-muted font-mono">
                                            {idx + 1}.
                                        </span>
                                        <span className="text-sm font-mono">
                                            {choice.model}
                                        </span>
                                        <Chip
                                            size="sm"
                                            color={providerColors[choice.provider] ?? "default"}
                                            variant="soft"
                                        >
                                            {providerLabels[choice.provider] ?? choice.provider}
                                        </Chip>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Page
