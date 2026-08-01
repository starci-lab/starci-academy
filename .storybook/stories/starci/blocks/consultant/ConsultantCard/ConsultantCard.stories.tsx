import type { Meta, StoryObj } from "@storybook/nextjs"
import { ConsultantCard } from "@sb-components/starci/blocks/consultant/ConsultantCard/ConsultantCard"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * BLOCK — `ConsultantCard`: ONE recruiting consultant as a self-contained
 * pressable tile — photo, name, role, company, blurb — opening their profile
 * on press. A domain identity block reusable wherever one consultant needs to
 * be shown (`ConsultantDirectoryGrid`'s tiles today, a profile overlay
 * tomorrow).
 *
 * BUILT ON `SurfaceCard.Pressable` (composite navigation frame), NOT a
 * hand-rolled `<button>` around bare `Image`/`Typography` atoms — the exact
 * regression this run exists to correct (see `ContentModeNav`'s file header).
 *
 * 📐 TWO LEAVES by STRUCTURE (§14d.2). `jobTitle`/`companyTitle`/`description`
 * are each conditionally drawn — losing all three at once removes THREE nodes
 * from the tree, so `Minimal` earns its own leaf rather than being three
 * separate states layered onto `Default`. `isSkeleton`, by contrast, keeps the
 * exact same tree (all three optional rows still render, now as shimmer, same
 * convention as `ContentHeader`'s outcomes card during loading) — so it stays
 * a STATE inside `Default`, not a third leaf.
 */
const meta: Meta<typeof ConsultantCard> = {
    title: "StarCi/Blocks/Consultant/ConsultantCard/ConsultantCard",
    component: ConsultantCard,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof ConsultantCard>

// PNG base64 1×1 — loads reliably (fires onLoad) without a network fetch, same
// convention as the `Image` atom's own story.
const PHOTO_SRC =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=="

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "SurfaceCard": { tier: "composite", role: "the whole-card press target, giving the tile its surface face, hover/press feedback and keyboard focus ring — the block only supplies the id it presses with", storyId: "composites-cards-surfacecard-surfacecard--pressable" },
    "StackV": { tier: "frame", role: "the vertical frame stacking photo, identity cluster, company row and blurb as one card body — reused at two nesting levels, the inner one holding just name + role as a tighter unit", storyId: "frames-stack-stackv--default" },
    "Image": { tier: "atom", role: "the consultant's photo, owning its own loading skeleton and fallback glyph so the block never has to branch on load state itself", storyId: "atoms-media-image-image--with-image" },
    "Typography": { tier: "atom", role: "one of the block's own text lines — name, role, company (with its leading building icon) or blurb — real or its skeleton mirror", storyId: "atoms-text-typography-typography--plain" },
}

const FULL_CONSULTANT = {
    id: "consultant-1",
    fullName: "Hannah Nguyen",
    jobTitle: "Backend Recruiting Specialist",
    companyTitle: "TechCorp Vietnam",
    description: "5 years recruiting backend engineers for product companies. Has interviewed over 300 candidates.",
    avatarUrl: PHOTO_SRC,
}

/** LEAF — full set: photo → name+role → company → blurb. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConsultantCard"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xs"
                states={[
                    {
                        name: "full data",
                        why: "Every optional row is present, so the tile reads top to bottom as photo, name, role, company and a short blurb — the full identity a visitor needs before deciding to open this consultant's profile.",
                        code: `<ConsultantCard
    consultant={{
        id: "consultant-1",
        fullName: "Hannah Nguyen",
        jobTitle: "Backend Recruiting Specialist",
        companyTitle: "TechCorp Vietnam",
        description: "5 years recruiting backend engineers for product companies. Has interviewed over 300 candidates.",
        avatarUrl: photoUrl,
    }}
    onOpen={(id) => openProfile(id)}
/>`,
                        render: (
                            <ConsultantCard

                               
                                consultant={FULL_CONSULTANT}
                                onOpen={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isSkeleton = true",
                        why: "Photo and every text line switch to their own shimmer while the consultant list is still loading, and the tile stops accepting presses — there is no id to open yet. All three optional rows still render as bars, because at this point the block does not yet know which of them the real consultant will have.",
                        code: `<ConsultantCard
    consultant={{ id: "", fullName: "" }}
    onOpen={(id) => openProfile(id)}
    isSkeleton
/>`,
                        render: (
                            <ConsultantCard
                                consultant={{ id: "", fullName: "" }}
                                onOpen={() => {}}
                                isSkeleton
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** LEAF — the consultant carries no role/company/blurb ⇒ **loses** all three text rows. */
export const Minimal: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ConsultantCard"
                tier="block"
                leaf="Minimal"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-xs"
                states={[
                    {
                        name: "jobTitle / companyTitle / description omitted",
                        why: "With no role, company or blurb on file, the tile ends at the name — no empty row claims information that was never entered. The photo and the name alone are still enough to open the profile.",
                        code: `<ConsultantCard
    consultant={{
        id: "consultant-2",
        fullName: "Kevin Tran",
        avatarUrl: photoUrl,
    }}
    onOpen={(id) => openProfile(id)}
/>`,
                        render: (
                            <ConsultantCard

                               
                                consultant={{
                                    id: "consultant-2",
                                    fullName: "Kevin Tran",
                                    avatarUrl: PHOTO_SRC,
                                }}
                                onOpen={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
