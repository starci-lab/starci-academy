import type { Meta, StoryObj } from "@storybook/nextjs"
import { Container, type ContainerSize } from "@sb-components/layouts/layout/Container/Container"
import { Grid } from "@sb-components/layouts/layout/Grid/Grid"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * LAYOUT (khung) — `Container.Base`: KHỔ NỘI DUNG (căn giữa + chặn bề rộng + đệm).
 *
 * ⭐ Điểm đáng soi nhất là leaf `ContainerQuery`: khung này MỞ `@container`, nên lưới
 * nằm trong nó đo BỀ RỘNG KHỔ chứ không đo cột app nữa. Hai khổ khác `size` ôm cùng
 * một `Grid` cùng `columns` sẽ ra số cột KHÁC nhau — đó chính là lý do thầy chốt mở
 * container (2026-07-26).
 *
 * Leaf ở tầng khung tách theo CẤU TRÚC/trục prop của khung (§14d.2), không theo luật
 * 1-prop-1-leaf của tầng atom (§12g).
 */

/** Ô mẫu — chỉ để nhìn ra mép khổ và số cột, không mang nội dung domain (§13). */
const Tile = ({ label }: { label: string }) => (
    <div className="rounded-xl border border-default bg-surface p-3 text-sm text-foreground">{label}</div>
)

/** Dải kẻ nền để thấy khổ được căn giữa trong vùng cha rộng hơn. */
const Bleed = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full bg-default/40 py-4">{children}</div>
)

const meta: Meta<typeof Container.Base> = {
    title: "Layouts/Layout/Container/Container.Base",
    component: Container.Base,
    tags: ["autodocs"],
    parameters: { layout: "fullscreen" },
}

export default meta

type Story = StoryObj<typeof Container.Base>

/** ĐỦ union `ContainerSize`, kèm bề rộng token để đối chiếu với bậc `@app-*`. */
const SIZES: Array<{ size: ContainerSize; width: string }> = [
    { size: "sm", width: "40rem" },
    { size: "md", width: "48rem — default" },
    { size: "lg", width: "64rem" },
    { size: "xl", width: "80rem" },
    { size: "full", width: "no cap" },
]

/** Leaf trần — khổ mặc định `md`, đệm `6`, chỉ có `body`. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="primitive"
                leaf="Default"
                reason="A content column is a real concept, so it gets a frame with a name. Before this, every page hand-wrote the same `mx-auto w-full max-w-3xl` string — 72 of them across the app."
                note="Defaults to the 48rem column with p-6 padding, centred in whatever it sits in. The grey band is the parent, not part of the frame."
                code={'<Container.Base body={<Tile label="Body" />} />'}
            >
                <Bleed>
                    <Container.Base showAnatomy body={<Tile label="Body — max-w-app-md, centred" />} />
                </Bleed>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `size` — ĐỦ 5 bậc, mỗi bậc trỏ thẳng vào một token `--container-app-*`. */
