import type { Meta, StoryObj } from "@storybook/nextjs"
import { TestCaseResultGrid } from "./TestCaseResultGrid"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

const meta: Meta<typeof TestCaseResultGrid> = {
    title: "Primitives/Code/TestCaseResultGrid",
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

/** All cases pass — pills tint success, the first is selected showing its sample IO. */
export const AllPass: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <TestCaseResultGrid
                    labels={labels}
                    cases={[
                        { key: "1", label: "Case 1", passed: true, isSample: true, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", got: "[0,1]" },
                        { key: "2", label: "Case 2", passed: true, isSample: true, input: "[3,2,4], 6", expectedOutput: "[1,2]", got: "[1,2]" },
                        { key: "3", label: "Case 3", passed: true, isSample: false },
                    ]}
                />
            </div>
        </div>
    ),
}

/** A failure — selection defaults to the FIRST FAILING case (Case 3) and expands its input · expected · got diff. */
export const WithFailure: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <TestCaseResultGrid
                    labels={labels}
                    cases={[
                        { key: "1", label: "Case 1", passed: true, isSample: true, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", got: "[0,1]" },
                        { key: "2", label: "Case 2", passed: true, isSample: true, input: "[3,2,4], 6", expectedOutput: "[1,2]", got: "[1,2]" },
                        { key: "3", label: "Case 3", passed: false, isSample: true, input: "[3,3], 6", expectedOutput: "[0,1]", got: "[]" },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Hidden cases carry no IO — a failing hidden case shows the pill + a muted note only (the judge never leaks hidden IO). */
export const HiddenCase: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <TestCaseResultGrid
                    labels={labels}
                    cases={[
                        { key: "1", label: "Case 1", passed: true, isSample: true, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", got: "[0,1]" },
                        { key: "2", label: "Case 2", passed: false, isSample: false },
                    ]}
                />
            </div>
        </div>
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
export const SkeletonLoading: Story = {
    render: () => (
        <div className="p-8">
            <div className="flex max-w-md flex-col gap-3">
                {/* case selector pills */}
                <div className="flex flex-wrap gap-2">
                    {[0, 1, 2].map((i) => (
                        <Skeleton key={i} className="h-6 w-20 rounded-lg" />
                    ))}
                </div>
                {/* selected sample-case IO frame */}
                <div className="overflow-hidden rounded-3xl border border-default bg-surface">
                    <div className="px-3 py-2">
                        <Skeleton className="h-3 w-16 rounded" />
                        <Skeleton className="mt-1 h-4 w-2/3 rounded" />
                    </div>
                    <div className="border-t border-dashed border-default px-3 py-2">
                        <Skeleton className="h-3 w-16 rounded" />
                        <Skeleton className="mt-1 h-4 w-1/2 rounded" />
                    </div>
                </div>
            </div>
        </div>
    ),
}
