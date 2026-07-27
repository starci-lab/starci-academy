import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseBrief } from "@sb-components/blocks/learn/CourseBrief/CourseBrief"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `CourseBrief.Base`: the COURSE-IDENTITY cluster at the top of a page.
 *
 * Exists because of a TIER BOUNDARY: a screen must not hold the `Page.Header`
 * frame (layout) or the `Breadcrumbs` atom directly. The block takes **DATA**
 * (`breadcrumbItems` is a crumb array) and builds the atom itself — leaving it
 * as `breadcrumb?: ReactNode` would force the screen to hold an atom again.
 *
 * ⚠️ Meta is a **muted text strip joined by `·`**, NOT a chip (confirmed by
 * eyeballing it).
 *
 * 📐 **LEAF by STRUCTURE** (§14d.2): the two leaves below are REAL leaves because
 * they **lose a node**. A long trail only changes the crumb count ⇒ a STATE,
 * rendered together inside the full-set leaf's `states[]` (thầy chốt bố cục C,
 * 2026-07-27) — `leafShell` đã bị xoá vì nó chỉ để xếp state tay.
 */
const meta: Meta<typeof CourseBrief.Base> = {
    title: "Blocks/Learn/CourseBrief/CourseBrief.Base",
    component: CourseBrief.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof CourseBrief.Base>

const CRUMBS = [
    { key: "courses", label: "Khoá học", onPress: () => {} },
    { key: "course", label: "DevOps Mastery" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    // ⭐ 2026-07-27 (instructor: "a screen has layout components too, and they go
    // into the deps tree, then RECURSE into its children"): a FRAME is a DEP at
    // EVERY tier too. Without it the tree reads without knowing what this block
    // is laid out with — and the frame is exactly what decides the shape.
    // The node below IS `Typography.Base` built by the block itself, for the title, the
    // description, and the meta line alike (real content or its skeleton mirror) ⇒ it has
    // its own door, must be declared (decided 2026-07-27: "nothing is allowed to stand
    // outside the tree").
    "Typography.Base": { tier: "atom", role: "one of the header's own text lines — the course title, its description, or the modules/hours/learners meta strip — real or its skeleton mirror", storyId: "atoms-text-typography-typography-base--plain" },
    "Page.Header": { tier: "composite", role: "the page-header frame that lines up the breadcrumb, title, description, and meta line, owning the type scale for all four", storyId: "composites-layout-page-page-header--full" },
    "Breadcrumbs.Base": { tier: "atom", role: "the trail the block builds from crumb data handed down by the caller", storyId: "atoms-navigation-breadcrumbs-breadcrumbs-base--default" },
}

/** LEAF — full set: breadcrumb → course name → description → meta strip. Includes the long-trail case (state). */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="CourseBrief.Base"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "breadcrumbItems.length = 2",
                        why: "The full cluster renders in order: a two-crumb trail, the course title, the description, and the meta line listing modules, hours, and learners. This is the shape most course pages land in once every field the block reads has resolved.",
                        code: `<CourseBrief.Base
    breadcrumbItems={[{ key: "courses", label: "Courses", onPress: goToCourses }, { key: "course", label: "DevOps Mastery" }]}
    title="DevOps Mastery"
    description="From CI/CD to Kubernetes production — a hands-on path."
    moduleCount={8}
    hours={14}
    learnerCount={2481}
/>`,
                        render: (
                            <CourseBrief.Base
                                anatPart="CourseBrief"
                                showAnatomy
                                breadcrumbItems={CRUMBS}
                                title="DevOps Mastery"
                                description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                                moduleCount={8}
                                hours={14}
                                learnerCount={2481}
                            />
                        ),
                    },
                    {
                        name: "breadcrumbItems.length = 5",
                        why: "The `Breadcrumbs` atom collapses its five-crumb trail into a single back link instead of spelling out every step. Collapsing a long trail keeps the header on one line, and the collapsing behaviour lives inside the atom itself rather than being a shape this block draws.",
                        code: `<CourseBrief.Base
    breadcrumbItems={[
        { key: "home", label: "Home", onPress: goHome },
        { key: "courses", label: "Courses", onPress: goToCourses },
        { key: "devops", label: "DevOps", onPress: goToDevOps },
        { key: "module", label: "Chapter 2", onPress: goToModule },
        { key: "course", label: "Containerization" },
    ]}
    title="DevOps Mastery"
    moduleCount={8}
    hours={14}
/>`,
                        render: (
                            <CourseBrief.Base
                                breadcrumbItems={[
                                    { key: "home", label: "Trang chủ", onPress: () => {} },
                                    { key: "courses", label: "Khoá học", onPress: () => {} },
                                    { key: "devops", label: "DevOps", onPress: () => {} },
                                    { key: "module", label: "Chương 2", onPress: () => {} },
                                    { key: "course", label: "Container hoá" },
                                ]}
                                title="DevOps Mastery"
                                moduleCount={8}
                                hours={14}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — arriving straight from another page ⇒ **loses** the `Breadcrumbs` node. */
export const NoBreadcrumb: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="CourseBrief.Base"
                tier="block"
                leaf="No breadcrumb"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "breadcrumbItems = undefined",
                        why: "The `Breadcrumbs` node drops out entirely, leaving the title as the first line the reader sees. This is the shape for a viewer who lands straight on the course page rather than clicking through a listing, so there is no trail behind them to show.",
                        code: `<CourseBrief.Base
    title="DevOps Mastery"
    description="From CI/CD to Kubernetes production — a hands-on path."
    moduleCount={8}
    hours={14}
    learnerCount={2481}
/>`,
                        render: (
                            <CourseBrief.Base
                                anatPart="CourseBrief"
                                showAnatomy
                                title="DevOps Mastery"
                                description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                                moduleCount={8}
                                hours={14}
                                learnerCount={2481}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — a brand-new course ⇒ **loses** both `Meta` and the description; the cluster shrinks to breadcrumb + name. */
export const TitleOnly: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="CourseBrief.Base"
                tier="block"
                leaf="Title only"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "description = undefined, moduleCount/hours/learnerCount = undefined",
                        why: "Both the `Meta` line and the description drop out, shrinking the cluster down to just the breadcrumb and the course name. A brand-new course has no module count, study hours, or learner count to report yet, so the block shows only what it actually knows.",
                        code: "<CourseBrief.Base breadcrumbItems={crumbs} title=\"DevOps Mastery\" />",
                        render: (
                            <CourseBrief.Base
                                anatPart="CourseBrief"
                                showAnatomy
                                breadcrumbItems={CRUMBS}
                                title="DevOps Mastery"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * LEAF prop `isSkeleton` — the tree is IDENTICAL to the real version (§12g.0a):
 * `isSkeleton` only changes STATE, no node lost/added (§11f), so the anatomy
 * tree reuses the `ANNOTATE` above, no separate parts array declared for this state.
 */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="CourseBrief.Base"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton",
                        why: "Every line keeps the exact real text shape, the name, description, and meta strip, so nothing shifts once the data arrives (§8). No node is lost or added compared to the full leaf; only the content each line shows changes.",
                        code: "<CourseBrief.Base isSkeleton title=\"\" />",
                        render: (
                            <CourseBrief.Base
                                anatPart="CourseBrief"
                                showAnatomy
                                isSkeleton
                                title=""
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