export const Sizes: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="primitive"
                leaf="Prop `size`"
                reason="Each step points at the same `--container-app-*` token that drives the `@app-*` breakpoints, so the column width and the breakpoint scale can never drift apart. Picking `md` means 'exactly one app-md wide', not 'about 48rem'."
                note="Read it the other way round too: inside a `md` column the `@app-lg` step can never fire, so asking a grid for 4 columns there is asking for a step that never arrives."
                code={`<Container.Base size="sm" … />   // 40rem
<Container.Base size="md" … />   // 48rem — default
<Container.Base size="lg" … />   // 64rem
<Container.Base size="xl" … />   // 80rem
<Container.Base size="full" … /> // no cap`}
            >
                <div className="flex flex-col gap-3">
                    {SIZES.map(({ size, width }, index) => (
                        <Bleed key={size}>
                            <Container.Base
                                size={size}
                                padding={3}
                                showAnatomy={index === 0}
                                body={<Tile label={`size="${size}" · ${width}`} />}
                            />
                        </Bleed>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf prop `padding` — thang §10c, mặc định `6` (khổ web). */
export const Padding: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="primitive"
                leaf="Prop `padding`"
                note="Padding sits inside the width cap, so the readable line shortens as it grows. Drop to 0 when a child owns the edge — a full-bleed cover image or a table that scrolls sideways."
                code={`<Container.Base padding={0} … />
<Container.Base padding={3} … />
<Container.Base … />            // 6 = default
<Container.Base padding={8} … />`}
            >
                <div className="flex flex-col gap-3">
                    {([0, 3, 6, 8] as const).map((padding, index) => (
                        <Bleed key={padding}>
                            <Container.Base
                                padding={padding}
                                showAnatomy={index === 0}
                                body={<Tile label={`padding={${padding}}`} />}
                            />
                        </Bleed>
                    ))}
                </div>
            </BlockAnatomy>
        </div>
    ),
}

/** Leaf slot — ba vùng `header`/`body`/`footer`, cách nhau bằng nhịp TRANG. */
export const Slots: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="Container.Base"
                tier="primitive"
                leaf="Slots `header` / `body` / `footer`"
                note="With neither header nor footer the body renders raw — a children-only call produces no extra wrapper at all. The gap between regions defaults to the page rhythm (8), deliberately wider than the rhythm inside a card."
                code={`<Container.Base
  header={<Page.Header title="Courses" />}
  body={<CourseList />}
  footer={<Pagination />}
/>`}
            >
                <Bleed>
                    <Container.Base
                        showAnatomy
                        header={<Tile label="Header" />}
                        body={<Tile label="Body" />}
                        footer={<Tile label="Footer" />}
                    />
                </Bleed>
            </BlockAnatomy>
        </div>
    ),
}

/** Part `Grid.Base` có story riêng ⇒ khai `storyId` để bấm nhảy sang được. */
const QUERY_ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Grid.Base": {
        tier: "primitive",
        role: "Same grid, same columns prop — it just measures the column it lands in.",
        storyId: "layouts-layout-grid-grid-base--default",
    },
}

/**
 * Leaf ⭐ — bằng chứng của quyết định "khung này MỞ `@container`".
 *
 * Hai khổ, CÙNG một `Grid` với CÙNG `columns`, ra số cột khác nhau: khổ `md` đứng ở
 * bậc `@app-md` (2 cột), khổ `xl` với tới `@app-lg` (4 cột). Trước khi mở container,
 * cả hai đều nghe theo cột app nên cùng nhảy 4 cột dù khổ trái chỉ rộng 48rem.
 */
export const ContainerQuery: Story = {
    render: () => {
        const cells = ["Alpha", "Beta", "Gamma", "Delta"].map((label) => ({
            key: label,
            content: <Tile label={label} />,
        }))
        const columns = { base: 1, sm: 2, md: 2, lg: 4 } as const
        return (
            <div className="p-8">
                <BlockAnatomy
                    name="Container.Base"
                    tier="primitive"
                    leaf="Opening `@container`"
                    annotate={QUERY_ANNOTATE}
                    reason="The `@app-*` breakpoints are container queries — they measure the nearest container. This frame opens one, so a grid inside answers to the column it actually sits in instead of to the whole app shell."
                    note="Both columns hold the identical grid with identical props. The narrow one stops at 2 because `@app-lg` never fires inside 48rem; the wide one reaches 4. Asking for `lg: 4` inside a md column is asking for a step that never arrives — not a bug, just a page too narrow for four."
                    code={`const columns = { base: 1, sm: 2, md: 2, lg: 4 }

<Container.Base size="md" body={<Grid.Base columns={columns} gap={3} items={cells} />} />
<Container.Base size="xl" body={<Grid.Base columns={columns} gap={3} items={cells} />} />`}
                >
                    <div className="flex flex-col gap-6">
                        {(["md", "xl"] as const).map((size, index) => (
                            <div key={size} className="flex flex-col gap-2">
                                <p className="text-xs text-muted">{`size="${size}"`}</p>
                                <Bleed>
                                    <Container.Base size={size} padding={3} showAnatomy={index === 0}>
                                        <span className="block" data-anat-part="Grid.Base">
                                            <Grid.Base columns={columns} gap={3} items={cells} />
                                        </span>
                                    </Container.Base>
                                </Bleed>
                            </div>
                        ))}
                    </div>
                </BlockAnatomy>
            </div>
        )
    },
}
