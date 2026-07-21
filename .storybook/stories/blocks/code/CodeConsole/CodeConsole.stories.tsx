import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CodeConsole } from "./CodeConsole"
import { IOExampleCard } from "../IOExampleCard/IOExampleCard"

const meta: Meta<typeof CodeConsole> = {
    title: "Primitives/Code/CodeConsole",
    component: CodeConsole,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CodeConsole>

/** The two console tabs shared by the stories: a sample IO testcase + a results panel. */
const consoleTabs = [
    {
        key: "testcase",
        label: "Test case",
        content: (
            <IOExampleCard
                rows={[
                    { key: "in", label: "Ví dụ 1 · Đầu vào", value: "[2,7,11,15], 9" },
                    { key: "out", label: "Đầu ra", value: "[0,1]" },
                ]}
            />
        ),
    },
    {
        key: "result",
        label: "Kết quả",
        content: <p className="text-sm text-muted">Nộp bài để xem kết quả chấm.</p>,
    },
]

const actions = (
    <>
        <Button size="sm" variant="secondary" isDisabled>Chạy thử</Button>
        <Button size="sm" variant="primary">Nộp bài</Button>
    </>
)

/** The bottom console under an editor: tab strip over a scrollable panel, capped by a Run/Submit action bar. */
export const Default: Story = {
    render: () => {
        const [tab, setTab] = useState("testcase")
        return (
            <div className="p-8">
                <div className="flex h-96 w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-default">
                    <div className="flex flex-1 items-center justify-center bg-surface text-sm text-muted">
                        (editor)
                    </div>
                    <CodeConsole
                        className="h-1/2"
                        ariaLabel="Bảng test và kết quả"
                        selectedTab={tab}
                        onSelectTab={setTab}
                        tabs={consoleTabs}
                        hint="Chạy thử trên test mẫu sắp có · Nộp bài chấm toàn bộ test"
                        actions={actions}
                    />
                </div>
            </div>
        )
    },
}

/** The "Kết quả" tab selected — the same shell, the results panel content shown instead of the testcase IO. */
export const ResultTabActive: Story = {
    render: () => {
        const [tab, setTab] = useState("result")
        return (
            <div className="p-8">
                <div className="flex h-96 w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-default">
                    <div className="flex flex-1 items-center justify-center bg-surface text-sm text-muted">
                        (editor)
                    </div>
                    <CodeConsole
                        className="h-1/2"
                        ariaLabel="Bảng test và kết quả"
                        selectedTab={tab}
                        onSelectTab={setTab}
                        tabs={consoleTabs}
                        hint="Chạy thử trên test mẫu sắp có · Nộp bài chấm toàn bộ test"
                        actions={actions}
                    />
                </div>
            </div>
        )
    },
}

/** No `hint` — the footer left slot collapses (a spacer keeps the actions pinned right). */
export const NoHint: Story = {
    render: () => {
        const [tab, setTab] = useState("testcase")
        return (
            <div className="p-8">
                <div className="flex h-96 w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-default">
                    <div className="flex flex-1 items-center justify-center bg-surface text-sm text-muted">
                        (editor)
                    </div>
                    <CodeConsole
                        className="h-1/2"
                        ariaLabel="Bảng test và kết quả"
                        selectedTab={tab}
                        onSelectTab={setTab}
                        tabs={consoleTabs}
                        actions={actions}
                    />
                </div>
            </div>
        )
    },
}
