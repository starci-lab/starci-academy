import type { Meta, StoryObj } from "@storybook/nextjs"
import { CourseContents } from "@sb-components/starci/pages/CourseContents/CourseContents"
import { deviceLeaf } from "@sb-components/starci/pages/CourseContents/_shared"

/**
 * `CourseContents` — the `/learn/content` dashboard screen, the CANONICAL entry
 * point for the whole family. The per-device × per-state breakdown (desktop /
 * tablet / mobile, each empty / unpaid / paid / skeleton) lives one level down in
 * `Desktop/` · `Tablet/` · `Mobile/`; this leaf is the one every OTHER story in this
 * catalog links to when it needs to point at "the CourseContents screen" without
 * committing to one particular device or viewer.
 */
const meta: Meta<typeof CourseContents> = {
    title: "StarCi/Pages/CourseContents/CourseContents",
    component: CourseContents,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}
export default meta

type Story = StoryObj<typeof CourseContents>

/** LEAF — desktop, paid viewer: the full spine with no gate/paywall in the way. */
export const Default: Story = {
    render: () => deviceLeaf({
        viewer: "paid",
        leaf: "Default",
        reason: "Full width, purchased — only `TrialConversionStrip` drops out, leaving the spine: PageHeader · CourseTeamGate · continue cluster · LearnNudges · keep-going path. See `Desktop/`, `Tablet/`, `Mobile/` for the device breakdown, and `Unpaid`/`Empty`/`Skeleton` in each for the other states.",
    }),
}
