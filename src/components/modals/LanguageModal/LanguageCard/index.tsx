import { StarCiButton } from "@/components/atomic"
import { CheckCircleIcon } from "@phosphor-icons/react"
import React from "react"

/**
 * LanguageCard is a card component that is used to display a language.
 */
export interface LanguageCardProps {
    code: string
    label: string
    isSelected: boolean
    onPress: () => void
}
/**
 * LanguageCard is a card component that is used to display a language.
 */
export const LanguageCard = ({ code, label, isSelected, onPress }: LanguageCardProps) => {
    return (
        <StarCiButton 
            isDisabled={isSelected}
            variant="ghost" 
            className="h-fit p-2 w-full flex data-[disabled=true]:opacity-100 data-[disabled=true]:bg-default/40"  
            onPress={onPress}
        >
            <div className="flex items-center justify-center gap-3">
                <div className="flex flex-col items-start justify-start gap-1">
                    <div className="text-sm">{label}</div>
                    <div className="text-xs text-foreground-500 uppercase tracking-widest">{code}</div>
                </div>
                {isSelected ? <CheckCircleIcon className="size-5 text-primary" /> : null}
            </div>
        </StarCiButton>
    )
}