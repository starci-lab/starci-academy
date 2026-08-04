import type { ReactNode } from "react"
import { ArrowSquareOutIcon, CaretRightIcon, SignOutIcon } from "@phosphor-icons/react"
import { Chip, type ChipTone } from "@sb-components/atoms/chips/Chip/Chip"
import { LinkBack } from "@sb-components/atoms/navigation/Link/Link"
import { SurfaceCardList, type SurfaceCardListItem } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { StackV } from "@sb-components/frames/Stack/Stack"
import {
    AccountProfile,
    type AccountProfileLabels,
    type NotificationPrefKey,
} from "@sb-components/nivo/blocks/account/AccountProfile/AccountProfile"
import {
    AccountSecurity,
    type AccountSecurityLabels,
    type TwoFactorEnrollment,
    type TwoFactorStatusKey,
} from "@sb-components/nivo/blocks/account/AccountSecurity/AccountSecurity"

/**
 * `AccountView` — the PAGE at `/account`: the profile summary, opened into a
 * dedicated security sub-view. `view` NAMES which sub-view is on screen —
 * `profile` or `security`. A page's story is one complete STATE per story —
 * `loading`, `profile`, `security` — not a leaf-per-prop map. Grounded in the
 * real `UserEntity` (`twoFactorEnabled`); the active-session count is read
 * from Keycloak, the identity provider of record.
 */

/** Already-localized copy for every region this page arranges. */
export interface AccountViewLabels {
    /** Forwarded to `AccountProfile`. */
    profile: AccountProfileLabels
    /** Forwarded to `AccountSecurity`. */
    security: AccountSecurityLabels
    /** Title of the security entry row on the `profile` sub-view (e.g. "Security"). */
    securityEntryTitle: string
    /** Entry-row status chip text while 2FA is on. */
    securityEntryEnabledText: string
    /** Entry-row status chip text while 2FA is off (also covers mid-enrollment). */
    securityEntryDisabledText: string
    /** The `LinkBack` label above the `security` sub-view (e.g. "Back to account"). */
    backToAccount: string
    /** Title of the account-access card on the `security` sub-view. */
    accessCardTitle: string
    /** Title of the change-password row. */
    changePasswordTitle: string
    /** Subtitle of the change-password row (e.g. "Managed through Keycloak"). */
    changePasswordSubtitle: string
    /** Title of the active-sessions row. */
    activeSessionsTitle: string
    /** Title of the sign-out action row — present on both sub-views. */
    signOutTitle: string
}

/** The `profile` sub-view's own data — identity, notification switches, and the security entry. */
interface AccountViewProfileView {
    view: "profile"
    /** Display name (`UserEntity.username`) — forwarded to `AccountProfile`. */
    username: string
    /** Email address (`UserEntity.email`) — forwarded to `AccountProfile`. */
    email: string
    /** Absolute avatar image URL, or null — forwarded to `AccountProfile`. */
    avatarUrl?: string | null
    /** Notification preference values — forwarded to `AccountProfile`. */
    preferences: Record<NotificationPrefKey, boolean>
    /** Flip one preference — forwarded to `AccountProfile`. */
    onTogglePref: (key: NotificationPrefKey, value: boolean) => void
    /** 2FA phase (`UserEntity.twoFactorEnabled`) — tones the security entry's status chip. */
    twoFactorStatus: TwoFactorStatusKey
    /** Opens the `security` sub-view. */
    onOpenSecurity: () => void
    /** Ends the session — wired to the identity provider's sign-out in the connected half. */
    onSignOut: () => void
}

/** The `security` sub-view's own data — the 2FA panel plus the account-access rows. */
interface AccountViewSecurityView {
    view: "security"
    /** 2FA phase — forwarded to `AccountSecurity`. */
    status: TwoFactorStatusKey
    /** The secret + otpauth URI while enrolling — forwarded to `AccountSecurity`. */
    enrollment?: TwoFactorEnrollment | null
    /** The 6-digit confirm code — forwarded to `AccountSecurity`. */
    confirmCode: string
    /** Fires as the confirm field changes — forwarded to `AccountSecurity`. */
    onConfirmChange: (value: string) => void
    /** Begin enrolment — forwarded to `AccountSecurity`. */
    onBeginEnroll: () => void
    /** Confirm the typed code — forwarded to `AccountSecurity`. */
    onConfirmEnroll: () => void
    /** Turn 2FA off — forwarded to `AccountSecurity`. */
    onDisable: () => void
    /** `true` → the confirm code is being verified — forwarded to `AccountSecurity`. */
    isVerifying?: boolean
    /** Deep link into the Keycloak account console's change-password screen. */
    passwordHref: string
    /** Currently active login sessions, as tracked by Keycloak. */
    activeSessionCount: number
    /** Returns to the `profile` sub-view. */
    onBack: () => void
    /** Ends the session — wired to the identity provider's sign-out in the connected half. */
    onSignOut: () => void
}

