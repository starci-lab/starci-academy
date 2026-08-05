import React from "react"
import { AdBanner } from "@/components/features/dashboard/AdBanner"
import { ModalShell } from "@/components/composites/layout/ModalShell"
import type { QueryActiveAdvertisementData } from "@/modules/api/graphql/queries/types/active-advertisement"
import type { CallerIdentity } from "@/components/frames/_identity"

/** This component's identity — worn by {@link ModalShell}'s root instead of a wrapper div. See `_identity.ts`. */
const IDENTITY: CallerIdentity = { tier: "overlay", component: "AdModal" }

/** All display text, already localized by the connected `AdModal`; a story passes i18n keys. */
export interface AdModalLabels {
    /** Modal title (`t("dashboard.adModalTitle")`). */
    title: string
}

/** Props for {@link _AdModal} — presentational; all data resolved, no fetch/store/i18n. */
export interface AdModalProps {
    /** Whether the modal is currently open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
    /**
     * The active advertisement to render. The connected `AdModal` only ever mounts this
     * component once an ad is stashed, so this is never `null` here.
     */
    ad: QueryActiveAdvertisementData
    labels: AdModalLabels
}

/**
 * Interstitial ad modal — the presentational half of {@link AdModal}: shows the active ad
 * (image / video / carousel) via the shared {@link AdBanner} inside {@link ModalShell}.
 * Dismissable, so the viewer can close it and keep reading the free lesson. See
 * `tiers/split.md` — the connected `index.tsx` owns the overlay store and i18n.
 *
 * @param props - {@link AdModalProps}
 */
export const _AdModal = ({
    isOpen,
    onOpenChange,
    ad,
    labels,
}: AdModalProps) => (
    <ModalShell
        identity={IDENTITY}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        title={labels.title}
        body={() => <AdBanner ad={ad} />}
    />
)
