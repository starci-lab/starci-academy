import { useId, useState, type ReactNode } from "react"
import {
    Input as HeroInput,
    TextField as HeroTextField,
    TextArea as HeroTextArea,
    NumberField as HeroNumberField,
    DatePicker as HeroDatePicker,
    SearchField as HeroSearchField,
    TimeField as HeroTimeField,
    InputOTP as HeroInputOTP,
    DateField,
    Calendar,
    Skeleton as HeroSkeleton,
    cn,
} from "@heroui/react"
import { Eye, EyeSlash } from "@gravity-ui/icons"
import type { DateValue } from "@internationalized/date"
// `TimeValue` (= Time | CalendarDateTime | ZonedDateTime) lives in react-aria-components —
// that is where HeroUI's own TimeField imports it from (NOT @internationalized/date, which
// only exports the concrete `Time` class used to CONSTRUCT a value).
import type { TimeValue } from "react-aria-components"
import { Chip } from "@sb-components/atoms/chips/Chip/Chip"
import { FieldFrame, fieldName } from "@sb-components/atoms/forms/_field/FieldFrame"

/**
 * Field-frame props mọi atom form nhận để TỰ mang nhãn/mô tả/lỗi/bắt buộc (thầy
 * chốt 2026-07-25: label/errorMessage tính VÀO atom, không tách Field primitive).
 * Bỏ hết → atom là ô TRẦN (FieldFrame render thẳng control).
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

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * ATOM — `Input.*`: the field-control atom namespace (bọc HeroUI form controls).
 *
 * Members theo KIỂU input — `Input.Text` · `Input.Textarea` · `Input.Number` ·
 * `Input.Date` (mở rộng: Search/Password/Time…). Đây là ô TRẦN (không label/hint/
 * error) — primitive `TextField`/`NumberField` (FieldShell) COMPOSE atom này.
 *
 * Rules chung (Chip/Typography):
 *   • Bọc HeroUI TỐI ĐA (TextField/TextArea/NumberField/DatePicker), alias `Hero*`.
 *   • STRICT §4: `value` + `onValueChange` TRẦN — consumer không đụng structure.
 *   • `isSkeleton` → field-box skeleton co-located (hybrid C, không `Skeleton.*`).
 *   • Anatomy tier `atom` (part `Field`).
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** A field-box skeleton owned by the atom (hybrid C). */
const FieldSkeleton = ({ heightCls = "h-9", className, showAnatomy }: { heightCls?: string; className?: string; showAnatomy?: boolean }) => (
    <HeroSkeleton className={cn("w-full rounded-xl", heightCls, className)} data-anat-part={showAnatomy ? "Skeleton" : undefined} />
)

/** Shared props for the text-string members (+ frame nhãn/lỗi). */
interface StringFieldProps extends FrameProps {
    value: string
    onValueChange: (value: string) => void
    placeholder?: string
    isDisabled?: boolean
    isInvalid?: boolean
    /** Accessible name khi KHÔNG có `label` (có label thì label lo). */
    ariaLabel?: string
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
}

/** `Input.Text` — single-line text (HeroUI TextField+Input) + nhãn/mô tả/lỗi. */
const InputText = ({ value, onValueChange, placeholder, isDisabled, isInvalid, ariaLabel, isSkeleton, showAnatomy, className, label, hint, errorMessage, isRequired }: StringFieldProps) => {
    const controlId = useId()
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
            id={controlId}
            skeletonControl={<FieldSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroTextField aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full", className)}>
                <HeroInput
                    id={controlId}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange(event.target.value)}
                    className="w-full"
                    data-anat-part={showAnatomy ? "Field" : undefined}
                />
            </HeroTextField>
        </FieldFrame.Base>
    )
}

/** `Input.Textarea` — multi-line (HeroUI TextArea), `rows` visible lines (default 3). */
const InputTextarea = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    rows = 3,
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: StringFieldProps & { rows?: number }) => {
    const controlId = useId()
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
            id={controlId}
            skeletonControl={<FieldSkeleton heightCls="h-24" className={className} showAnatomy={showAnatomy} />}
        >
            <HeroTextField aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full", className)}>
                <HeroTextArea
                    id={controlId}
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange(event.target.value)}
                    className="w-full"
                    data-anat-part={showAnatomy ? "Field" : undefined}
                />
            </HeroTextField>
        </FieldFrame.Base>
    )
}

/** `Input.Number` — numeric with stepper (HeroUI NumberField). */
const InputNumber = ({
    value,
    onValueChange,
    minValue,
    maxValue,
    step,
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
}: {
    value: number
    onValueChange: (value: number) => void
    minValue?: number
    maxValue?: number
    step?: number
    isDisabled?: boolean
    isInvalid?: boolean
    ariaLabel?: string
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
} & FrameProps) => {
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
            skeletonControl={<FieldSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroNumberField
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                isInvalid={invalid}
                isDisabled={isDisabled}
                fullWidth
                className={className}
            >
                <div data-anat-part={showAnatomy ? "Field" : undefined}>
                    <HeroNumberField.Group>
                        <HeroNumberField.DecrementButton />
                        <HeroNumberField.Input />
                        <HeroNumberField.IncrementButton />
                    </HeroNumberField.Group>
                </div>
            </HeroNumberField>
        </FieldFrame.Base>
    )
}

