import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { PuzzlePieceIcon } from "@phosphor-icons/react"
import { SurfaceCardList } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { VariantChipDifficulty, type Difficulty } from "@sb-components/starci/blocks/learn/VariantChip/VariantChip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ModuleChallengeList`: every CHALLENGE across this module's lessons,
 * flattened into one list — solve-me rows, not read-me rows.
 *
 * ⭐ A SEPARATE BLOCK FROM A LESSON LIST, NOT ONE LIST WITH A `kind` SWITCH
 * (§14d). This shares its layout composite with a plain lesson list
 * (`SurfaceCardList`), but the WHY underneath differs on every axis that
 * matters:
 *   - VERB: a lesson row means "go read this"; a challenge row means "go solve
 *     this" — the row's job is to send the learner into a puzzle, not a page.
 *   - ICON: a lesson leans on read-state glyphs (play/check/circle, see
 *     `KeepGoingPath`); a challenge is always the same `PuzzlePieceIcon`,
 *     recoloured by whether it's been solved — there is no "in progress" for a
 *     challenge, only solved / not yet.
 *   - NAV TARGET: a lesson row opens the LESSON itself; a challenge row opens
 *     the OWNING LESSON'S CHALLENGES TAB — the row's `id` identifies the
 *     challenge for the key, but `onSelectChallenge` is called with the
 *     `lessonId`, because that's the route that actually exists.
 * Folding these into one list behind a prop would hide that divergence behind
 * a boolean nobody could read the reason for later — this is exactly the
 * mistake the file header of `ContentModeNav` documents (a "shared" component
 * that quietly drops a real behaviour because two different jobs got merged
 * into one shape).
 *
 * COMPOSED FROM `SurfaceCardList` (layout) + `VariantChipDifficulty` (design) —
 * the block adds no card chrome of its own, it only supplies the domain: which
 * icon color a row gets, what its subtitle says, and where a press goes.
 *
 * THE LEADING ICON IS HAND-ROLLED, NOT `leadingIcon` (§4/§5 escape hatch, same
 * call as `KeepGoingPath`'s state table): `leadingIcon` forces the frame's
 * shared `text-muted`/foreground rule, but "solved" carries its OWN success
 * color that must survive independent of the row's text. Going through
 * `leading` (a node) is the one path that lets a per-row color live outside
 * the frame's own rule.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One challenge row — plain DATA, the block builds the row shape itself. */
export interface ModuleChallengeItem {
    /** Stable React key — the challenge's own id. */
    id: string
    /** Challenge title. */
    title: string
    /** Difficulty tier — the block builds `VariantChipDifficulty` itself. */
    difficulty: Difficulty
    /** Whether this challenge has been solved — decides the icon color and the subtitle. */
    completed: boolean
    /** The LESSON this challenge belongs to — where a press actually navigates. */
    lessonId: string
}

/** Props for {@link ModuleChallengeList}. */
export interface ModuleChallengeListProps {
    /** The challenges, flattened across every lesson in the module. */
    challenges: Array<ModuleChallengeItem>
    /**
     * Fired with the OWNING LESSON's id (not the challenge id) — a challenge is
     * solved inside its lesson's Challenges tab, there is no standalone
     * challenge route to send the learner to.
     */
    onSelectChallenge: (lessonId: string) => void
    /**
     * `true` → mirror shimmer instead of waiting on `challenges`. The flag flows
     * straight into `SurfaceCardList` (keeps the row box/divider, only the text
     * shimmers) and into `VariantChipDifficulty`. The leading icon color is
     * chosen directly by this block (no atom in between, see the file header),
     * so — same as `KeepGoingPath` — it hand-rolls a single shimmer dot in its
     * place rather than branching off a second row shape.
     *
     * Empty while loading (`challenges.length === 0`) guesses **3** rows,
     * matching this pass's convention for repeating lists.
     */
    isSkeleton?: boolean
}

/**
 * Icon color by solved state — the block owns this table (mirrors
 * `KeepGoingPath`'s `CONTENT_LEADING`, one entry instead of three because a
 * challenge has no "in progress" state, only solved / not yet).
 */
const CHALLENGE_LEADING_CLASS: Record<"completed" | "todo", string> = {
    completed: "size-5 text-success-soft-foreground",
    todo: "size-5 text-foreground",
}

/** Placeholder DATA for the 3 guessed rows when `challenges` is empty while loading (§12c). */
const SKELETON_CHALLENGES: Array<ModuleChallengeItem> = Array.from({ length: 3 }, (_unused, index) => ({
    id: `skeleton-${index}`,
    title: "",
    difficulty: "beginner",
    completed: false,
    lessonId: "",
}))

/**
 * Every challenge across this module's lessons, flattened into one solve-me
 * list. See the file header for the full contract and why this is not merged
 * with a lesson list.
 *
 * @param props - {@link ModuleChallengeListProps}
 */
const ModuleChallengeList = ({
    challenges,
    onSelectChallenge,
    isSkeleton = false,
}: ModuleChallengeListProps) => {
    // Empty while loading (no real challenges yet) → guess 3 rows, keeping the
    // right shape for when real data arrives (§8). Once real `challenges` exist,
    // keep the EXACT row count already there.
    const rows = isSkeleton && challenges.length === 0 ? SKELETON_CHALLENGES : challenges

    return (
        <SurfaceCardList

            isSkeleton={isSkeleton}
            items={rows.map((challenge) => ({
                key: challenge.id,
                leading: isSkeleton ? (
                    // The color is chosen DIRECTLY by this block (no atom in between) —
                    // hand-roll a single shimmer dot in place of the puzzle icon.
                    <HeroSkeleton className="size-5 shrink-0 rounded-full" />
                ) : (
                    <PuzzlePieceIcon
                        aria-hidden
                        focusable="false"
                        className={CHALLENGE_LEADING_CLASS[challenge.completed ? "completed" : "todo"]}
                    />
                ),
                title: challenge.title,
                // Only a SOLVED challenge earns the subtitle — an unsolved row says
                // nothing extra, the difficulty chip is already the row's other fact.
                subtitle: challenge.completed ? "Completed" : undefined,
                onPress: () => onSelectChallenge(challenge.lessonId),
                // Meta holds EXACTLY ONE thing: difficulty. The shape is owned by
                // DESIGN — this block doesn't reshape the chip (§14d.1). The flag
                // flows straight down into the `VariantChipDifficulty` atom.
                meta: (
                    <VariantChipDifficulty
                        difficulty={challenge.difficulty}
                        isSkeleton={isSkeleton}

                    />
                ),
            }))}
        />
    )
}

export { ModuleChallengeList }
