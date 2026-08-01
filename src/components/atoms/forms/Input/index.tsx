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
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import type { DateValue } from "@internationalized/date"
// `TimeValue` (= Time | CalendarDateTime | ZonedDateTime) lives in react-aria-components —
// that is where HeroUI's own TimeField imports it from (NOT @internationalized/date, which
// only exports the concrete `Time` class used to CONSTRUCT a value).
import type { TimeValue } from "react-aria-components"
import { FieldFrame, fieldName } from "@/components/atoms/forms/_field/FieldFrame"
import type { AllowedClassName } from "@/components/atoms/_allowed-class-name"

/**
 * Field-frame props every form atom accepts to carry its own label, hint,
 * error, and required mark. Omit them all and the atom renders as a bare
 * control (FieldFrame renders the control straight through).
 *
 * Exported so the `InputTags` composite (`composites/form/InputTags`) can
 * reuse the same shape — it moved out of this file (ATOM-8: it composed the
 * `Chip` atom once per tag) but still carries the same label/hint/error frame.
 */
export interface FrameProps {
    /** Label above the control. */
    label?: ReactNode
    /** Description below the label (always visible). */
    hint?: ReactNode
    /** Error line below the control (set it to show an error border). */
    errorMessage?: ReactNode
    /** Adds a required `*` mark. */
    isRequired?: boolean
}

/**
 * `Input.*` — the field-control atom namespace (wraps HeroUI form controls).
 *
 * Members are grouped by input kind — `InputText` · `InputTextarea` ·
 * `InputNumber` · `InputDate` (plus Search/Password/Time/OTP/Currency).
 * Each member composes `FieldFrame` directly to carry its own label, hint,
 * error, and required mark via {@link FrameProps} — there is no separate
 * `Field` wrapper component.
 *
 * `isSkeleton` renders a field-box skeleton co-located on the atom, without
 * importing the `Skeleton.*` compound.
 *
 * `InputTags` stops being a member here — the token row rebuilds one `Chip`
 * per tag, which moved it to `composites/form/InputTags` (ATOM-8: rendering
 * another house atom once per item is the composite signal, not the atom one).
 */

/**
 * Props for the {@link FieldSkeleton} mirror — a field-box skeleton owned by the atom.
 *
 * Exported so the `InputTags` composite can draw the same field-box shimmer it
 * used before it moved out of this file — the shimmer's shape still belongs
 * here, at the atom tier, per ATOM-4.
 */
export interface FieldSkeletonProps {
    /** Height class of the bar — matches the real control it stands in for. */
    heightCls?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

export const FieldSkeleton = ({ heightCls = "h-9", classNames }: FieldSkeletonProps) => (
    <HeroSkeleton data-tier="atom" data-component="FieldSkeleton" className={cn("w-full rounded-xl", heightCls, classNames)} />
)

/** Shared props for text-string members, excluding the value pair and `isSkeleton`. */
interface StringFieldOwnProps extends FrameProps {
    placeholder?: string
    isDisabled?: boolean
    isInvalid?: boolean
    /** Accessible name used when there's no `label` (otherwise the label handles it). */
    ariaLabel?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `value`/`onValueChange` are required when the field is live, optional when
 * `isSkeleton` is set — the field-box shimmer doesn't hold a value. Same shape
 * as `TypographyProps`.
 */
type StringFieldProps = StringFieldOwnProps &
    (
        | { isSkeleton: true; value?: string; onValueChange?: (value: string) => void }
        | { isSkeleton?: false; value: string; onValueChange: (value: string) => void }
    )

/** Props for {@link InputText}. */
type InputTextProps = StringFieldProps & {
    /** HeroUI field variant — `"secondary"` for a field sitting inside a card/modal surface. @default "primary" */
    variant?: "primary" | "secondary"
}

/** `InputText` — single-line text (HeroUI TextField+Input) with label/hint/error. */
const InputText = ({ value, onValueChange, placeholder, isDisabled, isInvalid, ariaLabel, isSkeleton, classNames, label, hint, errorMessage, isRequired, variant = "primary" }: InputTextProps) => {
    const controlId = useId()
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            id={controlId}
            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroTextField data-tier="atom" data-component="InputText" variant={variant} aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full", classNames)}>
                <HeroInput
                    id={controlId}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange?.(event.target.value)}
                    className="w-full"
                />
            </HeroTextField>
        </FieldFrame>
    )
}

