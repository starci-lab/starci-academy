import type { Meta, StoryObj } from "@storybook/nextjs"
import { ConsultantDirectoryHeader } from "@sb-components/starci/blocks/consultant/ConsultantDirectoryHeader/ConsultantDirectoryHeader"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ConsultantDirectoryHeader` — the directory-identity cluster atop the
 * consultant directory screen: a course-scoped breadcrumb trail, a title, and an
 * optional one-line description. A thin `PageHeader` cluster with no read-state
 * chip or meta row. `description` is optional; `isSkeleton` swaps every atom for
 * its mirror. The breadcrumb trail always exists.
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
    "Typography": { tier: "atom", role: "one of the block's own text lines — the directory title or its description, real or its skeleton mirror", storyId: "atoms-text-typography-typography--overview" },
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