/**
 * Props for {@link AccountView} — a discriminated union on `view`, with a
 * leading `isSkeleton` branch bare of every other field: before the first
 * fetch resolves the page mirrors the `profile` shape, the landing sub-view,
 * since there is nothing else yet to show.
 */
export type AccountViewProps =
    | { isSkeleton: true; labels: AccountViewLabels }
    | ((AccountViewProfileView | AccountViewSecurityView) & { isSkeleton?: false; labels: AccountViewLabels })

/** Placeholder preference values for the `isSkeleton` mirror — shimmer covers the values either way. */
const SKELETON_PREFERENCES: Record<NotificationPrefKey, boolean> = {
    notifyInvoiceCreated: false,
    notifyServiceStatusChanged: false,
    notifyExpiringSoon: false,
}

/**
 * The `/account` page. See the file header for why the security entry and the
 * account-access rows are drawn here (a `SurfaceCardList` composite) rather
 * than folded into `AccountProfile`/`AccountSecurity` — neither block owns a
 * nav affordance into its sibling sub-view.
 *
 * @param props - {@link AccountViewProps}
 */
const AccountView = (props: AccountViewProps) => {
    const shell = (children: ReactNode) => (
        <div
            data-tier="page"
            data-component="AccountView"
            className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-8"
        >
            {children}
        </div>
    )

    // ── LOADING: mirrors the `profile` shape, the landing sub-view.
    if (props.isSkeleton) {
        return shell(
            <StackV
                gap={4}
                isSkeleton
                items={[
                    () => (
                        <AccountProfile
                            username=""
                            email=""
                            preferences={SKELETON_PREFERENCES}
                            onTogglePref={() => {}}
                            labels={props.labels.profile}
                            isSkeleton
                        />
                    ),
                    () => <SurfaceCardList items={[{ key: "security" }, { key: "signout" }]} isSkeleton />,
                ]}
            />,
        )
    }

    // ── SECURITY: the 2FA panel, plus the account-access rows this page owns.
    if (props.view === "security") {
        const accessItems: Array<SurfaceCardListItem> = [
            {
                key: "password",
                title: props.labels.changePasswordTitle,
                subtitle: props.labels.changePasswordSubtitle,
                href: props.passwordHref,
                trailingIcon: ArrowSquareOutIcon,
            },
            {
                key: "sessions",
                title: props.labels.activeSessionsTitle,
                metaText: String(props.activeSessionCount),
            },
            {
                key: "signout",
                title: props.labels.signOutTitle,
                onPress: props.onSignOut,
                trailingIcon: SignOutIcon,
            },
        ]
        return shell(
            <StackV
                gap={4}
                items={[
                    () => <LinkBack label={props.labels.backToAccount} onPress={props.onBack} />,
                    () => (
                        <AccountSecurity
                            status={props.status}
                            enrollment={props.enrollment}
                            confirmCode={props.confirmCode}
                            onConfirmChange={props.onConfirmChange}
                            onBeginEnroll={props.onBeginEnroll}
                            onConfirmEnroll={props.onConfirmEnroll}
                            onDisable={props.onDisable}
                            isVerifying={props.isVerifying}
                            labels={props.labels.security}
                        />
                    ),
                    () => <SurfaceCardList label={props.labels.accessCardTitle} items={accessItems} />,
                ]}
            />,
        )
    }

    // ── PROFILE: identity + notification switches, plus the entry into security.
    const entryTone: ChipTone = props.twoFactorStatus === "enabled" ? "success" : "warning"
    const entryText = props.twoFactorStatus === "enabled"
        ? props.labels.securityEntryEnabledText
        : props.labels.securityEntryDisabledText
    const securityEntryItems: Array<SurfaceCardListItem> = [
        {
            key: "security",
            title: props.labels.securityEntryTitle,
            onPress: props.onOpenSecurity,
            meta: () => <Chip tone={entryTone} text={entryText} />,
            trailingIcon: CaretRightIcon,
        },
        {
            key: "signout",
            title: props.labels.signOutTitle,
            onPress: props.onSignOut,
            trailingIcon: SignOutIcon,
        },
    ]

    return shell(
        <StackV
            gap={4}
            items={[
                () => (
                    <AccountProfile
                        username={props.username}
                        email={props.email}
                        avatarUrl={props.avatarUrl}
                        preferences={props.preferences}
                        onTogglePref={props.onTogglePref}
                        labels={props.labels.profile}
                    />
                ),
                () => <SurfaceCardList items={securityEntryItems} />,
            ]}
        />,
    )
}

export { AccountView }

/** Source-level tier marker — lets a gate read the tier without guessing from the folder path. */
export const meta = { tier: "page", name: "AccountView" } as const
