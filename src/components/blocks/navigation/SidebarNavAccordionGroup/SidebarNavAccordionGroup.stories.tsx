import type { Meta, StoryObj } from "@storybook/nextjs"
import { CubeIcon } from "@phosphor-icons/react"

import { SidebarNavAccordionGroup } from "./index"
import { SidebarCollapsedContext } from "../CollapsibleSidebar/context"

const meta: Meta<typeof SidebarNavAccordionGroup> = {
    title: "Blocks/Navigation/SidebarNavAccordionGroup",
    component: SidebarNavAccordionGroup,
    parameters: { layout: "centered" },
}
export default meta
type Story = StoryObj<typeof SidebarNavAccordionGroup>

/** Dùng cho một cụm nhỏ các đích đến liên quan (ví dụ Docker/Kubernetes/RAG của Playground) không đáng để tách thành các dòng phẳng riêng trong sidebar. */
export const Default: Story = {
    parameters: { usage: "Dùng cho một cụm nhỏ các đích đến liên quan (ví dụ Docker/Kubernetes/RAG của Playground) không đáng để tách thành các dòng phẳng riêng trong sidebar." },
    render: () => (
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
    ),
}

/** Dùng khi một trong các đích đến con chính là trang hiện tại, để tô đậm dòng đó bằng nền accent-soft. */
export const WithActiveChild: Story = {
    parameters: { usage: "Dùng khi một trong các đích đến con chính là trang hiện tại, để tô đậm dòng đó bằng nền accent-soft." },
    render: () => (
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
    ),
}

/** Dùng khi sidebar đang ở dạng thu gọn (rail icon-only) — nhóm chỉ hiện icon trigger, không còn chỗ cho panel con. */
export const Collapsed: Story = {
    parameters: { usage: "Dùng khi sidebar đang ở dạng thu gọn (rail icon-only) — nhóm chỉ hiện icon trigger, không còn chỗ cho panel con." },
    render: () => (
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
    ),
}

/** Dùng khi nhãn đích đến con dài hơn bề rộng panel — chữ phải bị cắt gọn bằng dấu ba chấm thay vì làm vỡ layout. */
export const LongChildLabel: Story = {
    parameters: { usage: "Dùng khi nhãn đích đến con dài hơn bề rộng panel — chữ phải bị cắt gọn bằng dấu ba chấm thay vì làm vỡ layout." },
    render: () => (
        <div className="w-64 rounded-2xl border border-separator bg-surface p-2">
            <SidebarNavAccordionGroup
                icon={CubeIcon}
                label="Playground"
                items={[
                    { value: "docker", label: "Docker — dựng container cho bài lab thực hành", onPress: () => {} },
                    { value: "k8s", label: "Kubernetes", onPress: () => {} },
                    { value: "rag", label: "RAG", onPress: () => {} },
                ]}
            />
        </div>
    ),
}
