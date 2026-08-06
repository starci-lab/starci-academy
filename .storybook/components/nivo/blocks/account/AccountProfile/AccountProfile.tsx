import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { ChoiceSwitch } from "@sb-components/atoms/forms"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackH, StackV } from "@sb-components/frames/Stack/Stack"

/**
 * `AccountProfile` — the user's identity summary plus their notification switches.
 * The switch values are DATA, so a row being on or off is a state of the single
 * shape. Grounded in the real `UserEntity` identity fields + the three notification
 * booleans.
 */

/** The three notification preferences — real boolean columns on `UserEntity`. */
export type NotificationPrefKey =
    | "notifyInvoiceCreated"
    | "notifyServiceStatusChanged"
    | "notifyExpiringSoon"

/** The three preferences in display order. */
const PREF_ORDER: Array<NotificationPrefKey> = [
    "notifyInvoiceCreated",
    "notifyServiceStatusChanged",
    "notifyExpiringSoon",
]

/** Props for {@link AccountProfile}. */
export interface AccountProfileProps {
    /** Display name (`UserEntity.username`). */
    username: string
    /** Email address (`UserEntity.email`). */
    email: string
    /** Absolute avatar image URL, or null → the initials fallback. */
    avatarUrl?: string | null
    /** Current on/off value of each notification preference (`UserEntity` booleans). */
    preferences: Record<NotificationPrefKey, boolean>
    /** Flip one preference — the connected layer runs the mutation. */
    onTogglePref: (key: NotificationPrefKey, value: boolean) => void
    /**
     * `true` → the profile's own first fetch is in flight: the same two cards keep
     * their shape while the avatar, identity lines, and every notification switch
     * shimmer (§12b). The preference rows are a fixed set, so they mirror the loaded
     * shape directly. Threaded straight down — never fed to a separate skeleton tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: AccountProfileLabels
}

/** The already-resolved copy the block renders. */
export interface AccountProfileLabels {
    /** Notifications card title. */
    notificationsTitle: string
    /** Per-preference label + description, keyed by preference. */
    prefOptions: Record<NotificationPrefKey, { label: string; description: string }>
}

/**
 * The account profile. See the file header for why the switch values are states of
 * one shape rather than separate leaves.
 *
 * @param props - {@link AccountProfileProps}
 */
const AccountProfile = ({ username, email, avatarUrl, preferences, onTogglePref, isSkeleton = false, labels }: AccountProfileProps) => (
    <div data-tier="block" data-component="AccountProfile">
        <StackV
            gap={4}
            principle="label-field"
            isSkeleton={isSkeleton}
            items={[
                () => (
                    <SurfaceCard
                        padding={3}
                        isSkeleton={isSkeleton}
                        body={() => (
                            <StackH
                                gap={3}
                                isSkeleton={isSkeleton}
                                items={[
                                    () => (
                                        <Avatar
                                            size="lg"
                                            name={username}
                                            src={avatarUrl ?? undefined}
                                            fallback="initials"
                                            isSkeleton={isSkeleton}
                                        />
                                    ),
                                    () => (
                                        <StackV
                                            gap={1}
                                            isSkeleton={isSkeleton}
                                            items={[
                                                () => <Typography size="base" weight="semibold" isSkeleton={isSkeleton} text={username} />,
                                                () => <Typography size="sm" color="muted" isSkeleton={isSkeleton} text={email} />,
                                            ]}
                                        />
                                    ),
                                ]}
                            />
                        )}
                    />
                ),
                () => (
                    <SurfaceCard
                        padding={3}
                        label={labels.notificationsTitle}
                        isSkeleton={isSkeleton}
                        body={() => (
                            <StackV
                                gap={3}
                                principle="sibling-stack"
                                divider
                                isSkeleton={isSkeleton}
                                items={PREF_ORDER.map((key) => () => (
                                    <StackV
                                        gap={1}
                                        isSkeleton={isSkeleton}
                                        items={[
                                            () => (
                                                <ChoiceSwitch
                                                    isSelected={preferences[key]}
                                                    onValueChange={(value) => onTogglePref(key, value)}
                                                    label={labels.prefOptions[key].label}
                                                    isSkeleton={isSkeleton}
                                                />
                                            ),
                                            () => <Typography size="xs" color="muted" isSkeleton={isSkeleton} text={labels.prefOptions[key].description} />,
                                        ]}
                                    />
                                ))}
                            />
                        )}
                    />
                ),
            ]}
        />
    </div>
)

export { AccountProfile }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "block", name: "AccountProfile" } as const
