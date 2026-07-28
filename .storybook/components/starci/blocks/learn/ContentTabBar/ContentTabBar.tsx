import React from "react"
import { BookOpenIcon, FlameIcon, SparkleIcon, TerminalWindowIcon } from "@phosphor-icons/react"
import { Toolbar, type ToolbarTabItem } from "@sb-components/composites/navigation/Toolbar/Toolbar"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentTabBar`: HOW to look at this lesson. Reading, sandbox,
 * challenges, AI lab on the left; the code language on the right.
 *
 * ⚠️ CORRECTED 2026-07-28. The first cut composed the `Tabs` ATOM directly and
 * rebuilt a worse row on top of it. Wrong twice over. It reached PAST an existing
 * composite — `Toolbar` is already the ported two-group tab row, the thing the app
 * calls `TabsCard` — and in doing so it silently dropped three behaviours the real
 * screen depends on:
 *
 *   • the RIGHT group entirely (the code-language switcher),
 *   • `rightTabsNeutral` — only the LEFT group carries accent, so the row has ONE
 *     accent signal instead of two competing for the eye,
 *   • `collapseRightOnMobile` — the right group becomes a dropdown below `@app-sm`
 *     rather than crowding a narrow reading column with a second tab strip.
 *
 * None of that shows in a screenshot of the happy path, which is exactly why it
 * survived: with one group at desktop width the row LOOKED right.
 *
 * WHY A BLOCK ON TOP OF `Toolbar`: the composite knows it has two tab groups; it
 * does not know what a reading MODE is. The block owns their order, their words,
 * their icons, and which of them a lesson even offers.
 *
 * MODE IS AN ENUM, NOT A LIST OF TABS. The caller says `mode="challenges"` and
 * which modes exist; it never hands over labels. Labels from the caller would be
 * §14d.1's pre-formatted-string trap one level up — the caller would end up owning
 * the vocabulary of the whole reading experience.
 *
 * NEVER SKELETONISED, on purpose. The row is static chrome: known before any
 * lesson data lands, so it paints immediately and gives the reader something to
 * act on while the body loads. There is no `isSkeleton` prop at all rather than
 * one that is quietly unused.
 *
 * A LOCKED MODE STAYS VISIBLE, rendered disabled. The learner should see the mode
 * exists; removing it would make the paywall a surprise instead of an offer.
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

/** One offered mode — whether it is open, and whether it carries a count. */
export interface ContentTabBarMode {
    /** Which mode this entry is. */
    mode: ContentMode
    /** `true` → premium and not yet bought: shown, but not selectable. */
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

/** Props for {@link ContentTabBar}. */
export interface ContentTabBarProps {
    /** Modes this lesson offers, in display order. */
    modes: Array<ContentTabBarMode>
    /** Which mode is being looked at now. */
    mode: ContentMode
    /** Fired with the mode the reader picked. A locked mode never fires. */
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
     * i18n). Without it a screen reader hears four loose tabs.
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
 * The lesson's mode row. See the file header for the full contract and for what
 * the first version of this block got wrong.
 *
 * @param props - {@link ContentTabBarProps}
 */
const ContentTabBar = ({
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
}: ContentTabBarProps) => {
    const items: Array<ToolbarTabItem> = modes.map((entry) => ({
        key: entry.mode,
        // A count of zero is not news, so it is not shown — a "0" claims the tab has
        // something waiting when it does not.
        label: entry.count ? `${MODE_LABEL[entry.mode]} · ${entry.count}` : MODE_LABEL[entry.mode],
        icon: MODE_ICON[entry.mode],
        isDisabled: entry.isLocked,
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

export { ContentTabBar }
