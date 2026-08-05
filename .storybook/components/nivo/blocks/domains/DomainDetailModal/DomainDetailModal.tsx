import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ChoiceSwitch } from "@sb-components/atoms/forms/Choice/Choice"
import { Callout } from "@sb-components/composites/feedback/Callout/Callout"
import { KeyValueList } from "@sb-components/composites/data/KeyValue/KeyValue"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import type { SkeletonProps } from "@sb-components/frames/_slot"
import { StackV } from "@sb-components/frames/Stack/Stack"
import type { DomainStatusKey } from "@sb-components/nivo/blocks/domains/DomainList/DomainList"

/**
 * `DomainDetailModal` — overlay modal over one `DomainEntity`: registered
 * date, expiry, and nameservers, with renew as the one primary action once
 * the domain is `expiring` or `expired`.
 */

/** The one domain this modal is open on — a subset of `DomainEntity`. */
export interface DomainDetailModalDomain {
    /** Domain id — the {@link DomainDetailModalProps.onRenew} argument. */
    id: string
    /** Fully qualified domain name (`DomainEntity.name`) — the modal's own title. */
    name: string
    /** Current lifecycle status (`DomainEntity.status`). */
    status: DomainStatusKey
    /** Already-formatted registration date (`DomainEntity.registeredAt`). */
    registeredAtLabel: string
    /** Already-formatted expiry date, or null when unknown (`DomainEntity.expiresAt`). */
    expiresAtLabel?: string | null
    /** Assigned nameservers (`DomainEntity.nameservers`), joined for display by the connected layer. */
    nameserversLabel: string
    /** Current auto-renew flag (`DomainEntity.autoRenew`). */
    autoRenew: boolean
}

/** Props for {@link DomainDetailModal}. */
export interface DomainDetailModalProps {
    /** Whether the modal is currently open. Forwarded to `ModalShell`. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). Forwarded to `ModalShell`. */
    onOpenChange: (open: boolean) => void
    /** The domain this modal is open on. */
    domain: DomainDetailModalDomain
    /** Renew the domain a year forward — the connected layer runs the `renewDomain` mutation. */
    onRenew: (domainId: string) => void
    /** `true` → the renew mutation is in flight (renew button busy). */
    isRenewing?: boolean
    /** Flip auto-renew — the connected layer runs the `setDomainAutoRenew` mutation. */
    onAutoRenewChange: (domainId: string, nextAutoRenew: boolean) => void
    /** `true` → the auto-renew mutation is in flight (switch disabled). */
    isAutoRenewMutating?: boolean
    /**
     * `true` → the modal's own first fetch is in flight: every meta row
     * shimmers. Threaded straight down — never fed to a separate skeleton
     * tree.
     */
    isSkeleton?: boolean
    /** Already-localized copy. */
    labels: DomainDetailModalLabels
}

/** The already-resolved copy the modal renders. */
export interface DomainDetailModalLabels {
    /** The three status labels, keyed by status. */
    statusOptions: Record<DomainStatusKey, string>
    /** Label of the status meta row. */
    statusLabel: string
    /** Label of the registered-date meta row. */
    registeredLabel: string
    /** Label of the expiry meta row. */
    expiresLabel: string
    /** Label of the nameservers meta row. */
    nameserversLabel: string
    /** Title of the renewal-nudge banner, shown only for `expiring`/`expired`. */
    renewalNudgeTitle: string
    /** Supporting line of the renewal-nudge banner. */
    renewalNudgeDescription: string
    /** Label beside the auto-renew switch. */
    autoRenewLabel: string
    /** Close button label. */
    closeLabel: string
    /** Renew button label. */
    renewLabel: string
}

/** `expiring`/`expired` want the owner's attention now; `active` needs no nudge. */
const NEEDS_RENEWAL_NUDGE: Record<DomainStatusKey, boolean> = {
    active: false,
    expiring: true,
    expired: true,
}

/**
 * The domain-detail modal. See the file header for why renew is the only
 * mutation this modal exposes, and how the nudge banner reads off `status`.
 *
 * @param props - {@link DomainDetailModalProps}
 */
const DomainDetailModal = ({
    isOpen,
    onOpenChange,
    domain,
    onRenew,
    isRenewing = false,
    onAutoRenewChange,
    isAutoRenewMutating = false,
    isSkeleton = false,
    labels,
}: DomainDetailModalProps) => (
    <ModalShell
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={domain.name}
        size="md"
        isSkeleton={isSkeleton}
        body={({ isSkeleton }: SkeletonProps) => (
            <StackV
                gap={4}
                isSkeleton={isSkeleton}
                items={[
                    ...(!isSkeleton && NEEDS_RENEWAL_NUDGE[domain.status]
                        ? [() => (
                            <Callout
                                status={domain.status === "expired" ? "danger" : "warning"}
                                title={labels.renewalNudgeTitle}
                                description={labels.renewalNudgeDescription}
                            />
                        )]
                        : []),
                    () => (
                        <KeyValueList
                            isSkeleton={isSkeleton}
                            items={[
                                { key: "status", label: labels.statusLabel, value: labels.statusOptions[domain.status] },
                                { key: "registered", label: labels.registeredLabel, value: domain.registeredAtLabel },
                                { key: "expires", label: labels.expiresLabel, value: domain.expiresAtLabel ?? "—" },
                                { key: "nameservers", label: labels.nameserversLabel, value: domain.nameserversLabel },
                            ]}
                        />
                    ),
                    () => (
                        <ChoiceSwitch
                            isSelected={domain.autoRenew}
                            onValueChange={(value) => onAutoRenewChange(domain.id, value)}
                            label={labels.autoRenewLabel}
                            isDisabled={isAutoRenewMutating}
                            isSkeleton={isSkeleton}
                        />
                    ),
                ]}
            />
        )}
        footer={() => (
            <>
                <Button variant="ghost" label={labels.closeLabel} onPress={() => onOpenChange(false)} isDisabled={isRenewing} />
                <Button variant="primary" label={labels.renewLabel} onPress={() => onRenew(domain.id)} isPending={isRenewing} />
            </>
        )}
    />
)

export { DomainDetailModal }
