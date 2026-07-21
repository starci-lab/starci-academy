import React, { useCallback, useMemo } from "react"
import { Tabs, cn } from "@heroui/react"
import type { IconType } from "react-icons"
import { FaJava, FaGolang } from "react-icons/fa6"
import { TbBrandTypescript } from "react-icons/tb"
import { PiFileCSharp } from "react-icons/pi"
import { ExtendedTabs } from "../ExtendedTabs/ExtendedTabs"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/navigation/ProgrammingLanguageTabs`.
 * Authored in Storybook (not `src`); synced to `src` later.
 *
 * MERGE A9 — this block no longer hand-rolls a raw HeroUI `<Tabs>` strip. The
 * underline (secondary) and pill (primary) tab CHROME is already owned by the
 * sibling {@link ExtendedTabs} primitive, so PLT is now a THIN WRAPPER: it keeps
 * only its own value-add — the {@link ProgrammingLanguage} enum, the fixed
 * four-language set + icon map, and the availability / `alwaysShow` /
 * active-key resolution logic — and renders `<ExtendedTabs>` with mapped tabs.
 * HeroUI `Tabs.*` compound parts stay the tab anatomy (the same parts
 * `ExtendedTabs` expects as children); PLT layers its brand chrome (accent pill
 * fill, accent underline) onto those child slots. Brand glyphs come from
 * `react-icons` (the same dep the real block uses).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Canonical programming-language keys (matches mount/CDN `lang` fields). */
export enum ProgrammingLanguage {
    TypeScript = "typescript",
    Java = "java",
    Csharp = "csharp",
    Go = "go",
}

/** Visual layout for {@link ProgrammingLanguageTabs} (pill switcher vs underline tabs). */
export enum ProgrammingLanguageTabsVariant {
    /** Compact pill tabs with accent fill indicator. */
    Pill = "pill",
    /** Full-width underline tabs matching a content tab bar. */
    Secondary = "secondary",
}

/** Fixed tab order for the four default programming languages. */
const DEFAULT_PROGRAMMING_LANGUAGES: Array<ProgrammingLanguage> = [
    ProgrammingLanguage.TypeScript,
    ProgrammingLanguage.Java,
    ProgrammingLanguage.Csharp,
    ProgrammingLanguage.Go,
]

/** Display label per language (stands in for next-intl `programmingLanguage.*`). */
const PROGRAMMING_LANGUAGE_LABEL: Record<ProgrammingLanguage, string> = {
    [ProgrammingLanguage.TypeScript]: "TypeScript",
    [ProgrammingLanguage.Java]: "Java",
    [ProgrammingLanguage.Csharp]: "C#",
    [ProgrammingLanguage.Go]: "Go",
}

/** Brand icon per default programming-language tab (react-icons). */
const programmingLanguageIconMap: Record<ProgrammingLanguage, IconType> = {
    [ProgrammingLanguage.TypeScript]: TbBrandTypescript,
    [ProgrammingLanguage.Java]: FaJava,
    [ProgrammingLanguage.Csharp]: PiFileCSharp,
    [ProgrammingLanguage.Go]: FaGolang,
}

/** Normalize a language key for comparisons (`TypeScript` → `typescript`). */
const normalizeProgrammingLang = (lang: string): string => lang.trim().toLowerCase()

/** Whether a default tab language is present in the backend payload. */
const isProgrammingLangAvailable = (lang: ProgrammingLanguage, availableLangs: Array<string>): boolean => {
    const normalizedAvailable = new Set(availableLangs.map(normalizeProgrammingLang))
    return normalizedAvailable.has(lang)
}

/**
 * Resolve the active language: keep a valid selection, else the first available tab
 * in {@link DEFAULT_PROGRAMMING_LANGUAGES} order, then the first backend language.
 */
const resolveActiveProgrammingLang = (
    selectedLang: string | null | undefined,
    availableLangs: Array<string>,
): string => {
    const normalizedAvailable = new Set(availableLangs.map(normalizeProgrammingLang))
    if (selectedLang && normalizedAvailable.has(normalizeProgrammingLang(selectedLang))) {
        return normalizeProgrammingLang(selectedLang)
    }
    for (const lang of DEFAULT_PROGRAMMING_LANGUAGES) {
        if (normalizedAvailable.has(lang)) {
            return lang
        }
    }
    return availableLangs[0] ? normalizeProgrammingLang(availableLangs[0]) : DEFAULT_PROGRAMMING_LANGUAGES[0]
}

/**
 * Pill brand chrome layered onto the `ExtendedTabs` primary (segmented) base:
 * center the compact strip; each tab hugs its label with `px-3`, smaller text,
 * accent-foreground when selected. The accent FILL comes from the `bg-accent`
 * indicator below. `ExtendedTabs variant="primary" size="sm"` already sizes the
 * root to `w-fit`, so PLT only adds the centering + per-tab overrides here.
 */
const PROGRAMMING_LANGUAGE_TABS_PILL_ROOT_CLASS_NAME = "text-center"

/** `Tabs.List` slot overrides for the pill variant (compact tabs + accent selected text). */
const PROGRAMMING_LANGUAGE_TABS_PILL_LIST_CLASS_NAME =
    "w-fit  *:w-fit *:px-3 *:text-sm *:font-normal *:data-[selected=true]:text-accent-foreground"

/** Active tab pill fill. */
const PROGRAMMING_LANGUAGE_TABS_PILL_INDICATOR_CLASS_NAME = "bg-accent"

/**
 * Secondary brand chrome layered onto the `ExtendedTabs` secondary (underline)
 * base: stretch the strip full-width. The baseline removal + label-hugging tabs
 * come from `ExtendedTabs`' `.extended-tabs` override; the accent underline is
 * the native `.tabs--secondary` `<Tabs.Indicator/>` (hardcoded `bg-accent`).
 */
const PROGRAMMING_LANGUAGE_TABS_SECONDARY_ROOT_CLASS_NAME = "w-full"

/** `Tabs.List` slot override for the secondary variant (full-width underline row). */
const PROGRAMMING_LANGUAGE_TABS_SECONDARY_LIST_CLASS_NAME = "w-full"

/** Per-tab classes for the secondary variant — accent text when selected. */
const PROGRAMMING_LANGUAGE_TABS_SECONDARY_TAB_CLASS_NAME =
    "rounded-none data-[selected=true]:text-accent"

/** Props for {@link ProgrammingLanguageTabs}. */
export interface ProgrammingLanguageTabsProps {
    /** Language keys returned by the backend (subset of the default four). */
    availableLangs: Array<string>
    /** Controlled selected language key (normalized by {@link resolveActiveProgrammingLang}). */
    selectedLang: string
    /** Fired when the user selects an enabled tab. */
    onSelectLang: (lang: string) => void
    /** Accessible name for the tab list. */
    ariaLabel: string
    /** Optional wrapper class on the root `Tabs`. */
    className?: string
    /** When true, always render four tabs even if `availableLangs` is empty (all disabled). */
    alwaysShow?: boolean
    /** Tab chrome: compact pills or full-width underline tabs. */
    variant?: ProgrammingLanguageTabsVariant
    /**
     * When false with {@link ProgrammingLanguageTabsVariant.Secondary}, skip the full-width
     * `border-b` wrapper so the parent can own edge-to-edge dividers around padded tab content.
     */
    surfaceBorder?: boolean
}

/**
 * Fixed four-tab programming-language switcher (TypeScript, Java, C#, Go).
 *
 * A thin wrapper over {@link ExtendedTabs}: PLT owns the fixed language set,
 * icon map, availability + active-key logic and maps them to the shared tab
 * primitive. Supports pill (default) or secondary underline layout via
 * `variant`. Tabs missing from `availableLangs` are rendered disabled.
 * Presentational only.
 *
 * @param props - {@link ProgrammingLanguageTabsProps}
 */
export const ProgrammingLanguageTabs = ({
    availableLangs,
    selectedLang,
    onSelectLang,
    ariaLabel,
    className,
    alwaysShow = false,
    variant = ProgrammingLanguageTabsVariant.Pill,
    surfaceBorder = true,
}: ProgrammingLanguageTabsProps) => {
    const isSecondary = variant === ProgrammingLanguageTabsVariant.Secondary

    const tabItems = useMemo(
        () => DEFAULT_PROGRAMMING_LANGUAGES.map((lang) => ({
            lang,
            isDisabled: !isProgrammingLangAvailable(lang, availableLangs),
        })),
        [availableLangs],
    )

    const activeKey = useMemo(
        () => resolveActiveProgrammingLang(selectedLang, availableLangs),
        [selectedLang, availableLangs],
    )

    const onSelectionChange = useCallback(
        (key: string) => onSelectLang(key),
        [onSelectLang],
    )

    if (!alwaysShow && availableLangs.length === 0) {
        return null
    }

    const tabs = (
        <ExtendedTabs
            variant={isSecondary ? "secondary" : "primary"}
            size={isSecondary ? "md" : "sm"}
            selectedKey={activeKey}
            onSelectionChange={onSelectionChange}
            className={cn(
                isSecondary
                    ? PROGRAMMING_LANGUAGE_TABS_SECONDARY_ROOT_CLASS_NAME
                    : PROGRAMMING_LANGUAGE_TABS_PILL_ROOT_CLASS_NAME,
                className,
            )}
        >
            <Tabs.ListContainer className={isSecondary ? "w-full" : undefined}>
                <Tabs.List
                    aria-label={ariaLabel}
                    className={isSecondary
                        ? PROGRAMMING_LANGUAGE_TABS_SECONDARY_LIST_CLASS_NAME
                        : PROGRAMMING_LANGUAGE_TABS_PILL_LIST_CLASS_NAME}
                >
                    {tabItems.map(({ lang, isDisabled }) => {
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
                                    <Icon aria-hidden className="size-5 shrink-0" />
                                    {PROGRAMMING_LANGUAGE_LABEL[lang]}
                                </span>
                                <Tabs.Indicator
                                    className={isSecondary ? undefined : PROGRAMMING_LANGUAGE_TABS_PILL_INDICATOR_CLASS_NAME}
                                />
                            </Tabs.Tab>
                        )
                    })}
                </Tabs.List>
            </Tabs.ListContainer>
        </ExtendedTabs>
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
