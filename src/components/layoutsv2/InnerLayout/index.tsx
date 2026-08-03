"use client"

import React from "react"
import { useLocale, useTranslations } from "next-intl"
import { _InnerLayout, type InnerLayoutProps } from "./component"

/**
 * `InnerLayout` — the CONNECTED half of the SRC TWIN, and a STAGED one: the
 * running root layout is NOT swapped to it. `src/app/[locale]/layout.tsx`
 * still renders the v1 `src/app/InnerLayout.tsx`; this twin only mirrors the
 * storybook shell so the app can migrate onto it later. Nothing imports it yet.
 *
 * WHY THIS IS THIN (deferred shell wiring, debt `src-tier-ported-but-unused`):
 * the presentational `_InnerLayout` composes the presentational `Navbar` and
 * `Footer` blocks, which take their whole data surface as props (nav routing +
 * search + i18n locale + theme + cart + notifications + account/auth + mobile
 * drawer for the Navbar; explore/support link arrays + socials + terms/privacy
 * for the Footer) — there is no connected `Navbar`/`Footer` child in the tree
 * to lean on, so resolving those honestly means reimplementing both features.
 * The v1 `src/app/InnerLayout.tsx` does none of that here either: it delegates
 * to the self-wired old-world `@/components/features/navbar/Navbar` /
 * `.../footer/Footer` and additionally owns app-tier concerns that do NOT
 * belong in a presentational shell twin (the provider stack, `AppSplash`,
 * `TopLoader`, `AmbientBackgroundGate`, `SocketConnectionStatus`, the
 * modal/drawer/toast/cookie containers, the `ContentAiChatRail` split, and the
 * `usePathname()`-derived `showFooter` / assessment gates). Rather than
 * fabricate a plausible-but-wrong shell, that wiring is left to the eventual
 * consumer and recorded as debt — this half only supplies the genuinely static,
 * zero-app-data i18n props (`searchPlaceholder`, `activeLocale`) and forwards
 * everything else (including `children`) through.
 *
 * @param props - {@link InnerLayoutProps} minus the two i18n props filled here.
 */
export const InnerLayout = (props: Omit<InnerLayoutProps, "searchPlaceholder" | "activeLocale">) => {
    const t = useTranslations()
    const locale = useLocale()

    return (
        <_InnerLayout
            {...props}
            searchPlaceholder={t("search.placeholder")}
            activeLocale={locale}
        />
    )
}

export type { InnerLayoutProps }
