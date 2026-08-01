import { ButtonBase } from "./ButtonBase"

/**
 * `Button.*` — the trigger family namespace. This file only gathers, no logic.
 *
 * - `Button` → {@link ButtonBase} — the button. Pass `isIconOnly` for an icon-only button
 *   (`<Button isIconOnly prefixIcon={X} ariaLabel="…" />`); there is no separate `Button.Icon`.
 * - `./button-tokens` — a shared token table, not a component.
 *
 * `ButtonGroup` and `ButtonRadioGroup` used to live here too — both render another
 * atom per item, which makes them composites, not members of this namespace. They
 * now live at `@sb-components/composites/buttons/ButtonGroup` and
 * `@sb-components/composites/buttons/ButtonRadioGroup`.
 */
export { ButtonBase as Button }

export type { ButtonBaseProps } from "./ButtonBase"
export type { ButtonSize, ButtonVariant, IconComponent } from "./button-tokens"

/** Tier meta for `Button` — `ButtonBase.tsx` also exports its own. */
export const meta = { tier: "atom", name: "Button" } as const
