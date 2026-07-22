import React, { useState } from "react"

import { Typography } from "@heroui/react"

import { FlowbookProviders } from "../FlowbookProviders"
import { ChatFlow } from "../flows/chat/ChatFlow"

/**
 * Flowbook shell: a registry of flows on the left, the selected flow on the right.
 * Each flow is a self-contained XState machine that walks real `src` screens through
 * their states. Add a flow by dropping a `flows/<name>/` module and registering it here.
 */
const FLOWS: Array<{ id: string; label: string; blurb: string; Component: React.ComponentType }> = [
    {
        id: "chat",
        label: "Content-AI Chat",
        blurb: "14 màn: bài học · chat · bôi đen · tìm nội dung · lịch sử · đổi tên · model…",
        Component: ChatFlow,
    },
]

export const App = () => {
    const [activeId, setActiveId] = useState(FLOWS[0].id)
    const active = FLOWS.find((flow) => flow.id === activeId) ?? FLOWS[0]
    const Flow = active.Component

    return (
        <FlowbookProviders>
            <div className="mx-auto flex max-w-6xl gap-6 p-6">
                <aside className="flex w-52 shrink-0 flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <Typography type="h5">Flowbook</Typography>
                        <Typography type="body-sm" color="muted">
                            Storyboard prototype — tất cả màn của 1 feature, vẽ tay từ design system (HeroUI).
                        </Typography>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {FLOWS.map((flow) => {
                            const isActive = flow.id === activeId
                            return (
                                <button
                                    key={flow.id}
                                    type="button"
                                    onClick={() => setActiveId(flow.id)}
                                    className={`rounded-xl border p-3 text-left transition-colors ${
                                        isActive
                                            ? "border-accent bg-accent-soft"
                                            : "border-default bg-surface hover:bg-surface-secondary"
                                    }`}
                                >
                                    <Typography type="body-sm">{flow.label}</Typography>
                                    <Typography type="body-xs" color="muted">
                                        {flow.blurb}
                                    </Typography>
                                </button>
                            )
                        })}
                    </nav>
                </aside>
                <main className="min-w-0 flex-1">
                    <Flow />
                </main>
            </div>
        </FlowbookProviders>
    )
}
