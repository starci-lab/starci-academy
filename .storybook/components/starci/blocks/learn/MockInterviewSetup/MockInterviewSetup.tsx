import React from "react"
import { FlowArrowIcon, PlayIcon } from "@phosphor-icons/react"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { InputText } from "@sb-components/atoms/forms/Input/Input"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ButtonRadioGroup } from "@sb-components/composites/buttons/ButtonRadioGroup/ButtonRadioGroup"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `MockInterviewSetup` — the green-room card: who is interviewing, a name for the run, a
 * difficulty tier, and the button(s) that start it. Sibling of `QuizSetup` (resumable
 * banner leads, form body, action row trailing).
 *
 * Two start buttons are two different interviews — Q&A always, plus a Design round only
 * when `isDesignAvailable`; availability is the caller's to pass, never guessed from the
 * course kind. A resumable run leads the card above the form. Persona identity is
 * `Avatar` + `Typography` (not `UserCell`, whose second line is a handle, not a role).
 *
 * One leaf this pass (identity + tier + name + start); the "Customize" deep-config
 * disclosure is a deferred second leaf and is not composed here. The error sits next to
 * the action row.
 */

/** How hard the interviewer's questions run. The block owns the label (§14d.1). */
export type MockInterviewTier = "junior" | "mid" | "senior"

const TIER_LABEL: Record<MockInterviewTier, string> = {
    junior: "Junior",
    mid: "Mid-level",
    senior: "Senior",
}

/** Which start action is in flight, so the busy affordance lands on the right button. */
export type MockInterviewStartMode = "qna" | "design"

/** The interviewer greeting the candidate. */
export interface MockInterviewPersona {
    /** Interviewer's display name. */
    name: string
    /** Role line under the name, e.g. "Senior Backend @ a digital bank" — NOT a handle. */
    role: string
    /** Uploaded avatar URL. Absent → `Avatar`'s own generated/initials fallback. */
    avatarSrc?: string
}

/** A run the candidate left unfinished. */
export interface MockInterviewResumable {
    /** What the run was called when it was started. */
    name: string
    /** Where the run left off, already worded by the caller — e.g. "Left off at question 3". */
    progressLabel: string
    /** Fired when the candidate picks the run back up. */
    onResume: () => void
}

/** Props for {@link MockInterviewSetup}. */
export interface MockInterviewSetupProps {
    /** Section label, localized by the caller — e.g. "Prepare for the interview". */
    label: string
    /** The interviewer greeting the candidate. */
    persona: MockInterviewPersona
    /** Current run name. */
    sessionName: string
    /** Fired as the candidate types a name. */
    onSessionNameChange: (value: string) => void
    /** Chosen difficulty. */
    tier: MockInterviewTier
    /** Fired when the candidate picks a tier. */
    onTierChange: (tier: MockInterviewTier) => void
    /**
     * `true` → this is a System-Design course, so the Design-mode start button
     * renders beside the Q&A one. The CALLER decides this (course kind lives on
     * the screen); the block never infers it.
     */
    isDesignAvailable: boolean
    /** Fired when the candidate starts the Q&A round. Always available. */
    onStartQna: () => void
    /** Fired when the candidate starts the Design round. Required once `isDesignAvailable` is set. */
    onStartDesign?: () => void
    /** A run left unfinished. Present → the resume banner leads the card. */
    resumable?: MockInterviewResumable
    /** Which start action is currently in flight — drives which button shows its own spinner. */
    startingMode?: MockInterviewStartMode
    /** `true` → a start is in flight; both start buttons lock while one of them runs. */
    isPending?: boolean
    /** Set → the last start attempt failed. Reported beside the action row that failed. */
    errorMessage?: string
    /** `true` → the card draws its own mirror while the setup data loads. */
    isSkeleton?: boolean
}

/**
 * The interview green-room card. See the file header for the full contract.
 *
 * @param props - {@link MockInterviewSetupProps}
 */
