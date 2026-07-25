import type { ReactNode } from "react"
import {
    Checkbox as HeroCheckbox,
    RadioGroup as HeroRadioGroup,
    Radio as HeroRadio,
    Switch as HeroSwitch,
    Label as HeroLabel,
    Skeleton as HeroSkeleton,
    cn,
} from "@heroui/react"
import { FieldFrame } from "@sb-components/atoms/forms/_field/FieldFrame"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Choice.*`: the boolean / single-select control atom namespace (bọc
 * HeroUI Checkbox · Radio · RadioGroup · Switch).
 *
 * Đây là các control INLINE — nhãn nằm BÊN CẠNH control (Checkbox.Content /
 * Radio.Content owns nhãn native; Switch nhãn = sibling `<Label>` per house note).
 * Đó là ô TRẦN (không group heading / hint / error) — primitive field (FieldShell)
 * COMPOSE atom này để thêm nhãn nhóm / mô tả / lỗi.
 *
 * Rules chung (Chip/Input):
 *   • Bọc HeroUI TỐI ĐA (Checkbox/RadioGroup/Radio/Switch), alias `Hero*`.
 *   • STRICT §4: `isSelected|value` + `onValueChange` TRẦN — consumer không đụng
 *     structure (không Checkbox.Control/Indicator/Content thủ công).
 *   • KHÔNG `children` (luật thầy chốt 2026-07-25): control không bọc phần tử nào
 *     nên nhãn đi bằng prop `label`; nhóm radio mô tả bằng `options` DỮ LIỆU.
 *   • `isSkeleton` → control-shaped skeleton co-located (hybrid C, `HeroSkeleton`
 *     kích thước control — KHÔNG import `Skeleton.*` compound).
 *   • Anatomy tier `atom` (part `Control` · `Label`; state loading = `Skeleton`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/**
 * Field-frame props các control INLINE nhận thêm (thầy chốt 2026-07-25): `hint` +
 * `errorMessage` render qua FieldFrame quanh control (nhãn chính vẫn INLINE cạnh
 * control — KHÔNG truyền vào FieldFrame `label`). `isRequired` gắn dấu `*` vào nhãn
 * inline. Bỏ hết → control trần như cũ (FieldFrame render thẳng children).
 */
interface InlineFrameProps {
    /** Mô tả phụ (qua FieldFrame). */
    hint?: ReactNode
    /** Dòng lỗi (qua FieldFrame → viền + text-danger). */
    errorMessage?: ReactNode
    /** Thêm dấu `*` vào nhãn inline. */
    isRequired?: boolean
}

/** Nhãn inline + dấu `*` khi bắt buộc (khớp FieldFrame). */
const withRequired = (label: ReactNode, isRequired?: boolean) =>
    isRequired ? (
        <>
            {label} <span className="text-danger">*</span>
        </>
    ) : (
        label
    )

/* ── Checkbox ──────────────────────────────────────────────────────────────── */

/** Props for {@link ChoiceCheckbox}. */
export interface ChoiceCheckboxProps extends InlineFrameProps {
    /** Checked state (controlled). */
    isSelected: boolean
    /** Fires with the new checked state. */
    onValueChange: (value: boolean) => void
    /** Nhãn nằm BÊN CẠNH ô (Checkbox.Content). */
    label: ReactNode
    isDisabled?: boolean
    isInvalid?: boolean
    /** Render the control-shaped skeleton (square + nhãn bar) instead of the checkbox. */
    isSkeleton?: boolean
    /** `true` → tag each part with `data-anat-part` so a BlockAnatomy panel can badge it. */
    showAnatomy?: boolean
    className?: string
}

/** `Choice.Checkbox` — single boolean checkbox with an inline label (HeroUI Checkbox compound). */
const ChoiceCheckbox = ({ isSelected, onValueChange, label, isDisabled, isInvalid, isSkeleton, showAnatomy, className, hint, errorMessage, isRequired }: ChoiceCheckboxProps) => {
    const invalid = isInvalid || errorMessage != null
    // Control = size-4 rounded-md · label = body-sm glyph bar (14/24), row gap-3 (khớp Checkbox.Content gap).
    const skeletonControl = (
        <div className={cn("flex items-center gap-3", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
            <HeroSkeleton className="size-4 shrink-0 rounded-md" />
            <HeroSkeleton className="my-[5px] h-[14px] w-32 rounded" />
        </div>
    )
    return (
        <FieldFrame.Base hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} showAnatomy={showAnatomy} skeletonControl={skeletonControl}>
            <HeroCheckbox isSelected={isSelected} onChange={onValueChange} isInvalid={invalid} isDisabled={isDisabled} className={className}>
                <HeroCheckbox.Control data-anat-part={showAnatomy ? "Control" : undefined}>
                    <HeroCheckbox.Indicator />
                </HeroCheckbox.Control>
                <HeroCheckbox.Content data-anat-part={showAnatomy ? "Label" : undefined}>{withRequired(label, isRequired)}</HeroCheckbox.Content>
            </HeroCheckbox>
        </FieldFrame.Base>
    )
}

/* ── Radio ─────────────────────────────────────────────────────────────────── */

/**
 * Props for {@link ChoiceRadio} — ONE option row; must live inside a
 * {@link ChoiceRadioGroup}.
 *
 * ⚠️ KHÔNG có `hint`/`errorMessage`/`isRequired` (thầy chốt 2026-07-25): radio LẺ
 * không sống độc lập được — mô tả phụ · lỗi · bắt buộc là chuyện của NHÓM, nên 3
 * prop đó nằm ở {@link ChoiceRadioGroup}.
 */
export interface ChoiceRadioProps {
    /** Value reported to the group's `onValueChange` when this option is picked. */
    value: string
    /** Nhãn nằm BÊN CẠNH dot (Radio.Content). */
    label: ReactNode
    /** Disable just this option row. */
    isDisabled?: boolean
    /** Render the control-shaped skeleton — one radio-row shimmer (dot + nhãn bar). */
    isSkeleton?: boolean
    /** `true` → tag `Control` · `Label` for BlockAnatomy. */
    showAnatomy?: boolean
    className?: string
}

/** `Choice.Radio` — one radio option row (HeroUI Radio compound). Renders inside `Choice.RadioGroup`. */
const ChoiceRadio = ({ value, label, isDisabled, isSkeleton, showAnatomy, className }: ChoiceRadioProps) => {
    if (isSkeleton) {
        // One row: size-4 rounded-full dot + body-sm label bar, gap-3 (co-located, hybrid C).
        return (
            <div className={cn("flex items-center gap-3", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                <HeroSkeleton className="my-[5px] h-[14px] w-32 rounded" />
            </div>
        )
    }
    return (
        <HeroRadio value={value} isDisabled={isDisabled} className={className}>
            <HeroRadio.Content>
                <HeroRadio.Control data-anat-part={showAnatomy ? "Control" : undefined}>
                    <HeroRadio.Indicator />
                </HeroRadio.Control>
                <span className="min-w-0" data-anat-part={showAnatomy ? "Label" : undefined}>
                    {label}
                </span>
            </HeroRadio.Content>
        </HeroRadio>
    )
}

/* ── RadioGroup ────────────────────────────────────────────────────────────── */

/** One selectable option for {@link ChoiceRadioGroup}'s `options` shorthand. */
export interface ChoiceRadioOption {
    value: string
    label: ReactNode
    isDisabled?: boolean
}

/** Props for {@link ChoiceRadioGroup}. */
export interface ChoiceRadioGroupProps extends InlineFrameProps {
    /** Currently selected value (controlled). */
    value: string
    /** Fires with the newly selected option's value. */
    onValueChange: (value: string) => void
    /**
     * Danh sách option bằng DỮ LIỆU — atom tự dựng một {@link ChoiceRadio} mỗi
     * entry. KHÔNG có `children`: consumer không lắp JSX con (§4 STRICT).
     */
    options: Array<ChoiceRadioOption>
    /** Nhãn heading TRÊN nhóm (map vào FieldFrame `label`) — bỏ trống → chỉ `ariaLabel`. */
    groupLabel?: ReactNode
    /** Accessible name for the group (dùng khi không có `groupLabel` hiển thị). */
    ariaLabel?: string
    isDisabled?: boolean
    isInvalid?: boolean
    /** Render the control-shaped skeleton — stacked radio-row shimmers. */
    isSkeleton?: boolean
    /** Row count for the skeleton mirror (default = `options.length`). */
    skeletonRows?: number
    /** `true` → tag each option's `Control` · `Label` for BlockAnatomy. */
    showAnatomy?: boolean
    className?: string
}

/** `Choice.RadioGroup` — mutually-exclusive single-select group (HeroUI RadioGroup + `Choice.Radio` rows). */
const ChoiceRadioGroup = ({
    value,
    onValueChange,
    options,
    groupLabel,
    ariaLabel = "Nhóm lựa chọn",
    isDisabled,
    isInvalid,
    isSkeleton,
    skeletonRows,
    showAnatomy,
    className,
    hint,
    errorMessage,
    isRequired,
}: ChoiceRadioGroupProps) => {
    const invalid = isInvalid || errorMessage != null
    const rows = skeletonRows ?? options.length
    // Each row: size-4 rounded-full dot + body-sm label bar, gap-3; group stacks gap-2.
    const skeletonControl = (
        <div className={cn("flex flex-col gap-2", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
            {Array.from({ length: rows }).map((_, index) => (
                <div key={index} className="flex items-center gap-3">
                    <HeroSkeleton className="size-4 shrink-0 rounded-full" />
                    <HeroSkeleton className="my-[5px] h-[14px] w-32 rounded" />
                </div>
            ))}
        </div>
    )
    return (
        <FieldFrame.Base
            label={groupLabel}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            skeletonControl={skeletonControl}
        >
            <HeroRadioGroup
                aria-label={typeof groupLabel === "string" ? groupLabel : ariaLabel}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                className={cn("flex flex-col gap-2", className)}
            >
                {options.map((option) => (
                    <ChoiceRadio key={option.value} value={option.value} label={option.label} isDisabled={option.isDisabled} showAnatomy={showAnatomy} />
                ))}
            </HeroRadioGroup>
        </FieldFrame.Base>
    )
}

/* ── Switch ────────────────────────────────────────────────────────────────── */

/** Props for {@link ChoiceSwitch}. */
export interface ChoiceSwitchProps extends InlineFrameProps {
    /** On/off state (controlled). */
    isSelected: boolean
    /** Fires with the new on/off state. */
    onValueChange: (value: boolean) => void
    /** Nhãn nằm BÊN CẠNH track (sibling `<Label>` — NOT via Switch.Content, per house note). */
    label?: ReactNode
    isDisabled?: boolean
    isInvalid?: boolean
    /** Track size — HeroUI Switch supports sm/md/lg. */
    size?: "sm" | "md" | "lg"
    /** Render the control-shaped skeleton — a switch-track pill (+ nhãn bar). */
    isSkeleton?: boolean
    /** `true` → tag `Control` · `Label` for BlockAnatomy. */
    showAnatomy?: boolean
    className?: string
}

/** `Choice.Switch` — boolean toggle with the label BESIDE the track (HeroUI Switch compound). */
const ChoiceSwitch = ({ isSelected, onValueChange, label, isDisabled, isInvalid, size, isSkeleton, showAnatomy, className, hint, errorMessage, isRequired }: ChoiceSwitchProps) => {
    const invalid = isInvalid || errorMessage != null
    // Track = h-9 w-16 pill (app override) · optional label bar (body-sm).
    const skeletonControl = (
        <div className={cn("flex items-center gap-3", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
            <HeroSkeleton className="h-9 w-16 shrink-0 rounded-full" />
            {label != null ? <HeroSkeleton className="my-[5px] h-[14px] w-32 rounded" /> : null}
        </div>
    )
    return (
        <FieldFrame.Base hint={hint} errorMessage={errorMessage} isDisabled={isDisabled} isSkeleton={isSkeleton} showAnatomy={showAnatomy} skeletonControl={skeletonControl}>
            <div className={cn("flex items-center gap-3", className)}>
                <HeroSwitch
                    data-anat-part={showAnatomy ? "Control" : undefined}
                    size={size}
                    isSelected={isSelected}
                    onChange={onValueChange}
                    isDisabled={isDisabled}
                    isInvalid={invalid}
                    aria-label={typeof label === "string" ? label : undefined}
                >
                    <HeroSwitch.Content>
                        <HeroSwitch.Control>
                            <HeroSwitch.Thumb />
                        </HeroSwitch.Control>
                    </HeroSwitch.Content>
                </HeroSwitch>
                {label != null ? (
                    <HeroLabel isDisabled={isDisabled} data-anat-part={showAnatomy ? "Label" : undefined} className="text-sm font-medium">
                        {withRequired(label, isRequired)}
                    </HeroLabel>
                ) : null}
            </div>
        </FieldFrame.Base>
    )
}

/**
 * `Choice.*` — boolean / single-select control atom namespace. Each member is the
 * bare inline control; primitive fields (FieldShell) compose them for the group
 * heading / hint / error column.
 *
 * §12a: khai bằng `Object.assign` như 42 atom còn lại (KHÔNG object literal trần) —
 * root phải là callable-namespace. Root gọi thẳng = `Choice.Checkbox`, hình thái
 * cơ bản nhất của họ (cùng lối `Select` lấy `Select.Single` làm root). API các
 * member GIỮ NGUYÊN, chỉ đổi HÌNH export.
 */
export const Choice = Object.assign(ChoiceCheckbox, {
    Checkbox: ChoiceCheckbox,
    Radio: ChoiceRadio,
    RadioGroup: ChoiceRadioGroup,
    Switch: ChoiceSwitch,
})
