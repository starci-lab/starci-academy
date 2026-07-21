"use client"

import React from "react"
import { Button, cn } from "@heroui/react"
import { SidebarSimpleIcon, SquareHalfIcon } from "@phosphor-icons/react"
import { useTranslations } from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useContentAiChatModeStore, type ContentAiChatMode } from "@/hooks/zustand/contentAiChatMode/store"

/** The desktop presentation modes, in switch order, with their icon + aria key. */
const MODES: ReadonlyArray<{ mode: ContentAiChatMode, Icon: typeof SidebarSimpleIcon, labelKey: string }> = [
    { mode: "rail", Icon: SidebarSimpleIcon, labelKey: "contentAi.mode.rail" },
    { mode: "drawer", Icon: SquareHalfIcon, labelKey: "contentAi.mode.drawer" },
]

/**
 * A segmented control for the content-AI presentation mode (rail · drawer).
 * Reads/writes the persisted {@link useContentAiChatModeStore}, so the learner's
 * choice sticks. Desktop only — a phone is forced to the drawer, so the shell
 * hides this switch there.
 *
 * @param props - optional root class name (placement only).
 */
export const ContentAiChatModeSwitch = ({ className }: WithClassNames<undefined>) => {
    const t = useTranslations()
    const { mode, setMode } = useContentAiChatModeStore()

    return (
        <div
            role="group"
            aria-label={t("contentAi.mode.aria")}
            className={cn("inline-flex items-center gap-0.5 rounded-full bg-default p-0.5", className)}
        >
            {MODES.map((entry) => {
                const Icon = entry.Icon
                const isActive = entry.mode === mode
                return (
                    <Button
                        key={entry.mode}
                        isIconOnly
                        size="sm"
                        variant="ghost"
                        aria-label={t(entry.labelKey)}
                        aria-pressed={isActive}
                        className={cn(
                            "size-7 rounded-full",
                            isActive && "bg-surface text-accent-soft-foreground shadow-surface",
                        )}
                        onPress={() => setMode(entry.mode)}
                    >
                        <Icon className="size-4" aria-hidden focusable="false" />
                    </Button>
                )
            })}
        </div>
    )
}
