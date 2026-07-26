import type { Meta, StoryObj } from "@storybook/nextjs"
import { Breadcrumbs } from "@sb-components/atoms/navigation/Breadcrumbs/Breadcrumbs"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * ATOM — `Breadcrumbs.Base` bọc thẳng HeroUI `Breadcrumbs`, không compose atom
 * nào khác có story riêng (`Crumb`/`Ellipsis`/`Back`/`Skeleton` chỉ là KHE nội bộ
 * của chính atom này). Theo canon §12g: atom lá bọc thẳng HeroUI ⇒ KHÔNG có deps
 * ⇒ BỎ HẲN prop `annotate` trên mọi leaf bên dưới (thầy chốt 2026-07-26).
 */

const meta: Meta<typeof Breadcrumbs.Base> = {
    title: "Atoms/Navigation/Breadcrumbs/Breadcrumbs.Base",
    component: Breadcrumbs.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Breadcrumbs.Base>

/** Default — trail đầy đủ; crumb cuối là trang hiện tại (không `onPress`). */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                leaf="Default"
                reason="The one breadcrumb atom, wrapping HeroUI's Breadcrumbs. Truncation is a leaf of the maxItems prop, not a separate component."
                code={"<Breadcrumbs.Base items={[{ key: \"home\", label: \"Home\", onPress: fn }, …, { key: \"current\", label: \"Lesson 3\" }]} />"}
            >
                <Breadcrumbs.Base
                    items={[
                        { key: "home", label: "Home", onPress: () => {} },
                        { key: "course", label: "Advanced React", onPress: () => {} },
                        { key: "current", label: "Lesson 3: Hooks" },
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
                note="maxItems=3 with a 5-crumb trail shows the first crumb, an '…', then the last two. Deeper ancestors are already reachable from top nav."
                code={"<Breadcrumbs.Base maxItems={3} items={[/* 5 crumbs */]} />"}
            >
                <Breadcrumbs.Base
                    maxItems={3}
                    items={[
                        { key: "home", label: "Home", onPress: () => {} },
                        { key: "catalog", label: "Catalog", onPress: () => {} },
                        { key: "course", label: "Advanced React", onPress: () => {} },
                        { key: "module", label: "Chapter 2", onPress: () => {} },
                        { key: "current", label: "Lesson 3: Hooks" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** CollapsedLongTrail — `collapseFrom` → trail dài đổi hẳn sang '← Back' ở MỌI width. */
export const CollapsedLongTrail: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Breadcrumbs.Base"
                tier="atom"
                leaf="CollapsedLongTrail"
                note="collapseFrom=4 with a 4-crumb trail swaps the whole Breadcrumbs for the back link — a long trail wraps and eats vertical space, and deeper ancestors are already reachable from top nav."
                code={"<Breadcrumbs.Base collapseFrom={4} backLabel=\"Back\" items={[/* 4 crumbs */]} />"}
            >
                <Breadcrumbs.Base
                    collapseFrom={4}
                    backLabel="Back"
                    items={[
                        { key: "home", label: "Home", onPress: () => {} },
                        { key: "catalog", label: "Catalog", onPress: () => {} },
                        { key: "course", label: "Advanced React", onPress: () => {} },
                        { key: "current", label: "Lesson 3: Hooks" },
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
                note="collapseOnMobile swaps a narrow column for the back link below @app-sm and shows the trail from @app-sm up. The fixed 375px container IS the mobile signal here (container queries — the viewport addon has no effect)."
                code={"<Breadcrumbs.Base collapseOnMobile backLabel=\"Back\" items={[…]} />"}
            >
                <div className="@container w-[375px] max-w-full rounded-none border border-dashed border-accent p-3">
                    <Breadcrumbs.Base
                        collapseOnMobile
                        backLabel="Back"
                        items={[
                            { key: "home", label: "Home", onPress: () => {} },
                            { key: "course", label: "Advanced React", onPress: () => {} },
                            { key: "current", label: "Lesson 3: Hooks" },
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
                note="isSkeleton renders a row of bar shimmers, owned by the atom, while the trail hasn't resolved from the route yet."
                code={"<Breadcrumbs.Base isSkeleton items={[…]} />"}
            >
                <Breadcrumbs.Base
                    isSkeleton
                    items={[
                        { key: "home", label: "Home" },
                        { key: "course", label: "React" },
                        { key: "current", label: "Lesson 3" },
                    ]}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}
