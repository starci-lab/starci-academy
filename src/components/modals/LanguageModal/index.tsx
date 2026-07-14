"use client"

import React from "react"
import { Typography } from "@heroui/react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "@/i18n/navigation"
import { usePathname } from "@/i18n/navigation"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { useLanguageOverlayState } from "@/hooks/zustand/overlay/hooks"
import { languages } from "@/resources/constants/lang"
import { ModalShell } from "@/components/blocks/layout/ModalShell"
import { SelectableCardGroup } from "@/components/blocks/navigation/SelectableCardGroup"

/**
 * LanguageModal is a modal component that is used to display the language selection.
 */
export const LanguageModal = ({ className }: WithClassNames<undefined>) => {
    const { isOpen, setOpen } = useLanguageOverlayState()
    const t = useTranslations()
    const locale = useLocale()
    const currentLanguage = languages.find((lang) => lang.code === locale)
    const router = useRouter()
    const pathname = usePathname()
    const popularLanguagesCodes = ["en", "vi"]
    const popularLanguages = languages.filter((lang) => popularLanguagesCodes.includes(lang.code)).sort((prev, next) => prev.code.localeCompare(next.code))
    const allLanguages = languages.sort((prev, next) => prev.code.localeCompare(next.code))
    const onChange = (code: string) => router.replace(pathname, { locale: code })
    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={setOpen}
            className={className}
            title={t("settings.language.title")}
        >
            <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                    <Typography type="body-sm" color="muted">{t("settings.language.popular")}</Typography>
                    <SelectableCardGroup
                        ariaLabel={t("settings.language.popular")}
                        columns={3}
                        value={currentLanguage?.code ?? locale}
                        onChange={onChange}
                        items={popularLanguages.map((lang) => ({
                            value: lang.code,
                            label: lang.label,
                            description: lang.code,
                        }))}
                    />
                </div>
                <div className="flex flex-col gap-3">
                    <Typography type="body-sm" color="muted">{t("settings.language.all")}</Typography>
                    <SelectableCardGroup
                        ariaLabel={t("settings.language.all")}
                        columns={3}
                        value={currentLanguage?.code ?? locale}
                        onChange={onChange}
                        items={allLanguages.map((lang) => ({
                            value: lang.code,
                            label: lang.label,
                            description: lang.code,
                        }))}
                    />
                </div>
            </div>
        </ModalShell>
    )
}
