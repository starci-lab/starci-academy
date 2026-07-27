import React from "react"
import { BookOpenIcon, FlameIcon, SparkleIcon, TerminalWindowIcon } from "@phosphor-icons/react"
import { Tabs, type TabItem } from "@sb-components/atoms/navigation/Tabs/Tabs"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentTabBar`: HOW to look at this lesson. Reading, sandbox,
 * challenges, AI lab — four ways into the same lesson, one row.
 *
 * WHY A BLOCK AND NOT THE `Tabs` ATOM DIRECTLY: the four modes are DOMAIN, not
 * tab data. The block owns their order, their words, their icons, and which of
 * them a course even offers. A screen holding the atom would have to know all
 * four, and every screen showing a lesson would have to know them again.
 *
 * MODE IS AN ENUM, NOT A LIST OF TABS. The caller says `mode="challenges"` and
 * which modes exist; it never hands over labels. Handing over labels is exactly
 * the pre-formatted-string trap of §14d.1, one level up: the caller would own
 * the vocabulary of the whole reading experience.
 *
 * NEVER SKELETONISED — on purpose, and this is the one thing to not "fix" later.
 * The row is static chrome: it is known before any lesson data arrives, so it
 * paints immediately and gives the reader something to act on while the body
 * loads. A shimmer here would hide a control that was ready.
 *
 * A LOCKED MODE STAYS VISIBLE. A premium mode renders disabled rather than being
 * dropped: the learner should see the mode exists. Removing it would make the
 * paywall a surprise instead of an offer.
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

const MODE_ICON: Record<ContentMode, TabItem["icon"]> = {
    content: BookOpenIcon,
    sandbox: TerminalWindowIcon,
    challenges: FlameIcon,
    aiLab: SparkleIcon,
}

/** One offered mode — whether it is open, and whether it carries a count. */
export interface ContentTabBarMode {
    /** Which mode this entry is. */
    mode: ContentMode
    /** `true` → premium and not yet bought: shown, but not selectable. */
    isLocked?: boolean
    /** Count floated on the tab, e.g. how many challenges this lesson has. */
    count?: number
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
     * Accessible name for the row, localized by the caller (blocks carry no
     * i18n). Without it a screen reader hears four loose tabs.
     */
    ariaLabel: string
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The lesson's mode row. See the file header for the full contract.
 *
 * @param props - {@link ContentTabBarProps}
 */
const ContentTabBar = ({
    modes,
    mode,
    onModeChange,
    ariaLabel,
    showAnatomy = false,
    anatPart,
}: ContentTabBarProps) => {
    const items: Array<TabItem> = modes.map((entry) => ({
        key: entry.mode,
        label: MODE_LABEL[entry.mode],
        icon: MODE_ICON[entry.mode],
        // A count of zero is not news, so it is not shown — a badge reading "0"
        // claims the tab has something waiting when it does not.
        badge: entry.count ? String(entry.count) : undefined,
        isDisabled: entry.isLocked,
    }))

    return (
        <div data-anat-part={anatPart}>
            <Tabs
                items={items}
                selectedKey={mode}
                onSelectionChange={(key) => onModeChange(key as ContentMode)}
                ariaLabel={ariaLabel}
                showAnatomy={showAnatomy}
            />
        </div>
    )
}

export { ContentTabBar }
