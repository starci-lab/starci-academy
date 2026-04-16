"use client"

import { Button } from "@heroui/react"
import { CheckCircleIcon } from "@phosphor-icons/react"
import React from "react"

/**
 * LanguageCard is a card component that is used to display a language.
 */
export interface LanguageCardProps {
    /** BCP-47 style locale code shown in the UI. */
    code: string
    /** Human-readable language label. */
    label: string
    /** Whether this locale is currently active. */
    isSelected: boolean
    /** Called when the user selects this language. */
    onPress: () => void
}

/**
 * Selectable language row for the language modal grid.
 */
export const LanguageCard = ({ code, label, isSelected, onPress }: LanguageCardProps) => {
    return (
        <Button
            className="flex h-fit w-full p-2 data-[disabled=true]:bg-default/40 data-[disabled=true]:opacity-100"
            isDisabled={isSelected}
            onPress={onPress}
            variant="ghost"
        >
            <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-start justify-start gap-1">
                    <div className="text-sm">{label}</div>
                    <div className="text-xs uppercase tracking-widest text-foreground-500">{code}</div>
                </div>
                {isSelected ? <CheckCircleIcon className="size-5 text-primary" /> : null}
            </div>
        </Button>
    )
}
