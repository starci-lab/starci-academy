import React from "react"
import { CheckCircleIcon, CircleIcon, LockIcon, PlayCircleIcon } from "@phosphor-icons/react"
import { GlyphMark, type GlyphMarkTone, type IconComponent } from "@/components/atoms/display/GlyphMark"
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
 * Glyph scale/colour live on `GlyphMark` (`size-5` + tone); the table only picks
 * which icon and which tone.
 */
/** The leading mark one content state resolves to: which glyph, and how it is coloured. */
interface ContentLeadingStyle {
    /** Phosphor glyph component for this state. */
    Icon: IconComponent
    /** GlyphMark colour tone; every state stays on one round shape (see the note above). */
    tone: GlyphMarkTone
}
const CONTENT_LEADING: Record<KeepGoingContentState, ContentLeadingStyle> = {
    active: { Icon: PlayCircleIcon, tone: "accent" },
    done: { Icon: CheckCircleIcon, tone: "success" },
    todo: { Icon: CircleIcon, tone: "default" },
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
const LOCKED_LEADING: ContentLeadingStyle = { Icon: LockIcon, tone: "warning" }
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
     * to shimmer), into `VariantChipDifficulty`, and into the leading `GlyphMark` —
     * each already owns its own `isSkeleton`.
     *
     * Empty while loading (`contents.length === 0`) → guesses **3** rows, matching
     * this pass's convention for repeating lists.
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
                const { Icon, tone } = content.locked
                    ? LOCKED_LEADING
                    : CONTENT_LEADING[content.state]
                return {
                    key: content.id,
                    leading: () => (
                        <GlyphMark
                            icon={Icon}
                            tone={tone}
                            isSkeleton={isSkeleton}
                            ariaLabel={content.locked ? "Paid content" : undefined}
                        />
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
