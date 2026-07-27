import type { ReactNode } from "react"
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
 * rendered together inside the full-set leaf.
 */
const meta: Meta<typeof CourseBrief.Base> = {
    title: "Blocks/Learn/CourseBrief.Base",
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
    // The three nodes below ARE `Typography.Base` built by the block itself ⇒
    // they have their own door, must be declared
    // (decided 2026-07-27: "nothing is allowed to stand outside the tree").
    "Skeleton.Title": { tier: "atom", role: "title mirror while loading (h3 bold)", storyId: "atoms-text-typography-typography-base--plain" },
    "Skeleton.Description": { tier: "atom", role: "description mirror while loading (sm muted)", storyId: "atoms-text-typography-typography-base--plain" },
    Meta: { tier: "atom", role: "meta line — modules · study hours · learners, joined by ·", storyId: "atoms-text-typography-typography-base--plain" },
    "Page.Header": { tier: "primitive", role: "page-header FRAME — breadcrumb ↔ title ↔ description ↔ meta; the frame owns the type scale", storyId: "layouts-layout-page-page-header--full" },
    Breadcrumbs: { tier: "atom", role: "trail — the block builds it from crumb DATA", storyId: "atoms-navigation-breadcrumbs-breadcrumbs-base--default" },
}

const leafShell = (leaf: string, node: ReactNode, note?: ReactNode, code?: string) => (
    <div className="mx-auto max-w-3xl p-8">
        <BlockAnatomy
            name="CourseBrief.Base"
            tier="block"
            leaf={leaf}
            parts={[]}
            annotate={ANNOTATE}
            note={note}
            code={code}
        >
            {node}
        </BlockAnatomy>
    </div>
)

/** LEAF — full set: breadcrumb → course name → description → meta strip. Includes the long-trail case (state). */
export const Full: Story = {
    render: () =>
        leafShell(
            "Full",
            <div className="flex flex-col gap-8">
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
            </div>,
            "A long trail → the `Breadcrumbs` atom collapses itself into a back-link. Collapsing is behaviour INSIDE the atom ⇒ a state, not a leaf.",
            `<CourseBrief.Base
    breadcrumbItems={[{ key: "courses", label: "Courses", onPress: goToCourses }, { key: "course", label: "DevOps Mastery" }]}
    title="DevOps Mastery"
    description="From CI/CD to Kubernetes production — a hands-on path."
    moduleCount={8}
    hours={14}
    learnerCount={2481}
/>`,
        ),
}

/** LEAF — arriving straight from another page ⇒ **loses** the `Breadcrumbs` node. */
export const NoBreadcrumb: Story = {
    render: () =>
        leafShell(
            "No breadcrumb",
            <CourseBrief.Base
                anatPart="CourseBrief"
                showAnatomy
                title="DevOps Mastery"
                description="Từ CI/CD tới Kubernetes production — lộ trình thực chiến."
                moduleCount={8}
                hours={14}
                learnerCount={2481}
            />,
            undefined,
            `<CourseBrief.Base
    title="DevOps Mastery"
    description="From CI/CD to Kubernetes production — a hands-on path."
    moduleCount={8}
    hours={14}
    learnerCount={2481}
/>`,
        ),
}

/** LEAF — a brand-new course ⇒ **loses** both `Meta` and the description; the cluster shrinks to breadcrumb + name. */
export const TitleOnly: Story = {
    render: () =>
        leafShell(
            "Title only",
            <CourseBrief.Base
                anatPart="CourseBrief"
                showAnatomy
                breadcrumbItems={CRUMBS}
                title="DevOps Mastery"
            />,
            undefined,
            "<CourseBrief.Base breadcrumbItems={crumbs} title=\"DevOps Mastery\" />",
        ),
}

/**
 * LEAF prop `isSkeleton` — the tree is IDENTICAL to the real version (§12g.0a):
 * `isSkeleton` only changes STATE, no node lost/added (§11f), so the anatomy
 * tree reuses the `ANNOTATE` above, no separate parts array declared for this state.
 */
export const Skeleton: Story = {
    render: () =>
        leafShell(
            "Prop `isSkeleton`",
            <CourseBrief.Base
                anatPart="CourseBrief"
                showAnatomy
                isSkeleton
                title=""
            />,
            "Every line keeps the exact real text shape (name/description/meta strip) so nothing shifts when data arrives (§8).",
            `<CourseBrief.Base isSkeleton title="" />`,
        ),
}
