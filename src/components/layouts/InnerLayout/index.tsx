"use client"

import React, { useCallback, useMemo, useState } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { BookmarkSimpleIcon, SignInIcon, SignOutIcon, UserPlusIcon } from "@phosphor-icons/react"
import { FaFacebook, FaGithub, FaLinkedin } from "react-icons/fa6"
import { usePathname, useRouter } from "@/i18n/navigation"
import { useRouter as useAppRouter, usePathname as useRawPathname } from "next/navigation"
import { pathConfig } from "@/resources/path"
import { languages } from "@/resources/constants/lang"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { AuthenticationModalTab, setAuthenticationModalTab } from "@/redux/slices/tabs"
import {
    useAuthenticationOverlayState,
    useLinkGithubOverlayState,
    useMiniCartOverlayState,
    useSearchOverlayState,
} from "@/hooks/zustand/overlay/hooks"
import { useQueryMyNotificationsSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyNotificationsSwr"
import { useQueryMyCartSwr } from "@/hooks/swr/api/graphql/queries/useQueryMyCartSwr"
import { useMutateSignOutSwr } from "@/hooks/swr/api/graphql/mutations/useMutateSignOutSwr"
import { useGraphQLWithToast } from "@/modules/toast/hooks"
import { mutateMarkAllNotificationsAsRead } from "@/modules/api/graphql/mutations/mutation-mark-all-notifications-as-read"
import { mutateMarkNotificationAsRead } from "@/modules/api/graphql/mutations/mutation-mark-notification-as-read"
import { queryResolveRoute } from "@/modules/api/graphql/queries/query-resolve-route"
import type {
    QueryNotificationData,
    QueryNotificationTargetData,
} from "@/modules/api/graphql/queries/types/notifications"
import {
    CONTACT_EMAIL,
    FOUNDER_FACEBOOK,
    FOUNDER_GITHUB,
    FOUNDER_LINKEDIN,
} from "@/resources/contact"
import type {
    NavbarAccountMenuItem,
    NavbarNotificationItem,
    NavLinkItem,
} from "@/components/blocks/navigation/Navbar"
import { _InnerLayout, type InnerLayoutProps } from "./component"

/**
 * `InnerLayout` — the CONNECTED half of the SRC TWIN. Like `LearnShell`, it takes
 * ONLY `children` and resolves every other prop `_InnerLayout` needs itself, then
 * renders the presentational shell. STILL STAGED: the running root layout is NOT
 * swapped to it — `src/app/[locale]/layout.tsx` renders the v1 `src/app/InnerLayout.tsx`;
 * nothing imports this twin yet (debt `src-tier-ported-but-unused-innerlayout`).
 *
 * WHAT THIS NOW RESOLVES (the whole Navbar + Footer data surface, lifted from the
 * LIVE v1 shell — `src/components/blocks/layout/shell/Navbar/**` and
 * `src/components/features/footer/Footer`):
 *   - nav routing + logo → `pathConfig` + the locale-aware `@/i18n/navigation` router
 *     (`NavLinks`); active-route detection copied verbatim from `NavLinks`.
 *   - search → `useSearchOverlayState` (`SearchButton`); the Ctrl/Cmd+K shortcut is
 *     owned by the presentational `Navbar` itself now, so only the open trigger is wired.
 *   - languages / locale switch → `languages` constant + `router.replace(pathname, { locale })`
 *     (the `LanguageDropdown` idiom).
 *   - theme → `next-themes` `useTheme` (`DarkLightModeSwitch`).
 *   - notifications → `useQueryMyNotificationsSwr` + `mark-read`/`mark-all-read` mutations +
 *     `queryResolveRoute` (`NotificationBell`), mapped to `NavbarNotificationItem[]`.
 *   - account/auth → `keycloak.authenticated` + `state.user.user` + the auth overlay,
 *     sign-out mutation and link-GitHub overlay (`AccountMenuDropdown` family).
 *   - Footer → the same `pathConfig` routes, contact constants and founder socials the
 *     v1 `Footer` reads; `showFooter` regex lifted from v1 `src/app/InnerLayout.tsx`.
 *
 * HONEST GAP — the v1 shell `Navbar` renders NO cart. Its `cartCount`/`onCartPress`
 * are REQUIRED props here, so they are sourced from the app's real cart (`useQueryMyCartSwr`
 * count + `useMiniCartOverlayState` open) rather than fabricated. See debt entry.
 *
 * OUT OF SCOPE (still the eventual consumer's job, unchanged from before): the app
 * route swap and all app-tier chrome the v1 `src/app/InnerLayout.tsx` owns (provider
 * stack, `AppSplash`, `TopLoader`, `AmbientBackgroundGate`, `SocketConnectionStatus`,
 * the modal/drawer/toast/cookie containers and the `ContentAiChatRail` split).
 *
 * @param props - only `children`, the active route's own content.
 */
export const InnerLayout = ({ children }: Pick<InnerLayoutProps, "children">) => {
    const t = useTranslations()
    const locale = useLocale()

    // locale-aware router + path (nav routing / active pills / locale switch)
    const router = useRouter()
    const pathname = usePathname()
    // raw router + path (v1 footer gate regex + notification target push both key off
    // the locale-PREFIXED pathname, so they read next/navigation, not @/i18n)
    const appRouter = useAppRouter()
    const rawPathname = useRawPathname()

    const dispatch = useAppDispatch()

    // --- session ------------------------------------------------------------------
    const authenticated = useAppSelector((state) => state.keycloak.authenticated)
    const user = useAppSelector((state) => state.user.user)

    // --- overlays / actions -------------------------------------------------------
    const { open: openSearch } = useSearchOverlayState()
    const { open: openAuthentication } = useAuthenticationOverlayState()
    const { open: openMiniCart } = useMiniCartOverlayState()
    const { setOpen: setLinkGithubOpen } = useLinkGithubOverlayState()
    const mutateSignOutSwr = useMutateSignOutSwr()
    const runGraphQL = useGraphQLWithToast()

    // --- theme --------------------------------------------------------------------
    const { theme, setTheme } = useTheme()
    const isDarkMode = theme === "dark"
    const onThemeToggle = useCallback((isDark: boolean) => setTheme(isDark ? "dark" : "light"), [setTheme])

    // --- nav items (copied verbatim from the v1 `NavLinks`) -----------------------
    const navItems = useMemo<Array<NavLinkItem>>(
        () => [
            {
                id: "home",
                label: t("nav.home"),
                isActive: pathname === pathConfig().locale(locale).build() || pathname === "/",
                onPress: () => router.push(pathConfig().locale().build()),
            },
            {
                id: "courses",
                label: t("nav.courses"),
                isActive: pathname.startsWith(pathConfig().locale(locale).course().build()),
                onPress: () => router.push(pathConfig().locale().course().build()),
            },
            {
                id: "community",
                label: t("nav.community"),
                isActive: pathname.startsWith(pathConfig().locale(locale).community().build()),
                onPress: () => router.push(pathConfig().locale().community().build()),
            },
            {
                id: "contact",
                label: t("nav.contact"),
                isActive: pathname.startsWith(pathConfig().locale(locale).contact().build()),
                onPress: () => router.push(pathConfig().locale().contact().build()),
            },
        ],
        [locale, pathname, router, t],
    )

    const onLogoPress = useCallback(() => router.push(pathConfig().locale().build()), [router])

    // --- language switch (the `LanguageDropdown` idiom) ---------------------------
    const onLocaleChange = useCallback(
        (code: string) => {
            if (code !== locale) {
                router.replace(pathname, { locale: code })
            }
        },
        [locale, pathname, router],
    )

    // --- cart (v1 shell renders none; sourced from the app's real cart) -----------
    const { data: cartData } = useQueryMyCartSwr()
    const cartCount = cartData?.length ?? 0

    // --- notifications (lifted from the v1 `NotificationBell`) --------------------
    const { data: notificationsData, isLoading: notificationsLoading, error: notificationsError, mutate: mutateNotifications } =
        useQueryMyNotificationsSwr()
    const rawNotifications = useMemo(() => notificationsData?.items ?? [], [notificationsData])

    /** Locale-aware relative-time formatter for the item timestamps. */
    const relativeFormat = useMemo(
        () => new Intl.RelativeTimeFormat(locale, { numeric: "auto" }),
        [locale],
    )

    /** Format an ISO timestamp as a coarse relative string ("3h ago"). */
    const formatRelative = useCallback(
        (iso: string): string => {
            const diffMs = new Date(iso).getTime() - Date.now()
            const diffMin = Math.round(diffMs / 60_000)
            const absMin = Math.abs(diffMin)
            if (absMin < 60) {
                return relativeFormat.format(diffMin, "minute")
            }
            const diffHour = Math.round(diffMin / 60)
            if (Math.abs(diffHour) < 24) {
                return relativeFormat.format(diffHour, "hour")
            }
            const diffDay = Math.round(diffHour / 24)
            return relativeFormat.format(diffDay, "day")
        },
        [relativeFormat],
    )

    const notificationItems = useMemo<Array<NavbarNotificationItem>>(
        () => rawNotifications.map((notification) => ({
            id: notification.id,
            title: t(notification.title.key, notification.title.params ?? undefined),
            subtitle: notification.body ? t(notification.body.key, notification.body.params ?? undefined) : undefined,
            timeLabel: formatRelative(notification.createdAt),
            isRead: notification.isRead,
        })),
        [rawNotifications, t, formatRelative],
    )

    /**
     * Encode a notification target into the opaque global id the route index expects:
     * base64url of `"<entityName>:<id>"` (copied from the v1 `NotificationBell`).
     */
    const encodeGlobalId = useCallback((target: QueryNotificationTargetData): string => {
        const raw = `${target.entityName}:${target.id}`
        return btoa(raw)
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "")
    }, [])

    /** Mark a single notification read (if unread) and navigate to its resolved target. */
    const onNotificationItemPress = useCallback(
        async (item: NavbarNotificationItem) => {
            const notification: QueryNotificationData | undefined =
                rawNotifications.find((candidate) => candidate.id === item.id)
            if (!notification) {
                return
            }
            if (!notification.isRead) {
                await runGraphQL(
                    async () => {
                        const env = await mutateMarkNotificationAsRead({
                            request: { notificationId: notification.id },
                        })
                        return env.data!.markNotificationAsRead
                    },
                    { showSuccessToast: false, showErrorToast: false },
                )
                await mutateNotifications()
            }
            const { target } = notification
            if (!target) {
                return
            }
            const response = await queryResolveRoute({
                request: { globalId: encodeGlobalId(target) },
            })
            const path = response.data?.resolveRoute?.data?.path
            if (path) {
                appRouter.push(`/${locale}${path}`)
            }
        },
        [rawNotifications, runGraphQL, mutateNotifications, encodeGlobalId, appRouter, locale],
    )

    /** Mark every unread notification read in one bulk action. */
    const onMarkAllNotificationsRead = useCallback(
        async () => {
            await runGraphQL(
                async () => {
                    const env = await mutateMarkAllNotificationsAsRead({
                        request: undefined,
                    })
                    return env.data!.markAllNotificationsAsRead
                },
                { showSuccessToast: false, showErrorToast: true },
            )
            await mutateNotifications()
        },
        [runGraphQL, mutateNotifications],
    )

    const onSeeAllNotifications = useCallback(
        () => router.push(pathConfig().locale().notifications().build()),
        [router],
    )

    // --- account menu -------------------------------------------------------------
    /** Open the auth modal on the chosen tab (guest rows). */
    const openAuthOnTab = useCallback(
        (tab: AuthenticationModalTab) => {
            dispatch(setAuthenticationModalTab(tab))
            openAuthentication()
        },
        [dispatch, openAuthentication],
    )

    const accountMenuItems = useMemo<Array<NavbarAccountMenuItem>>(
        () => {
            if (!authenticated || !user) {
                return [
                    {
                        id: "sign-in",
                        label: t("auth.signIn.submit"),
                        icon: SignInIcon,
                        onPress: () => openAuthOnTab(AuthenticationModalTab.SignIn),
                    },
                    {
                        id: "sign-up",
                        label: t("auth.signUp.submit"),
                        icon: UserPlusIcon,
                        onPress: () => openAuthOnTab(AuthenticationModalTab.SignUp),
                    },
                ]
            }
            const items: Array<NavbarAccountMenuItem> = [
                {
                    id: "bookmarks",
                    label: t("content.saved"),
                    icon: BookmarkSimpleIcon,
                    onPress: () => router.push(pathConfig().locale().profile().bookmarks().build()),
                },
            ]
            // manual GitHub-link entry point — self-hides once the account is linked
            if (!user.githubUsername) {
                items.push({
                    id: "link-github",
                    label: t("linkGithub.title"),
                    icon: FaGithub,
                    onPress: () => setLinkGithubOpen(true),
                })
            }
            items.push({
                id: "logout",
                label: t("nav.logout"),
                icon: SignOutIcon,
                isDanger: true,
                onPress: () => { void mutateSignOutSwr.trigger() },
            })
            return items
        },
        [authenticated, user, t, openAuthOnTab, router, setLinkGithubOpen, mutateSignOutSwr],
    )

    // --- footer -------------------------------------------------------------------
    const exploreLinks = useMemo<InnerLayoutProps["exploreLinks"]>(
        () => [
            { id: "courses", label: t("footer.links.courses"), onPress: () => router.push(pathConfig().locale().course().build()) },
            { id: "blog", label: t("footer.links.blog"), onPress: () => router.push(pathConfig().locale().blog().build()) },
            { id: "talents", label: t("footer.links.talents"), onPress: () => router.push(pathConfig().locale().talents().build()) },
            { id: "jobs", label: t("footer.links.jobs"), onPress: () => router.push(pathConfig().locale().jobs().build()) },
            { id: "community", label: t("footer.links.community"), onPress: () => router.push(pathConfig().locale().community().build()) },
        ],
        [router, t],
    )

    const supportLinks = useMemo<InnerLayoutProps["supportLinks"]>(
        () => [
            { id: "contact", label: t("footer.links.contact"), onPress: () => router.push(pathConfig().locale().contact().build()) },
            { id: "email", label: CONTACT_EMAIL, onPress: () => { window.location.href = `mailto:${CONTACT_EMAIL}` } },
        ],
        [router, t],
    )

    const socials = useMemo<InnerLayoutProps["socials"]>(
        () => [
            { id: "facebook", label: t("contact.founder.facebook"), icon: FaFacebook, onPress: () => window.open(FOUNDER_FACEBOOK, "_blank", "noreferrer") },
            { id: "linkedin", label: t("contact.founder.linkedin"), icon: FaLinkedin, onPress: () => window.open(FOUNDER_LINKEDIN, "_blank", "noreferrer") },
            { id: "github", label: t("contact.founder.github"), icon: FaGithub, onPress: () => window.open(FOUNDER_GITHUB, "_blank", "noreferrer") },
        ],
        [t],
    )

    const onTermsPress = useCallback(() => router.push(pathConfig().locale().terms().build()), [router])
    const onPrivacyPress = useCallback(() => router.push(pathConfig().locale().privacy().build()), [router])

    // footer visibility — regex lifted verbatim from v1 `src/app/InnerLayout.tsx`
    // (landing at the locale root or `/home`; every other route drops the footer).
    const footerPath = rawPathname ?? ""
    const showFooter = /^\/(?:[a-z]{2})?\/?$/.test(footerPath) || /^\/(?:[a-z]{2}\/)?home\/?$/.test(footerPath)

    // --- mobile drawer (pure local UI toggle, caller-owned by the block) ----------
    const [isMobileDrawerOpen, setMobileDrawerOpen] = useState(false)

    return (
        <_InnerLayout
            // --- Navbar ---
            onLogoPress={onLogoPress}
            navItems={navItems}
            searchPlaceholder={t("search.placeholder")}
            shortcutLabel="Ctrl K"
            onSearchPress={openSearch}
            languages={languages.map((language) => ({ code: language.code, label: language.label }))}
            activeLocale={locale}
            onLocaleChange={onLocaleChange}
            isDarkMode={isDarkMode}
            onThemeToggle={onThemeToggle}
            cartCount={cartCount}
            onCartPress={openMiniCart}
            notifications={{
                unreadCount: notificationsData?.unreadCount ?? 0,
                items: notificationItems,
                isLoading: notificationsLoading,
                error: notificationsError ? t("notifications.loadError") : null,
                onItemPress: onNotificationItemPress,
                onMarkAllRead: onMarkAllNotificationsRead,
                onSeeAll: onSeeAllNotifications,
                onRetry: () => { void mutateNotifications() },
            }}
            account={{
                isAuthed: authenticated,
                user: authenticated && user
                    ? { username: user.username, email: user.email, avatarUrl: user.avatar }
                    : undefined,
                isLoading: authenticated && !user,
                menuItems: accountMenuItems,
            }}
            isMobileDrawerOpen={isMobileDrawerOpen}
            onMobileDrawerOpenChange={setMobileDrawerOpen}
            // --- Footer ---
            exploreLinks={exploreLinks}
            supportLinks={supportLinks}
            socials={socials}
            onTermsPress={onTermsPress}
            onPrivacyPress={onPrivacyPress}
            // --- shell ---
            showFooter={showFooter}
        >
            {children}
        </_InnerLayout>
    )
}

export type { InnerLayoutProps }