/** Props for {@link InputTextarea}. */
type InputTextareaProps = StringFieldProps & {
    /** Visible rows. @default 3 */
    rows?: number
    /** HeroUI field variant — `"secondary"` for a field sitting inside a card/modal surface. @default "primary" */
    variant?: "primary" | "secondary"
}

/** `InputTextarea` — multi-line (HeroUI TextArea), `rows` visible lines (default 3). */
const InputTextarea = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    rows = 3,
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
    variant = "primary",
}: InputTextareaProps) => {
    const controlId = useId()
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            id={controlId}
            skeletonControl={<FieldSkeleton heightCls="h-24" classNames={classNames} />}
        >
            <HeroTextField data-tier="atom" data-component="InputTextarea" variant={variant} aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full", classNames)}>
                <HeroTextArea
                    id={controlId}
                    rows={rows}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange?.(event.target.value)}
                    className="w-full"
                />
            </HeroTextField>
        </FieldFrame>
    )
}

/** `InputNumber` — numeric with stepper (HeroUI NumberField). */
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
    classNames,
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
} & FrameProps) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroNumberField
                data-tier="atom"
                data-component="InputNumber"
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                isInvalid={invalid}
                isDisabled={isDisabled}
                fullWidth
                className={cn(classNames)}
            >
                {/* There's no wrapping div here since it had no styling of its own. */}
                <HeroNumberField.Group>
                    <HeroNumberField.DecrementButton />
                    <HeroNumberField.Input />
                    <HeroNumberField.IncrementButton />
                </HeroNumberField.Group>
            </HeroNumberField>
        </FieldFrame>
    )
}

/** `InputDate` — date picker (HeroUI DatePicker + DateField segments + Calendar popover). */
const InputDate = ({
    value,
    onValueChange,
    minValue,
    maxValue,
    isDisabled,
    isInvalid,
    ariaLabel = "Pick a date",
    isSkeleton,
    classNames,
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
} & FrameProps) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroDatePicker
                data-tier="atom"
                data-component="InputDate"
                aria-label={fieldName(label, ariaLabel)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                className={cn("w-full", classNames)}
            >
                <DateField.Group fullWidth variant="secondary">
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
        </FieldFrame>
    )
}

/** `InputSearch` — search field (HeroUI SearchField: leading icon + built-in clear). */
const InputSearch = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel = "Search",
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: StringFieldProps) => {
    const controlId = useId()
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            id={controlId}
            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroSearchField
                data-tier="atom"
                data-component="InputSearch"
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                className={cn("w-full", classNames)}
            >
                <HeroSearchField.Group>
                    <HeroSearchField.SearchIcon />
                    <HeroSearchField.Input id={controlId} placeholder={placeholder} />
                </HeroSearchField.Group>
            </HeroSearchField>
        </FieldFrame>
    )
}

/** `InputPassword` — masked text with a reveal/hide button (Phosphor EyeIcon/EyeSlashIcon). */
const InputPassword = ({
    value,
    onValueChange,
    placeholder,
    isDisabled,
    isInvalid,
    ariaLabel,
    isSkeleton,
    classNames,
    label,
    hint,
    errorMessage,
    isRequired,
}: StringFieldProps) => {
    const [reveal, setReveal] = useState(false)
    const controlId = useId()
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            id={controlId}
            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroTextField data-tier="atom" data-component="InputPassword" aria-label={fieldName(label, ariaLabel)} isInvalid={invalid} isDisabled={isDisabled} className={cn("w-full", classNames)}>
                <div className="relative">
                    {/* The wrapping div stays only for `relative` positioning. */}
                    <HeroInput
                        id={controlId}
                        type={reveal ? "text" : "password"}
                        placeholder={placeholder}
                        value={value}
                        onChange={(event) => onValueChange?.(event.target.value)}
                        className="w-full pr-9"
                    />
                    <button
                        type="button"
                        aria-label={reveal ? "Hide password" : "Show password"}
                        onClick={() => setReveal((r) => !r)}
                        className="text-muted absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer [&_svg]:size-4"
                    >
                        {/* icon size-4 is below the size-5 threshold, so `weight="bold"` compensates for the thinner stroke. */}
                        {reveal ? <EyeSlashIcon weight="bold" aria-hidden /> : <EyeIcon weight="bold" aria-hidden />}
                    </button>
                </div>
            </HeroTextField>
        </FieldFrame>
    )
}

