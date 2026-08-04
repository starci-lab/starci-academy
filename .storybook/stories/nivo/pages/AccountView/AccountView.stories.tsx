import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AccountView,
    type AccountViewLabels,
} from "@sb-components/nivo/pages/AccountView/AccountView"
import type { NotificationPrefKey } from "@sb-components/nivo/blocks/account/AccountProfile/AccountProfile"
import type { TwoFactorEnrollment } from "@sb-components/nivo/blocks/account/AccountSecurity/AccountSecurity"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AccountView` — the PAGE at `/account`: the profile summary, opened into a
 * dedicated security sub-view. `view` NAMES which sub-view is on screen —
 * `profile` or `security`. A page's story is one complete STATE per story —
 * `loading`, `profile`, `security` — not a leaf-per-prop map. Grounded in the
 * real `UserEntity` (`twoFactorEnabled`); the active-session count is read
 * from Keycloak, the identity provider of record.
 */
const meta: Meta<typeof AccountView> = {
    title: "Nivo/Pages/AccountView/AccountView",
    component: AccountView,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AccountView>

const NOOP = () => {}

const LABELS: AccountViewLabels = {
    profile: {
        notificationsTitle: "Notifications",
        prefOptions: {
            notifyInvoiceCreated: {
                label: "New invoices",
                description: "Email me when an invoice is issued to my account.",
            },
            notifyServiceStatusChanged: {
                label: "Service status changes",
                description: "Email me when one of my products goes active, suspended, or completes.",
            },
            notifyExpiringSoon: {
                label: "Expiring soon",
                description: "Email me before a domain or subscription is due to expire.",
            },
        },
    },
    security: {
        title: "Two-factor authentication",
        disabledDescription: "Add a second step at sign-in with an authenticator app.",
        enableLabel: "Enable 2FA",
        enrollingInstruction: "Scan this QR code with your authenticator app.",
        secretLabel: "Or enter this code manually",
        confirmLabel: "Enter the 6-digit code",
        confirmButtonLabel: "Confirm & turn on",
        enabledDescription: "Two-factor authentication is on.",
        disableCodeLabel: "Enter the 6-digit code",
        disableLabel: "Disable 2FA",
    },
    securityEntryTitle: "Security",
    securityEntryEnabledText: "2FA on",
    securityEntryDisabledText: "2FA off",
    backToAccount: "Back to account",
    accessCardTitle: "Account access",
    changePasswordTitle: "Change password",
    changePasswordSubtitle: "Managed through Keycloak",
    activeSessionsTitle: "Active sessions",
    signOutTitle: "Log out",
}

const PREFERENCES: Record<NotificationPrefKey, boolean> = {
    notifyInvoiceCreated: true,
    notifyServiceStatusChanged: true,
    notifyExpiringSoon: false,
}

const ENROLLMENT: TwoFactorEnrollment = {
    secret: "JBSWY3DPEHPK3PXP",
    otpauthUri: "otpauth://totp/nivo:an.nguyen@gmail.com?secret=JBSWY3DPEHPK3PXP&issuer=nivo",
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    StackV: { tier: "frame", role: "the page's vertical rhythm between the identity/security blocks and the page's own rows" },
    LinkBack: { tier: "atom", role: "the back link up to the account profile" },
    SurfaceCardList: {
        tier: "composite",
        role: "the security entry row (profile sub-view) and the account-access rows (security sub-view) — nav affordances this page owns, not either block",
    },
    Chip: { tier: "atom", role: "the security entry's status chip, toned by whether 2FA is on" },
    AccountProfile: {
        tier: "block",
        role: "identity summary plus the notification switches",
        storyId: "nivo-blocks-account-accountprofile-accountprofile--default",
    },
    AccountSecurity: {
        tier: "block",
        role: "the 2FA panel — disabled / enrolling / enabled",
        storyId: "nivo-blocks-account-accountsecurity-accountsecurity--default",
    },
}

/** STATE — the page is still loading; the skeleton mirrors the `profile` shape. */
export const Loading: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AccountView"
                tier="screen"
                leaf="Loading"
                annotate={ANNOTATE}
                reason="A page's story is one complete state per render, not a leaf-per-prop map — a page has states to show, not props to enumerate. Before the first fetch resolves the page has no `view` to discriminate on yet, so it mirrors the landing `profile` shape: the identity card, the notifications card, and the security entry row all shimmering."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The account is still fetching. Every region draws its resting shape, matching the loaded profile exactly.",
                        code: "<AccountView isSkeleton labels={labels} />",
                        render: <AccountView isSkeleton labels={LABELS} />,
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the resolved profile, 2FA currently off. */
export const Profile: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AccountView"
                tier="screen"
                leaf="Profile"
                annotate={ANNOTATE}
                reason="The landing sub-view: `AccountProfile` (identity + notification switches) above a one-row security entry the page draws itself — no reusable block owns a nav link into its own sibling sub-view. The entry's chip tones off `twoFactorStatus`: warning while 2FA isn't on."
                states={[
                    {
                        name: "view = \"profile\", twoFactorStatus = \"disabled\"",
                        why: "2FA hasn't been turned on yet, so the security entry's chip reads \"2FA off\" in warning — pressing the row opens the security sub-view to fix that.",
                        code: `<AccountView
    view="profile"
    username="An Nguyen"
    email="an.nguyen@gmail.com"
    preferences={preferences}
    onTogglePref={toggle}
    twoFactorStatus="disabled"
    onOpenSecurity={openSecurity}
    onSignOut={signOut}
    labels={labels}
