import React from "react"
import { InputPassword, InputText } from "@/components/atoms/forms/Input"
import { SelectSingle } from "@/components/atoms/forms/Select"
import { StackV } from "@/components/frames/Stack"
import { type GithubGradingSettingsFormProps, type TaskSubmissionPanelLabels } from "../types"

/** Props for the local {@link GithubGradingSettingsBody} leaf. */
interface GithubGradingSettingsBodyProps {
    form: GithubGradingSettingsFormProps
    labels: TaskSubmissionPanelLabels
}

/** The `GithubGradingSettings` form body: language / branch / token, mounted inside {@link DrawerShell}. */
export const GithubGradingSettingsBody = ({ form, labels }: GithubGradingSettingsBodyProps) => (
    <StackV
        gap={4}

        items={[
            () => (
                <SelectSingle
                    label={labels.languageLabel}
                    options={form.languageOptions}
                    value={form.language}
                    onValueChange={form.onLanguageChange}

                />
            ),
            () => (
                <InputText
                    label={labels.branchLabel}
                    value={form.branch}
                    onValueChange={form.onBranchChange}
                    placeholder={labels.branchPlaceholder}

                />
            ),
            () => (
                <InputPassword
                    label={labels.tokenLabel}
                    value={form.token}
                    onValueChange={form.onTokenChange}
                    hint={form.tokenHint ?? labels.tokenHintDefault}
                    placeholder="ghp_…"
                    revealLabel={labels.tokenRevealLabel}
                    hideLabel={labels.tokenHideLabel}

                />
            ),
        ]}
    />
)
