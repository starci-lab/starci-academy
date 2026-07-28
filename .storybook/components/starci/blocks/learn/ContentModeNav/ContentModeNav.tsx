import React from "react"
import { BookOpenIcon, FlameIcon, SparkleIcon, TerminalWindowIcon } from "@phosphor-icons/react"
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
    content: "Nội dung",
    sandbox: "Sandbox",
    challenges: "Thử thách",
    aiLab: "AI Lab",
}

const MODE_ICON: Record<ContentMode, React.ReactNode> = {
    content: <BookOpenIcon aria-hidden focusable="false" className="size-4" />,
    sandbox: <TerminalWindowIcon aria-hidden focusable="false" className="size-4" />,
    challenges: <FlameIcon aria-hidden focusable="false" className="size-4" />,
    aiLab: <SparkleIcon aria-hidden focusable="false" className="size-4" />,
}

/** One offered mode — whether it is locked, and whether it carries a count. */
export interface ContentModeOption {
    /** Which mode this entry is. */
    mode: ContentMode
    /** `true` → premium and not yet bought: rendered muted, still clickable. */
    isLocked?: boolean
    /** Count shown after the label, e.g. how many challenges this lesson has. */
    count?: number
}

/** One code language the lesson is available in. */
export interface ContentLanguage {
    /** Stable id used as the selection key, e.g. `"typescript"`. */
    key: string
    /** Display label, already localized by the caller. */
    label: string
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
     * Code languages this lesson is written in. Fewer than two → the right group
     * is not drawn: a switcher with one option is a control that cannot do
     * anything.
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
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: ContentModeNavProps) => {
    const items: Array<ToolbarTabItem> = modes.map((entry) => ({
        key: entry.mode,
        // A count of zero is not news, so it is not shown — a "0" claims the tab has
        // something waiting when it does not.
        label: entry.count ? `${MODE_LABEL[entry.mode]} · ${entry.count}` : MODE_LABEL[entry.mode],
        icon: MODE_ICON[entry.mode],
        // MUTED, not disabled: a locked mode must still receive the click so the
        // screen can open the offer. Disabling it kills the very thing this row is for.
        muted: entry.isLocked,
    }))

    // A switcher with one option is a control that cannot do anything, so the right
    // group only exists from two languages up.
    const hasLanguages = (languages?.length ?? 0) > 1 && language != null && onLanguageChange != null

    return (
        <div data-anat-part={anatPart}>
            <div data-anat-part={showAnatomy ? "Toolbar" : undefined}>
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
                                items: (languages ?? []).map((entry) => ({ key: entry.key, label: entry.label })),
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
                    // Below @app-sm it collapses to a dropdown instead of crowding a narrow
                    // reading column with a second tab strip.
                    collapseRightOnMobile
                    showAnatomy={showAnatomy}
                />
            </div>
        </div>
    )
}

export { ContentModeNav }
