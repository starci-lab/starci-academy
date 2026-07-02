"use client"

import { useEffect, useState } from "react"

/**
 * Detects whether the viewer is on macOS/iOS/iPadOS — client-only (no `navigator`
 * on the server), so the hook starts `false` (Windows/Linux default, matching the
 * majority of StarCi's viewers) and flips to `true` after mount if detected.
 *
 * Used to pick the correct modifier-key glyph for shortcut hints: `⌘ Command` on
 * Mac vs the word `Ctrl` everywhere else (HeroUI's `Kbd.Abbr keyValue="ctrl"`
 * renders the Mac Control glyph `⌃`, which is wrong for a Windows-style hint).
 *
 * @returns `true` once a Mac-family platform is detected on the client.
 */
export const useIsMacPlatform = (): boolean => {
    const [isMac, setIsMac] = useState(false)

    useEffect(() => {
        // modern Chromium API (avoids the deprecated `navigator.platform` warning)
        const uaDataPlatform = (navigator as Navigator & {
            userAgentData?: { platform?: string }
        }).userAgentData?.platform
        const platform = uaDataPlatform ?? navigator.platform ?? navigator.userAgent
        setIsMac(/mac|iphone|ipad|ipod/i.test(platform))
    }, [])

    return isMac
}
