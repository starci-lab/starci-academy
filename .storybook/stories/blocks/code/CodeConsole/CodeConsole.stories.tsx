import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@heroui/react"
import { CodeConsole } from "@sb-components/blocks/code/CodeConsole/CodeConsole"
import { IOExampleCard } from "@sb-components/blocks/code/IOExampleCard/IOExampleCard"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof CodeConsole> = {
    title: "Block/Code/CodeConsole",
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

/** Cùng parts cho mọi leaf: Tabs (strip) · Panel (nội dung tab đang chọn) · Footer (hint + actions). */
const CONSOLE_PARTS: Array<AnatomyNode> = [
    { name: "Tabs", tier: "design", role: "dải tab (ExtendedTabs) — 'Test case' · 'Kết quả'" },
    { name: "Panel", tier: "primitive", role: "nội dung tab đang chọn, cuộn dọc" },
    { name: "Footer", tier: "design", role: "thanh dưới cùng: hint muted bên trái + actions (Run/Submit) bên phải" },
]

/** The bottom console under an editor: tab strip over a scrollable panel, capped by a Run/Submit action bar. */
export const Default: Story = {
    render: () => {
        const [tab, setTab] = useState("testcase")
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="CodeConsole"
                    tier="block"
                    leaf="Default"
                    parts={CONSOLE_PARTS}
                    reason="Console dưới editor (kiểu LeetCode): tab strip + panel cuộn + thanh action pinned — block sở hữu shell để feature chỉ cần đổ nội dung tab + actions."
                >
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
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
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
                <BlockAnatomy name="CodeConsole" tier="block" leaf="ResultTabActive" parts={CONSOLE_PARTS} note="Chọn tab 'Kết quả' — cùng shell, Panel đổi nội dung theo tab đang active.">
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
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
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
                <BlockAnatomy name="CodeConsole" tier="block" leaf="NoHint" parts={CONSOLE_PARTS} note="Bỏ `hint` — Footer vẫn 1 node, chỉ đổi nội dung bên trái thành spacer rỗng để giữ actions ghim phải.">
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
                            showAnatomy
                        />
                    </div>
                </BlockAnatomy>
            </div>
        )
    },
}
