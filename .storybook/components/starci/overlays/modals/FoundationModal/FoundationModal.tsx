import React from "react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import {
    FoundationResourceBody,
    type FoundationKind,
} from "@sb-components/starci/blocks/learn/FoundationResourceBody/FoundationResourceBody"

/**
 * `FoundationModal` — a fullscreen overlay showing one foundation resource
 * (document / video / external link). Opened via the app's global overlay
 * store; this port takes plain `isOpen`/`onOpenChange` props. One leaf
 * (`Default`): the wrapper shape never changes across `kind` — only the
 * container width/scroll and which `FoundationResourceBody` leaf renders
 * inside, so `kind` is a state; the three structurally-different trees live one
 * level down inside `FoundationResourceBody`.
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
                body={() => (
                    <FoundationResourceBody
                        kind={kind}
                        markdownBody={markdownBody}
                        linkTitle={linkTitle}
                        linkUrl={linkUrl}
                        onOpenLink={onOpenLink}
                        isSkeleton={isSkeleton}


                    />
                )}
            />
        </div>
    )
}

export { FoundationModal }
