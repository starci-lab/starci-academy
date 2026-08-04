import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    AccountProfile,
    type AccountProfileLabels,
    type NotificationPrefKey,
} from "@sb-components/nivo/blocks/account/AccountProfile/AccountProfile"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `AccountProfile` — the user's identity summary plus their notification switches.
 * The switch values are DATA, so a row being on or off is a state of the single
 * shape. Grounded in the real `UserEntity` identity fields + the three notification
 * booleans.
 */
const meta: Meta<typeof AccountProfile> = {
    title: "Nivo/Blocks/Account/AccountProfile/AccountProfile",
    component: AccountProfile,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof AccountProfile>

const LABELS: AccountProfileLabels = {
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
}

const ALL_ON: Record<NotificationPrefKey, boolean> = {
    notifyInvoiceCreated: true,
    notifyServiceStatusChanged: true,
    notifyExpiringSoon: true,
}

const SOME_OFF: Record<NotificationPrefKey, boolean> = {
    notifyInvoiceCreated: true,
    notifyServiceStatusChanged: false,
    notifyExpiringSoon: false,
}

const NOOP = () => {}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    SurfaceCard: { tier: "composite", role: "the identity card and the notifications card" },
    Avatar: { tier: "atom", role: "the profile avatar (initials fallback when no image)" },
    ChoiceSwitch: { tier: "atom", role: "one toggle per notification preference; the label rides on the switch" },
    Typography: { tier: "atom", role: "the name, email, and each preference's description" },
}

/** LEAF — the profile has one shape; the switch values are DATA ⇒ states. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="AccountProfile"
                tier="block"
                leaf="Profile + notifications"
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xl"
                reason="Blocks take no `className`: the switch values are DATA, so all-on vs some-off are states of one shape, not separate leaves. The label rides on each `ChoiceSwitch` (so it is the switch's accessible name) with the longer description beneath, rather than a second visible copy of the label beside a bare toggle."
                states={[
                    {
                        name: "all preferences on",
                        why: "A user opted into every email: the three notification switches all read on. This is the default a freshly-created account starts from.",
                        code: `<AccountProfile
    username="Le Quang"
    email="quang@nivo.vn"
    preferences={allOn}
    onTogglePref={toggle}
    labels={labels}
/>`,
                        render: (
                            <AccountProfile
                                username="Le Quang"
                                email="quang@nivo.vn"
                                avatarUrl={null}
                                preferences={ALL_ON}
                                onTogglePref={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "some preferences off",
                        why: "The same profile with two switches turned off — the proof that each row reflects its own boolean independently, on or off, from the resolved preferences.",
                        code: "<AccountProfile preferences={someOff} … />",
                        render: (
                            <AccountProfile
                                username="Le Quang"
                                email="quang@nivo.vn"
                                avatarUrl={null}
                                preferences={SOME_OFF}
                                onTogglePref={NOOP}
                                labels={LABELS}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The profile's own first fetch hasn't resolved, so the same two cards keep their shape — avatar, name, email and every notification switch shimmering — matching the loaded profile so nothing jumps when it lands.",
                        code: `<AccountProfile
    username="Le Quang"
    email="quang@nivo.vn"
    preferences={allOn}
    onTogglePref={toggle}
    labels={labels}
    isSkeleton
/>`,
                        render: (
                            <AccountProfile
                                username="Le Quang"
                                email="quang@nivo.vn"
                                avatarUrl={null}
                                preferences={ALL_ON}
                                onTogglePref={NOOP}
                                labels={LABELS}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
