"use client"

import { KeyIcon } from "@phosphor-icons/react"
import React, {
    useCallback,
} from "react"
import {
    Button,
    Card,
    CardContent,
    FieldError,
    Input,
    Label,
    ListBox,
    Select,
    TextField,
    Typography,
} from "@heroui/react"
import {
    useTranslations,
} from "next-intl"
import {
    BYOK_PROVIDERS,
} from "../constants"
import { useQueryMyAiSettingsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyAiSettingsSwr"
import { useMutateUpdateMyAiSettingsSwr } from "@/hooks/swr/api/graphql/mutations/useMutateUpdateMyAiSettingsSwr"
import { useAiSettingsForm } from "@/hooks/zustand/aiSettings/useAiSettingsForm"
import { type AiSettingsSaveStatus } from "@/hooks/zustand/aiSettings/store"

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
    // masked hint of the stored key (paste-once; plaintext never returned)
    const byokKeyLast4 = settings?.byokKeyLast4 ?? null
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

    /** Wipe the stored BYOK key; the backend re-resolves the lane (premium/auto). */
    const onRemoveKey = useCallback(
        async () => {
            try {
                const result = await trigger({
                    clearByok: true,
                })
                const payload = result?.data?.updateMyAiSettings
                if (payload?.success) {
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
            setByokApiKey,
            setStatus,
            t,
        ],
    )

    return (
        <div className="flex flex-col gap-4">
            {hasByokKey ? (
                <Card>
                    <CardContent className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2">
                            <KeyIcon
                                aria-hidden
                                className="size-5 shrink-0 text-muted"
                            />
                            <div className="flex min-w-0 flex-col gap-0">
                                {/* masked key — never the plaintext; only the last 4 */}
                                <Typography type="body-sm" truncate>
                                    {byokKeyLast4 ? `••••••••${byokKeyLast4}` : t("aiSettings.byok.keyOnFile")}
                                </Typography>
                                <Typography type="body-xs" color="muted">
                                    {t("aiSettings.byok.keyOnFile")}
                                    {byokProviderOnFile ? ` · ${byokProviderOnFile}` : ""}
                                </Typography>
                            </div>
                        </div>
                        <Button
                            variant="danger"
                            size="sm"
                            isPending={isMutating}
                            onPress={onRemoveKey}
                        >
                            {t("aiSettings.byok.removeKey")}
                        </Button>
                    </CardContent>
                </Card>
            ) : null}

            <div className="flex flex-col gap-2">
                <Label>{t("aiSettings.byok.provider")}</Label>
                <Select.Root<{ id: string }, "single">
                    aria-label={t("aiSettings.byok.provider")}
                    selectedKey={byokProvider}
                    onSelectionChange={(key) => setByokProvider(String(key) as typeof byokProvider)}
                >
                    <Select.Trigger aria-label={t("aiSettings.byok.provider")} className="w-fit min-w-48">
                        <Select.Value>
                            {() => {
                                const found = BYOK_PROVIDERS.find(
                                    (provider) => provider.value === byokProvider,
                                )
                                return (
                                    <Typography type="body-sm">
                                        {found?.label ?? ""}
                                    </Typography>
                                )
                            }}
                        </Select.Value>
                        <Select.Indicator />
                    </Select.Trigger>
                    <Select.Popover>
                        <ListBox.Root aria-label={t("aiSettings.byok.provider")}>
                            {BYOK_PROVIDERS.map((provider) => (
                                <ListBox.Item
                                    key={provider.value}
                                    id={provider.value}
                                    textValue={provider.label}
                                >
                                    {provider.label}
                                </ListBox.Item>
                            ))}
                        </ListBox.Root>
                    </Select.Popover>
                </Select.Root>
            </div>

            <TextField variant="secondary">
                <Label htmlFor="byok-api-key">
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
