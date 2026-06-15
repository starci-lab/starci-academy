"use client"
import { Flame as FireIcon } from "@gravity-ui/icons"
import React from "react"

import {
    cn,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
} from "@heroui/react"

import { useTranslations } from "next-intl"

import type { WithClassNames } from "@/modules/types/base/class-name"

/** Props for {@link UserStreak}. */
export type UserStreakProps = WithClassNames<undefined>

/**
 * UserStreak — navbar streak widget.
 *
 * Self-contained section (single-use): reads its own i18n and renders the
 * streak dropdown with no props. `"use client"` for the dropdown interactivity.
 *
 * @param props - {@link UserStreakProps}
 */
export const UserStreak = ({ className }: UserStreakProps) => {
    const t = useTranslations("common")

    return (
        <Dropdown>
            <DropdownTrigger>
                <div className={cn("group relative flex size-10 cursor-pointer items-center justify-center rounded-full border-4 border-dashed border-pink-400 bg-pink-50/50 transition-all hover:scale-110 active:scale-95 dark:border-pink-500/50 dark:bg-pink-950/20", className)}>
                    <FireIcon className="size-6 fill-pink-500 text-pink-500 dark:fill-pink-400 dark:text-pink-400" />
                </div>
            </DropdownTrigger>
            <DropdownMenu aria-label="User streak information" className="min-w-64">
                <DropdownSection>
                    <DropdownItem key="streaks" className="cursor-default opacity-100 data-[hover=true]:bg-transparent">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5 rounded-lg bg-pink-50/50 p-2 text-center dark:bg-pink-950/20">
                                <p className="text-xs font-semibold text-pink-500 underline decoration-pink-300 underline-offset-4">
                                    {t("streak.current")}
                                </p>
                                <div className="flex items-center justify-center gap-1.5">
                                    <FireIcon className="size-4 fill-pink-500 text-pink-500" />
                                    <span className="text-lg font-bold">0</span>
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5 rounded-lg bg-pink-50/50 p-2 text-center dark:bg-pink-950/20">
                                <p className="text-xs font-semibold text-pink-500 underline decoration-pink-300 underline-offset-4">
                                    {t("streak.longest")}
                                </p>
                                <div className="flex items-center justify-center gap-1.5">
                                    <FireIcon className="size-4 fill-pink-500 text-pink-500" />
                                    <span className="text-lg font-bold">0</span>
                                </div>
                            </div>
                        </div>
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection className="border-t  pt-2 mt-2">
                    <DropdownItem key="weekly" className="cursor-default opacity-100 data-[hover=true]:bg-transparent">
                        <div className="flex justify-between px-1">
                            {["M", "T", "W", "T", "F", "S", "S"].map((day, i) => (
                                <div
                                    key={i}
                                    className="flex flex-col items-center gap-1.5"
                                >
                                    <div
                                        className={`flex size-7 items-center justify-center rounded-full border-2 border-slate-300 text-[10px] font-bold ${
                                            i === 0 ? "bg-slate-300 text-slate-700" : "text-slate-400"
                                        }`}
                                    >
                                        {day}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>


        </Dropdown>
    )
}