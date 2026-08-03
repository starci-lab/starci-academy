import React from "react"
import { type SkeletonProps } from "@/components/composites/_slot"
import { PlayIcon } from "@phosphor-icons/react"
import { Button } from "@/components/atoms/buttons/Button"
import { ButtonRadioGroup } from "@/components/composites/buttons/ButtonRadioGroup"
import { InputText } from "@/components/atoms/forms/Input"
import { Typography } from "@/components/atoms/text/Typography"
import { SurfaceCard } from "@/components/composites/cards/SurfaceCard"
import { Callout } from "@/components/composites/feedback/Callout"
import { StackH, StackV } from "@/components/frames/Stack"

/**
 * `QuizSetup` — choose the shape of a drill (length, seniority, name), then
 * start it. The block owns the domain wording and the lengths behind it: the
 * learner picks "quick" or "deep" and the block turns that into 5 or 10 cards,
 * saying so on the button. A run already in progress takes priority — the resume
 * strip leads the card above the form. A failed draw is reported next to the
 * button that failed.
 */

/** How long a drill runs. */
export type QuizLength = "quick" | "deep"

/** Seniority the questions aim at. */
export type QuizLevel = "junior" | "middle" | "senior" | "staff"

/** Card count per length. The BLOCK owns this — it is the judgement, not a prop. */
const LENGTH_CARDS: Record<QuizLength, number> = { quick: 5, deep: 10 }

const LENGTH_LABEL: Record<QuizLength, string> = { quick: "Quick", deep: "Deep" }

const LEVEL_LABEL: Record<QuizLevel, string> = {
    junior: "Junior",
    middle: "Middle",
    senior: "Senior",
    staff: "Staff",
}

/** A run the learner left unfinished. */
export interface QuizResumable {
    /** What the run was called when it was started. */
    name: string
    /** How many cards were answered already. */
    answered: number
    /** How many cards the run has in total. */
    total: number
    /** Fired when the learner picks the run back up. */
    onResume: () => void
}

/** Props for {@link QuizSetup}. */
export interface QuizSetupProps {
    /** Section label, localized by the caller — e.g. "Set up session". */
    label: string
    /** Current run name. */
    name: string
    /** Fired as the learner types a name. */
    onNameChange: (value: string) => void
    /** Chosen length. */
    length: QuizLength
    /** Fired when the learner picks a length. */
    onLengthChange: (length: QuizLength) => void
    /** Chosen seniority. */
    level: QuizLevel
    /** Fired when the learner picks a seniority. */
    onLevelChange: (level: QuizLevel) => void
    /** Fired when the learner starts the run. */
    onStart: () => void
    /** A run left unfinished. Present → the resume strip leads the card. */
    resumable?: QuizResumable
    /** `true` → the draw is in flight; the start button owns the busy affordance. */
    isPending?: boolean
    /** Set → the draw failed. Reported beside the action that failed. */
    errorMessage?: string
    /** `true` → the card draws its own mirror while the setup data loads. */
    isSkeleton?: boolean
}

/**
 * The drill setup form. See the file header for the full contract.
 *
 * @param props - {@link QuizSetupProps}
 */
const QuizSetup = ({
    label,
    name,
    onNameChange,
    length,
    onLengthChange,
    level,
    onLevelChange,
    onStart,
    resumable,
    isPending = false,
    errorMessage,
    isSkeleton = false,
}: QuizSetupProps) => {
    const nameField = (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: SkeletonProps) => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text="Session name" />,
                ({ isSkeleton }: SkeletonProps) => (
                    <InputText
                        value={name}
                        onValueChange={onNameChange}
                        placeholder="e.g. review Docker before the interview"
                        ariaLabel="Session name"
                        isSkeleton={isSkeleton}

                    />
                ),
            ]}
        />
    )

    const lengthField = (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: SkeletonProps) => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text="Length" />,
                () => (
                    <ButtonRadioGroup
                        ariaLabel="Session length"
                        value={length}
                        onChange={onLengthChange}

                        items={(Object.keys(LENGTH_LABEL) as Array<QuizLength>).map((key) => ({
                            value: key,
                            content: `${LENGTH_LABEL[key]} · ${LENGTH_CARDS[key]} questions`,
                        }))}
                    />
                ),
            ]}
        />
    )

    const levelField = (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: SkeletonProps) => <Typography size="sm" weight="medium" isSkeleton={isSkeleton} text="Level" />,
                () => (
                    <ButtonRadioGroup
                        ariaLabel="Question level"
                        value={level}
                        onChange={onLevelChange}

                        items={(Object.keys(LEVEL_LABEL) as Array<QuizLevel>).map((key) => ({
                            value: key,
                            content: LEVEL_LABEL[key],
                        }))}
                    />
                ),
            ]}
        />
    )

    const submitRow = (
        <StackH
            gap={3}
            principles={["flex-action"]}
            justify="end"
            isSkeleton={isSkeleton}
            items={[
                ({ isSkeleton }: SkeletonProps) => (
                    <Button
                        label={`Start · ${LENGTH_CARDS[length]} questions`}
                        variant="primary"
                        prefixIcon={PlayIcon}
                        onPress={onStart}
                        isPending={isPending}
                        isSkeleton={isSkeleton}

                    />
                ),
            ]}
        />
    )

    // The error sits WITH the action that failed. At the top of the card it
    // would read as a problem with the whole form.
    const actionField = (
        <StackV
            gap={3}
            isSkeleton={isSkeleton}
            items={[
                ...(errorMessage != null ? [() => (
                    <Callout
                        status="danger"
                        title={errorMessage}

                    />
                )] : []),
                () => submitRow,
            ]}
        />
    )

    const formBody = (
        <>
            {resumable != null ? (
                // A learner who left mid-run almost always means to come back. Making
                // them scroll past a start button to find their own session is how one
                // run gets abandoned twice.
                <Callout
                    title={resumable.name}
                    description={`In progress · ${resumable.answered}/${resumable.total} questions`}
                    actionLabel="Continue"
                    onAction={resumable.onResume}

                />
            ) : null}

            {nameField}
            {lengthField}
            {levelField}
            {actionField}
        </>
    )

    return (
        <div>
            <SurfaceCard
                label={label}
                isSkeleton={isSkeleton}

                body={() => <StackV gap={6} isSkeleton={isSkeleton} items={[() => formBody]} />}
            />
        </div>
    )
}

export { QuizSetup }
