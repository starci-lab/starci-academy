"use client"

import { Key as KeyIcon } from "@gravity-ui/icons"
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
    useTranslations,
} from "next-intl"
import {
    AiMode,
} from "@/modules/api"
import {
    useQueryMyAiSettingsSwr,
    useMutateUpdateMyAiSettingsSwr,
} from "@/hooks"
import {
    useAiSettingsForm,
    type AiSettingsSaveStatus,
} from "@/hooks/zustand"
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
    const {
        byokApiKey,
        byokProvider,
        setByokApiKey,
        setByokProvider,
        setMode,
        setStatus,
    } = useAiSettingsForm()
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
    const byokNeedsKey = !hasByokKey && !byokApiKey.trim()

    const onApiKeyChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            setByokApiKey(event.target.value)
        },
        [
            setByokApiKey,
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
                    setMode(AiMode.Auto)
                    setByokApiKey("")
                    await mutate()
                    setStatus({
                        kind: "success",
                        text: t("aiSettings.keyRemoved"),
                    } satisfies AiSettingsSaveStatus)
                } else {
                    setStatus({
                        kind: "error",
                        text: payload?.message ?? t("aiSettings.error"),
                    } satisfies AiSettingsSaveStatus)
                }
            } catch (error) {
                setStatus({
                    kind: "error",
                    text: (error as Error)?.message ?? t("aiSettings.error"),
                } satisfies AiSettingsSaveStatus)
            }
        },
        [
            trigger,
            mutate,
            setMode,
            setByokApiKey,
            setStatus,
            t,
        ],
    )

    return (
        <div className="rounded-3xl border border-accent/20 bg-accent/5 p-5">
            <div className="mb-3 text-sm font-semibold">{t("aiSettings.byok.heading")}</div>

            {hasByokKey ? (
                <div className="mb-4 flex items-center justify-between rounded-2xl border border-divider bg-background p-3">
                    <span className="flex items-center gap-1.5 text-sm text-muted">
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
            <div className="mt-2 flex flex-wrap gap-1.5">
                {BYOK_PROVIDERS.map((provider) => (
                    <Button
                        key={provider.value}
                        variant={byokProvider === provider.value ? "primary" : "secondary"}
                        size="sm"
                        onPress={() => setByokProvider(provider.value)}
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
                    value={byokApiKey}
                    onChange={onApiKeyChange}
                />
                <FieldError>{byokNeedsKey ? t("aiSettings.byok.keyHint") : ""}</FieldError>
            </TextField>
        </div>
    )
}
