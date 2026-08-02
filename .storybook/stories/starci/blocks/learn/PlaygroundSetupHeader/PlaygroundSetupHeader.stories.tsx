import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundSetupHeader } from "@sb-components/starci/blocks/learn/PlaygroundSetupHeader/PlaygroundSetupHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `PlaygroundSetupHeader` — the identity cluster at the top of the playground Setup
 * screen: a way back to the playground hub, the exercise title, and its one-line
 * intro. Sibling of `ContentHeader` / `CourseBrief` but carries no meta cluster —
 * a playground exercise has no read state, outcomes, or counts. The single hop back
 * is a `LinkBack` placed directly in `PageHeader.breadcrumb`. One shape:
 * `isSkeleton` swaps `title`/`description` to their shimmer mirror in the same
 * slots; the back link never waits on the fetch, so it gets no skeleton.
 */
const meta: Meta<typeof PlaygroundSetupHeader> = {
    title: "StarCi/Blocks/Learn/PlaygroundSetupHeader/PlaygroundSetupHeader",
    component: PlaygroundSetupHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof PlaygroundSetupHeader>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the back link, title and description, owning the type scale and the seam between them", storyId: "composites-layout-page-pageheader--full" },
    "LinkBack": { tier: "atom", role: "the single hop back to the playground hub, sitting in the header's breadcrumb slot since a Setup screen has no trail to show", storyId: "atoms-navigation-link-linkback--default" },
    "Typography": { tier: "atom", role: "the exercise title or its one-line intro — real or its skeleton mirror while the exercise is still loading", storyId: "atoms-text-typography-typography--overview" },
}

/** LEAF — the only shape this block has: back link + title + description, no meta cluster. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="PlaygroundSetupHeader"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "title and description loaded",
                        why: "The learner opened this exercise straight from the playground hub, so the header shows the way back, the exercise title and its one-line intro copy — nothing else, because a playground exercise carries no read state, no outcomes and no module count to show.",
                        code: `<PlaygroundSetupHeader
    breadcrumbLabel="Playground"
    onBack={() => router.push("/playground")}
    title="Debug a leaking Node.js service"
    description="You'll audit an Express service that's leaking memory and track down where it's leaking."
/>`,
                        render: (
                            <PlaygroundSetupHeader

                               
                                breadcrumbLabel="Playground"
                                onBack={() => {}}
                                title="Debug a leaking Node.js service"
                                description="You'll audit an Express service that's leaking memory and track down where it's leaking."
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "The exercise fetch has not landed yet, so the title and description swap to their shimmer mirror in the exact size/weight `PageHeader` gives them, while the back link stays live — the caller already knows the hub label and the route before the exercise itself resolves.",
                        code: `<PlaygroundSetupHeader
    breadcrumbLabel="Playground"
    onBack={() => router.push("/playground")}
    title=""
    isSkeleton
/>`,
                        render: (
                            <PlaygroundSetupHeader
                                breadcrumbLabel="Playground"
                                onBack={() => {}}
                                title=""
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
