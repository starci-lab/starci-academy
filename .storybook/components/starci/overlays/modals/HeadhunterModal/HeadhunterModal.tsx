import React from "react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import {
    ConsultantProfileBody,
    type ConsultantProfileBodyConsultant,
} from "@sb-components/starci/blocks/consultant/ConsultantProfileBody/ConsultantProfileBody"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `HeadhunterModal`: the global overlay that shows ONE recruiting
 * consultant's profile — avatar, name, role, company link, blurb, and
 * contact links (or a CV-score gate). Same name as the real `src` component
 * (`src/components/modals/HeadhunterModal`) — this is the Storybook-driven
 * rebuild of that overlay, not a new idea.
 *
 * RULE 13 CONTRACT — plain `isOpen`/`onOpenChange`, no store wiring. The real
 * component reads `useHeadhunterOverlayState()` (Zustand) for open state and
 * `useAppSelector((s) => s.headhunter.entity)` for the entity, and resolves
 * `onOpenCompany`/`onImproveCv` into `router.push(...)` calls — all APP
 * WIRING, out of scope here. This block only takes the resolved consultant
 * plus two bare callbacks; the caller (screen/layout) decides what "open the
 * company" and "go improve my CV" actually navigate to.
 *
 * WHY DELEGATE TO `ConsultantProfileBody` INSTEAD OF DRAWING THE PROFILE HERE:
 * mirrors the `FoundationModal` / `FoundationResourceBody` split already in
 * this inventory — a modal's job is "how big is the frame, does it scroll",
 * never "what does a consultant profile look like". `ConsultantProfileBody`
 * already owns the avatar/name/role/company/blurb/contact-or-gate layout (see
 * its own file header for that contract); re-drawing it here would be the
 * exact `ContentTabBar` mistake this run is warned against — a worse
 * duplicate of a block that already exists, silently dropping behaviour while
 * still looking right on the happy path. This block's own job stops at the
 * modal chrome: title, container width, scroll behaviour.
 *
 * ⚠️ DEPENDENCY NOTE (2026-07-28) — `ConsultantProfileBody` did not exist yet
 * when this file's first draft started (confirmed absent by Glob) — a sibling
 * agent was building it concurrently in this same overlays/layouts batch, the
 * same accepted temporary state already seen elsewhere in this exact WIP tree
 * (e.g. `QaQuestionThread` importing not-yet-built `Qa*` siblings). It landed
 * before this file was finalized, so the import below is wired against its
 * REAL shape (`consultant.contactLinks: Array<ConsultantProfileBodyContactLink>`,
 * no `id`/`cvScoreUnlockThreshold` on the consultant itself — those are the
 * caller's own lookup keys, not fields this profile body reads).
 *
 * WHAT THIS BLOCK OWNS — exactly the domain decision the real component made
 * inline: a narrower container (`modal__container--narrow`, matches `src`
 * verbatim) with `scroll="inside"` — a profile card is short but its contact
 * row can wrap on narrow viewports, so the shell still caps height rather
 * than growing past the screen. `title` is hardcoded to the real product copy
 * (`src/messages/vi.json` → `headhuntings.modalTitle`) per rule 4 (a block
 * owns its own wording) — unlike `FoundationModal`'s per-resource title, this
 * modal always shows the same generic "profile" heading regardless of which
 * consultant is inside, so there is no per-instance string for a caller to
 * supply.
 *
 * 📐 ONE LEAF, consultant-presence is a STATE (§11f) — mirrors `src`'s own
 * `{headhunter ? (...) : null}` guard verbatim: the wrapper shape (`ModalShell`
 * header + body) never changes; only whether `ConsultantProfileBody` renders
 * inside changes. An absent consultant is not a second structurally-different
 * tree, so it does not earn a second leaf.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Real product copy (`headhuntings.modalTitle`) — the block owns this wording, not the caller. */
const MODAL_TITLE = "Hồ sơ headhunter"

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
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    showAnatomy?: boolean
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
    anatPart?: string
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
    showAnatomy = false,
    anatPart,
}: HeadhunterModalProps) => {
    return (
        <div data-anat-part={anatPart}>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={MODAL_TITLE}
                containerClassName="modal__container--narrow"
                scroll="inside"
                showAnatomy={showAnatomy}
            >
                {consultant ? (
                    <ConsultantProfileBody
                        consultant={consultant}
                        onOpenCompany={onOpenCompany}
                        onImproveCv={onImproveCv}
                        isSkeleton={isSkeleton}
                        showAnatomy={showAnatomy}
                        anatPart={showAnatomy ? "ConsultantProfileBody" : undefined}
                    />
                ) : null}
            </ModalShell>
        </div>
    )
}

export { HeadhunterModal }
