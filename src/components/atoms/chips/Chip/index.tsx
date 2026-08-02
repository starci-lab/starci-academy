import { ChipBase } from "./ChipBase"

/**
 * `Chip.*` — namespace for the chip family. This file only re-exports; no logic here.
 *
 *   - `Chip` → {@link ChipBase} — the one chip; the status dot is the `dotColor`/
 *     `dotClassName` prop, not a separate member.
 *
 * `ChipGroup` used to live here too — it renders another atom (`Chip`) per item,
 * which makes it a composite, not a member of this namespace. It now lives at
 * `@/components/composites/chips/ChipGroup`.
 */
export { ChipBase as Chip }

export type { ChipBaseProps, ChipTone, IconComponent } from "./ChipBase"

/** Tier meta for `Chip` — `ChipBase.tsx` also exports its own. */
export const meta = { tier: "atom", name: "Chip" } as const
