"use client"

import React, { useMemo } from "react"
import {
    useTranslations,
} from "next-intl"
import type { WithClassNames } from "@/modules/types/base/class-name"
import {
    _ProgrammingLanguageTabs,
    DEFAULT_PROGRAMMING_LANGUAGES,
    isProgrammingLangAvailable,
    ProgrammingLanguageTabsVariant,
    programmingLanguageIconMap,
    type ProgrammingLanguageTabItem,
} from "./component"

export { ProgrammingLanguageTabsVariant, programmingLanguageIconMap }

/** Props the connected {@link ProgrammingLanguageTabs} takes from its caller. */
export interface ProgrammingLanguageTabsConnectedProps extends WithClassNames<undefined> {
    /** Language keys returned by the backend (subset of the default four). */
    availableLangs: Array<string>
    /** Controlled selected language key (normalized by `resolveActiveProgrammingLang`). */
    selectedLang: string
    /** Fired when the user selects an enabled tab. */
    onSelectLang: (lang: string) => void
    /** Accessible name for the tab list. */
    ariaLabel: string
    /** When true, always render four tabs even if `availableLangs` is empty. */
    alwaysShow?: boolean
    /** Tab chrome: compact pills or full-width underline tabs. */
    variant?: ProgrammingLanguageTabsVariant
    /** When false with `Secondary`, skip the full-width `border-b` wrapper. */
    surfaceBorder?: boolean
}

/**
 * Fixed four-tab programming-language switcher — the CONNECTED half:
 * resolves each tab's label via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link ProgrammingLanguageTabsConnectedProps}
 */
export const ProgrammingLanguageTabs = ({
    availableLangs,
    ...props
}: ProgrammingLanguageTabsConnectedProps) => {
    const t = useTranslations()

    const tabItems = useMemo<Array<ProgrammingLanguageTabItem>>(
        () => DEFAULT_PROGRAMMING_LANGUAGES.map((lang) => ({
            lang,
            isDisabled: !isProgrammingLangAvailable(lang, availableLangs),
            label: t(`programmingLanguage.${lang}`),
        })),
        [availableLangs, t],
    )

    return <_ProgrammingLanguageTabs {...props} tabItems={tabItems} />
}
