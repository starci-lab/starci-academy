import React from "react"
import { BookOpenIcon, FlagIcon, PuzzlePieceIcon, TrophyIcon } from "@phosphor-icons/react"
import { ButtonRadioGroup } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { Typography, type TypographyIcon } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `LeaderboardCategoryNav`: the MOBILE half of the src `LeaderboardCategoryRail`
 * fetch — which XP CATEGORY the board is currently sorted by.
 *
 * WHY ONLY HALF THE SRC COMPONENT LIVES HERE: `LeaderboardCategoryRail` draws TWO shapes
 * off one shared fetch. `variant="rail"` is a desktop `ListBox` that lives in the SHARED
 * `courses/[courseId]/learn/layout.tsx` `leftRail` slot — the same boundary as
 * `ContentMap`/`MilestoneOutline`, handed to every learn tab, not just this screen — so it
 * is OUT OF SCOPE here. `variant="chips"` is rendered DIRECTLY inside `Leaderboard/index.tsx`'s
 * own tree, `@app-lg:hidden`, so that half genuinely belongs to THIS screen and is the one
 * that earns a block.
 *
 * ⭐ REUSE, NOT A NEW ROW — the exact mistake this task exists to avoid (see
 * `ContentModeNav`'s file header for the full story of what happened last time). Picking a
 * category RE-SORTS the same board; it never swaps in a different body — the opposite of
 * `ContentModeNav`'s mode row, which changes the ROUTE. That makes this a single-value
 * FACET/config toggle, not navigation, so it reuses `Button.RadioGroup` — already documented
 * for exactly this case ("a facet/config toggle isn't a CTA": selected renders neutral
 * `tertiary`, never accent) — instead of `Toolbar`'s tab-navigation idiom or a hand-rolled
 * pressable row.
 *
 * ⚠️ ONE DELIBERATE VISUAL DEPARTURE FROM `src`, NOT AN OVERSIGHT: the original chip strip
 * is a horizontal-SCROLL row (`overflow-x-auto`, hand-written flex+gap). `Button.RadioGroup`
 * is documented to flex-WRAP instead ("buttons wrap to the next line, never scroll") — the
 * canon idiom for this exact shape (see `QuizSetup`'s length/level rows). Reusing the atom
 * as-is, rather than fighting its wrap behaviour back into a scroll strip, is the point of
 * reuse-first: four short category chips wrapping to a second line on a narrow phone reads
 * fine, and a hand-rolled `overflow-x-auto` row would also fail `check-seams`'s
 * hand-rolled-layout rule at this tier.
 *
 * THE BLOCK OWNS THE CATEGORY→ICON/LABEL TABLE (§14d.1), the same way `ModuleHeader` owns
 * its tier table: `items` carries only `key` + `xp` — TYPED DOMAIN DATA — never a
 * pre-built label or icon component. A caller that could pass those would be handing over
 * wording that belongs to this block. The XP number's wording ("{label} · {xp} điểm",
 * mirroring the app's `leaderboard.xp` copy) is likewise decided here, not assembled by
 * the caller and passed in as a string.
 *
 * NEVER SKELETONISED, on purpose (same call as `ContentModeNav`): the four categories and
 * their icons/labels are static chrome, known before any leaderboard fetch lands — only the
 * `xp` VALUES depend on that fetch, so a caller with no numbers yet simply does not render
 * this block yet, rather than this row growing a shimmer branch for one field.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The XP categories the leaderboard can be sorted by — mirrors the src's ranking keys. */
export type LeaderboardCategoryKey = "total" | "challenge" | "reading" | "milestone"

/** Label per category. The BLOCK owns this table — see file header. */
const CATEGORY_LABEL: Record<LeaderboardCategoryKey, string> = {
    total: "Tổng điểm",
    challenge: "Challenge",
    reading: "Đọc bài",
    milestone: "Milestone",
}

/** Icon per category — same glyphs the desktop rail uses, so switching layout reads as ONE control. */
const CATEGORY_ICON: Record<LeaderboardCategoryKey, TypographyIcon> = {
    total: TrophyIcon,
    challenge: PuzzlePieceIcon,
    reading: BookOpenIcon,
    milestone: FlagIcon,
}

/** One category the nav offers — TYPED DOMAIN DATA only, never a formatted label. */
export interface LeaderboardCategoryOption {
    /** Which category this entry is. */
    key: LeaderboardCategoryKey
    /** Viewer's XP in this category — the number the block turns into "{xp} điểm". */
    xp: number
}

/** Props for {@link LeaderboardCategoryNav}. */
export interface LeaderboardCategoryNavProps {
    /** Categories offered, in display order. */
    items: Array<LeaderboardCategoryOption>
    /** Which category the board is sorted by right now. */
    selected: LeaderboardCategoryKey
    /** Fired with the category the reader picked — the caller re-sorts the board, this block never does. */
    onSelect: (key: LeaderboardCategoryKey) => void
    /** Accessible name for the row, localized by the caller (blocks carry no i18n). */
    ariaLabel: string
    /**
     * @deprecated pass `classNames` instead — a free string cannot be constrained.
     * Kept only for `LeaderboardPage`'s `@app-lg:hidden`: a responsive visibility
     * toggle, not a positioning class, so it falls outside `AllowedClassName`
     * (ATOM-5 narrowing pass, 2026-07-31) and could not be converted.
     */
    className?: string
    /** Extra classes on the row. Prefer this over `className`; the string form is going away. */
    classNames?: Array<AllowedClassName>
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/**
 * The mobile category chip row. See the file header for why this is only HALF of the src
 * `LeaderboardCategoryRail` (the desktop `ListBox` half lives in a shared layout slot, out
 * of scope) and why it reuses `Button.RadioGroup` rather than a hand-rolled scroll strip.
 *
 * @param props - {@link LeaderboardCategoryNavProps}
 */
const LeaderboardCategoryNav = ({
    items,
    selected,
    onSelect,
    ariaLabel,
    className,
    classNames,
    showAnatomy = false,
    anatPart,
}: LeaderboardCategoryNavProps) => (
    <div data-anat-part={anatPart}>
        <div data-anat-part={showAnatomy ? "ButtonRadioGroup" : undefined}>
            <ButtonRadioGroup
                ariaLabel={ariaLabel}
                value={selected}
                onChange={onSelect}
                className={className}
                classNames={classNames}
                showAnatomy={showAnatomy}
                items={items.map((item) => ({
                    value: item.key,
                    content: (
                        <Typography
                            size="sm"
                            prefixIcon={CATEGORY_ICON[item.key]}
                            text={`${CATEGORY_LABEL[item.key]} · ${item.xp} điểm`}
                            anatPart={showAnatomy ? "Typography" : undefined}
                        />
                    ),
                }))}
            />
        </div>
    </div>
)

export { LeaderboardCategoryNav }
