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
import { ResizableRail } from "@sb-components/behaviors/ResizableRail/ResizableRail"
import { PageHeader } from "@sb-components/composites/layout/Page/Page"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `ResizableRail` — a side rail whose width the reader drags, persisted to
 * `localStorage`. One region (the rail body) → plain `children`, no named slots.
 *
 * 2026-07-27: migrated every leaf below to the `states[]` API.
 */
const meta: Meta<typeof ResizableRail> = {
    title: "Behaviors/ResizableRail/ResizableRail",
    component: ResizableRail,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ResizableRail>

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

/** Shell mirrored from `Practice`: flex row, rail `relative shrink-0`, content pane `flex-1` + a `PageHeader`. */
const PracticeShellDemo = ({
    storageKey,
    heightClassName,
    defaultWidth = 300,
    maxWidth = 420,
}: {
    storageKey: string
    heightClassName: string
    defaultWidth?: number
    maxWidth?: number
}) => (
    <div className={`flex w-full items-start ${heightClassName}`}>
        <ResizableRail
            className="relative flex h-full shrink-0 flex-col self-stretch"
            storageKey={storageKey}
            defaultWidth={defaultWidth}
            minWidth={256}
            maxWidth={maxWidth}
            ariaLabel="Kéo để đổi độ rộng danh sách chủ đề"
        >
            <PracticeTopicsBody className="min-h-0 flex-1" />
        </ResizableRail>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-6">
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <PageHeader
                    title="Luyện tập coding"
                    description="Chọn một chủ đề ở bên trái để bắt đầu luyện các bài tập tương ứng."
                />
            </div>
        </div>
    </div>
)

// No anatomy `parts` here (2026-07-28): the rail's body is a CALLER slot (`children`), not this
// frame's own part, and the drag handle is internal geometry with no component/story of its own
// to link a reader to — neither name is declared anywhere, so the badges only ever rendered into
// the DOM invisibly. Both were dropped at the source in `ResizableRail.tsx`.

/** Default: search + topic ListBox rail beside a content pane. Drag the right-edge handle to resize. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ResizableRail"
                tier="frame"
                leaf="Default"
                states={[
                    {
                        name: "defaultWidth = 300, minWidth = 256, maxWidth = 420",
                        why: "The rail body renders the topic search plus ListBox at its default 300px width, beside a content pane that fills the rest of the row. Dragging the right-edge handle resizes the rail within the 256 to 420 bound and the width persists to localStorage under storageKey.",
                        code: "<ResizableRail storageKey=\"practice.rail.width\" defaultWidth={300} minWidth={256} maxWidth={420} ariaLabel=\"Resize the topic list\"><TopicList /></ResizableRail>",
                        render: (
                            <PracticeShellDemo
                                storageKey="storybook.practice.rail.width"
                                heightClassName="h-[32rem]"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Overflow branch: a taller topic list scrolls INSIDE the rail (ScrollShadow), never pushing the shell taller. */
export const OverflowScrollsInRail: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ResizableRail"
                tier="frame"
                leaf="OverflowScrollsInRail"
                states={[
                    {
                        name: "rail height = h-80, topic list taller than the rail",
                        why: "The topic list scrolls inside the rail through its own ScrollShadow rather than pushing the surrounding shell taller. The rail is the exact same drag-to-resize box as Default, only the height and the overflow behaviour inside the rail body differ.",
                        code: "<ResizableRail storageKey=\"practice.rail.scroll.width\" defaultWidth={360} minWidth={256} maxWidth={420} ariaLabel=\"Resize the topic list\"><ScrollShadow><TopicList /></ScrollShadow></ResizableRail>",
                        render: (
                            <PracticeShellDemo
                                storageKey="storybook.practice.rail.scroll.v2.width"
                                heightClassName="h-80"
                                defaultWidth={360}
                            />
                        ),
                    },
                ]}
            />
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
                <BlockAnatomy
                    name="ResizableRail"
                    tier="frame"
                    leaf="ShrinkingMaxWidth"
                    reason="The persisted width is the reader's own preference, so a temporarily small maxWidth clamps the rail on screen without overwriting what gets saved to localStorage — the next time the bound widens, the rail returns to the width the reader actually chose."
                    states={[
                        {
                            name: "maxWidth toggled at runtime between 560 and 360",
                            why: "Dragging the rail out to its full width and then pressing the 360 button snaps the rail back to the new bound immediately, without waiting for another drag. The rail re-clamps itself the moment maxWidth narrows, so it can never sit at a width that is no longer legal.",
                            code: "<ResizableRail storageKey=\"practice.rail.bounds.width\" defaultWidth={300} minWidth={256} maxWidth={maxWidth} ariaLabel=\"Resize the topic list\"><TopicList /></ResizableRail>",
                            render: (
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
                            ),
                        },
                    ]}
                />
            </div>
        )
    },
}
