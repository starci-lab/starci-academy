import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"
import { CheckIcon, CircleIcon, LockIcon, PlayIcon } from "@phosphor-icons/react"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { VariantChipDifficulty, type Difficulty } from "@sb-components/starci/blocks/learn/VariantChip/VariantChip"

/**
 * `ModuleLessonList` — the full, ordered lesson table of contents of one module. Wraps
 * `SurfaceCardList` + `VariantChipDifficulty`. Sibling of `KeepGoingPath` but shows the
 * whole module with no heading of its own and never trims to "what's next".
 *
 * Uses distinct bare glyphs (`PlayIcon`/`CheckIcon`/`CircleIcon`) for a checklist reading
 * rhythm. The premium lock is a trailing marker beside the difficulty chip and never
 * replaces the state icon (premium is orthogonal to progress). `resumeLessonId` outranks
 * `isRead` for the leading icon. Owns the subtitle sentence ("N min read · M challenges")
 * from two numbers. A premium row is not disabled — `onSelectLesson` fires for every row;
 * what a locked tap means is the caller's decision.
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
            leading: () => (isSkeleton ? (
                // The status icon is chosen DIRECTLY by the block from `STATUS_LEADING`,
                // never through an atom in between — hand-roll a single shimmer dot in
                // its place instead of branching off to build a whole separate row (§12c).
                <HeroSkeleton className="size-5 shrink-0 rounded-full" />
            ) : (
                <Icon aria-hidden focusable="false" className={className} />
            )),
            title: lesson.title,
            // The subtitle sentence is assembled HERE — the caller hands over two
            // numbers, never a pre-formatted string (§14d.1).
            subtitle: `${lesson.minutesRead} min read · ${lesson.challengeCount} challenges`,
            // Placeholder rows never become press targets — nothing underneath can act
            // yet, and a clickable shimmer row would be a false affordance.
            onPress: usingPlaceholders ? undefined : () => onSelectLesson(lesson.id),
            // Difficulty is DESIGN's shape (`VariantChipDifficulty`, §14d.1) — the block
            // doesn't reshape the chip, only decides whether one is offered at all.
            meta: lesson.difficulty != null ? () => (
                <VariantChipDifficulty
                    difficulty={lesson.difficulty!}
                    isSkeleton={isSkeleton}

                />
            ) : undefined,
            // A quiet trailing marker, riding NEXT TO the chip rather than replacing the
            // leading icon (see the ⭐ judgement call above).
            trailingIcon: lesson.isPremium ? LockIcon : undefined,
        }
    })

    return (
        <SurfaceCardList

            isSkeleton={isSkeleton}
            items={rows}
        />
    )
}

export { ModuleLessonList }
