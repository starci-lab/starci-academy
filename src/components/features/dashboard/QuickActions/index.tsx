"use client"

import React, {
    useMemo,
} from "react"
import {
    Chip,
    cn,
    ListBox,
} from "@heroui/react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import {
    useRouter,
} from "next/navigation"
import {
    GraduationCap as CoursesIcon,
    Code as PracticeIcon,
    Bookmark as BookmarkIcon,
    Gift as RewardsIcon,
    TextAlignLeft as BlogIcon,
    Briefcase as TalentsIcon,
} from "@gravity-ui/icons"
import {
    useAppSelector,
} from "@/redux"
import {
    useQueryMyRewardWalletSwr,
} from "@/hooks"
import {
    pathConfig,
} from "@/resources/path"
import type {
    WithClassNames,
} from "@/modules/types/base/class-name"

/** Props for {@link QuickActions}. */
export type QuickActionsProps = WithClassNames<undefined>

/**
 * Left-rail "quick access" grid — one-tap shortcuts to the surfaces a learner
 * reaches for most (catalog, practice, bookmarks, own profile). Pure navigation;
 * self-reads the viewer's username from redux for the profile-scoped links.
 * `"use client"` for redux + the router.
 * @param props - optional className for the root element.
 */
export const QuickActions = ({
    className,
}: QuickActionsProps) => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const username = useAppSelector((state) => state.user.user?.username)
    // spendable reward balance — surfaced as a chip on the rewards shortcut
    const { data: wallet } = useQueryMyRewardWalletSwr()

    /** The shortcut tiles (icon + label + destination). */
    const actions = useMemo(
        () => [
            {
                key: "courses",
                Icon: CoursesIcon,
                href: pathConfig().locale(locale).course().build(),
            },
            {
                key: "practice",
                Icon: PracticeIcon,
                href: pathConfig().locale(locale).practice().build(),
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
                Icon: RewardsIcon,
                href: pathConfig().locale(locale).rewards().build(),
            },
            {
                key: "blog",
                Icon: BlogIcon,
                href: pathConfig().locale(locale).blog().build(),
            },
            {
                key: "talents",
                Icon: TalentsIcon,
                href: pathConfig().locale(locale).talents().build(),
            },
        ],
        [
            locale,
            username,
        ],
    )

    /** Map an item key to its destination for the listbox `onAction` handler. */
    const hrefByKey = useMemo(
        () => Object.fromEntries(actions.map(({
            key, href,
        }) => [
            key, href,
        ])),
        [actions],
    )

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <div className="text-base font-semibold text-foreground">
                {t("dashboard.quickActions")}
            </div>
            <ListBox
                aria-label={t("dashboard.quickActions")}
                selectionMode="none"
                onAction={(key) => router.push(hrefByKey[key])}
            >
                {actions.map(({
                    key,
                    Icon,
                }) => (
                    <ListBox.Item
                        key={key}
                        id={key}
                        textValue={t(`dashboard.actions.${key}`)}
                    >
                        <Icon className="size-5 shrink-0 text-muted" />
                        <span className="truncate text-sm">
                            {t(`dashboard.actions.${key}`)}
                        </span>
                        {key === "rewards" && wallet ? (
                            <Chip className="ml-auto" size="sm" variant="soft" color="warning">
                                <Chip.Label>
                                    {t("dashboard.rewardBalance", { count: wallet.balance })}
                                </Chip.Label>
                            </Chip>
                        ) : null}
                    </ListBox.Item>
                ))}
            </ListBox>
        </div>
    )
}
