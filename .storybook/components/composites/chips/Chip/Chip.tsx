import { EnumChip } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { HighlightChip } from "@sb-components/composites/chips/HighlightChip/HighlightChip"
import { RemovableToken } from "@sb-components/composites/chips/RemovableToken/RemovableToken"

/**
 * `Chip.*` — the compound namespace grouping all COMPOSITE-tier chips under one
 * root (`<ChipEnum/>`, `<ChipHighlight/>`, …), like `Skeleton.*`. HeroUI's base
 * pill is aliased `HeroChip` at the call site — `Chip` is our own namespace and a
 * plain object that renders nothing itself, so it does not collide with HeroUI's
 * `Chip` export.
 *
 * Only composite-tier chips live here. Design-tier chips that carry content
 * semantics (`DifficultyChip` · `AiCategoryChip` · `LanguageChip` ·
 * `HostPlatformChip`) stay separate. The dot chip is now a PROP of the atom `Chip`;
 * `Status`/`Tags` were dropped — call `Chip` / `ChipGroup` directly from
 * `atoms/chips/Chip/Chip`. The compound only aggregates; it adds no behavior.
 */
export { EnumChip as ChipEnum, HighlightChip as ChipHighlight, RemovableToken as ChipRemovable }
