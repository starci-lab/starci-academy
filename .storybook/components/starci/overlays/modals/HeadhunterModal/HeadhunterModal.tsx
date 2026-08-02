import React from "react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import {
    ConsultantProfileBody,
    type ConsultantProfileBodyConsultant,
} from "@sb-components/starci/blocks/consultant/ConsultantProfileBody/ConsultantProfileBody"

/**
 * `HeadhunterModal` — global overlay that shows ONE recruiting consultant's
 * profile (avatar, name, role, company link, blurb, contact links or a
 * CV-score gate). Opened from anywhere via the app's global overlay store;
 * this port takes plain `isOpen`/`onOpenChange` props instead of reading
 * Zustand/Redux directly (Rule 13).
 *
 * ONE LEAF (`Default`). The wrapper shape never changes — only whether a
 * consultant is present (renders the profile body vs. an empty modal body,
 * mirroring `src`'s own `{headhunter ? (...) : null}` guard) is a STATE of
 * this one leaf, not a second leaf, since the wrapper tree itself never
 * changes shape.
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
