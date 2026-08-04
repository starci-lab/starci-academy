import React, {
    useCallback,
    useMemo,
} from "react"
import {
    Tabs,
    cn,
} from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"
import {
    PROGRAMMING_LANGUAGE_TABS_INDICATOR_CLASS_NAME,
    PROGRAMMING_LANGUAGE_TABS_LIST_CLASS_NAME,
    PROGRAMMING_LANGUAGE_TABS_ROOT_CLASS_NAME,
    PROGRAMMING_LANGUAGE_TABS_SECONDARY_LIST_CLASS_NAME,
    PROGRAMMING_LANGUAGE_TABS_SECONDARY_ROOT_CLASS_NAME,
    PROGRAMMING_LANGUAGE_TABS_SECONDARY_TAB_CLASS_NAME,
} from "./constants"
import {
    ProgrammingLanguageTabsVariant,
} from "./enums"
import {
    programmingLanguageIconMap,
} from "./map"
import { DEFAULT_PROGRAMMING_LANGUAGES, isProgrammingLangAvailable, resolveActiveProgrammingLang } from "@/modules/types/utils/programming-language"
import type { ProgrammingLanguage } from "@/modules/types/enums/programming-language"

/** One resolved tab entry. */
export interface ProgrammingLanguageTabItem {
    /** The language key. */
    lang: ProgrammingLanguage
    /** `true` → rendered disabled (missing from `availableLangs`). */
    isDisabled: boolean
    /** Already-localized tab label. */
    label: string
}

/**
 * Props for {@link _ProgrammingLanguageTabs} — presentational; tab labels already resolved.
 */
export interface ProgrammingLanguageTabsProps extends WithClassNames<undefined> {
    /** The four language tabs, already resolved (label + disabled state), in display order. */
    tabItems: Array<ProgrammingLanguageTabItem>
    /** Controlled selected language key (normalized by {@link resolveActiveProgrammingLang}). */
    selectedLang: string
    /** Fired when the user selects an enabled tab. */
    onSelectLang: (lang: string) => void
    /** Accessible name for the tab list. */
    ariaLabel: string
    /** Optional wrapper class on the root `Tabs`. */
    className?: string
    /** When true, always render four tabs even if every one is disabled. */
    alwaysShow?: boolean
    /** Tab chrome: compact pills or full-width underline tabs. */
    variant?: ProgrammingLanguageTabsVariant
    /** When false with `Secondary`, skip the full-width `border-b` wrapper. */
    surfaceBorder?: boolean
}

/**
 * Fixed four-tab programming-language switcher (TypeScript, Java, C#, Go).
 *
 * Supports pill (default) or secondary underline layout via {@link ProgrammingLanguageTabsProps.variant}.
 * Tabs missing from `availableLangs` are rendered disabled. Presentational only.
 * @param props - {@link ProgrammingLanguageTabsProps}
 */
export const _ProgrammingLanguageTabs = ({
    tabItems,
    selectedLang,
    onSelectLang,
    ariaLabel,
    className,
    alwaysShow = false,
    variant = ProgrammingLanguageTabsVariant.Pill,
    surfaceBorder = true,
}: ProgrammingLanguageTabsProps) => {
    const isSecondary = variant === ProgrammingLanguageTabsVariant.Secondary

    const activeKey = useMemo(
        () => resolveActiveProgrammingLang(selectedLang, tabItems.filter((item) => !item.isDisabled).map((item) => item.lang)),
        [selectedLang, tabItems],
    )

    const onSelectionChange = useCallback(
        (key: React.Key) => onSelectLang(String(key)),
        [onSelectLang],
    )

    if (!alwaysShow && tabItems.every((item) => item.isDisabled)) {
        return null
    }

    const tabs = (
        <Tabs
            className={cn(
                isSecondary
                    ? PROGRAMMING_LANGUAGE_TABS_SECONDARY_ROOT_CLASS_NAME
                    : PROGRAMMING_LANGUAGE_TABS_ROOT_CLASS_NAME,
                className,
            )}
            selectedKey={activeKey}
            variant={isSecondary ? "secondary" : undefined}
            onSelectionChange={onSelectionChange}
        >
            <Tabs.ListContainer className={isSecondary ? "w-full" : undefined}>
                <Tabs.List
                    aria-label={ariaLabel}
                    className={isSecondary
                        ? PROGRAMMING_LANGUAGE_TABS_SECONDARY_LIST_CLASS_NAME
                        : PROGRAMMING_LANGUAGE_TABS_LIST_CLASS_NAME}
                >
                    {tabItems.map(({ lang, isDisabled, label }) => {
                        const Icon = programmingLanguageIconMap[lang]
                        return (
                            <Tabs.Tab
                                key={lang}
                                id={lang}
                                isDisabled={isDisabled}
                                className={isSecondary
                                    ? PROGRAMMING_LANGUAGE_TABS_SECONDARY_TAB_CLASS_NAME
                                    : undefined}
                            >
                                <span className="flex items-center gap-2">
                                    <Icon
                                        aria-hidden
                                        className={cn("shrink-0", isSecondary ? "size-5" : "size-5")}
                                    />
                                    {label}
                                </span>
                                <Tabs.Indicator
                                    className={isSecondary ? undefined : PROGRAMMING_LANGUAGE_TABS_INDICATOR_CLASS_NAME}
                                />
                            </Tabs.Tab>
                        )
                    })}
                </Tabs.List>
            </Tabs.ListContainer>
        </Tabs>
    )

    if (isSecondary && surfaceBorder) {
        return (
            <div className="w-full border-b">
                {tabs}
            </div>
        )
    }

    return tabs
}

export {
    DEFAULT_PROGRAMMING_LANGUAGES,
    isProgrammingLangAvailable,
}
export {
    ProgrammingLanguageTabsVariant,
} from "./enums"
export {
    programmingLanguageIconMap,
} from "./map"
