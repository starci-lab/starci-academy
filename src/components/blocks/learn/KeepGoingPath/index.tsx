import React from "react"
import { Skeleton } from "@/components/blocks/skeleton/Skeleton"
import { CheckCircleIcon, CircleIcon, LockIcon, PlayCircleIcon } from "@phosphor-icons/react"
import { SurfaceCardList } from "@/components/composites/cards/SurfaceCard"
import { VariantChipDifficulty, type Difficulty } from "@/components/blocks/learn/VariantChip"
/**
 * `KeepGoingPath` — the continue-learning path for the current chapter, answering
 * "where am I + what's next". Deliberately does not redraw the full module tree
 * (that lives in the left rail). The block owns the shape — state icon
 * (play/check/circle), difficulty chip, lock — while the caller supplies only data.
 * Every variant shares one `SurfaceCardList` → rows tree, differing only in content.
 */
/** Learning state of a content item in the path. */
export type KeepGoingContentState = "done" | "active" | "todo"
/** A content item in the path — plain DATA, the block builds the shape itself. */
export interface KeepGoingContent {
    /** Stable React key. */
    id: string
    /** Content title. */
    title: string
    /** Reading time (minutes) — the block assembles it into the subtitle line. */
    minutes: number
    /** Done / in progress / not started — decides the leading icon. */
    state: KeepGoingContentState
    /** Difficulty — the block builds `VariantChipDifficulty` itself. */
    difficulty: Difficulty
    /** Content belongs to a paid tier → shows the lock mark. */
    locked?: boolean
    /** Row press handler. */
    onPress?: () => void
}
/**
 * Leading icon per state — the block owns this table, the caller doesn't pick.
 * Goes through `leading` (a node) rather than `leadingIcon`, because each state
 * carries its OWN COLOR while `leadingIcon` forces a shared `text-muted`.
 *
 * ALL THREE STATES SHARE ONE ROUND SHAPE: the in-progress
 * state uses `PlayCircleIcon` (a play mark INSIDE a circle) rather than a bare triangle
 * (`PlayIcon`) — its two siblings `CheckCircleIcon`/`CircleIcon` are both circles, so one
 * shape breaking the mould breaks the row's reading rhythm.
 *
 * `size-5` — the row's leading icon size (heading icon = 5;
 * the icon inside the chip follows the font instead).
 */
/** The leading mark one content state resolves to: which glyph, and how it is coloured. */
interface ContentLeadingStyle {
    /** Phosphor glyph component for this state. */
    Icon: typeof CircleIcon
    /** Size + colour classes; every state stays on one round shape (see the note above). */
    glyphClass: string
}
const CONTENT_LEADING: Record<KeepGoingContentState, ContentLeadingStyle> = {
    active: { Icon: PlayCircleIcon, glyphClass: "size-5 text-accent-soft-foreground" },
    done: { Icon: CheckCircleIcon, glyphClass: "size-5 text-success-soft-foreground" },
    todo: { Icon: CircleIcon, glyphClass: "size-5 text-foreground" },
}
/**
 * A LOCKED content item → the lock icon **REPLACES** the state icon at the head of
 * the row instead of hanging a second one on the tail.
 *
 * COLOR: `warning` — NOT muted. A muted lock turns
 * invisible, and this isn't decoration: it's a SALES DOOR, it has to be seen. Uses
 * the `-soft-foreground` step to match its siblings (accent/success), not a bold
 * `text-warning`.
 *
 * Why it sits at the HEAD of the row: a standard list row already has leading ·
 * title · subtitle · meta; bolting a second icon onto the tail just creates a spot
 * nobody reads. And semantically: for a not-yet-unlocked item, "read / reading /
 * unread" is meaningless — **the lock IS its state**.
 */
const LOCKED_LEADING = { Icon: LockIcon, glyphClass: "size-5 text-warning-soft-foreground" }
/**
 * The MODULE this path belongs to.
 *
 * A `string` prop cannot be checked: nothing stops a caller sending `"chapter 2-"` or a
 * completely different sentence. Two named fields make the wrong shape UNTYPEABLE.
 *
 * Declared as a NAMED, EXPORTED interface rather than inline `{ index: number; name:
 * string }`: an inline shape has no name to
 * import, so a caller building this object has nothing to type it against and every
 * call-site re-describes it by hand.
 */
