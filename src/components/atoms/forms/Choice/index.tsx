import { ChoiceCheckbox } from "../ChoiceCheckbox"
import { ChoiceRadio } from "../ChoiceRadio"
import { ChoiceSwitch } from "../ChoiceSwitch"

/**
 * `Choice.*` — the boolean / single-select control atom namespace (wraps
 * HeroUI Checkbox · Radio · Switch).
 *
 * Transitional barrel: public members live in sibling folders. Callers keep
 * importing from this path until every importer moves.
 */

export type { InlineFrameProps } from "./types"
export type { ChoiceCheckboxProps } from "../ChoiceCheckbox"
export type { ChoiceRadioProps } from "../ChoiceRadio"
export type { ChoiceSwitchProps } from "../ChoiceSwitch"
export { ChoiceCheckbox, ChoiceRadio, ChoiceSwitch }

/** `Choice.*` namespace — folder-matching handle grouping the choice-control atom members. */
export const Choice = { Checkbox: ChoiceCheckbox, Radio: ChoiceRadio, Switch: ChoiceSwitch }

/** Tier metadata for each `Choice.*` member, used by the component registry/Storybook lookup. */
export const meta = [
    { tier: "atom", name: "ChoiceCheckbox" },
    { tier: "atom", name: "ChoiceRadio" },
    { tier: "atom", name: "ChoiceSwitch" },
] as const
