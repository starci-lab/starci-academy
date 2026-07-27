import { ChipBase } from "./ChipBase"
import { ChipGroup } from "./ChipGroup"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Chip.*`: namespace for the chip family. This file ONLY aggregates, no logic.
 *
 * Each member gets its OWN FILE (split 2026-07-26) so the relationship between them is
 * a REAL `import`, readable:
 *   • `Chip`  → ./ChipBase   — the ONE chip; the status dot is a PROP
 *     (`dotColor`/`dotClassName`), not a separate member.
 *   • `ChipGroup` → ./ChipGroup  — a ROW of chips truncated at `maxVisible` + a `+N`
 *     chip that opens a Tooltip; **imports ChipBase** ⇒ the only component in the
 *     family with deps.
 *
 * ⚠️ REMOVED 2026-07-26 — three things, three different reasons:
 *   • `Chip.Dot` — the dot isn't a different chip shape, just the leading glyph slot
 *     changing appearance ⇒ `<Chip dotClassName="text-success" text="Running" />`.
 *   • `StatusChip` — this chip hard-locked `tone` and added no other behavior ⇒ call
 *     `<Chip tone="success" … />` directly.
 *   • `TagChips` — DOES have real behavior (count · truncate · overflow) so it wasn't
 *     removed, just moved into the namespace as `ChipGroup`.
 *   • `chip-tone.ts` — the tone table now lives in `ChipBase.tsx`. A separate token file
 *     only makes sense when ≥2 SIBLING components both need it; here `ChipGroup` builds
 *     on `ChipBase` directly, so a direct import is enough, no intermediate file needed.
 *
 * Outside call sites do NOT change their import path: still `.../Chip/Chip`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export { ChipBase as Chip, ChipGroup }

export type { ChipBaseProps, ChipTone, IconComponent } from "./ChipBase"
export type { ChipGroupItem, ChipGroupProps } from "./ChipGroup"
