import React from "react"
import { type SkeletonProps } from "@/components/frames/_slot"
import {
    CheckCircleIcon,
    CloudArrowUpIcon,
    WarningCircleIcon,
} from "@phosphor-icons/react"
import { type IconComponent } from "@/components/atoms/buttons/Button"
import { InputText } from "@/components/atoms/forms/Input"
import { InlineIconLabel, type InlineIconLabelTone } from "@/components/composites/text/InlineIconLabel"
import { StackV } from "@/components/frames/Stack"
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
