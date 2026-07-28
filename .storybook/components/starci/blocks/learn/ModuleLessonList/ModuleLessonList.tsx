import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { CheckIcon, CircleIcon, LockIcon, PlayIcon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { VariantChipDifficulty, type Difficulty } from "@sb-components/starci/blocks/learn/VariantChip/VariantChip"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ModuleLessonList`: the FULL, ORDERED lesson list of one module —
 * every lesson the module has, not just what's next.
 *
 * REUSE, NOT A REBUILD (the exact trap `ContentModeNav`'s header warns about):
 * this wraps `SurfaceCardList` for the frame/row rhythm and `VariantChipDifficulty`
 * for the trailing chip — it does not hand-roll a bordered `<div>` and `.map()`
 * its own rows. Same composite `KeepGoingPath` already reaches for.
 *
 * SIBLING OF `KeepGoingPath`, NOT A DUPLICATE. `KeepGoingPath` shows the top of
 * the CONTINUE queue for the current chapter and owns its own heading sentence
 * ("Tiếp tục · Chương N …"); this block shows the WHOLE module's lesson table of
 * contents with no heading of its own (the screen/section around it supplies
 * that), and it never trims the list down to "what's next".
 *
 * ⭐ JUDGEMENT CALL — bare glyphs, not `KeepGoingPath`'s round trio. `KeepGoingPath`
 * deliberately keeps `PlayCircleIcon`/`CheckCircleIcon`/`CircleIcon` (one round
 * silhouette across all three states) because it is a short, glanceable queue.
 * This block is a full table of contents read top-to-bottom, closer to a
 * checklist, so it uses the spec's literal glyphs — `PlayIcon` (bare triangle) ·
 * `CheckIcon` (bare check) · `CircleIcon` (open ring) — three DIFFERENT
 * silhouettes reading as "in progress / done / not started" at a glance, the way
 * a course-outline checklist usually reads. Both tables are correct for their own
 * list; this is not a drift off `KeepGoingPath`, it's a distinct reading rhythm.
 *
 * ⭐ JUDGEMENT CALL — the lock does NOT replace the state icon. In `KeepGoingPath`
 * a locked item's paywall status is the only thing worth saying, so the lock
 * REPLACES the leading icon. Here premium-ness is ORTHOGONAL to progress — a
 * paid lesson can already be read, or be the one to resume — so the state icon
 * always stays at the head of the row, and the lock rides as its OWN trailing
 * marker next to the difficulty chip, never covering up progress.
 *
 * ⭐ `resumeLessonId` WINS OVER `isRead`. A lesson can be marked read (finished
 * once before) and still be the one the reader left off on this session — the
 * resume marker answers "where do I go next", which outranks "have I seen this
 * before" for deciding the leading icon.
 *
 * THE BLOCK OWNS THE SUBTITLE SENTENCE ("N phút đọc · M thử thách", §14d.1) — the
 * caller hands over the two numbers, never a formatted string.
 *
 * ⛔ A PREMIUM ROW IS NOT DISABLED. Exactly the bug `ContentModeNav`'s header
 * documents: `onSelectLesson` fires for every row regardless of `isPremium`. What
 * a tap on a locked lesson MEANS (open the reader anyway, or bounce to the
 * paywall) is the CALLER's business decision, not this block's to hardcode.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Where this lesson sits in the reader's progress through the module. */
type LessonStatus = "resume" | "read" | "unread"

/** One lesson row — plain data; the block assembles the wording and the icon. */
export interface ModuleLessonListLesson {
    /** Stable id — also what `onSelectLesson`/`resumeLessonId` key off. */
    id: string
    /** Lesson title. */
    title: string
    /** Reading time in minutes — the block folds this into the subtitle itself. */
    minutesRead: number
    /** Practice-challenge count for this lesson — folded into the same subtitle. */
    challengeCount: number
    /** Already finished at least once. */
    isRead: boolean
    /** Behind the paid tier — shows the trailing lock marker. */
    isPremium: boolean
    /** Difficulty tier — the block builds `VariantChipDifficulty` itself. Omit → no chip. */
    difficulty?: Difficulty
}

/** Props for {@link ModuleLessonList}. */
export interface ModuleLessonListProps {
    /** Every lesson in the module, in reading order. */
    lessons: Array<ModuleLessonListLesson>
    /** The lesson to mark "resume" — wins over `isRead` for the leading icon (see file header). */
    resumeLessonId?: string
    /** Fired with the lesson id on ANY row press, premium or not (see the ⛔ note above). */
    onSelectLesson: (id: string) => void
    /**
     * `true` → the list draws its own row mirror. `lessons` empty while loading
     * (§12c) → guesses 3 rows, the SSOT convention this composite's siblings
     * (`KeepGoingPath`, `LearnNudges`) already use.
     */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
}

/** Resolves the leading-icon state: `resumeLessonId` wins over `isRead` (see file header). */
const lessonStatus = (lesson: ModuleLessonListLesson, resumeLessonId?: string): LessonStatus => {
    if (resumeLessonId != null && lesson.id === resumeLessonId) {
        return "resume"
    }
    return lesson.isRead ? "read" : "unread"
}

/** The leading mark one lesson status resolves to: which glyph, and how it is coloured. */
interface LessonLeadingStyle {
    /** Phosphor glyph component for this status. */
    Icon: typeof CircleIcon
    /** Size + colour classes. */
    className: string
}

/** Leading glyph + colour per status — the block owns this table, the caller never picks an icon. */
const STATUS_LEADING: Record<LessonStatus, LessonLeadingStyle> = {
    resume: { Icon: PlayIcon, className: "size-5 text-accent-soft-foreground" },
    read: { Icon: CheckIcon, className: "size-5 text-success-soft-foreground" },
    unread: { Icon: CircleIcon, className: "size-5 text-foreground" },
}

/** Placeholder rows for the guessed skeleton count (§12c) — never carry a press handler. */
const SKELETON_LESSONS: Array<ModuleLessonListLesson> = Array.from({ length: 3 }, (_unused, index) => ({
    id: `skeleton-${index}`,
    title: "",
    minutesRead: 0,
    challengeCount: 0,
    isRead: false,
    isPremium: false,
    difficulty: "beginner",
}))

/**
 * The module's full lesson table of contents. See the file header for the full
 * contract and the two judgement calls that set it apart from `KeepGoingPath`.
 *
 * @param props - {@link ModuleLessonListProps}
 */
const ModuleLessonList = ({
    lessons,
    resumeLessonId,
    onSelectLesson,
    isSkeleton = false,
    showAnatomy = false,
    anatPart,
}: ModuleLessonListProps) => {
    // Empty while loading (no real lessons yet) → guess 3 rows, keeping the right
    // shape for when real data arrives (§8). Once real `lessons` exist, keep the
    // EXACT row count already there — the placeholder set never mixes with real rows.
    const usingPlaceholders = isSkeleton && lessons.length === 0
    const source = usingPlaceholders ? SKELETON_LESSONS : lessons

    const rows: Array<SurfaceCardListItem> = source.map((lesson) => {
        const { Icon, className } = STATUS_LEADING[lessonStatus(lesson, resumeLessonId)]
        return {
            key: lesson.id,
            leading: isSkeleton ? (
                // The status icon is chosen DIRECTLY by the block from `STATUS_LEADING`,
                // never through an atom in between — hand-roll a single shimmer dot in
                // its place instead of branching off to build a whole separate row (§12c).
                <HeroSkeleton className="size-5 shrink-0 rounded-full" />
            ) : (
                <Icon aria-hidden focusable="false" className={className} />
            ),
            title: lesson.title,
            // The subtitle sentence is assembled HERE — the caller hands over two
            // numbers, never a pre-formatted string (§14d.1).
            subtitle: `${lesson.minutesRead} phút đọc · ${lesson.challengeCount} thử thách`,
            // Placeholder rows never become press targets — nothing underneath can act
            // yet, and a clickable shimmer row would be a false affordance.
            onPress: usingPlaceholders ? undefined : () => onSelectLesson(lesson.id),
            // Difficulty is DESIGN's shape (`VariantChipDifficulty`, §14d.1) — the block
            // doesn't reshape the chip, only decides whether one is offered at all.
            meta: lesson.difficulty != null ? (
                <VariantChipDifficulty
                    difficulty={lesson.difficulty}
                    isSkeleton={isSkeleton}
                    anatPart={showAnatomy ? "VariantChipDifficulty" : undefined}
                />
            ) : undefined,
            // A quiet trailing marker, riding NEXT TO the chip rather than replacing the
            // leading icon (see the ⭐ judgement call above).
            trailingIcon: lesson.isPremium ? LockIcon : undefined,
        }
    })

    return (
        <SurfaceCardList
            anatPart={anatPart ?? (showAnatomy ? "SurfaceCardList" : undefined)}
            isSkeleton={isSkeleton}
            items={rows}
        />
    )
}

export { ModuleLessonList }
