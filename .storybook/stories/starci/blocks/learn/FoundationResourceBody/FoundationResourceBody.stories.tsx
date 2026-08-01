import type { Meta, StoryObj } from "@storybook/nextjs"
import { FoundationResourceBody } from "@sb-components/starci/blocks/learn/FoundationResourceBody/FoundationResourceBody"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `FoundationResourceBody`: renders one foundation resource by `kind` —
 * a markdown article, an honestly-gapped video slot, or an "open link" button.
 *
 * ⭐ VIDEO IS A SCOPE CUT, NOT A STUB (§B3). No video-playback primitive exists
 * in the inventory, so this leaf draws the card CHROME a video resource gets
 * and an honest `EmptyState` gap instead of faking a player — see the
 * component file header for the full reasoning.
 *
 * ⭐ `onOpenLink` is a DEVIATION from `src`, which calls `window.open` itself.
 * A block never performs a business-decided side effect (rule 7) — this one
 * hands the resolved URL up and lets the screen decide what "open" means.
 *
 * 📐 THREE LEAVES = the three `kind`s (each a structurally different tree).
 * `isSkeleton` stays a STATE inside each leaf rather than its own leaf: unlike
 * `ContentHeader`/`ContentArticle` (where flipping the flag re-shapes several
 * composed parts at once), here it only ever swaps ONE atom — and for the
 * `document`/`video` leaves it has no visible effect at all (`SurfaceCard`
 * only shimmers a `label`/`description` this block never gives it), which is
 * exactly why those two states are shown as an honest near-blank card rather
 * than invented shimmer.
 */
const meta: Meta<typeof FoundationResourceBody> = {
    title: "StarCi/Blocks/Learn/FoundationResourceBody/FoundationResourceBody",
    component: FoundationResourceBody,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof FoundationResourceBody>

const MARKDOWN_BODY = `## What is the 12-Factor App

Twelve principles for writing services that run well on the cloud — config kept
separate from code, processes holding no state, logs written to stdout instead of
managed as files.

- Configure through environment variables, don't hard-code per environment
- Build → Release → Run stay separate, never edit code at the run step

\`\`\`bash
docker run -e DATABASE_URL=$DB_URL app:release-42
\`\`\`

> Read the original at 12factor.net before applying it to your own service.`

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the card face a document or a video slot sits on, owning the paper surface and the padding around whatever the leaf puts inside it", storyId: "composites-cards-surfacecard-surfacecard--default" },
    "MarkdownContent": { tier: "composite", role: "the viewer that repeats the authored resource body; the block hands it the markdown and never inspects what is in it", storyId: "composites-viewers-markdowncontent--reading" },
    "EmptyState": { tier: "composite", role: "the honestly-labeled gap standing in for a video player this pass does not build — chrome without a stub", storyId: "composites-feedback-emptystate-emptystate--icon-and-title" },
    "Button": { tier: "atom", role: "the whole-card CTA for an external resource, handing the resolved URL up to `onOpenLink` on press", storyId: "atoms-buttons-button-button--default" },
}

/** LEAF — `kind = "document"`: a reading article in a paper card. */
export const Document: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationResourceBody"
                tier="block"
                leaf="Document"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "kind = \"document\"",
                        why: "The resource is a written guide, so the block hands its markdown straight to the viewer inside the same paper card the lesson reader itself uses — a foundation article should not look like a different kind of document from a lesson.",
                        code: `<FoundationResourceBody
    kind="document"
    markdownBody={resource.value}
/>`,
                        render: (
                            <FoundationResourceBody

                               
                                kind="document"
                                markdownBody={MARKDOWN_BODY}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The card renders its own near-blank mirror while the resource is still being fetched — an honest empty surface rather than invented shimmer, since `SurfaceCard` only shimmers a `label`/`description` this leaf never gives it.",
                        code: "<FoundationResourceBody kind=\"document\" isSkeleton />",
                        render: <FoundationResourceBody kind="document" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `kind = "video"`: card chrome + an honestly-labeled §B3 gap. */
export const Video: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationResourceBody"
                tier="block"
                leaf="Video"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "kind = \"video\"",
                        why: "No video-playback primitive exists anywhere in the inventory yet, so the block draws the same card chrome the other two kinds sit in plus a named gap — an absent player is honest, a fake one that plays nothing is not.",
                        code: "<FoundationResourceBody kind=\"video\" />",
                        render: (
                            <FoundationResourceBody

                               
                                kind="video"
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Same near-blank mirror as the document leaf — the gap message is static chrome, not data, so there is nothing for the flag to actually shimmer here either.",
                        code: "<FoundationResourceBody kind=\"video\" isSkeleton />",
                        render: <FoundationResourceBody kind="video" isSkeleton />,
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — `kind = "external_link"`: a single "open" button, no card. */
export const ExternalLink: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="FoundationResourceBody"
                tier="block"
                leaf="ExternalLink"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "linkUrl set",
                        why: "The resource is just a pointer elsewhere, so the block draws one button and nothing more — no card face to fill with a single line of text. Pressing it hands the resolved URL to `onOpenLink`; the caller decides what \"open\" means (rule 7).",
                        code: `<FoundationResourceBody
    kind="external_link"
    linkTitle="Official Docker documentation"
    linkUrl="https://docs.docker.com"
    onOpenLink={(url) => window.open(url, "_blank", "noopener,noreferrer")}
/>`,
                        render: (
                            <FoundationResourceBody

                               
                                kind="external_link"
                                linkTitle="Official Docker documentation"
                                linkUrl="https://docs.docker.com"
                                onOpenLink={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The button itself swaps to its own shimmer pill while the resource is fetched — the one leaf where the flag has a real, visible effect, because `Button.isSkeleton` replaces the whole element rather than shimmering a slot this block never fills.",
                        code: "<FoundationResourceBody kind=\"external_link\" linkUrl=\"https://docs.docker.com\" isSkeleton />",
                        render: (
                            <FoundationResourceBody
                                kind="external_link"
                                linkUrl="https://docs.docker.com"
                                isSkeleton
                            />
                        ),
                    },
                    {
                        name: "linkUrl missing",
                        why: "Matches `src`: a link resource with nothing to point at renders nothing at all, rather than a button that dangles with no destination — an invented \"broken link\" affordance nobody asked for.",
                        code: "<FoundationResourceBody kind=\"external_link\" linkTitle=\"Documentation\" />",
                        render: <FoundationResourceBody kind="external_link" linkTitle="Documentation" />,
                    },
                ]}
            />
        </div>
    ),
}
