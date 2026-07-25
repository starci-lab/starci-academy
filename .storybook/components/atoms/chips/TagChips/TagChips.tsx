"use client"

import React, { useMemo, useState } from "react"
import { Chip, ScrollShadow, Skeleton as HeroSkeleton, Tooltip } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `TagChips`. Authored in Storybook
 * (not `src`); synced to `src` later. NO `@/components` imports. In `src` the
 * "+N" label comes from `useTranslations()` (`common.tagsMore` = "+{count}");
 * here it is inlined as `+{count}` so the local port stays self-contained.
 */

/**
 * Props for {@link TagChips}.
 */
export interface TagChipsProps {
    /** Tag labels to render (e.g. hashtags). */
    tags: Array<string>
    /**
     * Maximum number of tag chips to show before collapsing the rest into a +N chip.
     * @default 3
     */
    maxVisible?: number
    /** Visual variant passed to each `Chip`. */
    variant?: React.ComponentProps<typeof Chip>["variant"]
    /** Per-slot class overrides for the overflow tooltip. */
    classNames?: {
        trigger?: string
        content?: string
    }
    /**
     * Loading placeholder — renders `maxVisible` self-drawn chip-shaped shimmer
     * pills in the same row instead of the real tags (no tooltip/overflow chip,
     * matching the resting layout so nothing shifts once data resolves).
     */
    isSkeleton?: boolean
    /** Anatomy tag: names this part so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
    /** Storybook-only: badge this composite's OWN direct parts (Chip/Overflow) for a BlockAnatomy panel. */
    showAnatomy?: boolean
}

/**
 * Renders tags as `Chip`s; if there are more than `maxVisible` tags, shows only the first
 * `maxVisible` and a +N chip. Hovering the row opens a HeroUI `Tooltip` listing every tag
 * (controlled open + short close delay so the pointer can move into the menu).
 *
 * @param props.tags — Full list of tag strings.
 * @param props.maxVisible — Cut-off before overflow (default 3).
 */
const TagChipsBase = ({
    tags,
    maxVisible = 3,
    variant = "soft",
    classNames,
    isSkeleton,
    anatPart,
    showAnatomy = false,
}: TagChipsProps) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const visibleTags = useMemo(() => tags.slice(0, maxVisible), [tags, maxVisible])
    if (isSkeleton) {
        return (
            <div className="flex items-center gap-2" data-anat-part={showAnatomy ? "Skeleton.Chip" : anatPart}>
                {/* Leaf skeleton OWNED by this atom (hybrid C) — pills matching the
                    real Chip box (h-6 rounded-full), one per resting slot. */}
                {Array.from({ length: maxVisible }).map((_, index) => (
                    <HeroSkeleton key={index} className="h-6 w-16 rounded-full" />
                ))}
            </div>
        )
    }
    // Số tag bị gom lại; chỉ khi > 0 mới có "tràn" thật để hiện chip +N (tránh số âm/0 khi rỗng hoặc chưa tràn).
    const overflowCount = Math.max(0, tags.length - maxVisible)
    return (
        <div className="flex items-center gap-2" data-anat-part={anatPart}>
            {visibleTags.map((tag, index) => (
                <Chip key={`${String(tag)}-${index}`} variant={variant} data-anat-part={showAnatomy ? "Chip" : undefined}>
                    <Chip.Label>{tag}</Chip.Label>
                </Chip>
            ))}
            {overflowCount > 0 && (
                <Tooltip isOpen={menuOpen} onOpenChange={setMenuOpen}>
                    <Tooltip.Trigger className={classNames?.trigger} data-anat-part={showAnatomy ? "Tooltip" : undefined}>
                        <Chip color="default" variant={variant}>
                            <Chip.Label>+{overflowCount}</Chip.Label>
                        </Chip>
                    </Tooltip.Trigger>
                    <Tooltip.Content className={classNames?.content}>
                        <ScrollShadow className="max-h-[200px]" hideScrollBar={true} orientation="horizontal">
                            <div className="flex flex-col gap-2 text-sm">
                                {tags.map((tag) => (
                                    <div key={tag}>{tag}</div>
                                ))}
                            </div>
                        </ScrollShadow>
                    </Tooltip.Content>
                </Tooltip>
            )}
        </div>
    )
}

/** `TagChips.*` — row of tag `Chip`s with overflow collapsing into a "+N" tooltip. */
export const TagChips = Object.assign(TagChipsBase, {
    Base: TagChipsBase,
})
