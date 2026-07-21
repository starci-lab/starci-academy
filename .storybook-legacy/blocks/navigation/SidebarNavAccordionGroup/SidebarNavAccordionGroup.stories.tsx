import type { Meta, StoryObj } from "@storybook/nextjs"
import { CubeIcon } from "@phosphor-icons/react"

import { SidebarNavAccordionGroup } from "@/components/blocks/navigation/SidebarNavAccordionGroup"
import { SidebarCollapsedContext } from "@/components/blocks/navigation/CollapsibleSidebar/context"
import { Gallery, Variant } from "../../../../story-kit"

const meta: Meta<typeof SidebarNavAccordionGroup> = {
    title: "Legacy/Blocks/Navigation/SidebarNavAccordionGroup",
    component: SidebarNavAccordionGroup,
}
export default meta
type Story = StoryObj<typeof SidebarNavAccordionGroup>

/**
 * Toàn bộ ma trận trạng thái của SidebarNavAccordionGroup: mặc định, có mục con
 * đang active, sidebar thu gọn (icon-only rail), và nhãn mục con dài tràn chữ.
 */
export const AllVariants: Story = {
    render: () => (
        <Gallery>
            <Variant
                label="Cụm mặc định"
                hint="Dùng cho một cụm nhỏ các đích đến liên quan (ví dụ Docker/Kubernetes/RAG của Playground) không đáng để tách thành các dòng riêng phẳng trong sidebar."
            >
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
            </Variant>
            <Variant
                label="Có mục con đang active"
                hint="Khi một trong các đích đến con là trang hiện tại — làm nổi dòng đó bằng nền accent-soft."
            >
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
            </Variant>
            <Variant
                label="Sidebar thu gọn"
                hint="Khi sidebar là rail chỉ hiện icon — nhóm chỉ hiện icon kích hoạt, không còn chỗ cho panel con."
            >
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
            </Variant>
            <Variant
                label="Nhãn mục con dài"
                hint="Khi nhãn của một đích đến con rộng hơn panel — chữ phải tràn có dấu ba chấm thay vì làm vỡ layout."
            >
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
            </Variant>
        </Gallery>
    ),
    parameters: {
        usage:
            "Toàn bộ ma trận trạng thái của SidebarNavAccordionGroup: cụm mặc định, có mục con đang active " +
            "(nền accent-soft), sidebar thu gọn chỉ hiện icon kích hoạt, và nhãn mục con dài tràn có dấu ba chấm.",
    },
}