/** `InputCurrency` — money amount (HeroUI NumberField + `formatOptions` currency). */
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
    classNames,
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
} & FrameProps) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroNumberField
                data-tier="atom"
                data-component="InputCurrency"
                aria-label={fieldName(label, ariaLabel)}
                value={value}
                onChange={onValueChange}
                minValue={minValue}
                maxValue={maxValue}
                step={step}
                // The atom owns the currency formatting — the consumer passes a raw number,
                // never a formatted string; the field renders the currency symbol and grouping itself.
                formatOptions={{ style: "currency", currency, currencyDisplay: "narrowSymbol" }}
                isInvalid={invalid}
                isDisabled={isDisabled}
                fullWidth
                className={cn(classNames)}
            >
                {/* There's no wrapping div here since it had no styling of its own. */}
                <HeroNumberField.Group>
                    <HeroNumberField.DecrementButton />
                    <HeroNumberField.Input />
                    <HeroNumberField.IncrementButton />
                </HeroNumberField.Group>
            </HeroNumberField>
        </FieldFrame>
    )
}

/** `InputTime` — hh:mm segments (HeroUI TimeField). No calendar popover; `value` is a `TimeValue`. */
const InputTime = ({
    value,
    onValueChange,
    isDisabled,
    isInvalid,
    ariaLabel = "Pick a time",
    isSkeleton,
    classNames,
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
} & FrameProps) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={<FieldSkeleton classNames={classNames} />}
        >
            <HeroTimeField
                data-tier="atom"
                data-component="InputTime"
                aria-label={fieldName(label, ariaLabel)}
                isInvalid={invalid}
                isDisabled={isDisabled}
                value={value}
                onChange={onValueChange}
                fullWidth
                className={cn("w-full", classNames)}
            >
                <HeroTimeField.Group fullWidth variant="secondary">
                    <HeroTimeField.Input>{(segment) => <HeroTimeField.Segment segment={segment} />}</HeroTimeField.Input>
                </HeroTimeField.Group>
            </HeroTimeField>
        </FieldFrame>
    )
}

/** `InputOtp` — bare one-time-code cells (HeroUI InputOTP), `length` slots, `value` a digit string. */
const InputOtp = ({
    value,
    onValueChange,
    length = 6,
    isDisabled,
    isInvalid,
    autoFocus,
    ariaLabel,
    isSkeleton,
    classNames,
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     */
    classNames?: Array<AllowedClassName>
} & FrameProps) => {
    const invalid = isInvalid || errorMessage != null
    return (
        <FieldFrame
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isRequired={isRequired}
            isDisabled={isDisabled}
            isSkeleton={isSkeleton}
            skeletonControl={
                // Leaf skeleton OWNED by the atom — a row of `length` cell-shaped squares.
                <div className={cn("flex items-center gap-2", classNames)}>
                    {Array.from({ length }, (_, index) => (
                        <HeroSkeleton key={index} className="h-10 w-9 rounded-xl" />
                    ))}
                </div>
            }
        >
            <HeroInputOTP
                data-tier="atom"
                data-component="InputOtp"
                aria-label={fieldName(label, ariaLabel)}
                maxLength={length}
                value={value}
                onChange={onValueChange}
                isInvalid={invalid}
                isDisabled={isDisabled}
                autoFocus={autoFocus}
                className={cn(classNames)}
            >
                <HeroInputOTP.Group>
                    {Array.from({ length }, (_, index) => (
                        <HeroInputOTP.Slot key={index} index={index} />
                    ))}
                </HeroInputOTP.Group>
            </HeroInputOTP>
        </FieldFrame>
    )
}

/**
 * `Input.*` — field-control atom namespace. Each member carries its own
 * label, hint, and error via {@link FrameProps}; no higher-level component
 * composes the members. `InputTags` is not a member here anymore — it moved
 * to `composites/form/InputTags` (ATOM-8: it rebuilt one `Chip` per tag,
 * which is the composite signal, not the atom one).
 */
export { InputText, InputTextarea, InputNumber, InputDate, InputSearch, InputPassword, InputCurrency, InputTime, InputOtp }

export const meta = [
    { tier: "atom", name: "FieldSkeleton" },
    { tier: "atom", name: "InputText" },
    { tier: "atom", name: "InputTextarea" },
    { tier: "atom", name: "InputNumber" },
    { tier: "atom", name: "InputDate" },
    { tier: "atom", name: "InputSearch" },
    { tier: "atom", name: "InputPassword" },
    { tier: "atom", name: "InputCurrency" },
    { tier: "atom", name: "InputTime" },
    { tier: "atom", name: "InputOtp" },
] as const
