import { ButtonBase } from "./ButtonBase"
import { ButtonGroup } from "./ButtonGroup"
import { ButtonRadioGroup } from "./ButtonRadioGroup"

/**
 * `Button.*` — the trigger family namespace. This file only gathers, no logic.
 *
 * - `Button` → {@link ButtonBase} — the button. Pass `isIconOnly` for an icon-only button
 *   (`<Button isIconOnly prefixIcon={X} ariaLabel="…" />`); there is no separate `Button.Icon`.
 * - `ButtonGroup` → `./ButtonGroup` — a row of action buttons built from stateless `items`
 *   (no "which one is selected"). Imports `ButtonBase`.
 * - `ButtonRadioGroup` → `./ButtonRadioGroup` — a row of select buttons (single
 *   `value`/`onChange` or multi `values`/`onToggle`), flex-wrap, `role="group"` +
 *   `aria-pressed` per button. Builds directly on HeroUI's `Button`/`ButtonGroup`.
 * - `./button-tokens` — a shared token table, not a component.
 */
export { ButtonBase as Button, ButtonGroup, ButtonRadioGroup }

export type { ButtonBaseProps } from "./ButtonBase"
export type { ButtonGroupItem, ButtonGroupProps } from "./ButtonGroup"
export type { ButtonRadioGroupItem, ButtonRadioGroupProps } from "./ButtonRadioGroup"
export type { ButtonSize, ButtonVariant, IconComponent } from "./button-tokens"