/>`,
                        render: (
                            <AccountView
                                view="profile"
                                username="An Nguyen"
                                email="an.nguyen@gmail.com"
                                avatarUrl={null}
                                preferences={PREFERENCES}
                                onTogglePref={NOOP}
                                twoFactorStatus="disabled"
                                onOpenSecurity={NOOP}
                                onSignOut={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "twoFactorStatus = \"enabled\"",
                        why: "The same profile once 2FA is on — the entry's chip flips to \"2FA on\" in success, the proof the chip reflects the resolved status rather than a fixed warning.",
                        code: "<AccountView twoFactorStatus=\"enabled\" … />",
                        render: (
                            <AccountView
                                view="profile"
                                username="An Nguyen"
                                email="an.nguyen@gmail.com"
                                avatarUrl={null}
                                preferences={PREFERENCES}
                                onTogglePref={NOOP}
                                twoFactorStatus="enabled"
                                onOpenSecurity={NOOP}
                                onSignOut={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** STATE — the security sub-view, mid-enrollment. */
export const Security: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AccountView"
                tier="screen"
                leaf="Security"
                annotate={ANNOTATE}
                reason="Opening the security entry swaps `view` to `security`: a `LinkBack` up to the profile sits above `AccountSecurity` (which owns the disabled/enrolling/enabled switch), then the account-access rows this page owns — change password hands off to Keycloak (external link), active sessions is a read-only count."
                states={[
                    {
                        name: "view = \"security\", status = \"enrolling\"",
                        why: "The user pressed the security entry and started enrolling 2FA — the QR/secret/confirm field render mid-flow, with the account-access rows unaffected below.",
                        code: `<AccountView
    view="security"
    status="enrolling"
    enrollment={enrollment}
    confirmCode=""
    onConfirmChange={setCode}
    onBeginEnroll={begin}
    onConfirmEnroll={confirm}
    onDisable={disable}
    passwordHref="https://id.nivo.vn/realms/nivo/account/#/security/signingin"
    activeSessionCount={1}
    onBack={backToProfile}
    onSignOut={signOut}
    labels={labels}
/>`,
                        render: (
                            <AccountView
                                view="security"
                                status="enrolling"
                                enrollment={ENROLLMENT}
                                confirmCode=""
                                onConfirmChange={NOOP}
                                onBeginEnroll={NOOP}
                                onConfirmEnroll={NOOP}
                                onDisable={NOOP}
                                passwordHref="https://id.nivo.vn/realms/nivo/account/#/security/signingin"
                                activeSessionCount={1}
                                onBack={NOOP}
                                onSignOut={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
