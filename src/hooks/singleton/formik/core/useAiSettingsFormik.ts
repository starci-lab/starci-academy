import { useFormik } from "formik"
import { useTranslations } from "next-intl"
import {
    AiMode,
    ModelProvider,
    type UpdateMyAiSettingsRequest,
} from "@/modules/api"
import {
    useQueryMyAiSettingsSwr,
    useMutateUpdateMyAiSettingsSwr,
} from "../../swr"

/** Form values for the AI settings (lane preference + BYOK credentials). */
export interface AiSettingsFormikValues {
    /** The lane the user prefers (Auto / Premium / Byok). */
    mode: AiMode
    /** BYOK provider picked in the form. */
    byokProvider: ModelProvider
    /** New BYOK API key typed in the form (never the stored one). */
    byokApiKey: string
}

/** Inline status surfaced by {@link useAiSettingsFormikCore} after an action. */
export interface AiSettingsSaveStatus {
    /** Whether the last action succeeded or failed. */
    kind: "success" | "error"
    /** Already-translated message to display. */
    text: string
}

/**
 * Singleton Formik for the AI settings page.
 *
 * Holds the lane preference + BYOK fields, seeds them from the SWR snapshot
 * (`enableReinitialize`), and on submit runs the update mutation, revalidates
 * the snapshot, and reports a success/error message via `formik.status`. The
 * secondary "remove key" action is owned by the BYOK panel itself, which reads
 * the same singletons.
 */
export const useAiSettingsFormikCore = () => {
    const t = useTranslations()
    const {
        data: settings,
        mutate,
    } = useQueryMyAiSettingsSwr()
    const { trigger } = useMutateUpdateMyAiSettingsSwr()

    const formik = useFormik<AiSettingsFormikValues>({
        // seed from the server snapshot; reinitialize when it changes so the
        // form mirrors the persisted preference
        initialValues: {
            mode: settings?.preferredMode ?? settings?.effectiveMode ?? AiMode.Auto,
            byokProvider: settings?.byokProvider ?? ModelProvider.OpenAI,
            byokApiKey: "",
        },
        enableReinitialize: true,
        onSubmit: async (values, helpers) => {
            // attach a key only when the user typed one on the byok lane
            const request: UpdateMyAiSettingsRequest = {
                mode: values.mode,
            }
            if (values.mode === AiMode.Byok && values.byokApiKey.trim()) {
                request.byokProvider = values.byokProvider
                request.byokApiKey = values.byokApiKey.trim()
            }
            try {
                const result = await trigger(request)
                const payload = result?.data?.updateMyAiSettings
                if (payload?.success) {
                    // drop the typed key from the form and refresh the snapshot
                    helpers.setFieldValue("byokApiKey", "")
                    await mutate()
                    helpers.setStatus({
                        kind: "success",
                        text: t("aiSettings.saved"),
                    } satisfies AiSettingsSaveStatus)
                } else {
                    helpers.setStatus({
                        kind: "error",
                        text: payload?.message ?? t("aiSettings.error"),
                    } satisfies AiSettingsSaveStatus)
                }
            } catch (error) {
                helpers.setStatus({
                    kind: "error",
                    text: (error as Error)?.message ?? t("aiSettings.error"),
                } satisfies AiSettingsSaveStatus)
            }
        },
    })

    return formik
}
