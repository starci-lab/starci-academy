"use client"

import React, { useCallback, useMemo } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter, usePathname } from "@/i18n/navigation"
import { useLanguageOverlayState } from "@/hooks/zustand/overlay/hooks"
import { languages } from "@/resources/constants/lang"
import { _LanguageModal, type LanguageModalOption } from "./component"

/** Locale codes shown in the "popular" section (order decided by the alphabetical sort below). */
const POPULAR_LANGUAGE_CODES = ["en", "vi"]

/** Maps the app's `Language` constant to the presentational `LanguageModalOption`. */
const toOption = (language: { code: string; label: string }): LanguageModalOption => ({
    code: language.code,
    label: language.label,
})

/**
 * Language-selection modal: reads the overlay open-state (`useLanguageOverlayState`)
 * and the active locale, resolves the app's fixed `languages` table into the
 * "popular" + "all" sections, and hands everything to the presentational
 * {@link _LanguageModal}. Picking a language re-routes the current page under the
 * new locale prefix. See `tiers/split.md` — this connected half owns the store,
 * the router/locale, and every i18n string.
 */
export const LanguageModal = () => {
    const { isOpen, setOpen } = useLanguageOverlayState()
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const pathname = usePathname()

    const popularLanguages = useMemo(
        () => languages
            .filter((language) => POPULAR_LANGUAGE_CODES.includes(language.code))
            .sort((prev, next) => prev.code.localeCompare(next.code))
            .map(toOption),
        [],
    )
    const allLanguages = useMemo(
        () => [...languages].sort((prev, next) => prev.code.localeCompare(next.code)).map(toOption),
        [],
    )

    const onSelect = useCallback(
        (code: string) => router.replace(pathname, { locale: code }),
        [router, pathname],
    )

    return (
        <_LanguageModal
            isOpen={isOpen}
            onOpenChange={setOpen}
            selectedCode={locale}
            popularLanguages={popularLanguages}
            allLanguages={allLanguages}
            onSelect={onSelect}
            labels={{
                title: t("settings.language.title"),
                popular: t("settings.language.popular"),
                all: t("settings.language.all"),
            }}
        />
    )
}
