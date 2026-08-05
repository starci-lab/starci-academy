import React from "react"
import { InputPassword, InputText, SelectSingle } from "@sb-components/atoms/forms"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { DEFAULT_TOKEN_HINT, type GithubGradingSettingsFormProps } from "../types"

/** Props for the local {@link GithubGradingSettingsBody} leaf. */
interface GithubGradingSettingsBodyProps {
    form: GithubGradingSettingsFormProps
}

/** The `GithubGradingSettings` form body: language / branch / token, mounted inside {@link DrawerShell}. */
export const GithubGradingSettingsBody = ({ form }: GithubGradingSettingsBodyProps) => (
    <StackV
        gap={4}

        items={[
            () => (
                <SelectSingle
                    label="Grading language"
                    options={form.languageOptions}
                    value={form.language}
                    onValueChange={form.onLanguageChange}

                />
            ),
            () => (
                <InputText
                    label="Branch"
                    value={form.branch}
                    onValueChange={form.onBranchChange}
                    placeholder="main"

                />
            ),
            () => (
                <InputPassword
                    label="GitHub token"
                    value={form.token}
                    onValueChange={form.onTokenChange}
                    hint={form.tokenHint ?? DEFAULT_TOKEN_HINT}
                    placeholder="ghp_…"
                    revealLabel="Show token"
                    hideLabel="Hide token"
                />
            ),
        ]}
    />
)
