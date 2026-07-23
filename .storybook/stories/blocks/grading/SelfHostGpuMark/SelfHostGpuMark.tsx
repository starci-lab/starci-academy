import React from "react"
import { Tooltip, cn } from "@heroui/react"
import { CpuIcon } from "@phosphor-icons/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — faithful port of
 * `@/components/blocks/grading/SelfHostGpuMark`. Authored in Storybook (not
 * `src`); synced to `src` later. NO `@/components` imports. In `src` the label
 * + tooltip come from `useTranslations("aiSettings")`; both strings are INLINED
 * here so the local port stays self-contained.
 */

/** Props for {@link SelfHostGpuMark}. */
export interface SelfHostGpuMarkProps {
    /** Extra classes on the tooltip trigger. */
    className?: string
    /** When on, emit `data-anat-part` markers for the anatomy overlay. */
    showAnatomy?: boolean
}

/**
 * Accent GPU icon with a tooltip — marks models self-hosted on StarCi hardware
 * (e.g. RTX 5060). Icon only on the row; detail lives in the tooltip (no extra chip).
 *
 * @param props - {@link SelfHostGpuMarkProps}
 */
export const SelfHostGpuMark = ({ className, showAnatomy }: SelfHostGpuMarkProps) => {
    return (
        <Tooltip data-anat-part={showAnatomy ? "Tooltip" : undefined}>
            <Tooltip.Trigger
                aria-label="Model tự host trên GPU của StarCi"
                className={cn("inline-flex shrink-0 cursor-default", className)}
                data-anat-part={showAnatomy ? "Tooltip.Trigger" : undefined}
            >
                <CpuIcon
                    aria-hidden
                    focusable="false"
                    className="size-4 text-accent-soft-foreground"
                    data-anat-part={showAnatomy ? "CpuIcon" : undefined}
                />
            </Tooltip.Trigger>
            <Tooltip.Content data-anat-part={showAnatomy ? "Tooltip.Content" : undefined}>
                <span className="text-sm">
                    Model chạy trên hạ tầng GPU nội bộ của StarCi (ví dụ RTX 5060), không gọi API bên ngoài.
                </span>
            </Tooltip.Content>
        </Tooltip>
    )
}
