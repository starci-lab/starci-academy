import React from "react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import {
    FoundationResourceBody,
    type FoundationKind,
} from "@sb-components/starci/blocks/learn/FoundationResourceBody/FoundationResourceBody"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `FoundationModal`: the overlay that shows ONE foundation resource
 * (document / video / external link) full-screen. Same name as the real
 * `src` component (`src/components/modals/FoundationModal`) — this is the
 * Storybook-driven rebuild of that overlay, not a new idea.
 *
 * ⚠️ RELOCATED (2026-07-28) from `starci/blocks/learn/FoundationModal` to
 * `starci/overlays/modals/FoundationModal`. The component and its behaviour
 * are unchanged from the original build — only the folder moved. `kind:
 * overlay-modal` items live under `starci/overlays/modals/**` per the
 * app-folder split contract (`components/README.md`) and match the sibling
 * `ContentModal` precedent; the first pass filed this one alongside its
 * domain neighbours (`Foundation*` blocks) instead, which is the org-tier
 * (Rule 4/canon §4) mistake this move corrects. No consumer imported the old
 * path yet (grepped clean), so this is a pure relocation, not a breaking one.
 *
 * RULE 13 CONTRACT — plain `isOpen`/`onOpenChange`, no store wiring. The real
 * component reads `useFoundationOverlayState()` (Zustand) and
 * `useAppSelector` for the entity; both are APP WIRING, out of scope here —
 * this block only takes the resolved fields it needs as typed props.
 *
 * WHAT THIS BLOCK OWNS — exactly the domain decision the real component made
 * inline: `kind === "video"` gets a NARROWER container (`modal__container--narrow`)
 * and no inner scroll (video chrome fits the frame, nothing to scroll past);
 * every other kind gets the full-size container with `scroll="inside"` (a
 * document or a bare link button can run longer than the viewport). This is
 * why the block sits ABOVE `ModalShell` instead of the caller passing
 * `containerClassName`/`scroll` itself — `ModalShell` has no idea a
 * "foundation resource" or a "kind" exists.
 *
 * WHY DELEGATE TO `FoundationResourceBody` INSTEAD OF RE-SWITCHING ON `kind`
 * HERE: that block already owns the three-way dispatch (document/video/
 * external_link), including the video scope-cut and the `onOpenLink`
 * deviation (see its own file header). Re-implementing the switch here would
 * be the exact `ContentTabBar` mistake this run is warned against — a worse
 * duplicate of a composite/block that already exists, silently dropping
 * behaviour while still looking right on the happy path. This block's own
 * job stops at "how big is the frame, does it scroll" — a sizing decision
 * `FoundationResourceBody` has no business making, since it does not know it
 * is inside a modal at all.
 *
 * `size="full"` is not conditional — it matches `src` for every kind; only
 * `containerClassName`/`scroll` vary by kind. The real `src` component only
 * ever produces `document`/`video` kinds (`FoundationKind` enum has no
 * `external_link` member) — `external_link` is a `FoundationResourceBody`
 * capability this block inherits for free, sized the same as `document`
 * since it is not `video`.
 *
 * 📐 ONE LEAF. The wrapper shape (`ModalShell` header + body) never changes
 * across kinds — only the container's width class and scroll behavior (both
 * plain style props, not a different composed tree) and which
 * `FoundationResourceBody` leaf renders inside. `kind` is therefore a STATE of
 * this one leaf (§11f), not three leaves of this block; the three
 * structurally-different trees already live one level down, inside
 * `FoundationResourceBody`.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** Props for {@link FoundationModal}. */
export interface FoundationModalProps {
    /** Whether the modal is currently open. Forwarded to {@link ModalShell}. */
    isOpen: boolean
    /** Open-state change handler — backdrop click, Escape, close button. Forwarded to {@link ModalShell}. */
    onOpenChange: (open: boolean) => void
    /** The resource's own title, shown as the modal header. */
    title?: string
    /** Which shape the body renders — see the file header for the container/scroll decision this makes per kind. */
    kind: FoundationKind
    /** The document body, as authored markdown. Read when `kind === "document"`. */
    markdownBody?: string
    /** CTA label for the link button. Read when `kind === "external_link"`. */
    linkTitle?: string
    /** Destination URL for the link button. Read when `kind === "external_link"`. */
    linkUrl?: string
    /**
     * Fired with the resolved URL when the reader presses the link button.
     * The CALLER owns what "open" means (rule 7) — forwarded straight through
     * to {@link FoundationResourceBody}.
     */
    onOpenLink?: (url: string) => void
    /** `true` → the composed body mirrors itself while the resource is still resolving. */
    isSkeleton?: boolean
    /** When on, each composed part emits `data-anat-part` for a BlockAnatomy panel. */
    /** Anatomy tag: names this block so a BlockAnatomy panel can badge it on-render. */
}

/**
 * Renders one foundation resource inside the shared modal scaffold, sizing
 * the container by `kind`. See the file header for the full contract.
 *
 * @param props - {@link FoundationModalProps}
 */
const FoundationModal = ({
    isOpen,
    onOpenChange,
    title,
    kind,
    markdownBody,
    linkTitle,
    linkUrl,
    onOpenLink,
    isSkeleton = false,
}: FoundationModalProps) => {
    const isVideo = kind === "video"

    return (
        <div>
            <ModalShell
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title={title}
                size="full"
                containerClassName={isVideo ? "modal__container--narrow" : undefined}
                scroll={isVideo ? undefined : "inside"}

            >
                <FoundationResourceBody
                    kind={kind}
                    markdownBody={markdownBody}
                    linkTitle={linkTitle}
                    linkUrl={linkUrl}
                    onOpenLink={onOpenLink}
                    isSkeleton={isSkeleton}


                />
            </ModalShell>
        </div>
    )
}

export { FoundationModal }
