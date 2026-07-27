import React from "react"
import type { ReactNode } from "react"
import { Button, ButtonGroup as HeroButtonGroup, cn } from "@heroui/react"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Button.RadioGroup`: hàng nút CHỌN (single hoặc multi), flex-wrap.
 *
 * Gom vào namespace `Button` 2026-07-26 (trước đó sống riêng ở
 * `atoms/navigation/FlexWrapButtonRadio`, tên cũ `FlexWrapButtonRadio`). Quyết định
 * MEMBER MỚI (không gộp prop vào `Button.Group` — xem `Button.Group` ở `./ButtonGroup.tsx`):
 * `Button.Group` là cụm nút HÀNH ĐỘNG rời rạc, dựng từ `items` KHÔNG mang trạng thái
 * chọn — mỗi item chỉ có `onPress` độc lập, không có khái niệm "đang chọn gì". Cụm này
 * NGƯỢC LẠI: nó là một CONTROL có state — `value`/`onChange` (chọn-1, kiểu radio) hoặc
 * `values`/`onToggle` (chọn-N, kiểu checkbox-group) — với `role="group"` +
 * `aria-pressed` per-button, cộng khả năng mỗi item tự nở thành một `Button.Group`
 * con khi có `itemAction`. Khác hình thái thật (control có-state vs cụm hành-động
 * vô-state), không phải biến thể thị giác ⇒ member riêng theo §12a, không phải prop
 * mới trên `Button.Group` theo §6b.
 *
 * ⚠️ Bên trong vẫn dựng thẳng HeroUI `Button`/`ButtonGroup` (KHÔNG qua `Button.Base`/
 * `Button.Group` của chính namespace này) — giữ nguyên lý do đã audit trước khi gom:
 * hợp đồng a11y của cụm này là `role="group"` + `aria-pressed` per-button, còn
 * `Button.Base` không forward các attribute tuỳ ý (không có `...rest`) nên đổi sẽ làm
 * rớt mất `aria-pressed` khỏi assistive tech. Deferred, KHÔNG audit lại lượt gom này.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** One selectable button in a {@link ButtonRadioGroup}. */
export interface ButtonRadioGroupItem<T extends string> {
    /** Value selected when this button is chosen. */
    value: T
    /** Button content (icon + label + meta — caller-defined inline row). */
    content: ReactNode
    /** When true the button is dimmed and not selectable. */
    isDisabled?: boolean
}

/** Props shared by both the single- and multi-select modes of {@link ButtonRadioGroup}. */
interface ButtonRadioGroupBaseProps<T extends string> {
    /** The selectable buttons. */
    items: Array<ButtonRadioGroupItem<T>>
    /** Accessible label for the group. */
    ariaLabel: string
    /**
     * Optional trailing node placed after the buttons in the SAME row (e.g. a
     * "+N" overflow button). Not part of the group's value — it's an action.
     */
    trailing?: ReactNode
    /**
     * Optional per-item trailing action(s) — e.g. a delete button and/or a "⋮"
     * (kebab) menu trigger. When provided, the item's select button and these
     * action buttons render as ONE connected `ButtonGroup` per item
     * (`[select | 🗑 | ⋮]`). Return the action `<Button>`s as an ARRAY (with
     * `key`s) so each is an individual segment. Omit for a plain single-select row.
     */
    itemAction?: (item: ButtonRadioGroupItem<T>) => ReactNode
    /** `true` → tag this row's own HeroUI renders (`Button`/`ButtonGroup`/`ButtonGroup.Separator`) with `data-anat-part` so a BlockAnatomy panel can badge them. */
    showAnatomy?: boolean
    /** Extra classes on the row. */
    className?: string
}

/** Single-select mode (default) — exactly one value selected at a time. */
interface ButtonRadioGroupSingleProps<T extends string> extends ButtonRadioGroupBaseProps<T> {
    /** Single-select — omit or pass `false`. */
    multiple?: false
    /** Currently selected value. */
    value: T
    /** Fired with the chosen value when a button is selected. */
    onChange: (value: T) => void
}

/**
 * Multi-select mode — a SET of values, each button an independent toggle. The
 * caller owns the set + the toggle logic (e.g. enforcing "at least one selected");
 * this component only reports which button was pressed via {@link onToggle}.
 */
interface ButtonRadioGroupMultiProps<T extends string> extends ButtonRadioGroupBaseProps<T> {
    /** Multi-select — pass `true`. */
    multiple: true
    /** Currently selected values. */
    values: Array<T>
    /** Fired with the pressed value (the caller adds/removes it from its own set). */
    onToggle: (value: T) => void
}

/** Props for {@link ButtonRadioGroup} — a discriminated union on `multiple`. */
export type ButtonRadioGroupProps<T extends string> =
    | ButtonRadioGroupSingleProps<T>
    | ButtonRadioGroupMultiProps<T>

/**
 * A single-select toggle-button group laid out as a flex-wrap row (buttons wrap
 * to the next line, never scroll). Every option is a real HeroUI `<Button>`:
 * standalone, selected = filled `tertiary` (NEUTRAL, not accent — a facet/config
 * toggle isn't a CTA), unselected = hollow `ghost`. NEVER `primary` here — a config
 * row commonly sits on the SAME surface as the page's one accent CTA.
 *
 * When `itemAction` is supplied, each item instead renders as one connected
 * `ButtonGroup` — the select button + its action button(s) touching, only the
 * two outer ends rounded (`[select | 🗑 | ⋮]`). The seam is HeroUI's own
 * `ButtonGroup.Separator`, recoloured to the `--border` token and forced full-height.
 *
 * `role="group"` + `aria-pressed` per button — works for BOTH the default
 * single-select toggle group and the multi-select mode.
 *
 * @param props - {@link ButtonRadioGroupProps}
 */
export const ButtonRadioGroup = <T extends string>(props: ButtonRadioGroupProps<T>) => {
    const { items, ariaLabel, trailing, itemAction, showAnatomy = false, className } = props
    // narrow the discriminated union once — selection state + the press handler are
    // the only things that differ between single- and multi-select.
    const isSelected = (candidate: T): boolean =>
        (props.multiple ? props.values.includes(candidate) : props.value === candidate)
    const handlePress = (candidate: T): void => {
        if (props.multiple) {
            props.onToggle(candidate)
        } else {
            props.onChange(candidate)
        }
    }
    return (
        <div role="group" aria-label={ariaLabel} className={cn("flex flex-wrap items-center gap-2", className)}>
            {items.map((item) => {
                const selected = isSelected(item.value)
                if (!itemAction) {
                    // standalone: selected = filled `tertiary` (neutral, NOT accent —
                    // a facet toggle isn't a CTA), unselected = hollow `ghost` (no
                    // surface of its own — the page/card is the surface).
                    // NOTE: left as raw HeroUI <Button> (not `Button.Base`) — this
                    // toggle group's a11y contract is `role="group"` + `aria-pressed`
                    // per button (see doc comment above); `Button.Base`'s props don't
                    // forward arbitrary/native attributes like `aria-pressed` (no
                    // `...rest` spread), so swapping would silently drop the pressed
                    // state from assistive tech. Deferred.
                    return (
                        <Button
                            key={item.value}
                            size="sm"
                            variant={selected ? "tertiary" : "ghost"}
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => handlePress(item.value)}
                            data-anat-part={showAnatomy ? "Button" : undefined}
                        >
                            {item.content}
                        </Button>
                    )
                }
                // select button + its action(s) = ONE connected ButtonGroup per
                // item. No border frame — the button variants carry the look; here
                // the unselected select is `tertiary` (filled `--default`), NOT
                // `ghost`, so it matches the filled action buttons instead of
                // floating hollow. Each action button gets a `ButtonGroup.Separator`
                // injected at the head of its children (HeroUI's separator must sit
                // INSIDE the following button), full-height.
                return (
                    <HeroButtonGroup
                        key={item.value}
                        size="sm"
                        className="w-fit"
                        data-anat-part={showAnatomy ? "ButtonGroup" : undefined}
                    >
                        <Button
                            size="sm"
                            variant={selected ? "secondary" : "tertiary"}
                            isDisabled={item.isDisabled}
                            aria-pressed={selected}
                            onPress={() => handlePress(item.value)}
                            data-anat-part={showAnatomy ? "Button" : undefined}
                        >
                            {item.content}
                        </Button>
                        {React.Children.map(itemAction(item), (action) =>
                            React.isValidElement<{ children?: ReactNode }>(action)
                                ? React.cloneElement(
                                    action,
                                    undefined,
                                    <HeroButtonGroup.Separator
                                        className="!top-0 !h-full !bg-border !opacity-100"
                                        data-anat-part={showAnatomy ? "ButtonGroup.Separator" : undefined}
                                    />,
                                    action.props.children,
                                )
                                : action,
                        )}
                    </HeroButtonGroup>
                )
            })}
            {trailing}
        </div>
    )
}
