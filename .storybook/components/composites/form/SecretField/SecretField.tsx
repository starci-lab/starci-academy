import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { InputPassword } from "@sb-components/atoms/forms/InputPassword/InputPassword"
import { InputText } from "@sb-components/atoms/forms/InputText/InputText"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `SecretField` — one write-only secret: a summary row that says what the server
 * knows about the stored value, and an entry row that replaces it. Domain-blind
 * on purpose (no channel, no provider, no pod), which is what keeps it a
 * composite rather than a block.
 *
 * `status` has THREE values, not two, because a server that offers no read path
 * is not the same as a server that says "nothing stored": `unknown` means the
 * client cannot tell, `unset` means it has been told there is nothing, and `set`
 * means a value is on file. Collapsing `unknown` into `unset` would print a
 * confident falsehood on first paint.
 *
 * The value itself is never displayed: `valueHint` is the last few characters and
 * may legitimately be `null` (a value shorter than the hint window has no tail to
 * show). `deliveryLabel` is a SEPARATE line from the stored/not-stored fact —
 * saved and delivered are different states, and a field that merges them tells a
 * reader a key is live while the running process still holds the old one.
 */

/** What the client knows about the stored value — see the file header for why `unknown` is its own member. */
export type SecretFieldStatus =
    /** The client has no read path, so it cannot say. The default on a server with no read query. */
    | "unknown"
    /** The server said there is no value stored. */
    | "unset"
    /** A value is on file; `valueHint` may still be null. */
    | "set"

/** Tone of the delivery line — muted when it is merely informational, warning when delivery is still pending. */
export type SecretFieldDeliveryTone = "muted" | "warning" | "success"

/** Which half of the field is showing: the read-only summary, or the entry control. */
export type SecretFieldMode = "summary" | "editing"

/** The already-resolved copy the field renders. */
export interface SecretFieldLabels {
    /** Button that switches the field into entry mode ("Enter key" / "Replace key"). */
    editLabel: string
    /** Submit button in entry mode. */
    saveLabel: string
    /** Discard button in entry mode. */
    cancelLabel: string
    /** Summary line for `status="unknown"` — must say the server cannot be asked, not that nothing is stored. */
    unknownLabel: string
    /** Summary line for `status="unset"`. */
    unsetLabel: string
    /** Summary line for `status="set"`. */
    setLabel: string
    /** Prefix in front of `valueHint` ("ending"), joined by the field itself. */
    endingLabel: string
    /** Accessible name for the reveal toggle when the control is masked. */
    revealLabel: string
    /** Accessible name for the hide toggle when the control is masked. */
    hideLabel: string
}

/** Props for {@link SecretField}, excluding the `value`/`onValueChange`/`isSkeleton` triple — see {@link SecretFieldProps}. */
interface SecretFieldOwnProps {
    /** Field label — the name of the secret, in the reader's language. */
    label: string
    /** Supporting line under the label (where to obtain the value). */
    hint?: string
    /** What the client knows about the stored value. See {@link SecretFieldStatus}. */
    status: SecretFieldStatus
    /** Last few characters of the stored value, or `null` when the server returned none. */
    valueHint?: string | null
    /**
     * Already-formatted delivery line ("Last delivered 14:32"). `null` when there
     * is nothing to say — never a fabricated timestamp.
     */
    deliveryLabel?: string | null
    /** Tone of {@link SecretFieldOwnProps.deliveryLabel}. Default `"muted"`. */
    deliveryTone?: SecretFieldDeliveryTone
    /** Which half is showing. See {@link SecretFieldMode}. */
    mode: SecretFieldMode
    /** Switch to entry mode. */
    onEdit: () => void
    /** Leave entry mode without submitting. */
    onCancel: () => void
    /** Submit the entered value. */
    onSubmit: () => void
    /** `true` → the control is masked (`InputPassword`); `false` → plain text. Default `false`. */
    isMasked?: boolean
    /**
     * `true` → this field's own save is in flight. The save button carries an
     * EXPLICIT spinner (the `Button` atom renders one for `isPending`; the vendor
     * control alone does not) and the control locks.
     */
    isPending?: boolean
    /** `true` → the field is inert because something else owns the moment (another field is saving). */
    isDisabled?: boolean
    /** Failure line under the control, red. */
    errorMessage?: string
    /** Warning-toned inline note — a caveat that is not a failure (the value was stored but not delivered). */
    noticeMessage?: string
    /** Already-localized copy. */
    labels: SecretFieldLabels
}

/**
 * `value`/`onValueChange` are required while the field is live and unnecessary
 * while it shimmers — the same discriminated pair every form atom in this house
 * carries, so the flag cannot be set without the value going optional with it.
 */
export type SecretFieldProps = SecretFieldOwnProps &
    (
        | { isSkeleton: true; value?: string; onValueChange?: (next: string) => void }
        | { isSkeleton?: false; value: string; onValueChange: (next: string) => void }
    )

