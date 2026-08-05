import React from "react"
import { type SkeletonProps } from "@sb-components/frames/_slot"
import {
    CheckCircleIcon,
    CloudArrowUpIcon,
    CodeIcon,
    GearSixIcon,
    GitBranchIcon,
    PlayIcon,
    SparkleIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react"
import { Button, type IconComponent } from "@sb-components/atoms/buttons/Button/Button"
import { InputText } from "@sb-components/atoms/forms"
import { InlineIconLabel, type InlineIconLabelTone } from "@sb-components/composites/text/InlineIconLabel/InlineIconLabel"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"
import { type TaskSubmissionAutosaveStatus } from "../types"

/** Autosave state → its own icon/tone/wording. `idle` never renders (see file header). */
const AUTOSAVE_ICON: Record<Exclude<TaskSubmissionAutosaveStatus, "idle">, IconComponent> = {
    saving: CloudArrowUpIcon,
    saved: CheckCircleIcon,
    error: WarningCircleIcon,
}
const AUTOSAVE_TONE: Record<Exclude<TaskSubmissionAutosaveStatus, "idle">, InlineIconLabelTone> = {
    saving: "default",
    saved: "success",
    error: "danger",
}
const AUTOSAVE_LABEL: Record<Exclude<TaskSubmissionAutosaveStatus, "idle">, string> = {
    saving: "Saving…",
    saved: "Saved",
    error: "Couldn't save, try again",
}

/** Props for the local {@link GithubUrlField} leaf. */
interface GithubUrlFieldProps {
    githubUrl: string
    onGithubUrlChange: (value: string) => void
    urlError?: string
    autosaveStatus: TaskSubmissionAutosaveStatus
    isSkeleton: boolean
}

/**
 * The repo-URL field + its autosave line. One `StackV`: the field is a MARK
 * attached to its status line below (`gap={2}`), never two peers.
 */
export const GithubUrlField = ({
    githubUrl,
    onGithubUrlChange,
    urlError,
    autosaveStatus,
    isSkeleton,
}: GithubUrlFieldProps) => {
    const AutosaveIcon = autosaveStatus === "idle" ? null : AUTOSAVE_ICON[autosaveStatus]
    return (
        <StackV
            gap={2}
            isSkeleton={isSkeleton}

            items={[
                () => (
                    <InputText
                        label="Repo GitHub"
                        value={githubUrl}
                        onValueChange={onGithubUrlChange}
                        errorMessage={urlError}
                        placeholder="https://github.com/ten-nhom/du-an"
                        ariaLabel="URL repo GitHub"
                        isSkeleton={isSkeleton}

                    />
                ),
                ...(!isSkeleton && AutosaveIcon != null ? [({ isSkeleton }: SkeletonProps) => (
                    <InlineIconLabel
                        icon={AutosaveIcon}
                        tone={AUTOSAVE_TONE[autosaveStatus as Exclude<TaskSubmissionAutosaveStatus, "idle">]}
                        size="xs"
                        label={AUTOSAVE_LABEL[autosaveStatus as Exclude<TaskSubmissionAutosaveStatus, "idle">]}
                        isSkeleton={isSkeleton}
                    />
                )] : []),
            ]}
        />
    )
}
