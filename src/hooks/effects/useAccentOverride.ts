import {
    useEffect,
} from "react"
import {
    useAppSelector,
} from "@/redux/hooks"
import {
    LocalStorage,
} from "@/modules/storage/local/storage"
import {
    LocalStorageId,
} from "@/modules/storage/local/enums/id"

/**
 * Compute a readable foreground (near-black or white) for a given hex color
 * via the standard YIQ perceived-brightness threshold — cheap, no color-space
 * conversion needed, good enough to guarantee `--accent-foreground` stays
 * legible against whatever hue the user picks.
 *
 * KEEP THIS IN SYNC with the inline no-flash script in `[locale]/layout.tsx`
 * (that one must stay a raw string — it runs before React/modules load).
 *
 * @param hex - A `#rgb` or `#rrggbb` color string.
 */
const foregroundFor = (hex: string): string => {
    const normalized = hex.replace("#", "")
    const full = normalized.length === 3
        ? normalized.split("").map((c) => c + c).join("")
        : normalized
    const r = parseInt(full.slice(0, 2), 16)
    const g = parseInt(full.slice(2, 4), 16)
    const b = parseInt(full.slice(4, 6), 16)
    const yiq = (r * 299 + g * 587 + b * 114) / 1000
    return yiq >= 150 ? "oklch(21.03% 0.0015 354.13)" : "oklch(100% 0 0)"
}

/**
 * Applies the signed-in user's custom accent color (Settings → "Giao diện")
 * as a `<html>`-level CSS variable override on top of whatever light/dark
 * theme is active — independent axes, so "dark + a custom hue" or
 * "light + a custom hue" both just work. Clears the override (falls back to
 * the theme's default brand accent) when the user has not set one.
 *
 * Also mirrors the value into localStorage so the NEXT page load's blocking
 * inline script (`[locale]/layout.tsx`) can apply it before hydration — the
 * server (`UserEntity.accentColor`) stays the source of truth; this is only a
 * same-device no-flash cache.
 */
export const useAccentOverride = () => {
    const accentColor = useAppSelector((state) => state.user.user?.accentColor)

    useEffect(() => {
        const root = document.documentElement
        if (!accentColor) {
            root.style.removeProperty("--accent")
            root.style.removeProperty("--accent-foreground")
            LocalStorage.removeItem(LocalStorageId.AccentColor)
            return
        }
        root.style.setProperty("--accent", accentColor)
        root.style.setProperty("--accent-foreground", foregroundFor(accentColor))
        LocalStorage.setItem(LocalStorageId.AccentColor, accentColor)
    }, [
        accentColor,
    ])
}
