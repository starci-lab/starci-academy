import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { FoundationModal } from "@sb-components/starci/overlays/modals/FoundationModal/FoundationModal"
import type { FoundationModalProps } from "@sb-components/starci/overlays/modals/FoundationModal/FoundationModal"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `FoundationModal` — a fullscreen overlay showing one foundation resource
 * (document / video / external link). Opened via the app's global overlay
 * store; this port takes plain `isOpen`/`onOpenChange` props. One leaf
 * (`Default`): the wrapper shape never changes across `kind` — only the
 * container width/scroll and which `FoundationResourceBody` leaf renders
 * inside, so `kind` is a state; the three structurally-different trees live one
 * level down inside `FoundationResourceBody`.
 */
const meta: Meta<typeof FoundationModal> = {
    title: "StarCi/Overlays/Modals/FoundationModal/FoundationModal",
    component: FoundationModal,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof FoundationModal>

// Real DOM (size="full"): Modal.CloseTrigger + Modal.Header > Typography(title)
// + Modal.Body > FoundationResourceBody (one-level door — its own kind switch
// lives in its own story, see storyId below).
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Modal.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "Typography": { tier: "atom", role: "the resource's own title, shown as the modal header", storyId: "atoms-text-typography-typography--plain" },
    "Modal.Body": { tier: "heroui", role: "the body region — capped at 85vh with inner scroll for document/link, uncapped for video" },
    "FoundationResourceBody": { tier: "block", role: "renders the actual resource by `kind` — document article, video gap, or link button; its own three-way switch lives one level down in its own story", storyId: "starci-blocks-learn-foundationresourcebody-foundationresourcebody--document" },
}

const DOCUMENT_BODY = `## What is a 12-Factor App

Twelve principles for writing services that run well on the cloud — config
separated from code, processes that hold no state, logs written to stdout
instead of managing files yourself.

- Config through environment variables, never hard-coded per environment
- Build → Release → Run kept separate, no code changes at the run step

\`\`\`bash
docker run -e DATABASE_URL=$DB_URL app:release-42
\`\`\`

> Read the original at 12factor.net before applying it to your own service.`

/** Controlled wrapper — the trigger reopens the modal after it closes. */
const ControlledFoundationModal = ({
    triggerLabel,
    ...modalProps
}: {
    triggerLabel: string
} & Omit<FoundationModalProps, "isOpen" | "onOpenChange">) => {
    const [isOpen, setIsOpen] = useState(true)
    return (
        <div data-tier="fixture" className="flex flex-col gap-3 p-8">
            <Button
                label={triggerLabel}
                variant="secondary"
                size="sm"
                classNames={["self-start"]}
                onPress={() => setIsOpen(true)}
            />
            <FoundationModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
               

                {...modalProps}
            />
        </div>
    )
}

/**
 * ONE LEAF. `kind` is a state of this one wrapper shape — document gets a
 * full-size, inner-scrolling container; video gets a narrower, non-scrolling
 * one; external_link reuses the document sizing. `isSkeleton` is shown as a
 * fourth state, flowing straight into `FoundationResourceBody`.
 */
export const Default: Story = {
    render: () => (
        <BlockAnatomy
            name="FoundationModal"
            tier="block"
            leaf="Default"
            parts={[]}
            annotate={ANNOTATE}
            reason={"Owns exactly the domain decision the real component made inline: a video resource gets a narrower container with no inner scroll, every other kind gets the full-size container with `scroll=\"inside\"`. Delegates the actual kind switch to `FoundationResourceBody` instead of re-implementing it."}
            states={[
                {
                    name: "kind = \"document\" — full container, scroll inside",
                    why: "A written guide can run longer than the viewport, so the shell caps itself at 85vh and scrolls the body internally rather than growing the modal past the screen.",
                    code: `<FoundationModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    title="12-Factor App"
    kind="document"
    markdownBody={resource.value}
/>`,
                    render: (
                        <ControlledFoundationModal
                            triggerLabel="Open document resource"
                            title="12-Factor App"
                            kind="document"
                            markdownBody={DOCUMENT_BODY}
                        />
                    ),
                },
                {
                    name: "kind = \"video\" — narrow container, no scroll",
                    why: "The video chrome is meant to fit the frame exactly — no page-length content to scroll past — so the block asks for the narrower `modal__container--narrow` class and leaves `scroll` unset instead of `\"inside\"`.",
                    code: `<FoundationModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    title="Introduction to Docker"
    kind="video"
/>`,
                    render: (
                        <ControlledFoundationModal
                            triggerLabel="Open video resource"
                            title="Introduction to Docker"
                            kind="video"
                        />
                    ),
                },
                {
                    name: "kind = \"external_link\" — full container, scroll inside",
                    why: "A bare link button never runs long, but it gets the same full-size, inner-scrolling container as a document — only `video` earns the narrower frame.",
                    code: `<FoundationModal
    isOpen={isOpen}
    onOpenChange={setIsOpen}
    title="Official Docker documentation"
    kind="external_link"
    linkTitle="Open documentation"
    linkUrl="https://docs.docker.com"
    onOpenLink={(url) => window.open(url, "_blank", "noopener,noreferrer")}
/>`,
                    render: (
                        <ControlledFoundationModal
                            triggerLabel="Open link resource"
                            title="Official Docker documentation"
                            kind="external_link"
                            linkTitle="Open documentation"
                            linkUrl="https://docs.docker.com"
                            onOpenLink={() => {}}
                        />
                    ),
                },
                {
                    name: "isSkeleton = true",
                    why: "The flag flows straight down into `FoundationResourceBody` (the shell itself has no data of its own to shimmer besides the caller-given title) — the document card mirrors itself while the resource is still resolving.",
                    code: "<FoundationModal isOpen={isOpen} onOpenChange={setIsOpen} kind=\"document\" isSkeleton />",
                    render: (
                        <ControlledFoundationModal
                            triggerLabel="Open loading resource"
                            kind="document"
                            isSkeleton
                        />
                    ),
                },
            ]}
        />
    ),
}
