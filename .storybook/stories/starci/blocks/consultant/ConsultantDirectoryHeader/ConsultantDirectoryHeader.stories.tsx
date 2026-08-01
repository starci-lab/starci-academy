import type { Meta, StoryObj } from "@storybook/nextjs"
import { ConsultantDirectoryHeader } from "@sb-components/starci/blocks/consultant/ConsultantDirectoryHeader/ConsultantDirectoryHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ConsultantDirectoryHeader`: the DIRECTORY-IDENTITY cluster at the
 * top of the consultant directory screen. It answers one question, "what
 * directory is this", via a course-scoped breadcrumb trail, a title and an
 * optional one-line description.
 *
 * SIBLING OF `ContentHeader`/`FoundationsHeader`, NOT A COPY of either. All
 * three place identity into the same `PageHeader` frame with a `Breadcrumbs`
 * trail, but this one is deliberately THIN like `FoundationsHeader`: no
 * read-state chip, no meta row, no secondary card — the directory carries no
 * per-item progress, so there is nothing to summarize in a meta row.
 *
 * 📐 LEAF by STRUCTURE (§14d.2). Losing the `description` Typography is the
 * same MAGNITUDE of change as `FoundationsHeader`'s own description toggle —
 * one atom node inside an already-composed frame — so it stays a STATE of the
 * `Default` leaf. The caller flipping `isSkeleton` swaps every composed atom
 * for its own mirror, which is its own leaf, same as `ContentHeader`'s and
 * `FoundationsHeader`'s `Skeleton` leaf.
 *
 * ⛔ There is deliberately NO "no breadcrumb" leaf. The directory is always
 * reached through its course, so the trail always exists — building that leaf
 * would be inventing a case no screen asks for (§14d.3).
 */
const meta: Meta<typeof ConsultantDirectoryHeader> = {
    title: "StarCi/Blocks/Consultant/ConsultantDirectoryHeader/ConsultantDirectoryHeader",
    component: ConsultantDirectoryHeader,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ConsultantDirectoryHeader>

const CRUMBS = [
    { key: "courses", label: "Courses", onPress: () => {} },
    { key: "course", label: "DevOps Mastery", onPress: () => {} },
    { key: "directory", label: "Consultant directory" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "PageHeader": { tier: "composite", role: "the header frame that lines up the trail, title and description, owning the type scale for all three", storyId: "composites-layout-page-pageheader--full" },
    "Breadcrumbs": { tier: "atom", role: "the trail the block builds from crumb data handed down by the screen", storyId: "atoms-navigation-breadcrumbs-breadcrumbs--default" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — the directory title or its description, real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — full set: trail → title → optional description. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConsultantDirectoryHeader"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "with description",
                        why: "The directory has a one-sentence summary, so it renders directly below the title. This is the shape most course directories show, since the screen usually gives visitors a short pitch for who is listed.",
                        code: `<ConsultantDirectoryHeader
    breadcrumbItems={crumbs}
    title="Consultant directory"
    description="Book a 1:1 session with the consultants supporting the DevOps Mastery course."
/>`,
                        render: (
                            <ConsultantDirectoryHeader

                               
                                breadcrumbItems={CRUMBS}
                                title="Consultant directory"
                                description="Book a 1:1 session with the consultants supporting the DevOps Mastery course."
                            />
                        ),
                    },
                    {
                        name: "without description",
                        why: "No summary was authored for this directory, so the description line drops out and the header ends right after the title. The trail and title keep their place regardless — only this one line is optional.",
                        code: `<ConsultantDirectoryHeader
    breadcrumbItems={crumbs}
    title="Consultant directory"
/>`,
                        render: (
                            <ConsultantDirectoryHeader
                                breadcrumbItems={CRUMBS}
                                title="Consultant directory"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`, so every atom swaps to its own mirror. */
export const Skeleton: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConsultantDirectoryHeader"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "Every atom the block composes swaps to its own shimmer while the directory is still loading, keeping the exact box it will hand back. The flag reaches the real atoms rather than a parallel skeleton tree, which is why the header does not jump when the data lands.",
                        code: "<ConsultantDirectoryHeader title=\"\" isSkeleton />",
                        render: (
                            <ConsultantDirectoryHeader

                               
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
