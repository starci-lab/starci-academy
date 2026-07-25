import type { ReactNode } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { TestCaseResultGrid } from "@sb-components/_legacy/blocks/code/TestCaseResultGrid/TestCaseResultGrid"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"
import { Skeleton as HeroSkeleton } from "@heroui/react"

const meta: Meta<typeof TestCaseResultGrid> = {
    title: "Legacy/Block/Code/TestCaseResultGrid",
    component: TestCaseResultGrid,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof TestCaseResultGrid>

/** Localised labels shared by the stories. */
const labels = {
    input: "Đầu vào",
    expected: "Mong đợi",
    got: "Nhận được",
    hidden: "Test case ẩn — không hiển thị dữ liệu",
}

/** Plain canvas for each leaf's anatomy panel. */
const shell = (node: ReactNode) => <div className="p-8"><div className="max-w-md">{node}</div></div>

// Selected case IS a sample → the pill row + the IOExampleCard detail pane.
const SAMPLE_PARTS: Array<AnatomyNode> = [
    { name: "Div.Pills", tier: "primitive", role: "wrap pill chọn case, mỗi pill mang glyph ✓/✕ + nhãn" },
    { name: "IOExampleCard", tier: "design", role: "chi tiết input · expected · got của case đang chọn" },
]

// Selected case is HIDDEN (non-sample) → the pill row + a muted note instead of IO.
const HIDDEN_PARTS: Array<AnatomyNode> = [
    { name: "Div.Pills", tier: "primitive", role: "wrap pill chọn case, mỗi pill mang glyph ✓/✕ + nhãn" },
    { name: "Typography.HiddenNote", tier: "primitive", role: "ghi chú mờ — case ẩn không lộ IO" },
]

/** All cases pass — pills tint success, the first is selected showing its sample IO. */
export const AllPass: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TestCaseResultGrid"
                tier="block"
                leaf="AllPass"
                parts={SAMPLE_PARTS}
                reason="Chọn mặc định là case ĐẦU TIÊN thất bại (ở đây không có nên là case đầu); case đó là sample → hiện chi tiết IOExampleCard bên dưới hàng pill."
            >
                <TestCaseResultGrid
                    labels={labels}
                    cases={[
                        { key: "1", label: "Case 1", passed: true, isSample: true, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", got: "[0,1]" },
                        { key: "2", label: "Case 2", passed: true, isSample: true, input: "[3,2,4], 6", expectedOutput: "[1,2]", got: "[1,2]" },
                        { key: "3", label: "Case 3", passed: true, isSample: false },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** A failure — selection defaults to the FIRST FAILING case (Case 3) and expands its input · expected · got diff. */
export const WithFailure: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TestCaseResultGrid"
                tier="block"
                leaf="WithFailure"
                parts={SAMPLE_PARTS}
                note="Cùng composition với leaf AllPass — case thất bại (Case 3) vẫn là sample nên vẫn hiện IOExampleCard, chỉ đổi tone diff."
            >
                <TestCaseResultGrid
                    labels={labels}
                    cases={[
                        { key: "1", label: "Case 1", passed: true, isSample: true, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", got: "[0,1]" },
                        { key: "2", label: "Case 2", passed: true, isSample: true, input: "[3,2,4], 6", expectedOutput: "[1,2]", got: "[1,2]" },
                        { key: "3", label: "Case 3", passed: false, isSample: true, input: "[3,3], 6", expectedOutput: "[0,1]", got: "[]" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/** Hidden cases carry no IO — a failing hidden case shows the pill + a muted note only (the judge never leaks hidden IO). */
export const HiddenCase: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TestCaseResultGrid"
                tier="block"
                leaf="HiddenCase"
                parts={HIDDEN_PARTS}
                note="Case thất bại được chọn KHÔNG phải sample → composition đổi: Typography.HiddenNote thay cho IOExampleCard."
            >
                <TestCaseResultGrid
                    labels={labels}
                    cases={[
                        { key: "1", label: "Case 1", passed: true, isSample: true, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", got: "[0,1]" },
                        { key: "2", label: "Case 2", passed: false, isSample: false },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>,
        ),
}

/**
 * Loading: MIRROR the real layout tree — a wrap of pill-shaped `Skeleton` bars
 * (matching the case selector's `rounded-lg` pills) over the `IOExampleCard`
 * frame (kept: `rounded-3xl border`), only the label/value nodes swapped for
 * `Skeleton` bars sized to a small muted label over a mono value line.
 * (The real component returns nothing when `cases` is empty — there is no
 * EmptyState branch to mirror — so only a loading state applies.)
 */
// Hand-rolled loading mockup — the real component has no `isSkeleton` prop, so
// this leaf mirrors the layout tree directly in the story (parts tagged here,
// not inside TestCaseResultGrid.tsx).
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Div.PillsSkeleton", tier: "primitive", role: "3 vạch skeleton mirror pill selector" },
    { name: "Div.IOFrameSkeleton", tier: "primitive", role: "khung IOExampleCard mirror 2 hàng nhãn/giá trị" },
]

export const SkeletonLoading: Story = {
    render: () =>
        shell(
            <BlockAnatomy
                name="TestCaseResultGrid"
                tier="block"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="Component thật không có `isSkeleton` — leaf này tự mirror layout tree (pill row + khung IO), không đi qua component thật."
            >
                <div className="flex flex-col gap-3">
                    {/* case selector pills */}
                    <div className="flex flex-wrap gap-2" data-anat-part="Div.PillsSkeleton">
                        {[0, 1, 2].map((i) => (
                            <HeroSkeleton key={i} className="h-6 w-20 rounded-lg" />
                        ))}
                    </div>
                    {/* selected sample-case IO frame */}
                    <div className="overflow-hidden rounded-3xl border border-default bg-surface" data-anat-part="Div.IOFrameSkeleton">
                        <div className="px-3 py-2">
                            <HeroSkeleton className="h-3 w-16 rounded" />
                            <HeroSkeleton className="mt-1 h-4 w-2/3 rounded" />
                        </div>
                        <div className="border-t border-dashed border-default px-3 py-2">
                            <HeroSkeleton className="h-3 w-16 rounded" />
                            <HeroSkeleton className="mt-1 h-4 w-1/2 rounded" />
                        </div>
                    </div>
                </div>
            </BlockAnatomy>,
        ),
}