/** Status → the summary chip's tone. `unknown` is neutral: it is an absence of knowledge, not a warning. */
const STATUS_TONE: Record<SecretFieldStatus, ChipTone> = {
    unknown: "default",
    unset: "default",
    set: "success",
}

/** Delivery tone → the chip tone it renders as. `muted` has no chip colour of its own. */
const DELIVERY_TONE: Record<SecretFieldDeliveryTone, ChipTone> = {
    muted: "default",
    warning: "warning",
    success: "success",
}

/**
 * One write-only secret. See the file header for why `status` has three members
 * and why delivery is a separate line from storage.
 *
 * @param props - {@link SecretFieldProps}
 */
const SecretField = (props: SecretFieldProps) => {
    const {
        label,
        hint,
        status,
        valueHint,
        deliveryLabel,
        deliveryTone = "muted",
        mode,
        onEdit,
        onCancel,
        onSubmit,
        isMasked = false,
        isPending = false,
        isDisabled = false,
        errorMessage,
        noticeMessage,
        labels,
        
    } = props
    const isSkeleton = props.isSkeleton === true

    // Narrowed off the discriminant rather than destructured, so `value`/`onValueChange`
    // stay REQUIRED in the live arm — reading them off `props` above would widen both to
    // `| undefined` and hand the atom a control with no value (same shape `Callout` uses).
    const entry = props.isSkeleton
        ? ({ isSkeleton: true } as const)
        : ({ isSkeleton: false, value: props.value, onValueChange: props.onValueChange } as const)

    const summaryText =
        status === "set"
            ? valueHint != null
                ? `${labels.setLabel} · ${labels.endingLabel} ${valueHint}`
                : labels.setLabel
            : status === "unset"
                ? labels.unsetLabel
                : labels.unknownLabel

    const notice =
        noticeMessage != null
            ? [() => <Typography size="xs" color="warning" isSkeleton={isSkeleton} text={noticeMessage} />]
            : []

    const summaryItems = [
        () => (
            <StackH
                gap={3}
                align="center"
                justify="between"
                principle="flex-action"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <StackV
                            gap={1}
                            principle="title-subtitle"
                            classNames={["min-w-0"]}
                            isSkeleton={isSkeleton}
                            items={[
                                () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={label} />,
                                ...(hint != null
                                    ? [() => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={hint} />]
                                    : []),
                            ]}
                        />
                    ),
                    () => <Chip tone={STATUS_TONE[status]} isSkeleton={isSkeleton} text={summaryText} />,
                ]}
            />
        ),
        ...(deliveryLabel != null
            ? [() => <Chip tone={DELIVERY_TONE[deliveryTone]} isSkeleton={isSkeleton} text={deliveryLabel} />]
            : []),
        ...notice,
        () => (
            <StackH
                gap={2}
                justify="start"
                principle="flex-action"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <Button
                            variant="ghost"
                            size="sm"
                            label={labels.editLabel}
                            isSkeleton={isSkeleton}
                            isDisabled={isDisabled}
                            onPress={isSkeleton ? undefined : onEdit}
                        />
                    ),
                ]}
            />
        ),
    ]

    const control = isMasked ? (
        <InputPassword
            {...entry}
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isDisabled={isDisabled || isPending}
            isRequired
            revealLabel={labels.revealLabel}
            hideLabel={labels.hideLabel}
        />
    ) : (
        <InputText
            {...entry}
            label={label}
            hint={hint}
            errorMessage={errorMessage}
            isDisabled={isDisabled || isPending}
            isRequired
        />
    )

    const editingItems = [
        () => control,
        ...notice,
        () => (
            <StackH
                gap={2}
                justify="end"
                principle="flex-action"
                isSkeleton={isSkeleton}
                items={[
                    () => (
                        <Button
                            variant="ghost"
                            size="sm"
                            label={labels.cancelLabel}
                            isSkeleton={isSkeleton}
                            isDisabled={isPending}
                            onPress={isSkeleton ? undefined : onCancel}
                        />
                    ),
                    () => (
                        <Button
                            variant="primary"
                            size="sm"
                            label={labels.saveLabel}
                            isSkeleton={isSkeleton}
                            // The `Button` atom swaps its leading glyph for a real `Spinner` when
                            // `isPending` — the vendor control's own busy flag draws nothing.
                            isPending={isPending}
                            isDisabled={isDisabled}
                            onPress={isSkeleton ? undefined : onSubmit}
                        />
                    ),
                ]}
            />
        ),
    ]

    return (
        <div data-tier="composite" data-component="SecretField">
            <StackV
                gap={2}
                principle="label-field"
                isSkeleton={isSkeleton}
                items={mode === "editing" ? editingItems : summaryItems}
            />
        </div>
    )
}

export { SecretField }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "composite", name: "SecretField" } as const
