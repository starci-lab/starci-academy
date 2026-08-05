"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import { queryResolveRoute } from "@/modules/api/graphql/queries/query-resolve-route"
import { _ResumeCard } from "./component"

/** Kind of resume target — drives the subtitle label. */
export type ResumeKind = "challenge" | "lesson"

/** One "pick up where you left off" card item. */
export interface ResumeItem {
    /** Opaque global id — resolved to a route on click. */
    globalId: string
    /** Title to show. */
    label: string
    /** Challenge vs lesson (chip styling). */
    kind: ResumeKind
}

/** Props for {@link ResumeCard}. */
export interface ResumeCardProps {
    /** The resume target rendered by this card. */
    item: ResumeItem
}

/**
 * `ResumeCard` — the CONNECTED half (see `tiers/split.md`): resolves the entity's
 * canonical route via the index on press, then navigates, and hands the
 * already-translated text to the presentational {@link _ResumeCard}. No BE progress
 * field is available for either kind yet, so the progress meter is hidden (never
 * fabricate a number).
 * @param props - {@link ResumeCardProps}
 */
export const ResumeCard = ({
    item,
}: ResumeCardProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const [pending, setPending] = useState(false)

    /** Resolve this entity's route, then push to it. */
    const onPress = useCallback(
        async () => {
            if (pending) {
                return
            }
            setPending(true)
            try {
                const response = await queryResolveRoute({
                    request: {
                        globalId: item.globalId,
                    },
                })
                const path = response.data?.resolveRoute?.data?.path
                if (path) {
                    router.push(`/${locale}${path}`)
                }
            } finally {
                setPending(false)
            }
        },
        [
            item.globalId,
            locale,
            pending,
            router,
        ],
    )

    return (
        <_ResumeCard
            title={item.label}
            subtitle={t(`DashboardPage.continueKind.${item.kind}`)}
            ctaLabel={t("DashboardPage.continue")}
            onPress={onPress}
        />
    )
}
