import type { Meta, StoryObj } from "@storybook/nextjs"
import { ContentRelatedList } from "@sb-components/starci/blocks/learn/ContentRelatedList/ContentRelatedList"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ContentRelatedList`: what else in this course is worth reading after
 * this lesson. A quiet list, never a call to action.
 *
 * ⚠️ SELF-HIDES, AND THAT IS THE WHOLE POINT. With nothing related it draws
 * NOTHING — no card, no label, no empty state. This is the exact opposite of
 * `ContentDiscussion`, whose empty state MUST be drawn because silence there is
 * an invitation to write. Here silence only means the course has nothing else on
 * the subject, and announcing that absence is noise.
 *
 * Same state NAME, opposite behaviour: worth reading both blocks together before
 * touching either.
 *
 * ⚠️ NO SNIPPET (thầy 2026-07-28, "chế nhiều quá"): real `src` never quotes a
 * passage in this row — see the component's own file header. `breadcrumb`
 * (course trail, above the title) and `isLocked` (a quiet lock line, below)
 * replace it.
 *
 * 📐 LEAVES by STRUCTURE (§14d.2). Row count is DATA ⇒ a state of `Full`.
 * Rendering nothing (`Hidden`), the caller flipping `isSkeleton` (`Skeleton`),
 * and a row gaining the lock line (`Locked`) each add/remove a real node ⇒
 * their own leaf.
 */
const meta: Meta<typeof ContentRelatedList> = {
    title: "StarCi/Blocks/Learn/ContentRelatedList/ContentRelatedList",
    component: ContentRelatedList,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ContentRelatedList>

const ITEMS = [
    { key: "cache", title: "Image layer và cache hoạt động ra sao", breadcrumb: "Container hoá · Docker", href: "#cache" },
    { key: "multistage", title: "Multi-stage build: bỏ toolchain khỏi image chạy thật", breadcrumb: "Container hoá · Docker", href: "#multistage" },
    { key: "registry", title: "Đẩy image lên registry và ghim tag cho production", href: "#registry" },
]

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCardList": { tier: "composite", role: "the nested list surface, owning the label, the row box, the dividers and the row mirror while loading; the block only hands it lesson rows as data", storyId: "composites-cards-surfacecard-surfacecardlist--default" },
    "StackV": { tier: "frame", role: "one row's own column — breadcrumb, title, optional lock line", storyId: "frames-stack-stackv--default" },
    "Typography": { tier: "atom", role: "one line of a row — the breadcrumb, the title (underlines on hover), or the lock line", storyId: "atoms-text-typography-typography--plain" },
}

/** LEAF — the course has related reading. */
export const Full: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentRelatedList"
                tier="block"
                leaf="Full"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "items.length = 3, with breadcrumb",
                        why: "Three lessons on the same subject are offered under a quiet label, each row carrying the course trail above its title — not a quoted passage, which the real row never shows. The rows sit on a nested surface with no accent, because the reader already has one forward step in the pager and a second loud one would split their attention.",
                        code: `<ContentRelatedList
    label="Có thể bạn muốn đọc"
    items={related}
/>`,
                        render: (
                            <ContentRelatedList
                                anatPart="ContentRelatedList"
                                showAnatomy
                                label="Có thể bạn muốn đọc"
                                items={ITEMS}
                            />
                        ),
                    },
                    {
                        name: "items.length = 1, no breadcrumb",
                        why: "One match, and it carries no course trail (a top-level lesson), so the row is a single title line. The list keeps its label and its surface, which is what tells the reader this is a short answer rather than a broken one.",
                        code: `<ContentRelatedList
    label="Có thể bạn muốn đọc"
    items={[{ key: "registry", title: "Đẩy image lên registry và ghim tag cho production", href }]}
/>`,
                        render: (
                            <ContentRelatedList
                                label="Có thể bạn muốn đọc"
                                items={[ITEMS[2]]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — one result the viewer must enrol to open ⇒ **gains** the lock line. */
export const Locked: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentRelatedList"
                tier="block"
                leaf="Locked result"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "items[0].isLocked = true",
                        why: "A related result the viewer hasn't bought sets expectations before the click — a quiet lock line replaces where a snippet never was anyway (the backend strips it for locked rows too). The row still navigates; landing on the course's own enrol gate is the funnel, this only warns first.",
                        code: `<ContentRelatedList
    label="Có thể bạn muốn đọc"
    items={[{ key: "cache", title: "Image layer và cache hoạt động ra sao", breadcrumb: "Container hoá · Docker", isLocked: true, href }]}
/>`,
                        render: (
                            <ContentRelatedList
                                anatPart="ContentRelatedList"
                                showAnatomy
                                label="Có thể bạn muốn đọc"
                                items={[{ ...ITEMS[0], isLocked: true }]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — nothing related ⇒ the block renders **nothing at all**. */
export const Hidden: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentRelatedList"
                tier="block"
                leaf="Hidden"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "items = []",
                        why: "The course has nothing else on this subject, so the block draws no card, no label and no empty state — the frame below is deliberately blank. Announcing an absence nobody asked about would add a section that says only that it has nothing to say.",
                        code: "<ContentRelatedList label=\"Có thể bạn muốn đọc\" items={[]} />",
                        render: (
                            <ContentRelatedList
                                anatPart="ContentRelatedList"
                                showAnatomy
                                label="Có thể bạn muốn đọc"
                                items={[]}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the caller flips `isSkeleton`; the mirror shows even though empty would hide. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ContentRelatedList"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isSkeleton = true",
                        why: "The list draws its own row mirror while the course search is still running. The self-hide deliberately does not apply here: during the fetch we do not yet know the answer is empty, and hiding first then appearing would push the page down under a reader who had already started scrolling.",
                        code: "<ContentRelatedList label=\"Có thể bạn muốn đọc\" items={[]} isSkeleton />",
                        render: (
                            <ContentRelatedList
                                anatPart="ContentRelatedList"
                                showAnatomy
                                label="Có thể bạn muốn đọc"
                                items={[]}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
