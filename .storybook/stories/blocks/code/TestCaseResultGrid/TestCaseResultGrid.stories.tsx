import type { Meta, StoryObj } from "@storybook/nextjs"

import { TestCaseResultGrid } from "@/components/blocks/code/TestCaseResultGrid"

const meta: Meta<typeof TestCaseResultGrid> = {
    title: "Blocks/Code/TestCaseResultGrid",
    component: TestCaseResultGrid,
    tags: ["news"],
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

/** All cases pass — pills tint success, the first is selected showing its sample IO. Renders the judge's `perCaseResults` the old UI discarded. */
export const AllPass: Story = {
    tags: ["news"],
    parameters: { usage: "Chờ duyệt — Accepted: mọi case ✓ (success), pill chọn hiện IO mẫu. Render perCaseResults." },
    render: () => (
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
    ),
}

/** A failure — selection defaults to the FIRST FAILING case (Case 3) and expands its input · expected · got diff. */
export const WithFailure: Story = {
    tags: ["news"],
    parameters: { usage: "Chờ duyệt — Wrong Answer: tự chọn case sai đầu tiên, mở diff expected/got. Học viên thấy ngay sai ở đâu." },
    render: () => (
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
    ),
}

/** Hidden cases carry no IO — a failing hidden case shows the pill + a muted note only (the judge never leaks hidden IO). */
export const HiddenCase: Story = {
    tags: ["news"],
    parameters: { usage: "Chờ duyệt — case ẩn (không sample): chỉ pill + note câm, không lộ IO." },
    render: () => (
        <div className="max-w-md">
            <TestCaseResultGrid
                labels={labels}
                cases={[
                    { key: "1", label: "Case 1", passed: true, isSample: true, input: "[2,7,11,15], 9", expectedOutput: "[0,1]", got: "[0,1]" },
                    { key: "2", label: "Case 2", passed: false, isSample: false },
                ]}
            />
        </div>
    ),
}
