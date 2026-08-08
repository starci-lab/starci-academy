import React from "react"
import { WarningCircleIcon } from "@phosphor-icons/react"
import { Typography } from "@/components/atoms/text/Typography"
import { Button } from "@/components/atoms/buttons/Button"
import { StackV } from "@/components/frames/Stack"

/** Props for {@link _GradeCreditCaption} — presentational; the caption text already resolved. */
export interface GradeCreditCaptionProps {
    /**
     * `null`/`undefined` while `creditUsage` hasn't landed yet → the caption
     * renders NOTHING (mirrors the connected half's own "no snapshot" branch).
     */
    text: string | null | undefined
    /** `true` → render the danger/warning styling (quota reached). */
    blocked: boolean
    /** Optional press → open the AI-quota details modal (makes the caption interactive). */
    onOpenDetails?: () => void
}

/**
 * The ONE shared "N/M credits left this week" caption for every AI surface, sitting
 * directly under (or beside) the model picker. Shows a muted line normally, or a
 * `danger` warning line (with icon) when the pool can't afford the next AUTO run.
 * The connected half decides `text`/`blocked` from `myAiQuota`.
 *
 * @param props - {@link GradeCreditCaptionProps}
 */
export const _GradeCreditCaption = ({
    text,
    blocked,
    onOpenDetails,
}: GradeCreditCaptionProps) => {
    if (text == null) {
        return null
    }

    if (onOpenDetails) {
        // Interactive path — house Button is the sole root. CallerIdentity held
        // until atoms accept it (CourseTrialChip pattern).
        return (
            <Button
                variant="tertiary"
                size="sm"
                label={text}
                prefixIcon={blocked ? WarningCircleIcon : undefined}
                onPress={onOpenDetails}
            />
        )
    }

    return (
        <StackV
            identity={{ tier: "block", component: "GradeCreditCaption" }}
            principle="label-field"
            explain="Caption under the model picker — not title-subtitle, because this line labels the credit state of the control above rather than continuing a title."
            items={[
                () => (
                    <Typography
                        size="sm"
                        weight={blocked ? "medium" : undefined}
                        color={blocked ? "danger" : "muted"}
                        prefixIcon={blocked ? WarningCircleIcon : undefined}
                        text={text}
                    />
                ),
            ]}
        />
    )
}