/** `Input.Date` — date picker (HeroUI DatePicker + DateField segments + Calendar popover). */
const InputDate = ({
    value,
    onValueChange,
    minValue,
    maxValue,
    isDisabled,
    isInvalid,
    ariaLabel = "Chọn ngày",
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: DateValue | null
    onValueChange: (value: DateValue | null) => void
    minValue?: DateValue
    maxValue?: DateValue
    isDisabled?: boolean
    isInvalid?: boolean
    ariaLabel?: string
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
} & FrameProps) => {
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
            skeletonControl={<FieldSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroDatePicker
                aria-label={fieldName(label, ariaLabel)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                className={cn("w-full", className)}
            >
                <DateField.Group fullWidth variant="secondary" data-anat-part={showAnatomy ? "Field" : undefined}>
                    <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                    <DateField.Suffix>
                        <HeroDatePicker.Trigger>
                            <HeroDatePicker.TriggerIndicator />
                        </HeroDatePicker.Trigger>
                    </DateField.Suffix>
                </DateField.Group>
                <HeroDatePicker.Popover>
                    <Calendar aria-label={ariaLabel} />
                </HeroDatePicker.Popover>
            </HeroDatePicker>
        </FieldFrame.Base>
    )
}

/** `Input.Search` — search field (HeroUI SearchField: leading icon + clear sẵn). */
const InputSearch = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel = "Tìm kiếm",
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: StringFieldProps) => {
    const controlId = useId()
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
            id={controlId}
            skeletonControl={<FieldSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroSearchField
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                className={cn("w-full", className)}
            >
                <HeroSearchField.Group data-anat-part={showAnatomy ? "Field" : undefined}>
                    <HeroSearchField.SearchIcon />
                    <HeroSearchField.Input id={controlId} placeholder={placeholder} />
                </HeroSearchField.Group>
            </HeroSearchField>
        </FieldFrame.Base>
    )
}

/** `Input.Password` — text ẩn + nút hiện/ẩn (gravity Eye/EyeSlash). */
const InputPassword = ({
    value,
    onValueChange,
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
}: StringFieldProps) => {
    const [reveal, setReveal] = useState(false)
    const controlId = useId()
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
            id={controlId}
            skeletonControl={<FieldSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroTextField aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full", className)}>
                <div className="relative" data-anat-part={showAnatomy ? "Field" : undefined}>
                    <HeroInput
                        id={controlId}
                        type={reveal ? "text" : "password"}
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => onValueChange(event.target.value)}
                        className="w-full pr-9"
                    />
                    <button
                        type="button"
                        aria-label={reveal ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        onClick={() => setReveal((r) => !r)}
                        data-anat-part={showAnatomy ? "Toggle" : undefined}
                        className="text-muted absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer [&_svg]:size-4"
                    >
                        {reveal ? <EyeSlash aria-hidden /> : <Eye aria-hidden />}
                    </button>
                </div>
            </HeroTextField>
        </FieldFrame.Base>
    )
}

/** `Input.Currency` — money amount (HeroUI NumberField + `formatOptions` currency). */
const InputCurrency = ({
    value,
    onValueChange,
    currency = "VND",
    minValue = 0,
    maxValue,
    step,
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
}: {
    value: number
    onValueChange: (value: number) => void
    /** ISO-4217 code fed to `formatOptions.currency`. Default `VND`. */
    currency?: string
    minValue?: number
    maxValue?: number
    step?: number
    isDisabled?: boolean
    isInvalid?: boolean
    ariaLabel?: string
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
} & FrameProps) => {
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
            skeletonControl={<FieldSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroNumberField
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                // The atom OWNS the currency formatting (§4) — consumer passes a raw number,
                // never a formatted string; the field renders "₫" / grouping itself.
                formatOptions={{ style: "currency", currency, currencyDisplay: "narrowSymbol" }}
                isInvalid={invalid}
                isDisabled={isDisabled}
                fullWidth
                className={className}
            >
                <div data-anat-part={showAnatomy ? "Field" : undefined}>
                    <HeroNumberField.Group>
                        <HeroNumberField.DecrementButton />
                        <HeroNumberField.Input />
                        <HeroNumberField.IncrementButton />
                    </HeroNumberField.Group>
                </div>
            </HeroNumberField>
        </FieldFrame.Base>
    )
}

