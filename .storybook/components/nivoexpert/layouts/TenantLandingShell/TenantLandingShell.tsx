"use client"

import { useEffect, useState } from "react"
import { ArrowRightIcon } from "@phosphor-icons/react"
import type { ComponentTypeWithSkeleton } from "@sb-components/frames/_slot"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { Cluster } from "@sb-components/frames/Cluster/Cluster"
import { StackH } from "@sb-components/frames/Stack/Stack"
import { BackToTopButton } from "@sb-components/nivoexpert/atoms/BackToTopButton/BackToTopButton"
import { LandingFooter, type LandingFooterProps } from "@sb-components/nivoexpert/blocks/landing/LandingFooter/LandingFooter"

/**
 * `TenantLandingShell` — the LAYOUT the public `apps/expert` `/` landing
 * route sits in: a sticky brand nav (brand mark, in-page anchors, sign-in +
 * enrol) on top, the route's own section stack in the CENTER, `LandingFooter`
 * closing it, a floating `BackToTopButton`, and a mobile-only sticky enrol
 * bar. `content` is the one slot a route's shape enters — mirrors
 * `nivo/layouts/MarketingLandingShell`'s own `content` slot, so `isSkeleton`
 * (loaded vs loading) is the only structural state a story maps.
 * `AnatomyTier` has no `layout` member, so this story passes `tier="screen"`
 * (story.md: a layout's story is the top arrangement tier).
 *
 * HeroUI: composes the house `Avatar`/`Button`/`Typography` atoms and
 * `Cluster`/`StackH` frames — every colour resolves through `apps/expert`'s
 * `--nivo-*` → HeroUI bridge, so the fixture below renders correctly with NO
 * host `:root` override present (this story), same as the real per-tenant
 * override would apply on top.
 */

/** One in-page anchor link in the nav's link row. */
export interface TenantNavLink {
    /** Stable id — also the React key. */
    id: string
    /** Visible link label. */
    label: string
    /** In-page anchor href this link points at. */
    href: string
}

/** Props for {@link TenantLandingShell}. */
export interface TenantLandingShellProps {
    /** The expert's display name (`Brand.displayName`) — nav brand mark + avatar-fallback initial. */
    brandName: string
    /** Optional avatar image (`Brand.avatarUrl`) — falls back to `brandName`'s initial when unset. */
    avatarUrl?: string
    /** The nav's in-page anchors, in display order — drop below `@app-md`; brand + actions remain. */
    navLinks: Array<TenantNavLink>
    /** Visible label for the nav's secondary sign-in action. */
    loginLabel: string
    /** Fired when sign-in is pressed — the caller opens the auth surface. No destination of its own. */
    onLogin: () => void
    /** Visible label for the primary enrol action — used by BOTH the nav button and the sticky bar's button. */
    enrolLabel: string
    /** Fired when the enrol action is pressed, from either the nav or the sticky bar. No destination of its own. */
    onEnrol: () => void
    /** The footer's resolved data, forwarded to `LandingFooter`. */
    footer: LandingFooterProps
    /** The routed page's own section stack, mounted in the CENTER. */
    content: ComponentTypeWithSkeleton
    /** Accessible name for the floating back-to-top control. */
    backToTopLabel: string
    /** Render the `content` slot in its skeleton (loading) state. */
    isSkeleton?: boolean
}

/** How far (px) the reader scrolls before `BackToTopButton` reveals itself — mirrors the prototype's own fold threshold. */
const BACK_TO_TOP_REVEAL_PX = 560

/**
 * The tenant landing shell. See the file header for why the nav/footer/sticky
 * bar never take `isSkeleton` and why only `content` does, and for the
 * nav-button vs. sticky-bar split of the one `onEnrol` action.
 *
 * @param props - {@link TenantLandingShellProps}
 */
const TenantLandingShell = ({
    brandName,
    avatarUrl,
    navLinks,
    loginLabel,
    onLogin,
    enrolLabel,
    onEnrol,
    footer,
    content: Content,
    backToTopLabel,
    isSkeleton,
}: TenantLandingShellProps) => {
    // Scroll-driven reveal is UI state the shell owns locally — not domain data,
    // so it sits beside `isSkeleton` rather than replacing it (a first-load
    // skeleton can still be scrolled past).
    const [isPastFold, setIsPastFold] = useState(false)

    useEffect(() => {
        const onScroll = () => setIsPastFold(window.scrollY > BACK_TO_TOP_REVEAL_PX)
        onScroll()
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [])

    return (
        <div data-tier="layout" data-component="TenantLandingShell" className="@container flex min-h-dvh flex-col bg-background text-foreground">
            <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b border-default bg-background/95 px-6 backdrop-blur">
                <StackH
                    gap={3}
                    align="center"
                    items={[
                        () => <Avatar src={avatarUrl} name={brandName} size="sm" fallback="initials" />,
                        () => <Typography size="lg" weight="bold" text={brandName} />,
                    ]}
                />

                <div className="hidden @app-md:flex">
                    <Cluster
                        gap={6}
                        items={navLinks.map((link) => () => (
                            <Typography size="sm" color="muted" isLink href={`#${link.id}`} text={link.label} />
                        ))}
                    />
                </div>

                <StackH
                    gap={2}
                    align="center"
                    items={[
                        () => <Button variant="secondary" size="sm" label={loginLabel} onPress={onLogin} />,
                        () => <Button variant="primary" size="sm" label={enrolLabel} onPress={onEnrol} />,
                    ]}
                />
            </header>

            <main className="flex-1 pb-16 @app-md:pb-0">
                <Content isSkeleton={isSkeleton} />
            </main>

            <LandingFooter {...footer} />

            <div className="fixed inset-x-0 bottom-0 z-30 border-t border-default bg-background/95 px-4 py-3 backdrop-blur @app-md:hidden">
                <StackH
                    gap={3}
                    align="center"
                    justify="between"
                    items={[
                        () => <Typography size="sm" weight="semibold" truncate text={brandName} />,
                        () => (
                            <Button
                                variant="primary"
                                size="sm"
                                label={enrolLabel}
                                suffixIcon={ArrowRightIcon}
                                iconSlide
                                onPress={onEnrol}
                            />
                        ),
                    ]}
                />
            </div>

            <div className="fixed bottom-20 end-6 z-40 @app-md:bottom-6">
                <BackToTopButton
                    isVisible={isPastFold}
                    label={backToTopLabel}
                    onPress={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                />
            </div>
        </div>
    )
}

export { TenantLandingShell }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "layout", name: "TenantLandingShell" } as const
