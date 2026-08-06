import { EnumChip } from "@/components/composites/chips/EnumChip"
import { HighlightChip } from "@/components/composites/chips/HighlightChip"
import { RemovableToken } from "@/components/composites/chips/RemovableToken"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Chip.*` compound namespace.
 *
 * Groups the chips that are **COMPOSITE, same tier** (Composites/Chips) into ONE
 * root, like `Skeleton.*` — one `Chip` import, easy to discover, consistent.
 * Consumer swaps `<EnumChip/>` → `<ChipEnum/>`, `<HighlightChip/>` → `<ChipHighlight/>`, …
 *
 * NAMING (instructor locked in 2026-07-24): HeroUI's base pill gets **aliased as
 * `HeroChip`** at the call site — `Chip` is OUR OWN namespace, NOT a mutation of
 * HeroUI's export. That's why this is a plain object (it doesn't render itself),
 * so it never collides with `@heroui/react`'s `Chip`.
 *
 * ⚠️ `Dot` is NO LONGER here (instructor locked in 2026-07-25): the dot chip moved
 * up to the ATOM — and since 2026-07-26 it's no longer even its own member over
 * there either, the dot is now a PROP of `Chip`. The `DotChip` block has been
 * DELETED; every domain chip calls the atom directly.
 *
 * ⚠️ `Status` and `Tags` have been DROPPED from this namespace (2026-07-26) — same
 * TIER reason below, just exposed this time by a change on the atom side:
 * `StatusChip` was deleted (it was just `Chip` with `tone` hard-locked) and
 * `TagChips` became `ChipGroup` at the ATOM tier.
 * Call `Chip` / `ChipGroup` directly from `atoms/chips/Chip/Chip`. This namespace
 * now only holds chips that actually belong to its own tier.
 *
 * TIER (instructor locked in: only group the same tier together): ONLY Composite
 * chips live here. DESIGN-tier chips (`DifficultyChip` · `AiCategoryChip` ·
 * `LanguageChip` — enums that carry content semantics) STAY SEPARATE, NOT folded
 * into `Chip.*` (keeping tier discipline §6c).
 *
 * ⚠️ `HostPlatform` has been DROPPED from this namespace (2026-07-25):
 * `HostPlatformChip` lives in `_designs/chips` (DESIGN tier, semantic by video
 * platform), so folding it in here would violate the exact TIER discipline
 * above. Its own story lives at `Design/Chips/HostPlatformChip`; it no longer
 * appears in the `Chip.*` gallery.
 *
 * Composition = component imports component: normal in this repo (EnumChip
 * imports the atom's `Chip`; ListRow imports TitledText…). The compound only
 * AGGREGATES, it adds no behavior of its own.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export { EnumChip as ChipEnum, HighlightChip as ChipHighlight, RemovableToken as ChipRemovable }

/** Folder-matching compound namespace (export-matches-folder). Existing named exports stay public. */
export const Chip = {
    Enum: EnumChip,
    Highlight: HighlightChip,
    Removable: RemovableToken,
} as const
