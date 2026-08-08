"use client"

import { Chip, ScrollShadow, Tooltip } from "@heroui/react"
import React, { useMemo, useState } from "react"

/**
 * Props for {@link _TagChips} — presentational; the overflow label already resolved.
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
    /** Already-localized "+N more" label for the overflow chip (interpolated with the count). */
    overflowLabel: string
}

/**
 * Renders tags as `Chip`s; if there are more than `maxVisible` tags, shows only the first
 * `maxVisible` and a +N chip. Hovering the row opens a HeroUI `Tooltip` listing every tag
 * (controlled open + short close delay so the pointer can move into the menu).
 *
 * @param props - {@link TagChipsProps}
 */
export const _TagChips = ({ tags, maxVisible = 3, variant = "soft", overflowLabel }: TagChipsProps) => {
    const [menuOpen, setMenuOpen] = useState(false)
    const visibleTags = useMemo(() => tags.slice(0, maxVisible), [tags, maxVisible])
    // How many tags were folded away; only when > 0 is there a real "overflow" worth a +N chip (avoids a negative/zero count when empty or not overflowing).
    const overflowCount = Math.max(0, tags.length - maxVisible)
    return (
        <div className="flex items-center gap-2">
            {visibleTags.map((tag, index) => (
                <Chip key={`${String(tag)}-${index}`} variant={variant}>
                    <Chip.Label>{tag}</Chip.Label>
                </Chip>
            ))}
            {overflowCount > 0 && (
                <Tooltip isOpen={menuOpen} onOpenChange={setMenuOpen}>
                    <Tooltip.Trigger>
                        <Chip color="default" variant={variant}>
                            <Chip.Label>{overflowLabel}</Chip.Label>
                        </Chip>
                    </Tooltip.Trigger>
                    <Tooltip.Content>
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
