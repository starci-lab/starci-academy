import type { Meta, StoryObj } from "@storybook/nextjs"
import { HeadhuntingCompaniesLayout } from "@sb-components/starci/layouts/HeadhuntingCompaniesLayout/HeadhuntingCompaniesLayout"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * LAYOUT — `HeadhuntingCompaniesLayout`: the wrapper for every route under
 * `courses/[courseId]/headhunting-companies/**`. See the component's own file
 * header for the full RULE 12 reasoning (why this is a layout, why it is a
 * thinner sibling of `LearnShell`, and why its rail is a marked §B3 gap).
 *
 * ⚠️ `@app-lg` is a CONTAINER query, not a viewport one — it measures the
 * nearest `@container`, not the browser window. To demo both the desktop and
 * the narrow shape in one page, each state below opens its OWN `@container`
 * at a fixed width straddling `--container-app-lg` (64rem), exactly the idiom
 * `Grid`'s own story already uses to demo a breakpoint.
 *
 * 📐 ONE LEAF. The layout takes no prop besides `children`/`className` — there
 * is no second SHAPE to switch between, only the ambient container width the
 * real app shell would provide. That is a STATE of this one leaf, not a
 * second leaf.
 */
const meta: Meta<typeof HeadhuntingCompaniesLayout> = {
    title: "StarCi/Layouts/HeadhuntingCompaniesLayout/HeadhuntingCompaniesLayout",
    component: HeadhuntingCompaniesLayout,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof HeadhuntingCompaniesLayout>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the root track putting the nav rail beside the routed content, owning the one seam between them", storyId: "frames-stack-stackh--default" },
    "CourseNavSidebarGap": { tier: "composite", role: "the §B3 stand-in for the real course-nav rail content, which is out of reach in this pass — an `AsyncContentEmpty` badged under this leaf's own part name rather than its generic one", storyId: "composites-async-asynccontent-asynccontentempty--basic" },
}

/** A stand-in for whatever `page.tsx` mounts inside `children` — this layout never learns what it is. */
const RoutedPage = () => (
    <StackV gap="grouped">
        <Typography size="lg" weight="bold" text="Headhunting Company: Coup Fund" />
        <Typography size="sm" color="muted" text="Đây là placeholder cho nội dung `page.tsx` thật của route này — layout không biết và không cần biết bên trong nó vẽ gì." />
    </StackV>
)

/** LEAF — the only shape this layout has: rail beside routed content, over two container widths. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="HeadhuntingCompaniesLayout"
                tier="screen"
                leaf="Default"
                annotate={ANNOTATE}
                renderClassName="w-full"
                states={[
                    {
                        name: "Container ≥ @app-lg (64rem) — desktop",
                        why: "Wide enough for the real app shell's column, so the nav-rail slot shows: a fixed, sticky-positioned aside carrying the §B3 gap marker, beside the routed page content taking the rest of the row.",
                        code: "<HeadhuntingCompaniesLayout>\n    <RoutedPage />\n</HeadhuntingCompaniesLayout>",
                        render: (
                            <div className="@container" style={{ width: "72rem", maxWidth: "100%" }}>
                                <HeadhuntingCompaniesLayout showAnatomy anatPart="HeadhuntingCompaniesLayout">
                                    <RoutedPage />
                                </HeadhuntingCompaniesLayout>
                            </div>
                        ),
                    },
                    {
                        name: "Container < @app-lg (64rem) — narrow",
                        why: "Below the desktop tier the rail is not collapsed into a bar or a drawer — it is simply absent, matching the real screen's own lack of a mobile substitute. The routed content takes the full row on its own.",
                        code: "<HeadhuntingCompaniesLayout>\n    <RoutedPage />\n</HeadhuntingCompaniesLayout>",
                        render: (
                            <div className="@container" style={{ width: "36rem", maxWidth: "100%" }}>
                                <HeadhuntingCompaniesLayout showAnatomy anatPart="HeadhuntingCompaniesLayout">
                                    <RoutedPage />
                                </HeadhuntingCompaniesLayout>
                            </div>
                        ),
                    },
                ]}
            />
        </div>
    ),
}
