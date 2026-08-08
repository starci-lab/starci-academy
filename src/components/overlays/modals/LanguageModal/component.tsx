import React from "react"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import { SurfaceCardSelectableGroup, type SurfaceCardSelectableGroupItem } from "@/components/composites/cards/SurfaceCard"
import { Typography } from "@/components/atoms/text/Typography"
import { StackV } from "@/components/frames/Stack"

/** One language option, already resolved by the connected `LanguageModal`. */
export interface LanguageModalOption {
    /** Locale code, e.g. `"en"`. */
    code: string
    /** Display name, e.g. `"English"`. */
    label: string
}

/** All display text, already localized by the connected `LanguageModal`; a story passes i18n keys. */
export interface LanguageModalLabels {
    /** Modal title (`t("settings.language.title")`). */
    title: string
    /** "Popular" section label (`t("settings.language.popular")`). */
    popular: string
    /** "All languages" section label (`t("settings.language.all")`). */
    all: string
}

/** Props for {@link _LanguageModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface LanguageModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler. Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** Currently active locale code — drives which card shows selected in BOTH sections. */
    selectedCode: string
    /** The most-used languages, shown first. */
    popularLanguages: Array<LanguageModalOption>
    /** Every supported language, alphabetical. */
    allLanguages: Array<LanguageModalOption>
    /** Fired with the chosen locale code (either section). */
    onSelect: (code: string) => void
    labels: LanguageModalLabels
}

/** Builds one section's `SurfaceCardSelectableGroup` items — the code doubles as the description line. */
const toSelectableItems = (options: Array<LanguageModalOption>): Array<SurfaceCardSelectableGroupItem<string>> =>
    options.map((option) => ({
        value: option.code,
        label: option.label,
        description: option.code,
    }))

/**
 * Language-selection modal — the presentational half of `LanguageModal`: two
 * `SurfaceCardSelectableGroup` sections ("popular" then "all"), each a real
 * single-select radio group, both reading/writing the SAME selected locale.
 * Composes `ModalShell`. See `tiers/split.md` — the connected `index.tsx` owns
 * the overlay store, the router/locale, and every i18n string; there is no
 * async boundary here (the language table is a fixed local constant), so
 * there is no `isSkeleton`.
 *
 * @param props - {@link LanguageModalProps}
 */
export const _LanguageModal = ({
    isOpen,
    onOpenChange,
    selectedCode,
    popularLanguages,
    allLanguages,
    onSelect,
    labels,
}: LanguageModalProps) => {
    const popularSectionItems = [
        () => <Typography size="sm" color="muted" text={labels.popular} />,
        () => (
            <SurfaceCardSelectableGroup
                ariaLabel={labels.popular}
                columns={3}
                value={selectedCode}
                onChange={onSelect}
                items={toSelectableItems(popularLanguages)}
            />
        ),
    ]
    const allSectionItems = [
        () => <Typography size="sm" color="muted" text={labels.all} />,
        () => (
            <SurfaceCardSelectableGroup
                ariaLabel={labels.all}
                columns={3}
                value={selectedCode}
                onChange={onSelect}
                items={toSelectableItems(allLanguages)}
            />
        ),
    ]
    const sections = [
        () => (
            <StackV
                principle="sibling-stack"
                explain="Popular languages label over selectable grid — not group-boundary, because these are peer pieces of one section."
                items={popularSectionItems}
            />
        ),
        () => (
            <StackV
                principle="sibling-stack"
                explain="All-languages label over selectable grid — not group-boundary, because these are peer pieces of one section."
                items={allSectionItems}
            />
        ),
    ]

    return (
        <ModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={labels.title}
            body={() => (
                <StackV
                    principle="block-boundary"
                    explain="Popular section over all-languages section — not group-boundary, because this is the modal body's major section seam, and not sibling-stack, because the two sections are different-function zones."
                    items={sections}
                />
            )}
            identity={{ tier: "overlay", component: "LanguageModal" }}
        />
    )
}
