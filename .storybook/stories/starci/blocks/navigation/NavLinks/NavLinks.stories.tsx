import type { Meta, StoryObj } from "@storybook/nextjs"
import { NavLinks } from "@sb-components/starci/blocks/navigation/NavLinks/NavLinks"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `NavLinks` — the desktop primary-route row inside the site's top nav
 * ("Home / Courses / Community / Contact"), one pinned as current. The
 * presentational half of a container: it takes `items` already resolved
 * (label/path/isActive) and an `onNavigate` callback, leaving router wiring to
 * the caller. Rendered with `Link` (HeroUI), not a tab compound — these are
 * real routes, not panels under one ARIA tablist. One leaf, `Row`; the current
 * route is data, so it is a state.
 */
const meta: Meta<typeof NavLinks> = {
    title: "StarCi/Blocks/Navigation/NavLinks/NavLinks",
    component: NavLinks,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof NavLinks>

const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "StackH": { tier: "frame", role: "the row that spaces the routes on the `related` seam and centers them", storyId: "frames-stack-stackh--default" },
    "Link": { tier: "heroui", role: "the real per-route link — HeroUI's own press/focus/keyboard handling; this block only supplies the pill skin (accent-soft when current, muted otherwise)" },
}

/** LEAF — the desktop route row, one state per which route is current. */
export const Row: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="NavLinks"
                tier="block"
                leaf="Row"
                parts={[]}
                annotate={ANNOTATE}
                renderClassName="mx-auto max-w-3xl"
                states={[
                    {
                        name: "isActive = \"Courses\"",
                        why: "The learner is somewhere under /course, so that route renders the accent-soft current pill while the other three stay muted text links. Only one item is ever current at a time — the caller's own route match decides which.",
                        code: `<NavLinks
    items={[
        { label: "Home", path: "/", isActive: false },
        { label: "Courses", path: "/course", isActive: true },
        { label: "Community", path: "/community", isActive: false },
        { label: "Contact", path: "/contact", isActive: false },
    ]}
    onNavigate={router.push}
/>`,
                        render: (
                            <NavLinks

                               
                                items={[
                                    { label: "Home", path: "/", isActive: false },
                                    { label: "Courses", path: "/course", isActive: true },
                                    { label: "Community", path: "/community", isActive: false },
                                    { label: "Contact", path: "/contact", isActive: false },
                                ]}
                                onNavigate={() => {}}
                            />
                        ),
                    },
                    {
                        name: "isActive = \"Home\"",
                        why: "The visitor is on the homepage, so the FIRST item carries the current pill instead — proving the pill follows `isActive` per item rather than being pinned to a fixed position in the row.",
                        code: `<NavLinks
    items={[
        { label: "Home", path: "/", isActive: true },
        { label: "Courses", path: "/course", isActive: false },
        { label: "Community", path: "/community", isActive: false },
        { label: "Contact", path: "/contact", isActive: false },
    ]}
    onNavigate={router.push}
/>`,
                        render: (
                            <NavLinks
                                items={[
                                    { label: "Home", path: "/", isActive: true },
                                    { label: "Courses", path: "/course", isActive: false },
                                    { label: "Community", path: "/community", isActive: false },
                                    { label: "Contact", path: "/contact", isActive: false },
                                ]}
                                onNavigate={() => {}}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
