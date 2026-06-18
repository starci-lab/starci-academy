"use client"

import { useCallback, useEffect, useRef } from "react"
import { useTranslations } from "next-intl"
import {
    AiMode,
    ModelProvider,
    type UpdateMyAiSettingsRequest,
} from "@/modules/api"
import {
    useQueryMyAiSettingsSwr,
    useMutateUpdateMyAiSettingsSwr,
} from "@/hooks/swr"
import { useAiSettingsStore } from "./store"

/**
 * Form hook for AI settings — state SHARED via {@link useAiSettingsStore} (4 components read/write).
 * Seeds lane/provider from the SWR snapshot (once, then respects user edits); submit runs the update
 * mutation, revalidates the snapshot, and sets a success/error status.
 * @returns values + setters + `submit`.
 */
export const useAiSettingsForm = () => {
    const t = useTranslations()
    const { data: settings, mutate } = useQueryMyAiSettingsSwr()
    const { trigger } = useMutateUpdateMyAiSettingsSwr()
    const mode = useAiSettingsStore((state) => state.mode)
    const byokProvider = useAiSettingsStore((state) => state.byokProvider)
    const byokApiKey = useAiSettingsStore((state) => state.byokApiKey)
    const status = useAiSettingsStore((state) => state.status)
    const setMode = useAiSettingsStore((state) => state.setMode)
    const setByokProvider = useAiSettingsStore((state) => state.setByokProvider)
    const setByokApiKey = useAiSettingsStore((state) => state.setByokApiKey)
    const setStatus = useAiSettingsStore((state) => state.setStatus)

    // Seed once from the server snapshot (replaces formik's enableReinitialize). The ref blocks
    // re-seeding after the user edits — avoids revalidation clobbering the in-progress selection.
    const seededRef = useRef(false)
    useEffect(() => {
        if (seededRef.current || !settings) {
            return
        }
        seededRef.current = true
        setMode(settings.preferredMode ?? settings.effectiveMode ?? AiMode.Auto)
        setByokProvider(settings.byokProvider ?? ModelProvider.OpenAI)
    }, [settings, setMode, setByokProvider])

    const submit = useCallback(async () => {
        // BYOK-only page: persist the key + provider. The lane is resolved by the
        // backend (natural order byok → premium → auto), so we never send `mode`.
        const request: UpdateMyAiSettingsRequest = {}
        if (byokApiKey.trim()) {
            request.byokProvider = byokProvider
            request.byokApiKey = byokApiKey.trim()
        }
        try {
            const result = await trigger(request)
            const payload = result?.data?.updateMyAiSettings
            if (payload?.success) {
                setByokApiKey("")
                await mutate()
                setStatus({ kind: "success", text: t("aiSettings.saved") })
            } else {
                setStatus({ kind: "error", text: payload?.message ?? t("aiSettings.error") })
            }
        } catch (error) {
            setStatus({ kind: "error", text: (error as Error)?.message ?? t("aiSettings.error") })
        }
    }, [byokProvider, byokApiKey, trigger, mutate, setByokApiKey, setStatus, t])

    return {
        mode,
        byokProvider,
        byokApiKey,
        status,
        setMode,
        setByokProvider,
        setByokApiKey,
        setStatus,
        submit,
    }
}
