import { EnumChip } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { HighlightChip } from "@sb-components/composites/chips/HighlightChip/HighlightChip"
import { RemovableToken } from "@sb-components/composites/chips/RemovableToken/RemovableToken"

/**
 * `Chip.*` — a compound namespace gathering the composite-tier chips under one root (same
 * pattern as `Skeleton.*`). The base HeroUI pill uses the alias `HeroChip`; design-tier chips
 * (Difficulty/AiCategory/Language) do not live here. `Chip.tsx` re-exports three composites
 * under new names: `EnumChip`→`ChipEnum`, `HighlightChip`→`ChipHighlight`, `RemovableToken`→`ChipRemovable`.
 */
export { EnumChip as ChipEnum, HighlightChip as ChipHighlight, RemovableToken as ChipRemovable }
