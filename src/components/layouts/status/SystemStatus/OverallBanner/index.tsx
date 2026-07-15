import React from "react"
import { cn } from "@heroui/react"
import { CheckCircleIcon, WarningOctagonIcon } from "@phosphor-icons/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link OverallBanner}. */
export interface OverallBannerProps extends WithClassNames<undefined> {
    /** True when every probed component is `up`. */
    allUp: boolean
    /** Localized "N/M components healthy" label. */
    label: string
}

/**
 * Top-of-page overall health banner. Tints success (green) when every component
 * is up and danger (red) the moment anything is down/degraded. Token-only so it
 * reads correctly in light + dark.
 *
 * @param props - See {@link OverallBannerProps}.
 */
export const OverallBanner = ({ allUp, label, className }: OverallBannerProps) => {
    return (
        <div
            className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3",
                allUp
                    ? "border-success/40 bg-success-soft text-success-soft-foreground"
                    : "border-danger/40 bg-danger-soft text-danger-soft-foreground",
                className,
            )}
        >
            {allUp ? (
                <CheckCircleIcon aria-hidden focusable="false" className="size-6 shrink-0" />
            ) : (
                <WarningOctagonIcon aria-hidden focusable="false" className="size-6 shrink-0" weight="fill" />
            )}
            <span className="text-base font-semibold">{label}</span>
        </div>
    )
}
