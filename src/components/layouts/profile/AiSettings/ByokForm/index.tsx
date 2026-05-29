"use client"

import React, {
    useCallback,
} from "react"
import {
    Button,
    FieldError,
    Input,
    Label,
    TextField,
} from "@heroui/react"
import {
    KeyIcon,
} from "@phosphor-icons/react"
import {
    useTranslations,
} from "next-intl"
import {
    AiMode,
} from "@/modules/api"
import {
    useAiSettingsFormik,
    useQueryMyAiSettingsSwr,
    useMutateUpdateMyAiSettingsSwr,
    type AiSettingsSaveStatus,
} from "@/hooks/singleton"
import {
    BYOK_PROVIDERS,
} from "../constants"

/**
 * BYOK panel — stored-key hint + provider picker + API key input.
 *
 * Reads form state from the AI settings formik singleton and eligibility from
 * the SWR singleton; owns the "remove key" action (its own mutation call +
 * status), so it takes no props. Only mounted while the BYOK lane is selected.
 */
export const ByokForm = () => {
    const t = useTranslations()
    const formik = useAiSettingsFormik()
    const {
        data: settings,
        mutate,
    } = useQueryMyAiSettingsSwr()
    const {
        trigger,
        isMutating,
    } = useMutateUpdateMyAiSettingsSwr()

    const hasByokKey = settings?.hasByokKey ?? false
    const byokProviderOnFile = settings?.byokProvider ?? null
    // the BYOK lane needs a stored key or a freshly typed one
    const byokNeedsKey = !hasByokKey && !formik.values.byokApiKey.trim()

    const onApiKeyChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            formik.setFieldValue("byokApiKey", event.target.value)
        },
        [
            formik,
        ],
    )

    /** Wipe the stored BYOK key and fall back to the Auto lane. */
    const onRemoveKey = useCallback(
        async () => {
            try {
                const result = await trigger({
                    mode: AiMode.Auto,
                    clearByok: true,
                })
                const payload = result?.data?.updateMyAiSettings
                if (payload?.success) {
                    formik.setFieldValue("mode", AiMode.Auto)
                    formik.setFieldValue("byokApiKey", "")
                    await mutate()
                    formik.setStatus({
                        kind: "success",
                        text: t("aiSettings.keyRemoved"),
                    } satisfies AiSettingsSaveStatus)
                } else {
                    formik.setStatus({
                        kind: "error",
                        text: payload?.message ?? t("aiSettings.error"),
                    } satisfies AiSettingsSaveStatus)
                }
            } catch (error) {
                formik.setStatus({
                    kind: "error",
                    text: (error as Error)?.message ?? t("aiSettings.error"),
                } satisfies AiSettingsSaveStatus)
            }
        },
        [
            trigger,
            mutate,
            formik,
            t,
        ],
    )

    return (
        <div className="rounded-3xl border border-accent/20 bg-accent/5 p-5">
            <div className="mb-3 text-sm font-semibold">{t("aiSettings.byok.heading")}</div>

            {hasByokKey ? (
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-divider bg-background p-3">
                    <span className="flex items-center gap-2 text-sm text-muted">
                        <KeyIcon className="size-4" />
                        {t("aiSettings.byok.keyOnFile")}
                        {byokProviderOnFile ? ` (${byokProviderOnFile})` : ""}
                    </span>
                    <Button
                        variant="danger"
                        size="sm"
                        isPending={isMutating}
                        onPress={onRemoveKey}
                    >
                        {t("aiSettings.byok.removeKey")}
                    </Button>
                </div>
            ) : null}

            <Label className="text-sm">{t("aiSettings.byok.provider")}</Label>
            <div className="mt-2 flex flex-wrap gap-2">
                {BYOK_PROVIDERS.map((provider) => (
                    <Button
                        key={provider.value}
                        variant={formik.values.byokProvider === provider.value ? "primary" : "secondary"}
                        size="sm"
                        onPress={() => formik.setFieldValue("byokProvider", provider.value)}
                    >
                        {provider.label}
                    </Button>
                ))}
            </div>

            <div className="h-4" />

            <TextField>
                <Label
                    htmlFor="byok-api-key"
                    className="text-sm"
                >
                    {t("aiSettings.byok.apiKey")}
                </Label>
                <Input
                    id="byok-api-key"
                    variant="secondary"
                    type="password"
                    placeholder={
                        hasByokKey
                            ? t("aiSettings.byok.apiKeyPlaceholderReplace")
                            : t("aiSettings.byok.apiKeyPlaceholder")
                    }
                    value={formik.values.byokApiKey}
                    onChange={onApiKeyChange}
                />
                <FieldError>{byokNeedsKey ? t("aiSettings.byok.keyHint") : ""}</FieldError>
            </TextField>
        </div>
    )
}