const MockInterviewSetup = ({
    label,
    persona,
    sessionName,
    onSessionNameChange,
    tier,
    onTierChange,
    isDesignAvailable,
    onStartQna,
    onStartDesign,
    resumable,
    startingMode,
    isPending = false,
    errorMessage,
    isSkeleton = false,
}: MockInterviewSetupProps) => {
    const showDesignStart = isDesignAvailable && onStartDesign != null

    // A candidate who left mid-interview almost always means to come back.
    // Making them scroll past a start button to find their own session is
    // how a run gets abandoned twice — same reasoning as `QuizSetup`.
    const resumeBanner = resumable != null ? (
        <Callout
            title={resumable.name}
            description={resumable.progressLabel}
            actionLabel="Continue"
            onAction={resumable.onResume}

        />
    ) : null

    const personaDetails = (
        <>
            <Typography
                size="sm"
                weight="medium"
                isSkeleton={isSkeleton}
                text={persona.name}

            />
            <Typography
                size="xs"
                color="muted"
                isSkeleton={isSkeleton}
                text={persona.role}

            />
        </>
    )

    // Interviewer identity — built from Avatar + Typography directly (not
    // `UserCell`): the second line is a ROLE, not an `@handle`.
    const identityRow = (
        <StackH
            gap={3}

            body={
                <>
                    <div>
                        <Avatar
                            name={persona.name}
                            src={persona.avatarSrc}
                            seed={persona.name}
                            size="md"
                            isSkeleton={isSkeleton}

                        />
                    </div>
                    <StackV gap={1} body={personaDetails} />
                </>
            }
        />
    )

    const sessionNameField = (
        <StackV
            gap={3}

            body={
                <>
                    <Typography size="sm" weight="medium" text="Session name" />
                    <InputText
                        value={sessionName}
                        onValueChange={onSessionNameChange}
                        placeholder="e.g. Round 1 - Backend"
                        ariaLabel="Session name"
                        isSkeleton={isSkeleton}

                    />
                </>
            }
        />
    )

    const tierField = (
        <StackV
            gap={3}

            body={
                <>
                    <Typography size="sm" weight="medium" text="Level" />
                    <ButtonRadioGroup
                        ariaLabel="Interview level"
                        value={tier}
                        onChange={onTierChange}

                        items={(Object.keys(TIER_LABEL) as Array<MockInterviewTier>).map((key) => ({
                            value: key,
                            content: TIER_LABEL[key],
                        }))}
                    />
                </>
            }
        />
    )

    const actionsRow = (
        <StackH
            gap={3}
            justify="end"

            body={
                <>
                    {showDesignStart ? (
                        <Button
                            label="Start Design"
                            variant="secondary"
                            prefixIcon={FlowArrowIcon}
                            onPress={onStartDesign}
                            isPending={isPending && startingMode === "design"}
                            isDisabled={isPending && startingMode !== "design"}

                        />
                    ) : null}
                    <Button
                        label="Start Q&A"
                        variant="primary"
                        prefixIcon={PlayIcon}
                        onPress={onStartQna}
                        isPending={isPending && startingMode === "qna"}
                        isDisabled={isPending && startingMode !== "qna"}

                    />
                </>
            }
        />
    )

    // The error sits WITH the action row that failed. At the top of the
    // card it would read as a problem with the whole form.
    const footer = (
        <StackV
            gap={3}

            body={
                <>
                    {errorMessage != null ? (
                        <Callout
                            status="danger"
                            title={errorMessage}

                        />
                    ) : null}
                    {actionsRow}
                </>
            }
        />
    )

    const setupBody = (
        <>
            {resumeBanner}
            {identityRow}
            {sessionNameField}
            {tierField}
            {footer}
        </>
    )

    return (
        <div>
            <SurfaceCard
                label={label}
                isSkeleton={isSkeleton}

                body={() => <StackV gap={6} body={setupBody} />}
            />
        </div>
    )
}

export { MockInterviewSetup }
