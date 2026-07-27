import type { Meta, StoryObj } from "@storybook/nextjs"
import { ArrowRightIcon } from "@phosphor-icons/react"
import { type SeamScale } from "@sb-components/frames/_spacing"
import { Section } from "@sb-components/composites/layout/Section/Section"
import { SurfaceCard } from "@sb-components/composites/cards/SurfaceCard/SurfaceCard"
import { Avatar } from "@sb-components/atoms/display/Avatar/Avatar"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Section.Base`, the frame for ONE region of a page: it stacks `header` / `body` /
 * `footer` along ONE vertical rhythm (`gap`) and does nothing else. NO chrome: no
 * background, no border, no radius, no padding, the surface lives INSIDE it
 * (`SurfaceCard.*`/`SectionCard`).
 *
 * ⚠️ Do not confuse this with `SectionCard` (design tier, `blocks/cards/SectionCard`):
 * that one IS a card, it carries HeroUI Card chrome (border, radius, padding), an
 * accent skin, a data-driven `withVerdict` band, and its own `isSkeleton`. `Section.Base`
 * is the bare frame around it.
 *
 * ⚠️ STATE SCOPE (§12f/§13): only the frame's OWN states live here, the slot
 * combination and the `gap` scale. The header's own slot set (eyebrow/description/
 * action/level) belongs to `Section.Header`, see its own story; loading/empty/error are
 * states of the BLOCK inside `body`, the frame does not own them (hence no `isSkeleton`
 * flag of its own).
 */
const meta: Meta<typeof Section.Base> = {
    title: "Composites/Layout/Section/Section.Base",
    component: Section.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof Section.Base>

/** Standard fixture (C-fixture) = ProfileCard: avatar + title + description inside one card face. */
const ProfileRow = () => (
    <div className="flex items-center gap-3">
        <Avatar.Base name="StarCi Academy" size="md" />
        <div className="flex min-w-0 flex-col">
            <Typography.Base size="sm" text="StarCi Academy" weight="medium" truncate />
            <Typography.Base size="xs" text="Learn fullstack, system design, and DevOps on an interview-prep roadmap." color="muted" truncate />
        </div>
    </div>
)

/** Sample body: a region usually holds one (or more) card faces, not bare text. */
const CardBody = () => (
    <SurfaceCard.Base>
        <ProfileRow />
    </SurfaceCard.Base>
)

// `header` in object-props form is a FIXED internal choice — the frame always builds its own
// real `Section.Header` from it, so that node gets the real component name + storyId.
const HEADER_BODY_PARTS: Array<AnatomyNode> = [
    { name: "Section.Header", tier: "composite", role: "the top region, the frame builds a Section.Header from props itself", storyId: "composites-layout-section-section-header--default" },
    { name: "Body", tier: "composite", role: "the main region (`body`, or the `children` shorthand)" },
]
const BODY_ONLY_PARTS: Array<AnatomyNode> = [
    { name: "Body", tier: "composite", role: "the main region, `children` is the shorthand for `body`" },
]
// Here `header` is the free-form NODE escape hatch (arbitrary caller content, not the props
// shorthand), so — unlike HEADER_BODY_PARTS above — it stays a generic label.
const FULL_PARTS: Array<AnatomyNode> = [
    { name: "Header", tier: "composite", role: "the top region; in this leaf it is a free-form NODE, not `Section.Header` props" },
    { name: "Body", tier: "composite", role: "the main region" },
    { name: "Footer", tier: "composite", role: "the bottom region (a closing CTA, a caption, a see-more link)" },
]

/** `children` = shorthand for `body`: a wrapping frame that accepts any content, no header. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Section.Base"
                tier="composite"
                leaf="Default"
                parts={BODY_ONLY_PARTS}
                renderClassName="max-w-2xl"
                reason="The frame for one region of a page, it only stacks header/body/footer along one vertical rhythm. It does NOT draw a surface (no background/border/radius/padding), the surface is `SurfaceCard.*` living INSIDE `body`. Because it is a wrapping frame, `children` is still valid (the shorthand for `body`, §13b)."
                states={[
                    {
                        name: "children set, no header",
                        why: "Only the body region renders: a SurfaceCard profile row sits directly inside the frame with no header above it. `children` is accepted here as the shorthand for `body`, since the frame is a pure wrapper with nothing of its own to draw around the content.",
                        code: "<Section.Base>\n  <SurfaceCard.Base><ProfileRow /></SurfaceCard.Base>\n</Section.Base>",
                        render: (
                            <Section.Base showAnatomy>
                                <CardBody />
                            </Section.Base>
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** `header` accepts the PROPS of `Section.Header`, the MAIN path: the frame builds the header itself. */
export const HeaderProps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Section.Base"
                tier="composite"
                leaf="HeaderProps"
                parts={HEADER_BODY_PARTS}
                renderClassName="max-w-2xl"
                states={[
                    {
                        name: "header = { title, description, action }",
                        why: "Passing the object form (`{ title, description, action }`) makes the frame render its own `Section.Header` above the body, and `showAnatomy` flows down into that header too. This is the main path: the frame builds the header FOR the caller instead of the caller assembling a header node by hand.",
                        code: `<Section.Base
  header={{
    title: "Khoá của tôi",
    description: "Sắp theo lần học gần nhất.",
    action: <Button.Base label="Xem tất cả" variant="ghost" size="sm" prefixIcon={ArrowRightIcon} />,
  }}
