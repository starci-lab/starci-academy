import { ButtonBase } from "./ButtonBase"
import { ButtonGroup } from "./ButtonGroup"
import { ButtonRadioGroup } from "./ButtonRadioGroup"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Button.*`: the trigger family namespace. This file ONLY gathers, no logic.
 *
 * Each member gets its OWN FILE (split 2026-07-26) so the relationship between
 * them is a REAL, readable `import`:
 *   • `Button`       → ./ButtonBase       — the ONE button; `isIconOnly` for an icon-only button.
 *   • `ButtonGroup`      → ./ButtonGroup      — a ROW of action buttons, built from
 *     STATE-LESS `items` (no "which one is selected"); **imports ButtonBase**.
 *   • `ButtonRadioGroup` → ./ButtonRadioGroup — a row of SELECT buttons (single
 *     `value`/`onChange` or multi `values`/`onToggle`), flex-wrap, `role="group"` +
 *     `aria-pressed` per button. Folded in from `atoms/navigation/FlexWrapButtonRadio`
 *     2026-07-26 — a genuinely different shape from `ButtonGroup` (stateful control
 *     vs. stateless action cluster, §12a), so it's a SEPARATE MEMBER rather than a
 *     new prop on `ButtonGroup`. Builds straight on HeroUI's `Button`/`ButtonGroup`
 *     (not through `Button`/`ButtonGroup`) — see the reasoning in
 *     `ButtonRadioGroup.tsx`.
 *   • `./button-tokens` — a shared table (not a component, not part of the deps tree).
 *
 * ⚠️ `Button.Icon` HAS BEEN REMOVED (2026-07-26): an icon-only button isn't a
 * different shape, it's the SAME button with the label dropped ⇒
 * `<Button isIconOnly prefixIcon={X} ariaLabel="…" />`. Keeping two components
 * side by side means every rule has to be fixed in two places.
 *
 * External call sites do NOT change their import path: still `.../Button/Button`.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export { ButtonBase as Button, ButtonGroup, ButtonRadioGroup }

export type { ButtonBaseProps } from "./ButtonBase"
export type { ButtonGroupItem, ButtonGroupProps } from "./ButtonGroup"
export type { ButtonRadioGroupItem, ButtonRadioGroupProps } from "./ButtonRadioGroup"
export type { ButtonSize, ButtonVariant, IconComponent } from "./button-tokens"
