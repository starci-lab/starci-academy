"use client"

import React, {
    useCallback,
} from "react"
import {
    Breadcrumbs,
    Button,
    Spinner,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    useQueryMyAiSettingsSwr,
    useMutateUpdateMyAiSettingsSwr,
} from "@/hooks"
import {
    useAiSettingsForm,
} from "@/hooks/zustand"
import {
    AiMode,
} from "@/modules/api"
import {
    pathConfig,
} from "@/resources"
import {
    SubPageHeader,
} from "@/components/reuseable"
import {
    EffectiveLane,
} from "./EffectiveLane"
import {
    LaneSelector,
} from "./LaneSelector"
import {
    ByokForm,
} from "./ByokForm"
import {
    StatusLine,
} from "./StatusLine"
import {
    AiSettingsSkeleton,
} from "./AiSettingsSkeleton"

/**
 * AI settings feature container.
 *
 * Thin orchestrator: owns the page chrome (breadcrumb + header) and the loading
 * gate, then renders propless children that read the SWR + formik singletons
 * themselves. Mounted by the `/profile/ai-settings` route.
 */
export const AiSettings = () => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()
    const {
        data: settings,
        isLoading,
        error,
    } = useQueryMyAiSettingsSwr()
    const { isMutating } = useMutateUpdateMyAiSettingsSwr()
    const { mode, byokApiKey, submit } = useAiSettingsForm()

    /** Navigate to the home page (breadcrumb root). */
    const onNavigateHome = useCallback(
        () => router.push(pathConfig().locale().build()),
        [
            router,
        ],
    )
    /** Navigate to the profile page (breadcrumb parent + back target). */
    const onNavigateProfile = useCallback(
        () => router.push(pathConfig().locale(locale).profile().build()),
        [
            router,
            locale,
        ],
    )

    // gate only the data-dependent content; breadcrumb + header are static
    // chrome (i18n/router only) so they render immediately, outside the gate.
    // isValidating is intentionally excluded — background revalidate keeps the
    // existing content instead of flashing back to the skeleton
    const ready = !isLoading && !!settings && !error

    // BYOK lane can only be saved with a stored key or a freshly typed one
    const byokNeedsKey =
        mode === AiMode.Byok
        && !settings?.hasByokKey
        && !byokApiKey.trim()
    const saveDisabled = isMutating || byokNeedsKey

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-6 p-6">
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateProfile}>
                    {t("nav.profile")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    <span>{t("aiSettings.title")}</span>
                </Breadcrumbs.Item>
            </Breadcrumbs>
            <SubPageHeader
                title={t("aiSettings.title")}
                description={t("aiSettings.subtitle")}
                onBack={onNavigateProfile}
            />
            {ready ? (
                <>
                    <EffectiveLane />
                    <LaneSelector />
                    {mode === AiMode.Byok ? <ByokForm /> : null}
                    <StatusLine />
                    <Button
                        variant="primary"
                        fullWidth
                        isDisabled={saveDisabled}
                        isPending={isMutating}
                        onPress={submit}
                    >
                        {({ isPending }) => (
                            <>
                                {isPending ? (
                                    <Spinner
                                        color="current"
                                        size="sm"
                                    />
                                ) : null}
                                {t("aiSettings.save")}
                            </>
                        )}
                    </Button>
                </>
            ) : (
                <AiSettingsSkeleton />
            )}
        </div>
    )
}
