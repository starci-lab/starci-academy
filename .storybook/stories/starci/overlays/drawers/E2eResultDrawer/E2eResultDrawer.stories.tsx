import { useState } from "react"
import type { Meta, StoryObj } from "@storybook/nextjs"
import { Button } from "@sb-components/atoms/buttons/Button/Button"
import { E2eResultDrawer } from "@sb-components/starci/overlays/drawers/E2eResultDrawer/E2eResultDrawer"
import type { E2eFlow } from "@sb-components/starci/overlays/drawers/E2eResultDrawer/E2eResultDrawer"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `E2eResultDrawer` — presentational-only overlay drawer showing the recorded
 * Playwright E2E proof for a lesson (pass/fail chip + title per flow,
 * expandable to the full proof markdown), with a language filter when the
 * flow set spans multiple stacks. Collapses the real `E2eResultDrawer` +
 * `E2eBody` pair into one block (Rule 13 + the task's ContentModal precedent).
 */
const meta: Meta<typeof E2eResultDrawer> = {
    title: "StarCi/Overlays/Drawers/E2eResultDrawer/E2eResultDrawer",
    component: E2eResultDrawer,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof E2eResultDrawer>

// DOM thật (single-stack flows): Drawer.CloseTrigger + Drawer.Header (title) +
// Drawer.Body > StackV(root) > Typography(count) + Accordion > Disclosure per
// flow > Disclosure.Trigger > StackH(flow title) > Chip + Typography, and
// Disclosure.Content > MarkdownContent when a flow carries a proof.
const ANNOTATE_SINGLE: Record<string, AnatomyAnnotation> = {
    "Drawer.CloseTrigger": { tier: "heroui", role: "the close button, upper-right" },
    "Drawer.Body": { tier: "heroui", role: "the scrollable body region" },
    "StackV (root)": { tier: "frame", role: "grouped seam between the count line and the flow list", storyId: "frames-stack-stackv--default" },
    "Typography (count)": { tier: "atom", role: "how many of the visible flows passed", storyId: "atoms-text-typography-typography--colors" },
    "DisclosureGroup": { tier: "atom", role: "the accordion — one panel per recorded flow", storyId: "atoms-navigation-accordion-accordion--default" },
    "StackH (flow title)": { tier: "frame", role: "tight seam — the chip is a mark attached to the flow title", storyId: "frames-stack-stackh--default" },
    "Chip": { tier: "atom", role: "pass/fail status for this flow", storyId: "atoms-chips-chip-chip--tones" },
    "Typography (flow title)": { tier: "atom", role: "the flow's title", storyId: "atoms-text-typography-typography--overview" },
    "MarkdownContent": { tier: "composite", role: "the full proof — commands, real output, conclusion", storyId: "composites-viewers-markdowncontent--compact" },
}

// Multi-language flow set additionally surfaces the Tabs filter above the accordion.
const ANNOTATE_MULTI: Record<string, AnatomyAnnotation> = {
    ...ANNOTATE_SINGLE,
    "Tabs": { tier: "atom", role: "filter the list down to one recorded stack", storyId: "atoms-navigation-tabs-tabs--default" },
}

const SINGLE_LANG_FLOWS: Array<E2eFlow> = [
    {
        id: "flow-enroll",
        title: "Đăng ký học viên vào khoá học",
        status: "passed",
        markdown: `## Đăng ký học viên

1. Đăng nhập bằng tài khoản học viên đã seed.
2. Mở trang chi tiết khoá học, bấm **Đăng ký**.
3. Xác nhận thanh toán (sandbox gateway).

\`\`\`
✓ enrollment created, id=9f2a...
✓ redirected to /learn/course/9f2a...
\`\`\`

Kết luận: luồng đăng ký chạy đúng end-to-end trên backend + UI thật.`,
    },
    {
        id: "flow-submit",
        title: "Nộp bài Thử thách và nhận điểm",
        status: "failed",
        markdown: `## Nộp bài Thử thách

1. Mở một Thử thách đã có sẵn given code.
2. Sửa file, bấm **Nộp bài**.
3. Chờ job chấm điểm.

\`\`\`
✗ grading job timed out after 30s
\`\`\`

Kết luận: job chấm điểm không phản hồi trong thời gian chờ của lần chạy này.`,
    },
]

const MULTI_LANG_FLOWS: Array<E2eFlow> = [
    {
        id: "flow-ws-ts",
        title: "Kết nối WebSocket real-time",
        lang: "typescript",
        status: "passed",
        markdown: "## TypeScript\n\nKết nối `ws://`, gửi/nhận message, đóng kết nối sạch. Toàn bộ bước pass.",
    },
    {
        id: "flow-ws-go",
        title: "Kết nối WebSocket real-time",
        lang: "go",
        status: "passed",
        markdown: "## Go\n\nCùng luồng, chạy trên server Go. Pass.",
    },
    {
        id: "flow-ws-csharp",
        title: "Kết nối WebSocket real-time",
        lang: "csharp",
        status: "failed",
        markdown: "## C#\n\nKết nối rớt sau ~5s do handshake timeout.",
    },
    {
        id: "flow-upload-java",
        title: "Tải file lên và xử lý bất đồng bộ",
        lang: "java",
        status: "passed",
    },
]

/** Props for the controlled story wrapper below. */
interface ControlledE2eResultDrawerProps {
    flows: Array<E2eFlow>
}

/** Controlled wrapper — the trigger reopens the drawer after it closes. */
const ControlledE2eResultDrawer = ({ flows }: ControlledE2eResultDrawerProps) => {
    const [isOpen, setIsOpen] = useState(true)
    const isMulti = new Set(flows.map((flow) => flow.lang ?? "agnostic")).size > 1
    return (
        <div className="flex flex-col gap-3 p-8">
            <Button
                label="Xem kết quả E2E"
                variant="secondary"
                size="sm"
                className="self-start"
                onPress={() => setIsOpen(true)}
            />
            <BlockAnatomy
                name="E2eResultDrawer"
                tier="block"
                leaf="Default"
                parts={[]}
                annotate={isMulti ? ANNOTATE_MULTI : ANNOTATE_SINGLE}
                reason="Collapses the real E2eResultDrawer+E2eBody pair (Rule 13 + ContentModal precedent): a status chip and title per recorded flow, expandable to the full proof markdown, with a language filter that only appears when the flow set spans more than one stack. Root guard mirrors both real call-sites — an empty `flows` array renders nothing."
                states={[
                    {
                        name: "single stack — no language filter",
                        why: "Every flow shares the same `lang` (or none is set), so `langs.length` is 1 and the Tabs filter never mounts — matches the real `E2eBody`'s `hasLangFilter` guard.",
                        code: `<E2eResultDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  flows={[
    { id: "flow-enroll", title: "Đăng ký học viên vào khoá học", status: "passed", markdown: "..." },
    { id: "flow-submit", title: "Nộp bài Thử thách và nhận điểm", status: "failed", markdown: "..." },
  ]}
/>`,
                        render: (
                            <E2eResultDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                flows={SINGLE_LANG_FLOWS}
                                showAnatomy
                            />
                        ),
                    },
                    {
                        name: "multi-stack — language filter shown",
                        why: "Flows span four stacks (typescript/go/csharp/java), so the Tabs filter renders above the accordion; the passed/total count reflects only the flows visible for the active language.",
                        code: `<E2eResultDrawer
  isOpen={isOpen}
  onOpenChange={setIsOpen}
  flows={[
    { id: "flow-ws-ts", title: "Kết nối WebSocket real-time", lang: "typescript", status: "passed", markdown: "..." },
    { id: "flow-ws-go", title: "Kết nối WebSocket real-time", lang: "go", status: "passed", markdown: "..." },
    { id: "flow-ws-csharp", title: "Kết nối WebSocket real-time", lang: "csharp", status: "failed", markdown: "..." },
    { id: "flow-upload-java", title: "Tải file lên và xử lý bất đồng bộ", lang: "java", status: "passed" },
  ]}
/>`,
                        render: (
                            <E2eResultDrawer
                                isOpen={isOpen}
                                onOpenChange={setIsOpen}
                                flows={MULTI_LANG_FLOWS}
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    )
}

/** Single-stack flow set: no language filter, both a passed and a failed flow. */
export const Default: Story = {
    render: () => <ControlledE2eResultDrawer flows={SINGLE_LANG_FLOWS} />,
}

/** LEAF — the caller flips `isSkeleton`; `flows` hasn't resolved yet so there's nothing real to filter or expand. */
export const Skeleton: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="E2eResultDrawer"
                tier="block"
                leaf="Prop `isSkeleton`"
                parts={[]}
                annotate={ANNOTATE_SINGLE}
                states={[
                    {
                        name: "isSkeleton = true, default skeletonCount",
                        why: "The drawer can open before `flows` has resolved from the backend — a count-bar shimmer stands in for the passed/total line, followed by `skeletonCount` (default 3) flat bars, one per flow row expected once the list loads. No language filter or accordion mounts yet since there's no `flows` array to derive either from.",
                        code: "<E2eResultDrawer isOpen={isOpen} onOpenChange={setIsOpen} isSkeleton />",
                        render: (
                            <E2eResultDrawer
                                isOpen
                                onOpenChange={() => {}}
                                isSkeleton
                                anatPart="E2eResultDrawer"
                                showAnatomy
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
