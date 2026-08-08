import React from "react"
import { BookOpenIcon, FlagIcon, PuzzlePieceIcon, TrophyIcon } from "@phosphor-icons/react"
import { ButtonRadioGroup } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { Typography, type TypographyIcon } from "@sb-components/atoms/text/Typography/Typography"

/**
 * `LeaderboardCategoryNav` — the mobile chip row for switching which XP category
 * the leaderboard is sorted by (the `variant="chips"` half of `LeaderboardCategoryRail`;
 * the desktop `ListBox` rail lives in the learn-shell `leftRail` slot). Picking a
 * category re-sorts the same board — a facet toggle, not navigation — so it wraps
 * `Button.RadioGroup`. Which category is selected and each XP count are data on the
 * same chip row.
 */

/** The XP categories the leaderboard can be sorted by — mirrors the src's ranking keys. */
export type LeaderboardCategoryKey = "total" | "challenge" | "reading" | "milestone"

/** Label per category. The BLOCK owns this table — see file header. */
const CATEGORY_LABEL: Record<LeaderboardCategoryKey, string> = {
    total: "Total points",
    challenge: "Challenge",
    reading: "Reading",
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
    /** Viewer's XP in this category — the number the block turns into "{xp} pts". */
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
     * and could not be converted.
     */
    className?: string
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
}: LeaderboardCategoryNavProps) => (
    <div className={className}>
        <div>
            <ButtonRadioGroup
                ariaLabel={ariaLabel}
                value={selected}
                onChange={onSelect}
                items={items.map((item) => ({
                    value: item.key,
                    content: (
                        <Typography
                            size="sm"
                            prefixIcon={CATEGORY_ICON[item.key]}
                            text={`${CATEGORY_LABEL[item.key]} · ${item.xp} points`}

                        />
                    ),
                }))}
            />
        </div>
    </div>
)

export { LeaderboardCategoryNav }
