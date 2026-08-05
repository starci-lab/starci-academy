/**
 * `Choice.*` — the boolean / single-select control atom namespace (wraps HeroUI
 * Checkbox · Radio · Switch).
 *
 * Transitional barrel: public members live in sibling folders. Callers keep
 * importing from this path until every importer moves.
 */

export type { InlineFrameProps } from "./types"
export type { ChoiceCheckboxProps } from "../ChoiceCheckbox/ChoiceCheckbox"
export type { ChoiceRadioProps } from "../ChoiceRadio/ChoiceRadio"
export type { ChoiceSwitchProps } from "../ChoiceSwitch/ChoiceSwitch"
export { ChoiceCheckbox } from "../ChoiceCheckbox/ChoiceCheckbox"
export { ChoiceRadio } from "../ChoiceRadio/ChoiceRadio"
export { ChoiceSwitch } from "../ChoiceSwitch/ChoiceSwitch"

export const meta = [
    { tier: "atom", name: "ChoiceCheckbox" },
    { tier: "atom", name: "ChoiceRadio" },
    { tier: "atom", name: "ChoiceSwitch" },
] as const
