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
import {
    PuzzlePieceIcon,
    BookOpenIcon,
} from "@phosphor-icons/react"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { queryResolveRoute } from "@/modules/api/graphql/queries/query-resolve-route"
import { ContinueCard } from "@/components/blocks/cards/ContinueCard"

/** Kind of resume target — drives the chip icon + label. */
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
export interface ResumeCardProps extends WithClassNames<undefined> {
    /** The resume target rendered by this card. */
    item: ResumeItem
}

/**
 * A "continue" card — thin wrapper over the canonical {@link ContinueCard}
 * block. Resolves the entity's canonical route via the index on press, then
 * navigates. No BE progress field is available for either kind yet, so the
 * progress meter is hidden (never fabricate a number).
 * @param props - the resume target
 */
export const ResumeCard = ({
    className,
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

    const ChipIcon = item.kind === "challenge" ? PuzzlePieceIcon : BookOpenIcon

    return (
        <ContinueCard
            className={className}
            variant="item"
            icon={<ChipIcon weight="fill" />}
            title={item.label}
            subtitle={t(`dashboard.continueKind.${item.kind}`)}
            ctaLabel={t("dashboard.continue")}
            onPress={onPress}
        />
    )
}
