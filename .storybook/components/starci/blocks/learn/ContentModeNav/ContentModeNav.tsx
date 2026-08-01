import React from "react"
import { BookOpenIcon, CodeIcon, FlaskIcon, PlayIcon, PuzzlePieceIcon } from "@phosphor-icons/react"
import { Toolbar, type ToolbarTabItem } from "@sb-components/composites/navigation/Toolbar/Toolbar"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentModeNav`: HOW to look at this lesson. Modes on the left, the
 * code language on the right.
 *
 * ⚠️ NAMED FOR WHAT IT DOES, not what it looks like (renamed from `ContentTabBar`
 * 2026-07-28). Switching mode changes the ROUTE — the real screen does
 * `router.replace(?tab=…)` — so this is NAVIGATION, not a tab/panel pair. Calling
 * it a "tab bar" promised `role="tab"` + `aria-controls` semantics it never had.
 * The body it switches to is a SEPARATE block (`ContentArticle` and its siblings),
 * because it is the content of a different route, not a panel this row owns.
 *
 * ⭐ A LOCKED MODE IS CLICKABLE, and clicking it is the WHOLE POINT. The first cut
 * set `isDisabled` on locked modes, so tapping them did nothing — which quietly
 * killed the offer this block exists to surface. A locked mode is rendered MUTED
 * (dimmed) but still fires `onModeChange`; the CALLER decides what a locked tap
 * means (open the paywall). "What locked does" is a business decision that lives
 * on the screen, not a behaviour this block gets to hardcode.
 *
 * WHY A BLOCK ON TOP OF `Toolbar`: the composite knows it has two tab groups; it
 * does not know what a reading MODE is. The block owns their order, their words,
 * their icons, and which of them a lesson offers.
 *
 * MODE IS AN ENUM, NOT A LIST OF TABS. The caller says `mode="challenges"` and
 * which modes exist; it never hands over labels. Labels from the caller would be
 * §14d.1's pre-formatted-string trap one level up.
 *
 * NEVER SKELETONISED, on purpose. Static chrome, known before any lesson data
 * lands, so it paints immediately. There is no `isSkeleton` prop at all rather
 * than one quietly unused.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The ways a lesson can be looked at. */
export type ContentMode = "content" | "sandbox" | "challenges" | "aiLab"

/**
 * Label + icon per mode. The BLOCK owns this table: it is the vocabulary of the
 * reading experience, and a caller that could pass it would own the wording.
 */
const MODE_LABEL: Record<ContentMode, string> = {
    content: "Content",
    sandbox: "Sandbox",
    challenges: "Challenges",
    aiLab: "AI Lab",
}

// `size-5` — the tab's own text is `text-sm` (HeroUI `Tabs.Tab` default, `tabs.css`
// `.apply ... text-sm`), and this icon sits INSIDE that control, so it matches the
// control's own box height (line-height 20px), not the bare glyph size (§5a icon=DIV
// case) — `size-3.5` would be the icon=TEXT pairing, wrong for an icon inside a tab.
const MODE_ICON: Record<ContentMode, React.ReactNode> = {
    content: <BookOpenIcon aria-hidden focusable="false" className="size-5" />,
    sandbox: <PlayIcon aria-hidden focusable="false" className="size-5" />,
    challenges: <PuzzlePieceIcon aria-hidden focusable="false" className="size-5" />,
    aiLab: <FlaskIcon aria-hidden focusable="false" className="size-5" />,
}

// Same icon on every language tab (doesn't distinguish TS from Go) — the trigger
// affordance for "this collapses to a language switcher" below `@app-sm`, not a
// per-language mark. Matches `Toolbar`'s own collapsed-group story convention
// (`RightNeutralCollapsed`, every item sharing one `GlobeIcon`) — the collapsed
// `Select` trigger is ICON-ONLY (§13c), so a language row with no icon of its own
// would render a blank trigger once `collapseRightOnMobile` is on.
const LANGUAGE_ICON = <CodeIcon aria-hidden focusable="false" className="size-4" weight="bold" />

/** One offered mode — whether it is locked. */
export interface ContentModeOption {
    /** Which mode this entry is. */
    mode: ContentMode
    /** `true` → premium and not yet bought: rendered muted, still clickable. */
    isLocked?: boolean
}

/** One entry in the fixed code-language catalog. */
export interface ContentLanguage {
    /** Stable id used as the selection key, e.g. `"typescript"`. */
    key: string
    /** Display label, already localized by the caller. */
    label: string
    /** `true` → this lesson has no body in this language: rendered disabled, not omitted. */
    isDisabled?: boolean
}

/** Props for {@link ContentModeNav}. */
export interface ContentModeNavProps {
    /** Modes this lesson offers, in display order. */
    modes: Array<ContentModeOption>
    /** Which mode is being looked at now. */
    mode: ContentMode
    /**
     * Fired with the mode the reader picked — INCLUDING a locked one. The screen
     * decides what a locked pick means (typically: open the paywall instead of
     * navigating). The block never swallows the event.
     */
    onModeChange: (mode: ContentMode) => void
    /**
     * The FULL fixed language catalog (TypeScript/Java/C#/Go, in that order),
     * each carrying its own `isDisabled` — a lesson missing a language still
     * lists it, dimmed, rather than shrinking the row (real `src` never hides
     * a language, only greys it out). Fewer than two AVAILABLE (non-disabled)
     * entries → the right group is not drawn at all: a switcher with one live
     * option is a control that cannot do anything.
     */
    languages?: Array<ContentLanguage>
    /** Which language is being read. */
    language?: string
    /** Fired with the language the reader picked. */
    onLanguageChange?: (language: string) => void
    /**
     * Accessible name for the mode row, localized by the caller (blocks carry no
     * i18n). Without it a screen reader hears loose tabs.
     */
    ariaLabel: string
    /** Accessible name for the language group. Required whenever `languages` is set. */
    languageAriaLabel?: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * The lesson's mode row. See the file header for why locked modes stay clickable
 * and why this is navigation rather than a tab/panel pair.
 *
 * @param props - {@link ContentModeNavProps}
 */
const ContentModeNav = ({
    modes,
    mode,
    onModeChange,
    languages,
    language,
    onLanguageChange,
    ariaLabel,
    languageAriaLabel,
}: ContentModeNavProps) => {
    const items: Array<ToolbarTabItem> = modes.map((entry) => ({
        key: entry.mode,
        label: MODE_LABEL[entry.mode],
        icon: MODE_ICON[entry.mode],
        // MUTED, not disabled: a locked mode must still receive the click so the
        // screen can open the offer. Disabling it kills the very thing this row is for.
        muted: entry.isLocked,
    }))

    // A switcher with one AVAILABLE option is a control that cannot do anything — count
    // only the non-disabled entries, since the catalog itself always lists all four.
    const availableLanguageCount = (languages ?? []).filter((entry) => !entry.isDisabled).length
    const hasLanguages = availableLanguageCount > 1 && language != null && onLanguageChange != null

    return (
        <div>
            <div>
                <Toolbar
                    leftTabs={{
                        items,
                        selectedKey: mode,
                        ariaLabel,
                        onSelectionChange: (key) => onModeChange(String(key) as ContentMode),
                    }}
                    rightTabs={
                        hasLanguages
                            ? {
                                items: (languages ?? []).map((entry) => ({
                                    key: entry.key,
                                    label: entry.label,
                                    icon: LANGUAGE_ICON,
                                    isDisabled: entry.isDisabled,
                                })),
                                selectedKey: language as string,
                                ariaLabel: languageAriaLabel ?? "",
                                onSelectionChange: (key) => onLanguageChange?.(String(key)),
                            }
                            : undefined
                    }
                    // The language group is a "same lesson, different presentation" toggle, so
                    // it stays NEUTRAL: only the mode group carries accent, and the row keeps
                    // ONE accent signal rather than two competing for the eye.
                    rightTabsNeutral
                    // A set-once preference, not a second navigation choice — folds behind a
                    // compact icon-only dropdown below `@app-sm` instead of crowding the reading
                    // column with 4 inline tabs (instructor's call, 2026-07-29, reversing the 2026-07-29
                    // "keep every language reachable in one tap" call from earlier the same day).
                    collapseRightOnMobile

                />
            </div>
        </div>
    )
}

export { ContentModeNav }
