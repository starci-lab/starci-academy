import React from "react"
import { ScrollShadow, Skeleton as HeroSkeleton } from "@heroui/react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * BLOCK — `ContentModal`: fullscreen READ view of a content entity (a lesson,
 * a support article), opened from anywhere in the app.
 *
 * OVERLAY, PRESENTATIONAL ONLY (Rule 13 / canon §11a "screen owns overlay
 * store"). The real `src/components/modals/ContentModal/index.tsx` reads
 * `isOpen`/`content` off `useContentOverlayState()` (Zustand) and Redux
 * (`state.content.entity`) directly — that wiring is APP-LEVEL, same discipline
 * as a page never wiring its own router. This port takes the same two things
 * as PLAIN PROPS instead: `isOpen`/`onOpenChange` (open state) and `content`
 * (the entity to read). The caller — the real overlay-store hook, in `src` —
 * is responsible for supplying both.
 *
 * WHY IT EARNS A BLOCK LAYER (not just a bare `ModalShell` call from the
 * screen): it decides the DOMAIN shape — a content entity has a `title` and a
 * `body`, both markdown — and it decides HOW each field is read: the title
 * inline/compact (so it sits as one line of `Modal.Header`, matching the
 * legacy `[&_p]:m-0 [&_p]:inline` override), the body at full reading measure,
 * scrollable independently of the header. A composite (`ModalShell`,
 * `MarkdownContent`) does not know any of that — it only knows "a header slot"
 * and "a markdown document". Wired to `ModalShell`'s `header` prop (not `title`)
 * on purpose: `title` funnels its value through `Typography`'s `text` prop,
 * which would wrap this already-styled `MarkdownContent` node in a second,
 * conflicting text style — `header` renders custom content as-is.
 *
 * TITLE IS CONDITIONAL, BODY IS NOT. Mirrors the source 1:1: `content?.title`
 * gates whether `Modal.Header` renders at all (no header the source line
 * `content?.title ? <MarkdownContent .../> : null`), while the body always
 * renders — `content?.body ?? ""` — because a modal with a header but no body
 * frame reads as a bug, not a valid empty state.
 *
 * SCROLL LIVES ON THE BODY, NOT THE SHELL, on purpose (matches source): the
 * shell is asked for `scroll="inside"` (caps the container so the modal itself
 * never grows past `85vh`), and the actual scrolling box is the `ScrollShadow`
 * around the body markdown — same split the legacy component makes, kept
 * rather than collapsed into one for this port.
 * ─────────────────────────────────────────────────────────────────────────────
 */

/** The content entity `ContentModal` reads — a title and a body, both markdown. */
export interface ContentModalDocument {
    /** Entity title, markdown. Rendered inline/compact as the dialog header. */
    title: string
    /** Entity body, markdown. Rendered at full reading measure, scrolls independently. */
    body: string
}

/** Props for {@link ContentModal}. */
export interface ContentModalProps {
    /** Whether the modal is currently open. */
    isOpen: boolean
    /** Open-state change handler (backdrop click, Escape, close button). */
    onOpenChange: (open: boolean) => void
    /**
     * The entity being read. `undefined` while the caller has not resolved
     * which entity to show yet — the modal still opens, with no header and an
     * empty body, rather than the block deciding to withhold itself.
     */
    content?: ContentModalDocument
    /**
     * `true` → shimmer the header + body while the entity is still in flight,
     * DISTINCT from `content` being omitted (which the source itself models as
     * a genuine "no header, empty body" state, not a loading one — see the
     * file header's own "TITLE IS CONDITIONAL" note).
     */
    isSkeleton?: boolean
    /** Extra classes merged onto the dialog. */
    className?: string
}

/**
 * Fullscreen read view of a content entity. See the file header for the full
 * contract and the judgement calls made porting it off the Zustand/Redux source.
 *
 * @param props - {@link ContentModalProps}
 */
const ContentModal = ({
    isOpen,
    onOpenChange,
    content,
    isSkeleton = false,
    className,
}: ContentModalProps) => (
    <div>
        <ModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            className={className}
            size="full"
            scroll="inside"
            bodyClassName="pb-6"
            header={isSkeleton ? (
                <HeroSkeleton className="h-5 w-48 rounded" />
            ) : content?.title != null ? (
                <div className="[&_p]:m-0 [&_p]:inline">
                    <MarkdownContent
                        source={content.title}
                        measure="compact"


                    />
                </div>
            ) : null}

        >
            <ScrollShadow hideScrollBar>
                {isSkeleton ? (
                    <MarkdownContent source="" isSkeleton />
                ) : (
                    <MarkdownContent
                        source={content?.body ?? ""}
                        measure="reading"


                    />
                )}
            </ScrollShadow>
        </ModalShell>
    </div>
)

export { ContentModal }
