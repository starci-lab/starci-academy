import type { Meta, StoryObj } from "@storybook/nextjs"
import { CubeIcon } from "@phosphor-icons/react"
import { Label, Typography } from "@heroui/react"

import { SidebarNavAccordionGroup } from "@/components/blocks/navigation/SidebarNavAccordionGroup"
import { SidebarCollapsedContext } from "@/components/blocks/navigation/CollapsibleSidebar/context"

const meta: Meta<typeof SidebarNavAccordionGroup> = {
    title: "Blocks/Navigation/SidebarNavAccordionGroup",
    component: SidebarNavAccordionGroup,
}
export default meta
type Story = StoryObj<typeof SidebarNavAccordionGroup>

/** Use for a small cluster of related destinations (for example Playground's Docker/Kubernetes/RAG) that don't warrant breaking out into separate flat rows in the sidebar. */
export const Default: Story = {
    parameters: { usage: "Use for a small cluster of related destinations (for example Playground's Docker/Kubernetes/RAG) that don't warrant breaking out into separate flat rows in the sidebar." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Collapsible cluster</Label>
                <Typography type="body-sm" color="muted">
                    For a small cluster of related destinations (e.g. Docker / Kubernetes / RAG) that don't warrant breaking out into separate flat rows.
                </Typography>
            </div>
            <div className="w-64 rounded-2xl border border-separator bg-surface p-2">
                <SidebarNavAccordionGroup
                    icon={CubeIcon}
                    label="Playground"
                    items={[
                        { value: "docker", label: "Docker", onPress: () => {} },
                        { value: "k8s", label: "Kubernetes", onPress: () => {} },
                        { value: "rag", label: "RAG", onPress: () => {} },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Use when one of the child destinations is the current page, to highlight that row with an accent-soft background. */
export const WithActiveChild: Story = {
    parameters: { usage: "Use when one of the child destinations is the current page, to highlight that row with an accent-soft background." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>With active child</Label>
                <Typography type="body-sm" color="muted">
                    When one child destination is the current page — highlight that row with an accent-soft background.
                </Typography>
            </div>
            <div className="w-64 rounded-2xl border border-separator bg-surface p-2">
                <SidebarNavAccordionGroup
                    icon={CubeIcon}
                    label="Playground"
                    items={[
                        { value: "docker", label: "Docker", isActive: true, onPress: () => {} },
                        { value: "k8s", label: "Kubernetes", onPress: () => {} },
                        { value: "rag", label: "RAG", onPress: () => {} },
                    ]}
                />
            </div>
        </div>
    ),
}

/** Use when the sidebar is collapsed (icon-only rail) — the group shows only its trigger icon, with no room left for the child panel. */
export const Collapsed: Story = {
    parameters: { usage: "Use when the sidebar is collapsed (icon-only rail) — the group shows only its trigger icon, with no room left for the child panel." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Collapsed rail</Label>
                <Typography type="body-sm" color="muted">
                    When the sidebar is an icon-only rail — the group shows only its trigger icon, with no room left for the child panel.
                </Typography>
            </div>
            <SidebarCollapsedContext.Provider value={true}>
                <div className="w-16 rounded-2xl border border-separator bg-surface p-2">
                    <SidebarNavAccordionGroup
                        icon={CubeIcon}
                        label="Playground"
                        items={[
                            { value: "docker", label: "Docker", onPress: () => {} },
                            { value: "k8s", label: "Kubernetes", onPress: () => {} },
                            { value: "rag", label: "RAG", onPress: () => {} },
                        ]}
                    />
                </div>
            </SidebarCollapsedContext.Provider>
        </div>
    ),
}

/** Use when a child destination's label is wider than the panel — the text must truncate with an ellipsis instead of breaking the layout. */
export const LongChildLabel: Story = {
    parameters: { usage: "Use when a child destination's label is wider than the panel — the text must truncate with an ellipsis instead of breaking the layout." },
    render: () => (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-2">
                <Label>Long child label</Label>
                <Typography type="body-sm" color="muted">
                    When a child destination's label is wider than the panel — the text truncates with an ellipsis instead of breaking the layout.
                </Typography>
            </div>
            <div className="w-64 rounded-2xl border border-separator bg-surface p-2">
                <SidebarNavAccordionGroup
                    icon={CubeIcon}
                    label="Playground"
                    items={[
                        { value: "docker", label: "Docker — spin up containers for hands-on labs", onPress: () => {} },
                        { value: "k8s", label: "Kubernetes", onPress: () => {} },
                        { value: "rag", label: "RAG", onPress: () => {} },
                    ]}
                />
            </div>
        </div>
    ),
}
