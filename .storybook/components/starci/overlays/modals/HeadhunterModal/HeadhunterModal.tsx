import React from "react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import {
    ConsultantProfileBody,
    type ConsultantProfileBodyConsultant,
} from "@sb-components/starci/blocks/consultant/ConsultantProfileBody/ConsultantProfileBody"

/**
 * `HeadhunterModal` — the global overlay that shows one recruiting consultant's
 * profile: avatar, name, role, company link, blurb, and contact links (or a CV-score
 * gate). Owns the modal chrome — a narrow container with inside scroll and a fixed
 * title; the profile layout itself is drawn by `ConsultantProfileBody`.
 *
 * Presentational: `isOpen`/`onOpenChange` + the resolved `consultant`, plus
 * `onOpenCompany`/`onImproveCv` callbacks. An absent consultant renders nothing.
 */

/** Real product copy (`headhuntings.modalTitle`) — the block owns this wording, not the caller. */
const MODAL_TITLE = "Headhunter profile"

/** Props for {@link HeadhunterModal}. */
export interface HeadhunterModalProps {
    /** Whether the modal is currently open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
    /** The consultant this overlay profiles. Absent renders an empty modal body — see the file header's state note. */
    consultant?: ConsultantProfileBodyConsultant
    /**
     * Fired when the reader presses the consultant's company button. The
     * CALLER owns what "open the company" means (rule 7) — forwarded
     * straight through to {@link ConsultantProfileBody}.
     */
    onOpenCompany?: () => void
    /**
     * Fired when the reader presses the CV-score gate's CTA. The CALLER owns
     * where "improve my CV" navigates (rule 7) — forwarded straight through
     * to {@link ConsultantProfileBody}.
     */
    onImproveCv?: () => void
    /** `true` → the composed body mirrors itself while the consultant is still resolving. */
    isSkeleton?: boolean
}

/**
 * Renders one consultant's profile inside the shared modal scaffold. See the
 * file header for the full contract.
 *
 * @param props - {@link HeadhunterModalProps}
 */
const HeadhunterModal = ({
    isOpen,
    onOpenChange,
    consultant,
    onOpenCompany,
    onImproveCv,
    isSkeleton = false,
}: HeadhunterModalProps) => {
    return (
        <div>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={MODAL_TITLE}
                containerClassName="modal__container--narrow"
                scroll="inside"
                body={() => (consultant ? (
                    <ConsultantProfileBody
                        consultant={consultant}
                        onOpenCompany={onOpenCompany}
                        onImproveCv={onImproveCv}
                        isSkeleton={isSkeleton}


                    />
                ) : null)}
            />
        </div>
    )
}

export { HeadhunterModal }
