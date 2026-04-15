"use client"

import React from "react"
import {
    StarCiModal,
    StarCiModalBody,
    StarCiModalContent,
    StarCiModalHeader,
} from "../../atomic"
import { useLocale, useTranslations } from "next-intl"
import { useLanguageOverlayState } from "@/hooks/singleton"
import { useRouter } from "@/i18n/navigation"
import { usePathname } from "@/i18n/navigation"
import { Spacer } from "@/components/reuseable"
import { LanguageCard } from "./LanguageCard"
import { languages } from "@/resources"
/**
 * LanguageModal is a modal component that is used to display the language selection.
 */
export const LanguageModal = () => {
    const { isOpen, onOpenChange } = useLanguageOverlayState()
    const t = useTranslations()
    const locale = useLocale()
    const currentLanguage = languages.find((lang) => lang.code === locale)
    const router = useRouter()
    const pathname = usePathname()
    const popularLanguagesCodes = ["en", "vi"]
    const popularLanguages = languages.filter((lang) => popularLanguagesCodes.includes(lang.code)).sort((prev, next) => prev.code.localeCompare(next.code))
    const allLanguages = languages.sort((prev, next) => prev.code.localeCompare(next.code))
    return (
        <StarCiModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
            <StarCiModalContent>
                <StarCiModalHeader
                    title={t("settings.language.title")}
                />
                <StarCiModalBody>
                    <div>
                        <div className="text-sm text-foreground-500">{t("settings.language.popular")}</div>
                        <Spacer y={2} />
                        <div className="grid grid-cols-3 gap-3">
                            {popularLanguages.map((lang) => (
                                <LanguageCard key={lang.code} code={lang.code} label={lang.label} isSelected={lang.code === currentLanguage?.code} onPress={() => router.replace(pathname, { locale: lang.code })} />
                            ))}
                        </div>  
                    </div>
                    <Spacer y={3} />
                    <div>
                        <div className="text-sm text-foreground-500">{t("settings.language.all")}</div>
                        <Spacer y={2} />
                        <div className="grid grid-cols-3 gap-3">
                            {allLanguages.map((lang) => (
                                <LanguageCard key={lang.code} code={lang.code} label={lang.label} isSelected={lang.code === currentLanguage?.code} onPress={() => router.replace(pathname, { locale: lang.code })} />
                            ))}
                        </div>
                    </div>
                </StarCiModalBody>
            </StarCiModalContent>
        </StarCiModal>
    )
}