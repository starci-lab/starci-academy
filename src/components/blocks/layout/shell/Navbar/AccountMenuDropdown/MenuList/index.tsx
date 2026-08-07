"use client"

import React, { useCallback, useMemo } from "react"
import {
    useLocale,
    useTranslations,
} from "next-intl"
import { useRouter } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { useAppSelector } from "@/redux/hooks"
import { languages } from "@/resources/constants/lang"
import { useAccountMenuOverlayState, useLanguageOverlayState, useLinkGithubOverlayState } from "@/hooks/zustand/overlay/hooks"
import { _MenuList } from "./component"

/** Props for {@link MenuList}. */
export type MenuListProps = Record<string, never>
/**
 * Dropdown body menu — the CONNECTED half: reads auth state from Redux,
 * derives current language from locale, and self-dispatches navigation +
 * overlay actions on press. See `design/storybook/architecture/split.md`.
 * @param props - optional root class name
 */
export const MenuList = () => {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const user = useAppSelector((state) => state.user.user)
    const { close } = useAccountMenuOverlayState()
    const { open: openLanguage } = useLanguageOverlayState()
    const { setOpen: setLinkGithubOpen } = useLinkGithubOverlayState()

    /** Language entry matching the active locale (for the label). */
    const currentLanguageLabel = useMemo(
        () => languages.find((lang) => lang.code === locale)?.label,
        [locale],
    )

    /** Close the dropdown and navigate to the bookmarks page. */
    const onOpenBookmarks = useCallback(
        () => {
            close()
            router.push(pathConfig().locale().profile().bookmarks().build())
        },
        [close, router],
    )

    /** Close the dropdown and open the language overlay. */
    const onOpenLanguage = useCallback(
        () => {
            close()
            openLanguage()
        },
        [close, openLanguage],
    )

    /** Close the dropdown and open the link-GitHub modal (manual entry point). */
    const onLinkGithub = useCallback(
        () => {
            close()
            setLinkGithubOpen(true)
        },
        [close, setLinkGithubOpen],
    )

    return (
        <_MenuList
            isAuthenticated={Boolean(user)}
            showLinkGithub={Boolean(user) && !user?.githubUsername}
            linkGithubLabel={t("linkGithub.title")}
            bookmarksLabel={t("content.saved")}
            toggleLanguageLabel={t("nav.toggleLanguage")}
            currentLanguageLabel={currentLanguageLabel}
            onLinkGithub={onLinkGithub}
            onOpenBookmarks={onOpenBookmarks}
            onOpenLanguage={onOpenLanguage}
        />
    )
}