export interface ModuleLike {
    /** 1-based position of the module inside the course. */
    index: number
    /** Module name WITHOUT any prefix — the block adds "Chapter"/"Continue" itself. */
    name: string
}
/** Props for {@link KeepGoingPath}. */
export interface KeepGoingPathBaseProps {
    /** The current module as an ENTITY — never a pre-baked string. See {@link ModuleLike}. */
    module: ModuleLike
    /** The content items in the continue-learning path. */
    contents: Array<KeepGoingContent>
    /**
     * `true` → mirror shimmer INSTEAD OF waiting on `contents`. The flag FLOWS
     * DOWN into `SurfaceCardList` (keeps the box/row/divider, only the text turns
     * to shimmer) and into `VariantChipDifficulty` — both the atom and the frame
     * already own their own `isSkeleton`.
     *
     * Empty while loading (`contents.length === 0`) → guesses **3** rows, matching
     * this pass's convention for repeating lists.
     *
     * NOTE: the leading icon (play/check/circle/lock) is chosen DIRECTLY by the block
     * itself from the `CONTENT_LEADING`/`LOCKED_LEADING` table — it doesn't go
     * through any atom — so this is exactly the §12c case that allows hand-rolling
     * ONE shimmer dot in place of the icon, instead of branching off to build a
     * whole separate row.
     */
    isSkeleton?: boolean
}
/** Placeholder DATA for the 3 guessed rows when `contents` is empty while loading (§12c). */
const SKELETON_ROWS: Array<KeepGoingContent> = Array.from({ length: 3 }, (_unused, index) => ({
    id: `skeleton-${index}`,
    title: "",
    minutes: 0,
    state: "todo",
    difficulty: "beginner",
}))
/**
 * Continue-learning path — module heading + content list, sharing its layout with
 * `LearnNudges`.
 *
 * @param props - {@link KeepGoingPathBaseProps}
 */
const KeepGoingPathBase = ({
    module,
    contents,
    isSkeleton = false,
}: KeepGoingPathBaseProps) => {
    // Empty while loading (no real contents yet) → guess 3 rows, keeping the right
    // shape for when real data arrives (§8). Once real `contents` exist, keep the
    // EXACT row count already there.
    const rows = isSkeleton && contents.length === 0 ? SKELETON_ROWS : contents
    return (
        <SurfaceCardList
            identity={{ tier: "block", component: "KeepGoingPath" }}
            // The heading sentence is assembled by the BLOCK — the caller only hands over the module name.
            // EVERY word of the heading is decided HERE — "Continue", "Chapter", the `·`.
            // The caller only supplies the number and the name.
            label={`Continue · Chapter ${module.index} · ${module.name}`}

            isSkeleton={isSkeleton}
            items={rows.map((content) => {
                // A lock REPLACES the state icon, it isn't added on top at the row's tail.
                const { Icon, glyphClass } = content.locked
                    ? LOCKED_LEADING
                    : CONTENT_LEADING[content.state]
                return {
                    key: content.id,
                    leading: isSkeleton ? (
                        // The icon is chosen DIRECTLY by the block itself (no atom in between) —
                        // hand-roll a single shimmer dot in place of the state/lock icon.
                        () => <Skeleton className="size-5 shrink-0 rounded-full" />
                    ) : (
                        () => (
                            <Icon
                                aria-label={content.locked ? "Paid content" : undefined}
                                aria-hidden={content.locked ? undefined : true}
                                focusable="false"
                                className={glyphClass}
                            />
                        )
                    ),
                    title: content.title,
                    subtitle: `${content.minutes} min read`,
                    onPress: content.onPress,
                    // Meta now holds EXACTLY ONE thing: difficulty. The shape is owned by
                    // DESIGN — the block doesn't reshape the chip (§14d.1). The flag flows
                    // straight down into the `VariantChipDifficulty` atom.
                    meta: () => (
                        <VariantChipDifficulty
                            difficulty={content.difficulty}
                            isSkeleton={isSkeleton}

                        />
                    ),
                }
            })}
        />
    )
}
/** `KeepGoingPath.*` — single-component namespace ⇒ only `.Base`. */
export { KeepGoingPathBase as KeepGoingPath }
