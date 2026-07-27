import { useMemo, useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import {
    Button,
    Input,
    Label,
    ListBox,
    ScrollShadow,
    TextField,
    Typography,
    cn,
} from "@heroui/react"
import { ResizableRail } from "@sb-components/layouts/layout/ResizableRail/ResizableRail"
import { Page } from "@sb-components/layouts/layout/Page/Page"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ResizableRail.Base` — a side rail whose width the reader drags, persisted to
 * `localStorage`. One region (the rail body) → plain `children`, no named slots.
 */
const meta: Meta<typeof ResizableRail.Base> = {
    title: "Layouts/Layout/ResizableRail/ResizableRail.Base",
    component: ResizableRail.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ResizableRail.Base>

const TOPICS = [
    "Tất cả",
    "Mảng & Chuỗi",
    "Danh sách liên kết",
    "Ngăn xếp & Hàng đợi",
    "Cây & BST",
    "Đồ thị",
    "Quy hoạch động",
    "Tham lam",
    "Băm & Tập hợp",
    "Sắp xếp",
    "Hai con trỏ",
    "Cửa sổ trượt",
]

/** Props for the `PracticeTopicsBody` helper. */
interface PracticeTopicsBodyProps {
    /** Extra classes merged onto the body wrapper. */
    className?: string
}

/** Topic search + ListBox — the rail body, mirroring `PracticeRail` (problems mode) without the mode tabs. */
const PracticeTopicsBody = ({ className }: PracticeTopicsBodyProps) => {
    const [query, setQuery] = useState("")
    const [topic, setTopic] = useState("Tất cả")

    const topics = useMemo(() => {
        const normalized = query.trim().toLowerCase()
        if (!normalized) {
            return TOPICS
        }
        return TOPICS.filter((item) => item.toLowerCase().includes(normalized))
    }, [query])

    return (
        <div className={cn("relative flex min-h-0 min-w-0 flex-col gap-3 p-6", className)}>
            <div className="flex flex-col gap-2">
                <Label className="px-1 text-xs text-muted">Chủ đề</Label>
                <TextField>
                    <Input
                        type="search"
                        aria-label="Tìm chủ đề"
                        placeholder="Tìm chủ đề"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                    />
                </TextField>
            </div>

            <ScrollShadow
                hideScrollBar
                className="-mx-1 min-h-0 min-w-0 flex-1 overflow-y-auto px-1"
            >
                {topics.length === 0 ? (
                    <Typography type="body-sm" color="muted" className="px-3 py-2">
                        Không có chủ đề khớp "{query.trim()}"
                    </Typography>
                ) : (
                    <ListBox
                        aria-label="Danh sách chủ đề"
                        selectionMode="single"
                        disallowEmptySelection
                        selectedKeys={[topic]}
                        onSelectionChange={(keys) => {
                            const key = [...keys][0]
                            if (typeof key === "string") {
                                setTopic(key)
                            }
                        }}
                        className="gap-1 p-0"
                    >
                        {topics.map((item) => (
                            <ListBox.Item
                                key={item}
                                id={item}
                                textValue={item}
                                className="cursor-pointer rounded-2xl px-3 py-2 text-foreground data-[hovered=true]:bg-default-100 data-[selected=true]:bg-accent-soft data-[selected=true]:text-accent-soft-foreground"
                            >
                                <Typography type="body-sm" className="min-w-0 flex-1 truncate text-inherit">
                                    {item}
                                </Typography>
                            </ListBox.Item>
                        ))}
                    </ListBox>
                )}
            </ScrollShadow>
        </div>
    )
}

/** Shell mirrored from `Practice`: flex row, rail `relative shrink-0`, content pane `flex-1` + a `Page.Header`. */
const PracticeShellDemo = ({
    storageKey,
    heightClassName,
    defaultWidth = 300,
    maxWidth = 420,
    showAnatomy = false,
}: {
    storageKey: string
    heightClassName: string
    defaultWidth?: number
    maxWidth?: number
    showAnatomy?: boolean
}) => (
    <div className={`flex w-full items-start ${heightClassName}`}>
        <ResizableRail.Base
            className="relative flex h-full shrink-0 flex-col self-stretch"
            storageKey={storageKey}
            defaultWidth={defaultWidth}
            minWidth={256}
            maxWidth={maxWidth}
            ariaLabel="Kéo để đổi độ rộng danh sách chủ đề"
            showAnatomy={showAnatomy}
        >
            <PracticeTopicsBody className="min-h-0 flex-1" />
        </ResizableRail.Base>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <Page.Header
                    title="Luyện tập coding"
                    description="Chọn một chủ đề ở bên trái để bắt đầu luyện các bài tập tương ứng."
                />
            </div>
        </div>
    </div>
)

// Content (rail body — an anatomy-only marker, real children keep their own layout)
// · Handle (drag splitter, edge per `handleSide`).
const RAIL_PARTS: Array<AnatomyNode> = [
    { name: "Content", tier: "primitive", role: "vùng thân rail (children) — marker, không đổi layout thật" },
    { name: "Handle", tier: "primitive", role: "splitter kéo-thả (role=separator), cạnh theo `handleSide`" },
]

/** Default: search + topic ListBox rail beside a content pane. Drag the right-edge handle to resize. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ResizableRail.Base"
                tier="primitive"
                leaf="Default"
                parts={RAIL_PARTS}
                code={"<ResizableRail.Base storageKey=\"practice.rail.width\" defaultWidth={300} minWidth={256} maxWidth={420} ariaLabel=\"Resize the topic list\"><TopicList /></ResizableRail.Base>"}
            >
                <PracticeShellDemo
                    storageKey="storybook.practice.rail.width"
                    heightClassName="h-[32rem]"
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/** Overflow branch: a taller topic list scrolls INSIDE the rail (ScrollShadow), never pushing the shell taller. */
export const OverflowScrollsInRail: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ResizableRail.Base"
                tier="primitive"
                leaf="OverflowScrollsInRail"
                parts={RAIL_PARTS}
                note="Cùng bộ part với Default — chỉ khác chiều cao/overflow BÊN TRONG Content (ScrollShadow tự cuộn)."
                code={"<ResizableRail.Base storageKey=\"practice.rail.scroll.width\" defaultWidth={360} minWidth={256} maxWidth={420} ariaLabel=\"Resize the topic list\"><ScrollShadow><TopicList /></ScrollShadow></ResizableRail.Base>"}
            >
                <PracticeShellDemo
                    storageKey="storybook.practice.rail.scroll.v2.width"
                    heightClassName="h-80"
                    defaultWidth={360}
                    showAnatomy
                />
            </BlockAnatomy>
        </div>
    ),
}

/**
 * Moving-bounds branch: when the caller NARROWS `maxWidth`, an already-wider rail
 * must snap back to the new bound on its own, without waiting for the next drag.
 * The persisted width is left alone — the reader's preference, not overwritten by
 * a temporarily small window. Drag wide, then shrink the cap.
 */
export const ShrinkingMaxWidth: Story = {
    render: () => {
        const [maxWidth, setMaxWidth] = useState(560)
        return (
            <div className="p-8">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-2">
                        <Label>Bounds that move under the rail</Label>
                        <Typography type="body-sm" color="muted">
                            drag the rail out to its full {maxWidth}px, then shrink the cap. The rail re-clamps itself; it must not sit at an illegal width until the reader drags again.
                        </Typography>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onPress={() => setMaxWidth(560)}>
                                maxWidth 560
                            </Button>
                            <Button size="sm" variant="secondary" onPress={() => setMaxWidth(360)}>
                                maxWidth 360
                            </Button>
                        </div>
                    </div>
                    <PracticeShellDemo
                        storageKey="storybook.practice.rail.bounds.width"
                        heightClassName="h-[32rem]"
                        maxWidth={maxWidth}
                    />
                </div>
            </div>
        )
    },
}
