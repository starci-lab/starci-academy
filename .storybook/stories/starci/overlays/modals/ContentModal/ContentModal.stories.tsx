import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { ContentModal } from "@sb-components/starci/overlays/modals/ContentModal/ContentModal"
import type { ContentModalDocument } from "@sb-components/starci/overlays/modals/ContentModal/ContentModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ContentModal` — fullscreen, presentational-only READ view of a content
 * entity (a lesson, a support article). Opened from anywhere via the app's
 * global overlay store; this port takes plain `isOpen`/`onOpenChange`/`content`
 * props instead of reading Zustand/Redux directly (Rule 13).
 */
const meta: Meta<typeof ContentModal> = {
    title: "StarCi/Overlays/Modals/ContentModal/ContentModal",
    component: ContentModal,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ContentModal>

// Real DOM (size="full" scroll="inside"): Modal.CloseTrigger + Modal.Header
// (only when content.title exists — MarkdownContent measure="compact") +
// Modal.Body > ScrollShadow > MarkdownContent measure="reading".
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "MarkdownContent (title)": { tier: "composite", role: "the entity title, inline/compact — one line in the dialog header", storyId: "composites-viewers-markdowncontent--compact" },
    "Modal.Body": { tier: "heroui", role: "the scrollable body region" },
    "MarkdownContent (body)": { tier: "composite", role: "the entity body, full reading measure", storyId: "composites-viewers-markdowncontent--reading" },
    "Skeleton": { tier: "heroui", role: "the header shimmer bar standing in for the entity title while `isSkeleton` — the body has no bare bar of its own, it delegates entirely to `MarkdownContent`'s own `isSkeleton` shape" },
}

const SAMPLE_DOCUMENT: ContentModalDocument = {
    title: "Introduction to Dependency Injection",
    body: `## Why Dependency Injection matters

Dependency Injection (DI) separates **creating** an object from **using** it.
Instead of a class instantiating its own dependencies, it receives them from
the outside — through a constructor, a property, or a method.

- Easier to test: swap a real dependency for a mock/stub.
- Less coupling: a class only needs to know the interface, not how to build the dependency.
- Easier to extend: swap the implementation without touching the consumer.

\`\`\`ts
class OrderService {
  constructor(private readonly paymentGateway: PaymentGateway) {}
}
\`\`\`

> Principle: "depend on abstractions, not on concrete details."

In frameworks like NestJS, the DI container automatically builds and injects
dependencies by scope (singleton, request, transient), so developers never
have to wire each layer together by hand.`,
}

/** Controlled wrapper — the trigger reopens the modal after it closes. */
const ControlledContentModal = ({
    content,
}: {
    content?: ContentModalDocument
}) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label="Open lesson"
                variant="secondary"
                size="sm"
                classNames={["self-start"]}
                onPress={() => setIsOpen(true)}
            />
            <BlockAnatomy
                name="ContentModal"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                reason="Owns the domain shape of a content entity (title + body, both markdown) and how each is read — title inline/compact as the header, body at full reading measure inside its own scroll region — while ModalShell only knows a header slot and MarkdownContent only knows a markdown document."
                states={[
                    {
                        name: "content loaded — title present, body scrolls",
                        why: "Both fields resolved: Modal.Header renders because content.title is set, and the body markdown fills past the viewport so ScrollShadow's fade shows at the bottom.",
                        code: `<ContentModal
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  content={{ title: "Introduction to Dependency Injection", body: "## Why..." }}
/>`,
                        render: (
                            <ContentModal
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                content={content}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    )
}

/** Content loaded: title renders the header, body fills the scrollable region. */
export const Default: Story = {
    render: () => <ControlledContentModal content={SAMPLE_DOCUMENT} />,
}

/** LEAF — the caller flips `isSkeleton`, DISTINCT from `content` being omitted (the source's own "no header, empty body" genuine-empty state, not a loading one — see the component file header's "TITLE IS CONDITIONAL" note). */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ContentModal"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                reason="Owns the domain shape of a content entity (title + body, both markdown) and how each is read — title inline/compact as the header, body at full reading measure inside its own scroll region — while ModalShell only knows a header slot and MarkdownContent only knows a markdown document."
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The entity is still in flight — a bare HeroUI `Skeleton` bar shimmers where the title would sit (there is no title text yet to mirror), while the body delegates entirely to `MarkdownContent`'s own `isSkeleton` shape rather than a second, unrelated bar.",
                        code: "<ContentModal isOpen={isOpen} onOpenChange={setIsOpen} isSkeleton />",
                        render: (
                            <ContentModal
                                isOpen
                                onOpenChange={() => {}}
                                isSkeleton
                                anatPart="ContentModal"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
