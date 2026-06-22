"use client"

import React, {
    useCallback,
} from "react"
import {
    Breadcrumbs,
    Button,
    Link,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    Typography,
} from "@heroui/react"
import {
    useQueryMyAiSettingsSwr,
    useMutateUpdateMyAiSettingsSwr,
} from "@/hooks"
import {
    useAiSettingsForm,
} from "@/hooks/zustand"
import {
    pathConfig,
} from "@/resources"
import {
    PageHeader,
} from "@/components/blocks"
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
 * The page does ONE thing: manage the user's own API key (BYOK). The active AI
 * lane (auto / premium / byok) is resolved by the backend from tier + key in a
 * fixed natural order, so there is no lane selector here — only a read-only
 * "currently using" chip plus the BYOK form. Owns the page chrome + loading
 * gate; children read the SWR + zustand singletons themselves. Mounted by the
 * `/profile/ai-settings` route.
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
    const { byokApiKey, submit } = useAiSettingsForm()

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
    /** Navigate to the settings root (breadcrumb parent of every settings page). */
    const onNavigateSettings = useCallback(
        () => router.push(pathConfig().locale(locale).profile().settings().build()),
        [
            router,
            locale,
        ],
    )
    /** Navigate to the AI subscription page (cross-link for paid models). */
    const onNavigateSubscription = useCallback(
        () => router.push(`${pathConfig().locale(locale).profile().build()}/ai-subscription`),
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

    // saving needs a stored key or a freshly typed one (nothing else to persist)
    const byokNeedsKey = !settings?.hasByokKey && !byokApiKey.trim()
    const saveDisabled = isMutating || byokNeedsKey

    return (
        <div className="flex flex-col gap-6">
            <Breadcrumbs>
                <Breadcrumbs.Item onPress={onNavigateHome}>
                    {t("nav.home")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateProfile}>
                    {t("nav.profile")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item onPress={onNavigateSettings}>
                    {t("nav.settings")}
                </Breadcrumbs.Item>
                <Breadcrumbs.Item>
                    {t("aiSettings.title")}
                </Breadcrumbs.Item>
            </Breadcrumbs>
            <PageHeader
                title={t("aiSettings.title")}
                description={t("aiSettings.byokSubtitle")}
            />
            {ready ? (
                <>
                    <ByokForm />
                    <StatusLine />
                    <Button
                        variant="primary"
                        className="self-start"
                        isDisabled={saveDisabled}
                        isPending={isMutating}
                        onPress={submit}
                    >
                        {t("aiSettings.save")}
                    </Button>
                    <div className="flex flex-wrap items-center gap-2">
                        <Typography type="body-sm" color="muted">
                            {t("aiSettings.byok.upsellPrompt")}
                        </Typography>
                        <Link onPress={onNavigateSubscription}>
                            {t("aiSettings.byok.upsellCta")}
                        </Link>
                    </div>
                </>
            ) : (
                <AiSettingsSkeleton />
            )}
        </div>
    )
}
