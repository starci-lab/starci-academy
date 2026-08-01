import { EnumChip } from "@sb-components/composites/chips/EnumChip/EnumChip"
import { HighlightChip } from "@sb-components/composites/chips/HighlightChip/HighlightChip"
import { RemovableToken } from "@sb-components/composites/chips/RemovableToken/RemovableToken"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — `Chip.*` compound namespace.
 *
 * Groups all **COMPOSITE-tier chips** (Composites/Chips) under ONE root, just
 * like `Skeleton.*` — one `Chip` import, easy to spot, consistent. Consumers
 * rename `<EnumChip/>` → `<ChipEnum/>`, `<HighlightChip/>` → `<ChipHighlight/>`, …
 *
 * NAMING (decided 2026-07-24): HeroUI's base pill is **aliased `HeroChip`**
 * at the call site — `Chip` is OUR OWN namespace, it does NOT mutate HeroUI's
 * export. That's why this is a plain object (it doesn't render anything on
 * its own), so it doesn't collide with `@heroui/react`'s `Chip`.
 *
 * ⚠️ `Dot` is NO LONGER here (decided 2026-07-25): the dot chip moved up to
 * ATOM — and since 2026-07-26 it isn't even its own member over there anymore,
 * the dot is now a PROP of `Chip`. The `DotChip` block has been REMOVED; every
 * domain chip calls the atom directly.
 *
 * ⚠️ `Status` and `Tags` were DROPPED from this namespace (2026-07-26) — same
 * TIER reasoning below, just surfaced this time because the atom on the other
 * side changed: `StatusChip` was deleted (it was just `Chip` with `tone`
 * locked in) and `TagChips` became `ChipGroup` at the ATOM layer.
 * Call `Chip` / `ChipGroup` directly from `atoms/chips/Chip/Chip`. This
 * namespace now only holds chips at its own correct tier.
 *
 * TIER (decided: only group same-tier chips): ONLY Composite-tier chips live
 * here. DESIGN-tier chips (`DifficultyChip` · `AiCategoryChip` · `LanguageChip`
 * — enums that carry content semantics) STAY SEPARATE, NOT folded into
 * `Chip.*` (keeps tier discipline §6c).
 *
 * ⚠️ `HostPlatform` was DROPPED from this namespace (2026-07-25):
 * `HostPlatformChip` lives in `_designs/chips` (DESIGN tier, semantic by video
 * platform), so folding it in here would violate the same TIER discipline
 * above. Its own story lives at `Design/Chips/HostPlatformChip`, and it no
 * longer appears in the `Chip.*` gallery.
 *
 * Composition = component importing component: normal in this repo (EnumChip
 * imports the atom's `Chip`; ListRow imports TitledText…). The compound only
 * AGGREGATES, it doesn't add behavior.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export { EnumChip as ChipEnum, HighlightChip as ChipHighlight, RemovableToken as ChipRemovable }
