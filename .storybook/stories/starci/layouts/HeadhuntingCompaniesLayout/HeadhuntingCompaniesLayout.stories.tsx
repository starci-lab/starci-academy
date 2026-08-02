import type { Meta, StoryObj } from "@storybook/nextjs"
import { HeadhuntingCompaniesLayout } from "@sb-components/starci/layouts/HeadhuntingCompaniesLayout/HeadhuntingCompaniesLayout"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `HeadhuntingCompaniesLayout` — the wrapper for every route under
 * `courses/[courseId]/headhunting-companies/**`, a thinner sibling of
 * `LearnShell`. `@app-lg` is a container query measuring the nearest
 * `@container`, not the viewport. One leaf: the layout takes no prop besides
 * `children`/`className`, so the ambient container width is a state, not a
 * second shape.
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

const routedPageContent = (
    <>
        <Typography size="lg" weight="bold" text="Headhunting Company: Coup Fund" />
        <Typography size="sm" color="muted" text="This is a placeholder for the real `page.tsx` content of this route — the layout doesn't know and doesn't need to know what's drawn inside it." />
    </>
)

/** A stand-in for whatever `page.tsx` mounts inside `children` — this layout never learns what it is. */
const RoutedPage = () => (
    <StackV gap={4} body={routedPageContent} />
)

/** LEAF — the only shape this layout has: rail beside routed content, over two container widths. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
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
                            <div data-tier="fixture" className="@container" style={{ width: "72rem", maxWidth: "100%" }}>
                                <HeadhuntingCompaniesLayout>
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
                            <div data-tier="fixture" className="@container" style={{ width: "36rem", maxWidth: "100%" }}>
                                <HeadhuntingCompaniesLayout>
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
