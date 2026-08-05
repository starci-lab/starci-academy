import { cn } from "@heroui/react"
import { REACTION_BY_TYPE, type ReactionType } from "../types"

/** Props for the {@link ReactionGlyph} helper below. */
interface ReactionGlyphProps {
    type: ReactionType
    size: "xs" | "sm" | "md"
    className?: string
}

const REACTION_GLYPH_CLS: Record<ReactionGlyphProps["size"], string> = {
    xs: "size-4",
    sm: "size-5",
    md: "size-7",
}

/** Real Fluent Emoji SVG for a reaction (`public/reactions/<type>.svg` — same asset `src` serves). */
export const ReactionGlyph = ({ type, size, className }: ReactionGlyphProps) => (
    <img
        src={`/reactions/${type}.svg`}
        alt={REACTION_BY_TYPE[type].label}
        aria-hidden
        draggable={false}
        className={cn("inline-block select-none", REACTION_GLYPH_CLS[size], className)}
    />
)
