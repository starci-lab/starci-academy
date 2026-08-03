"use client"

import React from "react"
import {
    Button,
    Card,
    CardContent,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    LockIcon,
} from "@phosphor-icons/react"
import {
    ProfileHero,
} from "../ProfileHero"
import { EmptyState } from "@/components/blocks/feedback/EmptyState"
import { pathConfig } from "@/resources/path"

/** Props for {@link ProfileLockedState}. */
export type ProfileLockedStateProps = Record<string, never>

/**
 * Shown when a non-owner views a profile whose owner has locked it: the public
 * identity hero stays visible (so recruiters still see who it is) but the tabbed
 * activity is withheld behind a "private profile" notice. The server also
 * withholds the tab data, so this is a presentation guard, not the security
 * boundary.
 *
 * @param props - {@link ProfileLockedStateProps}
 */
export const ProfileLockedState = (_props: ProfileLockedStateProps) => {
    const t = useTranslations()
    const router = useRouter()
    const locale = useLocale()

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 py-6">
            <ProfileHero />
            <Card>
                <CardContent>
                    <EmptyState
                        icon={<LockIcon aria-hidden focusable="false" className="size-8" />}
                        title={t("publicProfile.locked.title")}
                        description={t("publicProfile.locked.description")}
                        action={(
                            <Button
                                variant="primary"
                                onPress={() => router.push(pathConfig().locale(locale).course().build())}
                            >
                                {t("nav.courses")}
                            </Button>
                        )}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
