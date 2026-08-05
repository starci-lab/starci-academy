"use client"

import React from "react"
import { Button } from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { ErrorPageState } from "@/components/blocks/feedback/ErrorPageState"
import { pathConfig } from "@/resources/path"

/** Props for {@link ProfileNotFoundState}. */
export type ProfileNotFoundStateProps = WithClassNames<undefined>

/**
 * 404-style page shown when the requested profile cannot be read — not found,
 * soft-deleted, or a failed fetch. Shares the app-wide {@link ErrorPageState}
 * shell (large "404" numeral + title/description + a way home) with the global
 * not-found / error pages, but carries the profile-specific copy.
 *
 * @param props - {@link ProfileNotFoundStateProps}
 */
export const ProfileNotFoundState = ({
    className,
}: ProfileNotFoundStateProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()

    return (
        <ErrorPageState
            className={className}
            code="404"
            title={t("publicProfile.notFound")}
            description={t("publicProfile.notFoundDescription")}
            actions={(
                <Button
                    variant="primary"
                    onPress={() => router.push(pathConfig().locale(locale).build())}
                >
                    {t("nav.home")}
                </Button>
            )}
        />
    )
}
