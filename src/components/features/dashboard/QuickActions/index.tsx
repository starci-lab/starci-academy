"use client"

import React, {
    useMemo,
} from "react"
import {
    Chip,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import Link from "next/link"
import {
    GraduationCapIcon,
    CardsIcon,
    CodeIcon,
    TrophyIcon,
    BookmarkIcon,
    GiftIcon,
    ArticleIcon,
    BriefcaseIcon,
    UsersThreeIcon,
} from "@phosphor-icons/react"
import {
    pathConfig,
} from "@/resources/path"
import { LabeledList } from "@/components/blocks/lists/LabeledList"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"
import { useAppSelector } from "@/redux/hooks"
import { useQueryMyRewardWalletSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyRewardWalletSwr"
import { useQueryMyDueFlashcardsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyDueFlashcardsSwr"

/** Props for {@link QuickActions}. */
export type QuickActionsProps = WithClassNames<undefined>

/**
 * Left-rail "quick access" list — one-tap shortcuts to the surfaces a learner
 * reaches for most (catalog, practice, bookmarks, own profile). Pure navigation;
 * self-reads the viewer's username from redux for the profile-scoped links. Rows
 * are flush-left (aligned with the heading + the identity stats above), not the
 * indented HeroUI ListBox. `"use client"` for the redux read.
 * @param props - optional className for the root element.
 */
export const QuickActions = ({
    className,
}: QuickActionsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const username = useAppSelector((state) => state.user.user?.username)
    // spendable reward balance — surfaced as a chip on the rewards shortcut
    const { data: wallet } = useQueryMyRewardWalletSwr()
    // due-card count — a live "N due" nudge on the review shortcut
    const { data: dueFlashcards } = useQueryMyDueFlashcardsSwr()
    const dueCount = dueFlashcards?.dueCount ?? 0

    /** The shortcut rows (icon + label + destination), ordered by everyday frequency. */
    const actions = useMemo(
        () => [
            {
                key: "courses",
                Icon: GraduationCapIcon,
                href: pathConfig().locale(locale).course().build(),
            },
            {
                key: "review",
                Icon: CardsIcon,
                href: pathConfig().locale(locale).review().build(),
            },
            {
                key: "practice",
                Icon: CodeIcon,
                href: pathConfig().locale(locale).practice().build(),
            },
            {
                key: "league",
                Icon: TrophyIcon,
                href: pathConfig().locale(locale).league().build(),
            },
            {
                key: "bookmarks",
                Icon: BookmarkIcon,
                // bookmarks live under the viewer's own profile
                href: username
                    ? pathConfig().locale(locale).profile(username).bookmarks().build()
                    : pathConfig().locale(locale).course().build(),
            },
            {
                key: "rewards",
                Icon: GiftIcon,
                href: pathConfig().locale(locale).rewards().build(),
            },
            {
                key: "blog",
                Icon: ArticleIcon,
                href: pathConfig().locale(locale).blog().build(),
            },
            {
                key: "talents",
                Icon: UsersThreeIcon,
                href: pathConfig().locale(locale).talents().build(),
            },
            {
                key: "jobs",
                Icon: BriefcaseIcon,
                href: pathConfig().locale(locale).jobs().build(),
            },
        ],
        [
            locale,
            username,
        ],
    )

    return (
        <LabeledList className={className} label={t("dashboard.quickActions")}>
            {actions.map(({
                key,
                Icon,
                href,
            }) => (
                <Link
                    key={key}
                    href={href}
                    className="group flex w-full items-center gap-3 py-2 text-left"
                >
                    <Icon aria-hidden focusable="false" className="size-5 shrink-0 text-muted" />
                    <span className="truncate text-sm transition-colors group-hover:text-foreground group-hover:underline">
                        {t(`dashboard.actions.${key}`)}
                    </span>
                    {key === "rewards" && wallet ? (
                        <Chip className="ml-auto" size="sm" variant="soft" color="warning">
                            <Chip.Label>
                                {t("dashboard.rewardBalance", { count: wallet.balance })}
                            </Chip.Label>
                        </Chip>
                    ) : null}
                    {key === "review" && dueCount > 0 ? (
                        <Chip className="ml-auto" size="sm" variant="soft" color="accent">
                            <Chip.Label>
                                {t("dashboard.dueCount", { count: dueCount })}
                            </Chip.Label>
                        </Chip>
                    ) : null}
                </Link>
            ))}
        </LabeledList>
    )
}
