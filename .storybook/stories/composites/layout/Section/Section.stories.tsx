import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { type AllowedGap } from "@sb-components/frames/_spacing"
import { Section, SectionHeader } from "@sb-components/composites/layout/Section/Section"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Section` — the frame for one region of a page: it stacks `header` / `body` / `footer` along
 * one vertical rhythm (`gap`) and nothing else. No chrome (no background, border, radius, or
 * padding) — the surface lives inside it (`SurfaceCard.*`/`SectionCard`). Distinct from
 * `SectionCard`, which is an actual card with chrome. Owns only slot combination and `gap`.
 */
const meta: Meta<typeof Section> = {
    title: "Composites/Layout/Section/Section",
    component: Section,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Section>

/** Standard fixture (C-fixture) = ProfileCard: avatar + title + description inside one card face. */
const ProfileRow = () => (
    <div data-tier="fixture" className="flex items-center gap-3">
        <Avatar name="StarCi Academy" size="md" />
        <div className="flex min-w-0 flex-col">
            <Typography size="sm" text="StarCi Academy" weight="medium" truncate />
            <Typography size="xs" text="Learn fullstack, system design, and DevOps on an interview-prep roadmap." color="muted" truncate />
        </div>
    </div>
)

/** Sample body: a region usually holds one (or more) card faces, not bare text. */
const CardBody = () => (
    <SurfaceCard body={() => <ProfileRow />} />
)

// `header` in object-props form is a FIXED internal choice — the frame always builds its own
// real `SectionHeader` from it, so that node gets the real component name + storyId. `body`/
// `footer` (and the free-form NODE form of `header`) are arbitrary caller-supplied slots (§11a
// caller-slot rule) — the frame never claims them as its own anatomy, so they carry no badge.
const HEADER_BODY_PARTS: Array<AnatomyNode> = [
    { name: "SectionHeader", tier: "composite", role: "the top region, the frame builds a SectionHeader from props itself", storyId: "composites-layout-section-sectionheader--default" },
]
const BODY_ONLY_PARTS: Array<AnatomyNode> = []
// Here `header` is the free-form NODE escape hatch (arbitrary caller content, not the props
// shorthand) — like `body`/`footer`, it stays unbadged.
const FULL_PARTS: Array<AnatomyNode> = []

/** `children` = shorthand for `body`: a wrapping frame that accepts any content, no header. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Section"
                tier="composite"
                leaf="Default"
                parts={BODY_ONLY_PARTS}
                renderClassName="max-w-2xl"
                reason="The frame for one region of a page, it only stacks header/body/footer along one vertical rhythm. It does NOT draw a surface (no background/border/radius/padding), the surface is `SurfaceCard.*` living INSIDE `body`. Because it is a wrapping frame, `children` is still valid (the shorthand for `body`, §13b)."
                states={[
                    {
                        name: "children set, no header",
                        why: "Only the body region renders: a SurfaceCard profile row sits directly inside the frame with no header above it. `children` is accepted here as the shorthand for `body`, since the frame is a pure wrapper with nothing of its own to draw around the content.",
                        code: "<Section>\n  <SurfaceCard body={() => <ProfileRow />} />\n</Section>",
                        render: (
                            <Section>
                                <CardBody />
                            </Section>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `header` accepts the PROPS of `SectionHeader`, the MAIN path: the frame builds the header itself. */
export const HeaderProps: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Section"
                tier="composite"
                leaf="HeaderProps"
                parts={HEADER_BODY_PARTS}
                renderClassName="max-w-2xl"
                states={[
                    {
                        name: "header = { title, description, action }",
                        why: "Passing the object form (`{ title, description, action }`) makes the frame render its own `SectionHeader` above the body, and `showAnatomy` flows down into that header too. This is the main path: the frame builds the header FOR the caller instead of the caller assembling a header node by hand.",
                        code: `<Section
  header={{
    title: "My courses",
    description: "Sorted by most recently studied.",
    action: <Button label="View all" variant="ghost" size="sm" prefixIcon={ArrowRightIcon} />,
  }}
>
  <SurfaceCard body={() => <ProfileRow />} />
</Section>`,
                        render: (
                            <Section
                               
                                header={{
                                    title: "My courses",
                                    description: "Sorted by most recently studied.",
                                    action: <Button label="View all" variant="ghost" size="sm" prefixIcon={ArrowRightIcon} onPress={() => {}} />,
                                }}
                            >
                                <CardBody />
                            </Section>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** All 3 slots filled — `header` in this leaf is a free-form NODE (the escape hatch when a region's header isn't written by the frame itself). */
export const Slots: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Section"
                tier="composite"
                leaf="Slots"
                parts={FULL_PARTS}
                renderClassName="max-w-2xl"
                states={[
                    {
                        name: "header (node) + body + footer",
                        why: "All three regions are filled at once, and `header` here is a free-form node (a `SectionHeader` built by hand) rather than the object shorthand, useful when the top row is something other than a title, such as a toolbar or a tab row. `body` wins over `children` whenever both are passed, which is what lets this leaf also demonstrate the `footer` region.",
                        code: `<Section
  header={<SectionHeader level={3} title="Saved posts" />}
  body={<SurfaceCard body={() => <ProfileRow />} />}
  footer={<Typography size="xs" text="Updated 5 minutes ago" color="muted" />}
