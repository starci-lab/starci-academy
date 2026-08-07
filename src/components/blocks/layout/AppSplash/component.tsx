import React, {
    useEffect,
    useState,
} from "react"
import {
    Typography,
    cn,
} from "@heroui/react"
import {
    BrandLogo,
} from "@/components/blocks/identity/BrandLogo"

/** Minimum on-screen time so the splash reads as deliberate, not a flash. */
const MIN_VISIBLE_MS = 550
/** Opacity fade-out duration once the app is ready. */
const FADE_MS = 350

/** Props for {@link _AppSplash} — presentational; the loading label already resolved. */
export interface AppSplashProps {
    /** Already-localized loading label (used both as the `aria-label` and the visible caption). */
    loadingLabel: string
}

/**
 * AppSplash — the full-screen entry "suspense" screen shown the moment you land
 * on the app (cold load / hard refresh): the StarCi lockup centred over the page
 * background, with the same 3px brand-pink line trickling across the top as
 * {@link TopLoader} (one accent bar, two surfaces).
 *
 * It paints in the server HTML (so it's there before any JS), then fades out once
 * the client has mounted — plus a short minimum so it doesn't blink on a fast
 * boot. Self-managing: mounted once in {@link InnerLayout}, renders `null` when
 * done. Honours `prefers-reduced-motion` (static bar, no trickle). Owns all of its style.
 * @see Story: .storybook/stories/blocks/layout/AppSplash/AppSplash.stories
 */
export const _AppSplash = ({ loadingLabel }: AppSplashProps) => {
    const [leaving, setLeaving] = useState(false)
    const [gone, setGone] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setLeaving(true), MIN_VISIBLE_MS)
        return () => clearTimeout(timer)
    }, [])

    useEffect(() => {
        if (!leaving) {
            return
        }
        const timer = setTimeout(() => setGone(true), FADE_MS)
        return () => clearTimeout(timer)
    }, [leaving])

    if (gone) {
        return null
    }

    return (
        <div
            role="status"
            aria-label={loadingLabel}
            className={cn(
                "fixed inset-0 z-[70] flex flex-col items-center justify-center gap-6 bg-background transition-opacity",
                leaving ? "pointer-events-none opacity-0" : "opacity-100",
            )}
            style={{ transitionDuration: `${FADE_MS}ms` }}
        >
            <div className="pointer-events-none fixed inset-x-0 top-0 h-[3px] overflow-hidden">
                <div
                    className="app-splash-bar h-full bg-accent"
                    style={{ animation: "appSplashTrickle 2.4s ease-in-out infinite" }}
                />
            </div>
            <BrandLogo size="lg" />
            <Typography type="body-sm" color="muted">
                {loadingLabel}
            </Typography>
        </div>
    )
}
