import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { BlockAnatomy, type AnatomyNode } from "@sb-components/blocks/layout/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof Breadcrumbs.Base> = {
    title: "Atoms/Navigation/Breadcrumbs/Breadcrumbs.Base",
    component: Breadcrumbs.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Breadcrumbs.Base>

const TRAIL_PARTS: Array<AnatomyNode> = [
    { name: "Breadcrumbs", tier: "atom", role: "trail gốc (HeroUI Breadcrumbs) — separators tự dựng" },
    { name: "Crumb", tier: "atom", role: "một crumb (HeroBreadcrumbs.Item); crumb cuối = trang hiện tại, không onPress" },
]
const TRUNCATED_PARTS: Array<AnatomyNode> = [
    { name: "Breadcrumbs", tier: "atom", role: "trail gốc (HeroUI Breadcrumbs)" },
    { name: "Crumb", tier: "atom", role: "crumb còn giữ: đầu + 2 cuối" },
    { name: "Ellipsis", tier: "atom", role: "crumb '…' gộp phần giữa khi vượt maxItems (không bấm được)" },
]
const BACK_PARTS: Array<AnatomyNode> = [
    { name: "Back", tier: "atom", role: "link '← Trở lại' về ancestor sâu nhất bấm được — thay CẢ trail khi thu gọn" },
]
const SKELETON_PARTS: Array<AnatomyNode> = [
    { name: "Skeleton", tier: "atom", role: "leaf skeleton do atom tự sở hữu (hàng bar)" },
]

/** Default — trail đầy đủ; crumb cuối là trang hiện tại (không `onPress`). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                leaf="Default"
                parts={TRAIL_PARTS}
                reason="Atom breadcrumb DUY NHẤT bọc HeroUI Breadcrumbs; truncation là leaf (prop maxItems), không component riêng."
                code={`<Breadcrumbs.Base items={[{ key: "home", label: "Trang chủ", onPress: fn }, …, { key: "current", label: "Bài 3" }]} />`}
            >
                <Breadcrumbs.Base
                    items={[
                        { key: "home", label: "Trang chủ", onPress: () => {} },
                        { key: "course", label: "React nâng cao", onPress: () => {} },
                        { key: "current", label: "Bài 3: Hooks" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Truncated — trail dài hơn `maxItems` → gộp giữa thành '…' (đầu · … · 2 cuối). */
export const Truncated: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                leaf="Truncated"
                parts={TRUNCATED_PARTS}
                note="maxItems=3 mà trail 5 crumb → hiện đầu + '…' + 2 crumb cuối; ancestor sâu đã tới được từ top-nav."
                code={`<Breadcrumbs.Base maxItems={3} items={[/* 5 crumbs */]} />`}
            >
                <Breadcrumbs.Base
                    maxItems={3}
                    items={[
                        { key: "home", label: "Trang chủ", onPress: () => {} },
                        { key: "catalog", label: "Danh mục", onPress: () => {} },
                        { key: "course", label: "React nâng cao", onPress: () => {} },
                        { key: "module", label: "Chương 2", onPress: () => {} },
                        { key: "current", label: "Bài 3: Hooks" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** CollapsedLongTrail — `collapseFrom` → trail dài đổi hẳn sang '← Trở lại' ở MỌI width. */
export const CollapsedLongTrail: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                leaf="CollapsedLongTrail"
                parts={BACK_PARTS}
                note="collapseFrom=4 mà trail 4 crumb → Breadcrumbs KHÔNG render, chỉ còn back link (trail dài wrap, ăn chiều dọc; ancestor sâu đã tới được từ top-nav)."
                code={`<Breadcrumbs.Base collapseFrom={4} items={[/* 4 crumbs */]} />`}
            >
                <Breadcrumbs.Base
                    collapseFrom={4}
                    items={[
                        { key: "home", label: "Trang chủ", onPress: () => {} },
                        { key: "catalog", label: "Danh mục", onPress: () => {} },
                        { key: "course", label: "React nâng cao", onPress: () => {} },
                        { key: "current", label: "Bài 3: Hooks" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** CollapsedOnMobile — dưới `@app-sm` (container 375px) trail nhường chỗ cho back link. */
export const CollapsedOnMobile: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                leaf="CollapsedOnMobile"
                parts={BACK_PARTS}
                note="collapseOnMobile → cột hẹp không chứa nổi trail: dưới @app-sm hiện back link, từ @app-sm lên hiện trail. Container 375px cố định LÀ tín hiệu mobile (container-query, viewport addon vô tác dụng)."
                code={`<Breadcrumbs.Base collapseOnMobile items={[…]} />`}
            >
                <div className="@container w-[375px] max-w-full rounded-none border border-dashed border-accent p-3">
                    <Breadcrumbs.Base
                        collapseOnMobile
                        items={[
                            { key: "home", label: "Trang chủ", onPress: () => {} },
                            { key: "course", label: "React nâng cao", onPress: () => {} },
                            { key: "current", label: "Bài 3: Hooks" },
                        ]}
                        showAnatomy
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Loading — atom tự vẽ leaf skeleton (hàng bar); không dùng Skeleton.*. */
export const Loading: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                leaf="Loading"
                parts={SKELETON_PARTS}
                note="isSkeleton → hàng bar shimmer OWNED bởi atom (hybrid C) khi trail chưa resolve từ route."
                code={`<Breadcrumbs.Base isSkeleton items={[…]} />`}
            >
                <Breadcrumbs.Base
                    isSkeleton
                    items={[
                        { key: "home", label: "Trang chủ" },
                        { key: "course", label: "React" },
                        { key: "current", label: "Bài 3" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
