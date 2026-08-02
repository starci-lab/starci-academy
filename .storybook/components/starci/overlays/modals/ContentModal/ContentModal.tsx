import React from "react"
import { ScrollShadow, Skeleton as HeroSkeleton } from "@heroui/react"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"

/**
 * `ContentModal` — the fullscreen read view of a content entity (a lesson, a support
 * article), opened from anywhere. Renders the markdown title inline in the header
 * and the markdown body at full reading measure, scrolling independently (the shell
 * caps at 85vh, the body's `ScrollShadow` scrolls). The header renders only when a
 * title is present; the body always renders.
 *
 * Presentational: `isOpen`/`onOpenChange` + `content`.
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
            body={
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
            }
        />
    </div>
)

export { ContentModal }