/>`,
                        render: (
                            <Section
                               
                                header={<SectionHeader level={3} title="Saved posts" />}
                                body={<CardBody />}
                                footer={<Typography size="xs" text="Updated 5 minutes ago" color="muted" />}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Props for the demo gap sample. */
interface GapSampleProps {
    /** The `AllowedGap` step this sample demonstrates. */
    gap: AllowedGap
    /** Caption text shown under the sample's header. */
    caption: string
    /** `true` → this is the sample currently inspected by the anatomy overlay. */
}

/** One `gap` column for comparing rhythm — every sample shares the same composition, only the step changes. */
const GapSample = ({ gap, caption, }: GapSampleProps) => (
    <Section
        gap={gap}
        header={{ level: 3, title: `gap=${gap}`, description: caption }}
        body={<CardBody />}

    />
)

/**
 * `gap`, the vertical rhythm between regions, forced onto the eight-rung `AllowedGap` scale
 * by a union literal. Every state below is titled by its step number, with the sentence
 * from `gap.md` that earns it riding along as the check against taste.
 */
export const Gaps: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="Section"
                tier="composite"
                leaf="Gaps"
                parts={HEADER_BODY_PARTS}
                reason="The vertical rhythm between header, body and footer, forced onto the eight `AllowedGap` steps by a union literal. An off-scale value is a TYPE error rather than a review comment, and the step is chosen from what the header IS to the body: a heading over its own region, a label stuck to a list, or one half of a single composed unit."
                states={[
                    {
                        name: "1 — must touch",
                        why: "The header sits flush against the body with no seam at all, so the two read as one continuous surface rather than a heading over a region. A `Section` header rarely earns this step; it is shown so the tight end of the ladder stays recognisable.",
                        code: "<Section gap={1} header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap={1} caption="Step 1 — header and body touch, one surface." />,
                    },
                    {
                        name: "2 — a joint, not a seam",
                        why: "A hairline seam keeps the header and body apart while the pair still reads as one unit, the relationship an icon has with the word beside it. Too close for a header that should read as its own region.",
                        code: "<Section gap={2} header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap={2} caption="Step 2 — a joint, not yet a seam." />,
                    },
                    {
                        name: "3 — two halves of one composed unit",
                        why: "The header and body read as one cluster rather than two separate regions. This is the closest step on the scale that still counts as a seam, meant for a header and body that are really one composed unit.",
                        code: "<Section gap={3} header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap={3} caption="Step 3 — header and body are one cluster." />,
                    },
                    {
                        name: "4 — a label stuck to the list below it",
                        why: "The header pulls right up against a list or a group of items below it. Use it when the header reads as a label stuck to what follows rather than a heading over a whole standalone region.",
                        code: "<Section gap={4} header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap={4} caption="Step 4 — the header sits stuck to a list/group." />,
                    },
                    {
                        name: "5 — open, no sentence yet",
                        why: "`gap.md` records this rung as chosen by 56 app call sites but not yet read, so there is no sentence yet to check a header/body seam against. Shown here for completeness rather than as a considered choice — inventing a reason now would be guessing and citing the count as if it had spoken.",
                        code: "<Section gap={5} header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap={5} caption="Step 5 — no sentence written yet." />,
                    },
                    {
                        name: "6 — a heading over its own region (default)",
                        why: "The default step opens the widest rhythm between the header and the body that still reads as ONE region, the spacing a page uses between its major sections. Reach for it whenever the region stands on its own rather than being visually grouped with something above or below it.",
                        code: "<Section gap={6} header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap={6} caption="Step 6 — default, the rhythm between the PAGE's regions." />,
                    },
                    {
                        name: "7 — a page frame holding separate features",
                        why: "The header opens a page-band gap, wider than the default region rhythm. This is the step a page-level frame reaches for when the header and body are less a single region and more two things sharing a page — replacing the old `page` word, which rendered `gap-8` (8 real uses) where this step's `gap-10` has 55.",
                        code: "<Section gap={7} header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap={7} caption="Step 7 — page bands, wider than a region rhythm." />,
                    },
                    {
                        name: "8 — marketing air",
                        why: "The widest rung the scale offers, for full-width marketing bands rather than a page's teaching content. A `Section` header rarely reaches this far; it is shown here only to bound the ladder.",
                        code: "<Section gap={8} header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap={8} caption="Step 8 — marketing air, bounds the ladder." />,
                    },
                ]}
            />
        </div>
    ),
}
