import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import {
    DomainDetailModal,
    type DomainDetailModalDomain,
    type DomainDetailModalLabels,
} from "@sb-components/nivo/blocks/domains/DomainDetailModal/DomainDetailModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `DomainDetailModal` — overlay modal over one `DomainEntity`: registered
 * date, expiry, and nameservers, with renew as the one primary action once
 * the domain is `expiring` or `expired`.
 */
const meta: Meta<typeof DomainDetailModal> = {
    title: "Nivo/Blocks/Domains/DomainDetailModal/DomainDetailModal",
    component: DomainDetailModal,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof DomainDetailModal>

const LABELS: DomainDetailModalLabels = {
    statusOptions: { active: "Active", expiring: "Expiring", expired: "Expired" },
    statusLabel: "Status",
    registeredLabel: "Registered",
    expiresLabel: "Expires",
    nameserversLabel: "Nameservers",
    renewalNudgeTitle: "This domain needs renewal",
    renewalNudgeDescription: "Renew now so your site stays reachable without interruption.",
    autoRenewLabel: "Auto-renew",
    closeLabel: "Close",
    renewLabel: "Renew now",
}

const DOMAIN_ACTIVE: DomainDetailModalDomain = {
    id: "dom-1",
    name: "lequang.com",
    status: "active",
    registeredAtLabel: "14/03/2025",
    expiresAtLabel: "14/03/2027",
    nameserversLabel: "ns1.nivo.vn, ns2.nivo.vn",
    autoRenew: true,
}

const DOMAIN_EXPIRING: DomainDetailModalDomain = {
    id: "dom-2",
    name: "academy.lequang.vn",
    status: "expiring",
    registeredAtLabel: "22/08/2025",
    expiresAtLabel: "22/08/2026",
    nameserversLabel: "ns1.nivo.vn, ns2.nivo.vn",
    autoRenew: false,
}

const DOMAIN_EXPIRED: DomainDetailModalDomain = {
    id: "dom-3",
    name: "old-portfolio.net",
    status: "expired",
    registeredAtLabel: "01/06/2024",
    expiresAtLabel: "01/06/2026",
    nameserversLabel: "ns1.nivo.vn, ns2.nivo.vn",
    autoRenew: false,
}

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    Callout: { tier: "composite", role: "the renewal nudge — only rendered for `expiring`/`expired`, never for `active`" },
    KeyValueList: { tier: "composite", role: "status, registered date, expiry date, and nameservers" },
    ChoiceSwitch: { tier: "atom", role: "the auto-renew toggle — disabled while its own mutation is in flight" },
    Button: { tier: "atom", role: "close (ghost) and renew-now (primary, busy while renewing)" },
}

/** Shared controlled wrapper — one `isOpen`/`isRenewing`/`autoRenew` state feeds every leaf state below. */
const ControlledDomainDetailModal = ({ domain }: { domain: DomainDetailModalDomain }) => {
    const [isOpen, setIsOpen] = useState(true)
    const [isRenewing, setIsRenewing] = useState(false)
    const [autoRenew, setAutoRenew] = useState(domain.autoRenew)

    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button label="Open domain" variant="secondary" size="sm" classNames={["self-start"]} onPress={() => setIsOpen(true)} />
            <DomainDetailModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
                domain={{ ...domain, autoRenew }}
                onRenew={() => setIsRenewing(true)}
                isRenewing={isRenewing}
                onAutoRenewChange={(_domainId, next) => setAutoRenew(next)}
                labels={LABELS}
            />
        </div>
    )
}

/** LEAF — `status` decides whether the renewal-nudge banner renders at all. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="DomainDetailModal"
                tier="block"
                leaf="status"
                annotate={ANNOTATE}
                reason="A presentational overlay modal, read-only over the domain's own fields — it never edits the name itself (that is `RegisterDomainModal`'s job). Renew is the one mutation it exposes, and the nudge banner reads straight off `status`: silent for `active`, a warning for `expiring`, a danger tone for `expired` — the same three-way vocabulary `DomainList`'s status chip already uses."
                states={[
                    {
                        name: "status = \"active\"",
                        why: "A healthy domain, well before its renewal window — no nudge banner, just the read-only facts.",
                        code: `<DomainDetailModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    domain={{ status: "active", … }}
    onRenew={renew}
    labels={labels}
/>`,
                        render: <ControlledDomainDetailModal domain={DOMAIN_ACTIVE} />,
                    },
                    {
                        name: "status = \"expiring\"",
                        why: "Inside the renewal window — a warning-toned nudge banner sits above the facts, and renew is the one action that matters here.",
                        code: "<DomainDetailModal domain={{ status: \"expiring\", … }} … />",
                        render: <ControlledDomainDetailModal domain={DOMAIN_EXPIRING} />,
                    },
                    {
                        name: "status = \"expired\"",
                        why: "Past its expiry — the same nudge banner escalates to a danger tone, since the site behind this domain may already be unreachable.",
                        code: "<DomainDetailModal domain={{ status: \"expired\", … }} … />",
                        render: <ControlledDomainDetailModal domain={DOMAIN_EXPIRED} />,
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The modal's own first fetch hasn't resolved yet, so every meta row shimmers instead of the resolved facts.",
                        code: "<DomainDetailModal isSkeleton … />",
                        render: (
                            <DomainDetailModal
                                isOpen
                                onOpenChange={() => {}}
                                domain={DOMAIN_ACTIVE}
                                onRenew={() => {}}
                                onAutoRenewChange={() => {}}
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
