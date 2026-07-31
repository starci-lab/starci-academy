import { ChipBase } from "./ChipBase"
import { ChipGroup } from "./ChipGroup"

/**
 * `Chip.*` — namespace for the chip family. This file only re-exports; no logic here.
 *
 *   - `Chip` → {@link ChipBase} — the one chip; the status dot is the `dotColor`/
 *     `dotClassName` prop, not a separate member.
 *   - `ChipGroup` → {@link ChipGroup} — a row of chips truncated at `maxVisible`, plus a
 *     `+N` chip that opens a tooltip. The only member in the family with dependencies.
 */
export { ChipBase as Chip, ChipGroup }

export type { ChipBaseProps, ChipTone, IconComponent } from "./ChipBase"
export type { ChipGroupItem, ChipGroupProps } from "./ChipGroup"