/** `Input.Time` — hh:mm segments (HeroUI TimeField). No calendar popover; `value` is a `TimeValue`. */
const InputTime = ({
    value,
    onValueChange,
    isDisabled,
    isInvalid,
    ariaLabel = "Chọn giờ",
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: TimeValue | null
    onValueChange: (value: TimeValue | null) => void
    isDisabled?: boolean
    isInvalid?: boolean
    ariaLabel?: string
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
} & FrameProps) => {
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
            skeletonControl={<FieldSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <HeroTimeField
                aria-label={fieldName(label, ariaLabel)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                value={value}
                onChange={onValueChange}
                fullWidth
                className={cn("w-full", className)}
            >
                <HeroTimeField.Group fullWidth variant="secondary" data-anat-part={showAnatomy ? "Field" : undefined}>
                    <HeroTimeField.Input>{(segment) => <HeroTimeField.Segment segment={segment} />}</HeroTimeField.Input>
                </HeroTimeField.Group>
            </HeroTimeField>
        </FieldFrame.Base>
    )
}

/** `Input.Otp` — bare one-time-code cells (HeroUI InputOTP), `length` slots, `value` a digit string. */
const InputOtp = ({
    value,
    onValueChange,
    length = 6,
    isDisabled,
    isInvalid,
    autoFocus,
    ariaLabel,
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: string
    onValueChange: (value: string) => void
    /** Slot count (also `maxLength`). Default `6`. */
    length?: number
    isDisabled?: boolean
    isInvalid?: boolean
    autoFocus?: boolean
    ariaLabel?: string
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
} & FrameProps) => {
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
            skeletonControl={
                // Leaf skeleton OWNED by the atom — a row of `length` cell-shaped squares.
                <div className={cn("flex items-center gap-2", className)} data-anat-part={showAnatomy ? "Skeleton" : undefined}>
                    {Array.from({ length }, (_, index) => (
                        <HeroSkeleton key={index} className="h-10 w-9 rounded-xl" />
                    ))}
                </div>
            }
        >
            <HeroInputOTP
                aria-label={fieldName(label, ariaLabel)}
                maxLength={length}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                autoFocus={autoFocus}
                className={className}
            >
                <HeroInputOTP.Group data-anat-part={showAnatomy ? "Field" : undefined}>
                    {Array.from({ length }, (_, index) => (
                        <HeroInputOTP.Slot key={index} index={index} />
                    ))}
                </HeroInputOTP.Group>
            </HeroInputOTP>
        </FieldFrame.Base>
    )
}

/** `Input.Tags` — token input: `value` a string[], add with Enter, remove with × (composes Chip.Base). */
const InputTags = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel = "Thẻ",
    removeLabel = "Xoá thẻ",
    isSkeleton,
    showAnatomy,
    className,
    label,
    hint,
    errorMessage,
    isRequired,
}: {
    value: string[]
    onValueChange: (value: string[]) => void
    placeholder?: string
    isDisabled?: boolean
    isInvalid?: boolean
    ariaLabel?: string
    removeLabel?: string
    isSkeleton?: boolean
    showAnatomy?: boolean
    className?: string
} & FrameProps) => {
    // Ephemeral draft text (like Password's `reveal`) — NOT part of the semantic value.
    const [draft, setDraft] = useState("")
    const controlId = useId()
    const invalid = isInvalid || errorMessage != null
    const commit = () => {
        const token = draft.trim()
        if (token && !value.includes(token)) {
            onValueChange([...value, token])
        }
        setDraft("")
    }
    const removeAt = (index: number) => onValueChange(value.filter((_, i) => i !== index))
    return (
        <FieldFrame.Base
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            showAnatomy={showAnatomy}
            id={controlId}
            skeletonControl={<FieldSkeleton className={className} showAnatomy={showAnatomy} />}
        >
            <div
                data-anat-part={showAnatomy ? "Field" : undefined}
                className={cn(
                    "bg-default-100 flex w-full flex-wrap items-center gap-1.5 rounded-xl border px-2 py-1.5",
                    invalid ? "border-danger" : "border-default-200",
                    isDisabled && "pointer-events-none opacity-50",
                    className,
                )}
            >
                {value.map((tag, index) => (
                    <span key={`${tag}-${index}`} data-anat-part={showAnatomy ? "Chip" : undefined} className="inline-flex">
                        <Chip.Base text={tag} onRemove={isDisabled ? undefined : () => removeAt(index)} removeLabel={removeLabel} />
                    </span>
                ))}
                <input
                    id={controlId}
                    aria-label={fieldName(label, ariaLabel)}
                    value={draft}
                    disabled={isDisabled}
                    placeholder={value.length === 0 ? placeholder : undefined}
                    onChange={(event) => setDraft(event.target.value)}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            event.preventDefault()
                            commit()
                        } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
                            removeAt(value.length - 1)
                        }
                    }}
                    className="min-w-24 flex-1 bg-transparent px-1 py-0.5 text-sm outline-none"
                />
            </div>
        </FieldFrame.Base>
    )
}

/**
 * `Input.*` — field-control atom namespace. Ô trần; primitive fields compose members.
 */
export const Input = Object.assign(InputText, {
    Text: InputText,
    Textarea: InputTextarea,
    Number: InputNumber,
    Date: InputDate,
    Search: InputSearch,
    Password: InputPassword,
    Currency: InputCurrency,
    Time: InputTime,
    Otp: InputOtp,
    Tags: InputTags,
})
