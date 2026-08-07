import React from "react"
import { Chip, cn, Typography } from "@heroui/react"
import { MedalIcon } from "@phosphor-icons/react"
import { UserAvatar } from "@/components/blocks/identity/UserAvatar"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** One stat cell (value over a muted label) in the {@link ProfileHero} stats row. */
const HeroStat = ({ value, label }: { value: React.ReactNode, label: string }) => (
    <div className="flex flex-col items-center gap-1 text-center">
        <Typography type="body" weight="semibold" className="leading-none text-foreground">
            {value}
        </Typography>
        <Typography type="body-xs" color="muted">{label}</Typography>
    </div>
)

/** Props for {@link ProfileHero}. */
export interface ProfileHeroProps extends WithClassNames<undefined> {
    /** Account username; drives the avatar fallback and the `@handle` line. */
    username: string
    /** Human-friendly name shown as the primary label; falls back to {@link ProfileHeroProps.username}. */
    displayName?: string | null
    /** Uploaded avatar URL; resilient fallbacks handled by {@link UserAvatar}. */
    avatar?: string | null
    /** Short bio / tagline shown under the name; hidden when absent. */
    bio?: string | null
    /** Followers count; renders a `—` placeholder when `null`/`undefined`. */
    followerCount?: number | null
    /** Following count; renders a `—` placeholder when `null`/`undefined`. */
    followingCount?: number | null
    /** Label for the followers stat (caller-localized). */
    followersLabel: string
    /** Label for the following stat (caller-localized). */
    followingLabel: string
    /** Rank badge text (e.g. "Gold Rank"); the chip is hidden when absent. */
    rankLabel?: string | null
    /** Right-aligned action slot — typically the follow toggle button. */
    action?: React.ReactNode
}

/**
 * Public-profile hero: a large {@link UserAvatar} beside the display name over its
 * `@username`, an optional bio, a rank badge, a followers/following stats row, and a
 * caller-supplied action slot (the follow toggle). Purely presentational and
 * props-only — no store, data, or router access; the owning FEATURE fetches the user
 * and supplies the localized labels and the follow control via
 * {@link ProfileHeroProps.action}.
 *
 * A missing follower/following count renders `—` rather than `0`, so an unimplemented
 * backend field reads as "unknown" instead of "none".
 *
 * @param props - {@link ProfileHeroProps}
 * @see Story: .storybook/stories/mia-mia/ProfileHero/ProfileHero.stories
 */
export const ProfileHero = ({
    username,
    displayName,
    avatar,
    bio,
    followerCount,
    followingCount,
    followersLabel,
    followingLabel,
    rankLabel,
    action,
    className,
}: ProfileHeroProps) => {
    const name = displayName ?? username
    const fmt = (value?: number | null) =>
        value == null ? "—" : value.toLocaleString()

    return (
        <div
            className={cn(
                "flex flex-col gap-4 rounded-3xl border border-default bg-surface p-4",
                className,
            )}
        >
            <div className="flex items-start gap-4">
                <UserAvatar
                    username={username}
                    avatar={avatar}
                    seed={username}
                    size="lg"
                    className="size-20 shrink-0"
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                    <Typography type="h4" truncate className="text-foreground">
                        {name}
                    </Typography>
                    <Typography type="body-sm" color="muted" truncate>
                        @{username}
                    </Typography>
                    {rankLabel ? (
                        <Chip size="sm" variant="soft" color="accent" className="mt-1 w-fit gap-1">
                            <MedalIcon weight="fill" className="size-3.5" aria-hidden focusable="false" />
                            {rankLabel}
                        </Chip>
                    ) : null}
                </div>
                {action ? <div className="shrink-0">{action}</div> : null}
            </div>

            {bio ? (
                <Typography type="body-sm" className="text-foreground">
                    {bio}
                </Typography>
            ) : null}

            <div className="flex items-center gap-6 border-t border-separator pt-3">
                <HeroStat value={fmt(followerCount)} label={followersLabel} />
                <div className="h-8 w-px bg-separator" />
                <HeroStat value={fmt(followingCount)} label={followingLabel} />
            </div>
        </div>
    )
}
