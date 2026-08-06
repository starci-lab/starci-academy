import { useState } from "react"
import { SnippetIcon } from "@sb-components/atoms/display/SnippetIcon/SnippetIcon"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ChoiceCheckbox } from "@sb-components/atoms/forms/ChoiceCheckbox/ChoiceCheckbox"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `OneTimeReveal` — a value the issuing server will never show again: the warning
 * FIRST, then the value beside a copy control, then a deliberate two-step
 * acknowledgement (tick, then press) that hides it.
 *
 * `value` is `string | null` and the composite owns the null branch itself, so a
 * caller cannot forget it. A null value is not an error and not an empty box: it
 * is the ordinary answer when the server minted nothing this time, and it renders
 * as its own explanatory note with no copy control, no placeholder frame, and
 * never the literal text "null".
 *
 * Acknowledgement is deliberately NOT the copy button. Copying is one click and
 * happens by reflex; hiding a value that can never be recovered should cost a tick
 * and a press, and the composite keeps the two separate for exactly that reason.
 */

/**
 * The already-resolved copy the reveal renders.
 *
 * There is no `copyLabel`/`copiedLabel` here: `SnippetIcon` — this system's only
 * copy control — takes no accessible name and swaps its own glyph on copy, so a
 * label pair would be copy nothing ever renders.
 */
export interface OneTimeRevealLabels {
    /** The confirm button that hides the value for good. */
    acknowledgeLabel: string
    /** The tick the reader must set before the confirm button unlocks. */
    acknowledgeCheckboxLabel: string
}

/** Props for {@link OneTimeReveal}, excluding the `value`/`isSkeleton` pair — see {@link OneTimeRevealProps}. */
interface OneTimeRevealOwnProps {
    /** What this value is, in the reader's language. */
    title: string
    /**
     * Heading of the note shown when {@link OneTimeRevealProps} carries a `null`
     * value. REQUIRED rather than optional: the null branch is the common case,
     * and an optional title would let a caller ship a silent hole where the
     * explanation belongs.
     */
    absenceTitle: string
    /** Supporting line under {@link OneTimeRevealOwnProps.absenceTitle}. */
    absenceDescription?: string
    /** Heading of the "shown once" warning that sits above the value. */
    warningTitle: string
    /** Supporting line under {@link OneTimeRevealOwnProps.warningTitle}. */
    warningDescription?: string
    /** `true` → the reader has confirmed they stored it; the value is replaced by the summary. */
    isAcknowledged: boolean
    /** Fires when the reader presses the confirm button. */
    onAcknowledge: () => void
    /**
     * Shown in place of the value after acknowledgement — a tail fragment the
     * caller computed while it still held the value. `null` renders nothing at
     * all rather than an empty line.
     */
    acknowledgedSummary?: string | null
    /**
     * Pins the copy control's confirmed glyph from outside, the same escape hatch
     * `SnippetIcon` itself exposes. Omitted, the atom manages that state on its own.
     */
    isCopied?: boolean
    /** Already-localized copy. */
    labels: OneTimeRevealLabels
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
}

/**
 * `value` is required while the reveal is live and unnecessary while it shimmers.
 * `null` is a real live value meaning "the server minted nothing" — it is NOT the
 * skeleton case, and the union keeps the two from being confused.
 */
export type OneTimeRevealProps = OneTimeRevealOwnProps &
    (
        | { isSkeleton: true; value?: string | null }
        | { isSkeleton?: false; value: string | null }
    )

/**
 * A once-only value. See the file header for why the null branch lives inside the
 * composite and why acknowledgement is not the copy button.
 *
 * @param props - {@link OneTimeRevealProps}
 */
const OneTimeReveal = (props: OneTimeRevealProps) => {
    const {
        title,
        absenceTitle,
        absenceDescription,
        warningTitle,
        warningDescription,
        isAcknowledged,
        onAcknowledge,
        acknowledgedSummary,
        isCopied,
        labels,
        classNames,
    } = props
    const isSkeleton = props.isSkeleton === true
    const value = props.value ?? null

    // View state, not app state: whether the reader has ticked the box in front of
    // the confirm button. It resets with the component because the value does too.
    const [isTicked, setIsTicked] = useState(false)

    const heading = () => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text={title} />

    // ── The null branch. No box, no copy control, no placeholder frame: there is
    // nothing to copy, and a frame that looks copy-pasteable around an absence is
    // worse than no frame at all.
    if (!isSkeleton && value === null) {
        return (
            <div data-tier="composite" data-component="OneTimeReveal">
                <StackV
                    gap={2}
                    principle="title-subtitle"
                    classNames={classNames}
                    items={[
                        heading,
                        () => <Callout status="info" title={absenceTitle} description={absenceDescription} />,
                    ]}
                />
            </div>
        )
    }

    // ── After acknowledgement. The caller kept a tail fragment while it still held
    // the value; with none, the row simply says nothing rather than printing a blank.
    if (!isSkeleton && isAcknowledged) {
        return (
            <div data-tier="composite" data-component="OneTimeReveal">
                <StackV
                    gap={2}
                    principle="title-subtitle"
                    classNames={classNames}
                    items={[
                        heading,
                        ...(acknowledgedSummary != null
                            ? [() => <Typography size="sm" color="muted" text={acknowledgedSummary} />]
                            : []),
                    ]}
                />
            </div>
        )
    }

    return (
        <div data-tier="composite" data-component="OneTimeReveal">
            <StackV
                gap={3}
                principle="sibling-stack"
                isSkeleton={isSkeleton}
                classNames={classNames}
                items={[
                    heading,
                    () =>
                        isSkeleton ? (
                            <Callout isSkeleton />
                        ) : (
                            <Callout status="warning" title={warningTitle} description={warningDescription} />
                        ),
                    () => (
                        <StackH
                            gap={3}
                            align="center"
                            justify="between"
                            principle="value-row"
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <Typography
                                        size="code"
                                        preserveWhitespace
                                        classNames={["min-w-0"]}
                                        isSkeleton={isSkeleton}
                                        text={value ?? undefined}
                                    />
                                ),
                                () =>
                                    isSkeleton ? (
                                        <SnippetIcon isSkeleton />
                                    ) : (
                                        <SnippetIcon copyString={value ?? ""} isCopied={isCopied} />
                                    ),
                            ]}
                        />
                    ),
                    () => (
                        <ChoiceCheckbox
                            isSelected={isTicked}
                            onValueChange={setIsTicked}
                            isDisabled={isSkeleton}
                            isSkeleton={isSkeleton}
                            label={labels.acknowledgeCheckboxLabel}
                        />
                    ),
                    () => (
                        <StackH
                            gap={2}
                            justify="end"
                            principle="flex-action"
                            isSkeleton={isSkeleton}
                            items={[
                                () => (
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        label={labels.acknowledgeLabel}
                                        isSkeleton={isSkeleton}
                                        isDisabled={!isTicked}
                                        onPress={isSkeleton ? undefined : onAcknowledge}
                                    />
                                ),
                            ]}
                        />
                    ),
                ]}
            />
        </div>
    )
}

export { OneTimeReveal }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "composite", name: "OneTimeReveal" } as const
