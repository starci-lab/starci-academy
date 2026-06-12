"use client"

import React from "react"
import { cn } from "@heroui/react"
import { useCallback } from "react"
import type { RendererTypeOption } from "../../types"
import type { VideoRendererType } from "@/modules/types"

export interface RendererTypeButtonProps {
    /** Option metadata to render. */
    option: RendererTypeOption
    /** Whether this option is currently selected. */
    isActive: boolean
    /** Selects this option's renderer type. */
    onSelect: (type: VideoRendererType) => void
}

/**
 * Single renderer-type selector button (icon + label + description).
 * @param props.option - Option metadata to render.
 * @param props.isActive - Whether this option is the active renderer type.
 * @param props.onSelect - Called with this option's type when pressed.
 */
export const RendererTypeButton = ({
    option,
    isActive,
    onSelect,
}: RendererTypeButtonProps) => {
    const onPress = useCallback(
        () => onSelect(option.type),
        [onSelect, option.type],
    )

    return (
        <button
            onClick={onPress}
            className={cn(
                "flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                isActive
                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                    : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
            )}
        >
            {option.icon}
            <div className="text-left">
                <div>{option.label}</div>
                <div className="text-[10px] opacity-70">
                    {option.description}
                </div>
            </div>
        </button>
    )
}
