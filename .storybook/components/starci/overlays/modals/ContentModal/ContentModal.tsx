import React from "react"
import { ScrollShadow, Skeleton as HeroSkeleton } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"
import { ModalShell } from "@sb-components/composites/layout/ModalShell/ModalShell"
import { MarkdownContent } from "@sb-components/composites/viewers/MarkdownContent/MarkdownContent"

/**
 * `ContentModal` — fullscreen, presentational-only READ view of a content
 * entity (a lesson, a support article). Opened from anywhere via the app's
 * global overlay store; this port takes plain `isOpen`/`onOpenChange`/`content`
 * props instead of reading Zustand/Redux directly (Rule 13).
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
    /** Where this sits inside its parent. Appearance is not passable — it is already a prop. */
    classNames?: Array<AllowedClassName>
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
    classNames,
}: ContentModalProps) => (
    <div>
        <ModalShell
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            classNames={classNames}
            size="full"
            scroll="inside"
            bodyClassName="pb-6"
            header={() => (isSkeleton ? (
                <HeroSkeleton className="h-5 w-48 rounded" />
            ) : content?.title != null ? (
                <div className="[&_p]:m-0 [&_p]:inline">
                    <MarkdownContent
                        source={content.title}
                        measure="compact"


                    />
                </div>
            ) : null)}
            body={() => (
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
            )}
        />
    </div>
)

export { ContentModal }
