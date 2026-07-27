import type { ReactNode } from "react"
import {
    Select as HeroSelect,
    ComboBox as HeroComboBox,
    ListBox as HeroListBox,
    ListBoxItem as HeroListBoxItem,
    Input as HeroInput,
    Skeleton as HeroSkeleton,
    cn,
} from "@heroui/react"
import { CaretDownIcon } from "@phosphor-icons/react"
import { FieldFrame, fieldName } from "@sb-components/atoms/forms/_field/FieldFrame"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Select.*`: the choose-from-a-list field-control atom namespace (bọc
 * HeroUI `Select` + `ComboBox`).
 *
 * Members theo CÁCH chọn — `Select.Single` (dropdown 1) · `Select.Multi` (nhiều) ·
 * `Select.Combobox` (autocomplete gõ-lọc). Atom TỰ mang nhãn/mô tả/lỗi/bắt buộc qua
 * `FieldFrame` (thầy chốt 2026-07-25: label/errorMessage tính VÀO atom, KHÔNG tách
 * Field primitive). Bỏ hết frame-prop → atom là ô control TRẦN (FieldFrame render
 * thẳng trigger).
 *
 * Rules chung (Input/Chip):
 *   • Bọc HeroUI TỐI ĐA (`Select.Root`/`ComboBox`), alias `Hero*`. KHÔNG hand-roll
 *     dropdown/popover/keyboard — react-aria đã lo.
 *   • STRICT §4: `value` + `onValueChange` TRẦN + `options: {value,label}[]` phẳng —
 *     consumer KHÔNG đụng structure (Trigger/Popover/ListBox nội bộ).
 *   • `isSkeleton` → trigger-box skeleton co-located (hybrid C, không `Skeleton.*`).
 *   • Anatomy tier `atom` (part `Field` = ô control · `Trigger` = actuator mở list;
 *     FieldFrame thêm `Label`/`Description`/`Error`).
 *
 * Icon lib = Phosphor (`@phosphor-icons/react`) — MỘT BỘ DUY NHẤT (§5.0). Caret ở
 * đây là `size-4` (nhỏ hơn `size-5`) nên phải `weight="bold"` để nét không mảnh đi
 * so với icon cỡ chuẩn (§5.0a).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Field-frame props mọi atom form nhận để TỰ mang nhãn/mô tả/lỗi/bắt buộc (thầy chốt
 * 2026-07-25). Bỏ hết → atom là ô TRẦN (FieldFrame render thẳng control).
 */
interface FrameProps {
    /** Nhãn trên control. */
    label?: ReactNode
    /** Mô tả dưới nhãn (luôn hiện). */
    hint?: ReactNode
    /** Dòng lỗi dưới control (set → viền lỗi). */
    errorMessage?: ReactNode
    /** Thêm dấu `*` bắt buộc. */
    isRequired?: boolean
}

/** One selectable option — `value` là payload, `label` là nhãn render. */
export interface SelectOption {
    /** Giá trị option — thứ `onValueChange` bắn ra + React key. */
    value: string
    /** Nhãn hiển thị (trong trigger khi chọn, và trong dòng list). */
    label: ReactNode
}

/** A trigger-box skeleton owned by the atom (hybrid C). */
/** Props for the local {@link TriggerSkeleton} mirror. */
interface TriggerSkeletonProps {
    /** Placement class only. */
    className?: string
    /** Emit `data-anat-part` so a BlockAnatomy panel can badge the mirror. */
    showAnatomy?: boolean
}

const TriggerSkeleton = ({ className, showAnatomy }: TriggerSkeletonProps) => (
    <HeroSkeleton className={cn("h-9 w-full rounded-xl", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined} />
)

/** Shared props across the members. */
interface BaseSelectProps extends FrameProps {
    /** Danh sách option phẳng để chọn. */
    options: Array<SelectOption>
    /** Placeholder khi chưa chọn gì. */
    placeholder?: string
    /** Khoá control. */
    isDisabled?: boolean
    /** Field invalid (viền lỗi) — errorMessage cũng bật viền qua FieldFrame. */
    isInvalid?: boolean
    /** Accessible name khi KHÔNG có `label` (có label thì label lo). */
    ariaLabel?: string
    /** Render trigger-box skeleton thay control. */
    isSkeleton?: boolean
    /** `true` → tag `data-anat-part` cho BlockAnatomy panel badge. */
    showAnatomy?: boolean
    className?: string
}

/**
 * `Select.Single` — dropdown chọn MỘT (HeroUI Select single). Trigger hiện nhãn
 * option đang chọn (hoặc placeholder), popover là ListBox các dòng.
 */
const SelectSingle = ({
    value,
    onValueChange,
    options,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: BaseSelectProps & {
    /** Value đang chọn (controlled), `null` khi chưa chọn. */
    value: string | null
    /** Bắn khi người dùng chọn 1 option. */
    onValueChange: (value: string) => void
}) => {
    const invalid = isInvalid || errorMessage != null
    const selected = options.find((option) => option.value === value)
    return (
        <FieldFrame.Base
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            skeletonControl={<TriggerSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroSelect.Root<SelectOption, "single">
                aria-label={fieldName(label, ariaLabel ?? placeholder)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                placeholder={placeholder}
                selectedKey={value}
                onSelectionChange={(key) => onValueChange(String(key))}
                fullWidth
                className={className}
            >
                <HeroSelect.Trigger data-anat-part={showAnatomy ? "Trigger" : undefined}>
                    <HeroSelect.Value data-anat-part={showAnatomy ? "Field" : undefined}>
                        {() => (
                            <span className={cn("text-sm", !selected && "text-field-placeholder")}>
                                {selected ? selected.label : placeholder}
                            </span>
                        )}
                    </HeroSelect.Value>
                    <HeroSelect.Indicator>
                        <CaretDownIcon className="text-muted size-4" weight="bold" />
                    </HeroSelect.Indicator>
                </HeroSelect.Trigger>
                <HeroSelect.Popover>
                    <HeroListBox.Root aria-label={ariaLabel ?? placeholder}>
                        {options.map((option) => (
                            <HeroListBox.Item
                                key={option.value}
                                id={option.value}
                                textValue={typeof option.label === "string" ? option.label : option.value}
                            >
                                {option.label}
                            </HeroListBox.Item>
                        ))}
                    </HeroListBox.Root>
                </HeroSelect.Popover>
            </HeroSelect.Root>
        </FieldFrame.Base>
    )
}

/**
 * `Select.Multi` — dropdown chọn NHIỀU (HeroUI Select `selectionMode="multiple"`).
 * Trigger tóm tắt số/nhãn đã chọn; mỗi dòng list toggle bật/tắt.
 */
const SelectMulti = ({
    value,
    onValueChange,
    options,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: BaseSelectProps & {
    /** Các value đang chọn (controlled). */
    value: Array<string>
    /** Bắn với mảng value mới mỗi lần toggle. */
    onValueChange: (value: Array<string>) => void
}) => {
    const invalid = isInvalid || errorMessage != null
    const chosen = options.filter((option) => value.includes(option.value))
    // Nhãn trigger: "n selected" khi ≥2, nhãn đơn khi =1, placeholder khi rỗng.
    // Chữ HIỆN RA UI viết tiếng Anh (thầy chốt 2026-07-26) — đây là chuỗi MẶC ĐỊNH nên
    // call-site không truyền tay là nó lộ thẳng lên màn hình.
    const summary =
        chosen.length === 0 ? null : chosen.length === 1 ? chosen[0].label : `${chosen.length} selected`
    return (
        <FieldFrame.Base
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            skeletonControl={<TriggerSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroSelect.Root<SelectOption, "multiple">
                selectionMode="multiple"
                aria-label={fieldName(label, ariaLabel ?? placeholder)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                placeholder={placeholder}
                value={value}
                onChange={(keys) => onValueChange(keys.map(String))}
                fullWidth
                className={className}
            >
                <HeroSelect.Trigger data-anat-part={showAnatomy ? "Trigger" : undefined}>
                    <span data-anat-part={showAnatomy ? "Field" : undefined} className={cn("text-sm", summary == null && "text-field-placeholder")}>
                        {summary ?? placeholder}
                    </span>
                    <HeroSelect.Indicator>
                        <CaretDownIcon className="text-muted size-4" weight="bold" />
                    </HeroSelect.Indicator>
                </HeroSelect.Trigger>
                <HeroSelect.Popover>
                    <HeroListBox.Root aria-label={ariaLabel ?? placeholder} selectionMode="multiple">
                        {options.map((option) => (
                            <HeroListBox.Item
                                key={option.value}
                                id={option.value}
                                textValue={typeof option.label === "string" ? option.label : option.value}
                            >
                                {option.label}
                            </HeroListBox.Item>
                        ))}
                    </HeroListBox.Root>
                </HeroSelect.Popover>
            </HeroSelect.Root>
        </FieldFrame.Base>
    )
}

/**
 * `Select.Combobox` — autocomplete gõ-lọc chọn MỘT (HeroUI ComboBox). Input cho gõ,
 * react-aria tự lọc `defaultItems` theo text; caret mở toàn bộ danh sách.
 */
const SelectCombobox = ({
    value,
    onValueChange,
    options,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: BaseSelectProps & {
    /** Value đang chọn (controlled), `null` khi chưa chọn. */
    value: string | null
    /** Bắn khi người dùng chọn 1 gợi ý. */
    onValueChange: (value: string) => void
}) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame.Base
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            skeletonControl={<TriggerSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroComboBox
                aria-label={fieldName(label, ariaLabel ?? placeholder)}
                variant="secondary"
                fullWidth
                menuTrigger="focus"
                isDisabled={isDisabled}
                isInvalid={invalid}
                defaultItems={options}
                selectedKey={value}
                onSelectionChange={(key) => {
                    if (key !== null) {
                        onValueChange(String(key))
                    }
                }}
                className={cn("w-full", className)}
            >
                <HeroComboBox.InputGroup className="relative">
                    <HeroInput placeholder={placeholder} className="w-full pr-9" data-anat-part={showAnatomy ? "Field" : undefined} />
                    <HeroComboBox.Trigger
                        className="text-muted absolute right-1 top-1/2 -translate-y-1/2 inline-flex size-7 items-center justify-center rounded-lg [&_svg]:size-4"
                        data-anat-part={showAnatomy ? "Trigger" : undefined}
                    >
                        <CaretDownIcon aria-hidden weight="bold" />
                    </HeroComboBox.Trigger>
                </HeroComboBox.InputGroup>
                <HeroComboBox.Popover>
                    <HeroListBox className="max-h-72 overflow-auto p-1">
                        {(option: SelectOption) => (
                            <HeroListBoxItem id={option.value} textValue={typeof option.label === "string" ? option.label : option.value}>
                                {option.label}
                            </HeroListBoxItem>
                        )}
                    </HeroListBox>
                </HeroComboBox.Popover>
            </HeroComboBox>
        </FieldFrame.Base>
    )
}

/**
 * `Select.*` — the choose-from-a-list field-control atom namespace. Single/Multi
 * over HeroUI `Select`, Combobox over HeroUI `ComboBox`; primitive fields compose
 * these members (xem block `Select`).
 */
export const Select = Object.assign(SelectSingle, {
    Single: SelectSingle,
    Multi: SelectMulti,
    Combobox: SelectCombobox,
})
