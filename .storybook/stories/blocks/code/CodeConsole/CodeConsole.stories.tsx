import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"

import { CodeConsole } from "@/components/blocks/code/CodeConsole"
import { IOExampleCard } from "@/components/blocks/code/IOExampleCard"

const meta: Meta<typeof CodeConsole> = {
    title: "Blocks/Code/CodeConsole",
    component: CodeConsole,
    tags: ["news"],
}

export default meta

type Story = StoryObj<typeof CodeConsole>

/** The bottom console of a code workspace: a tab strip over a scrollable panel, capped by a Run/Submit action bar. Sits under an editor (top border delineates). */
export const Default: Story = {
    tags: ["news"],
    parameters: { usage: "Chờ duyệt — console dưới editor: tab Test case/Kết quả + action bar Run/Submit. LeetCode-style." },
    render: () => {
        const [tab, setTab] = useState("testcase")
        return (
            <div className="flex h-96 w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-default">
                <div className="flex flex-1 items-center justify-center bg-surface text-sm text-muted">
                    (editor)
                </div>
                <CodeConsole
                    className="h-1/2"
                    ariaLabel="Bảng test và kết quả"
                    selectedTab={tab}
                    onSelectTab={setTab}
                    tabs={[
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
                    ]}
                    hint="Chạy thử trên test mẫu sắp có · Nộp bài chấm toàn bộ test"
                    actions={(
                        <>
                            <Button size="sm" variant="secondary" isDisabled>Chạy thử</Button>
                            <Button size="sm" variant="primary">Nộp bài</Button>
                        </>
                    )}
                />
            </div>
        )
    },
}