>
  <SurfaceCard.Base><ProfileRow /></SurfaceCard.Base>
</Section.Base>`,
                        render: (
                            <Section.Base
                                showAnatomy
                                header={{
                                    title: "Khoá của tôi",
                                    description: "Sắp theo lần học gần nhất.",
                                    action: <Button.Base label="Xem tất cả" variant="ghost" size="sm" prefixIcon={ArrowRightIcon} onPress={() => {}} />,
                                }}
                            >
                                <CardBody />
                            </Section.Base>
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
        <div className="p-8">
            <BlockAnatomy
                name="Section.Base"
                tier="composite"
                leaf="Slots"
                parts={FULL_PARTS}
                renderClassName="max-w-2xl"
                states={[
                    {
                        name: "header (node) + body + footer",
                        why: "All three regions are filled at once, and `header` here is a free-form node (a `Section.Header` built by hand) rather than the object shorthand, useful when the top row is something other than a title, such as a toolbar or a tab row. `body` wins over `children` whenever both are passed, which is what lets this leaf also demonstrate the `footer` region.",
                        code: `<Section.Base
  header={<Section.Header level={3} title="Bài đã lưu" />}
  body={<SurfaceCard.Base><ProfileRow /></SurfaceCard.Base>}
  footer={<Typography.Base size="xs" text="Cập nhật 5 phút trước" color="muted" />}
/>`,
                        render: (
                            <Section.Base
                                showAnatomy
                                header={<Section.Header level={3} title="Bài đã lưu" />}
                                body={<CardBody />}
                                footer={<Typography.Base size="xs" text="Cập nhật 5 phút trước" color="muted" />}
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
    /** The `SeamScale` step this sample demonstrates. */
    gap: SeamScale
    /** Caption text shown under the sample's header. */
    caption: string
    /** `true` → this is the sample currently inspected by the anatomy overlay. */
    showAnatomy?: boolean
}

/** One `gap` (§10c) column for comparing rhythm — every sample shares the same composition, only the token changes. */
const GapSample = ({ gap, caption, showAnatomy }: GapSampleProps) => (
    <Section.Base
        gap={gap}
        header={{ level: 3, title: `gap=${gap}`, description: caption }}
        body={<CardBody />}
        showAnatomy={showAnatomy}
    />
)

/**
 * `gap`, the vertical rhythm between regions, forced onto the §10c scale by a union
 * literal (`0 · 1 · 2 · 3 · 6 · 8`). `gap-4`/`gap-5` are TYPE errors, not review comments.
 */
export const Gaps: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Section.Base"
                tier="composite"
                leaf="Gaps"
                parts={HEADER_BODY_PARTS}
                reason="The vertical rhythm between header, body and footer, forced onto the six `SeamScale` words by a union literal (§10c). A number is a TYPE error rather than a review comment, and the word is chosen from what the header IS to the body: a heading over its own region, a label stuck to a list, or one half of a single composed unit."
                states={[
                    {
                        name: "a heading over its own region",
                        why: "The default `gap=\"section\"` opens the widest rhythm between the header and the body, the spacing a page uses between its major regions. Reach for it whenever the region stands on its own rather than being visually grouped with something above or below it.",
                        code: "<Section.Base gap=\"section\" header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap="section" caption="Default — the rhythm between the PAGE's regions." showAnatomy />,
                    },
                    {
                        name: "a label stuck to the list below it",
                        why: "Tightening to `gap=\"grouped\"` pulls the header right up against a list or a group of items below it. Use it when the header reads as a label stuck to what follows rather than a heading over a whole standalone region.",
                        code: "<Section.Base gap=\"grouped\" header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap="grouped" caption="Grouped — the header sits stuck to a list/group." showAnatomy />,
                    },
                    {
                        name: "two halves of one composed unit",
                        why: "At `gap=\"related\"` the header and body read as one cluster rather than two separate regions. This is the closest step on the scale, meant for a header and body that are really one composed unit.",
                        code: "<Section.Base gap=\"related\" header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap="related" caption="Related — header and body are one cluster." showAnatomy />,
                    },
                    {
                        name: "a page frame holding separate features",
                        why: "At `gap=\"page\"` the header opens the widest gap the scale allows. This is the step a page-level frame reaches for, wider than the default `section` rhythm.",
                        code: "<Section.Base gap=\"page\" header={{ title: \"…\" }} body={…} />",
                        render: <GapSample gap="page" caption="Page — the widest step, used at the page frame." showAnatomy />,
                    },
                ]}
            />
        </div>
    ),
}
