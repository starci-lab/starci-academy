import type { Meta, StoryObj } from "@storybook/nextjs"
import { PlaygroundSetupHeader } from "@sb-components/starci/blocks/learn/PlaygroundSetupHeader/PlaygroundSetupHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `PlaygroundSetupHeader`: the IDENTITY cluster at the top of the
 * playground Setup screen — a way back to the playground hub, the exercise
 * title, and its one-line intro copy.
 *
 * SIBLING OF `ContentHeader` / `CourseBrief`, NOT A COPY. All three place
 * identity into `PageHeader`, but a playground exercise has neither a read
 * state, an outcomes list, nor a module/hour/learner count, so this block
 * carries NO meta cluster at all.
 *
 * ⭐ REUSE, NOT A NEW BACK ROW. `PageHeader.breadcrumb` already accepts a
 * plain anchor chain, so a Setup screen's single hop back to the hub is
 * `LinkBack` sitting directly in that slot — no one-crumb `Breadcrumbs`
 * array pretending to be a trail, and no outer `StackV` wrapping a single
 * `PageHeader` (that frame already owns its own breadcrumb-to-title seam).
 *
 * 📐 ONE LEAF. `isSkeleton` swaps `title`/`description` to their shimmer
 * mirror but keeps the same nodes in the same slots — a DATA condition, not
 * a structural one — so it is a STATE inside `Default`, not its own leaf.
 * The back link never gets a skeleton mirror: `breadcrumbLabel`/`onBack` are
 * supplied synchronously by the caller and never wait on the exercise fetch.
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
    "Typography": { tier: "atom", role: "the exercise title or its one-line intro — real or its skeleton mirror while the exercise is still loading", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the only shape this block has: back link + title + description, no meta cluster. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
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
    description="Bạn sẽ soát một service Express đang phình bộ nhớ và tìm ra chỗ rò."
/>`,
                        render: (
                            <PlaygroundSetupHeader
                                anatPart="PlaygroundSetupHeader"
                                showAnatomy
                                breadcrumbLabel="Playground"
                                onBack={() => {}}
                                title="Debug a leaking Node.js service"
                                description="Bạn sẽ soát một service Express đang phình bộ nhớ và tìm ra chỗ rò."
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
