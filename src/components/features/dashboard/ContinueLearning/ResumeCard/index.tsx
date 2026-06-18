"use client"

import React, {
    useCallback,
    useState,
} from "react"
import {
    cn,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    ChevronRight as CaretRightIcon,
    CircleQuestion as ChallengeIcon,
    BookOpen as LessonIcon,
} from "@gravity-ui/icons"
import {
    queryResolveRoute,
} from "@/modules/api"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

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
 * A single clickable "continue" card. Resolves the entity's canonical route via
 * the index on click (the dashboard has no course context), then navigates — the
 * whole card is the hit target, so nothing is nested inside another button.
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

    const ChipIcon = item.kind === "challenge" ? ChallengeIcon : LessonIcon

    return (
        <button
            type="button"
            disabled={pending}
            onClick={onPress}
            className={cn(
                "card card--default flex h-full flex-col items-start gap-3 border border-divider/60 text-left transition-colors hover:bg-accent/5 disabled:opacity-60",
                className,
            )}
        >
            {/* kind icon */}
            <ChipIcon className="size-5 shrink-0 text-muted" />
            {/* title + kind label */}
            <div className="flex w-full min-w-0 flex-1 flex-col gap-0">
                <span className="truncate text-sm font-semibold text-foreground">
                    {item.label}
                </span>
                <span className="text-xs text-muted">
                    {t(`dashboard.continueKind.${item.kind}`)}
                </span>
            </div>
            {/* continue affordance */}
            <span className="flex items-center gap-1.5 text-sm font-medium text-muted">
                {t("dashboard.continue")}
                <CaretRightIcon className="size-5" />
            </span>
        </button>
    )
}
