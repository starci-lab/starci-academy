import type { Meta, StoryObj } from "@storybook/nextjs"
import { CameraIcon } from "@phosphor-icons/react"
import { ImageDropzone } from "@sb-components/atoms/forms/ImageDropzone/ImageDropzone"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Typography.Base` — OUR OWN atom, with its own story to jump to (the label and,
 * when set, the `hint` line both mount one each — see `ImageDropzone.tsx` passing
 * `anatPart="Typography.Base"` explicitly, § two-law pass, 2026-07-28).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography.Base": { tier: "atom", role: "label / hint text", storyId: "atoms-text-typography-typography-base--plain" },
}

/**
 * ATOM — `ImageDropzone.Base`: vùng thả/chọn MỘT ảnh duy nhất của hệ.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — luật của TẦNG ATOM). Prop sinh hình: `hint` (dòng gợi ý
 * định dạng/kích thước), `icon` (đổi glyph giữa), và `isDragActive` (ghim state kéo-thả
 * từ ngoài). `label` luôn có, nằm sẵn ở `Default`. `onFile`, `className`, `showAnatomy`
 * không sinh hình nên không có leaf.
 *
 * Sửa 2026-07-26 (theo chặng 1 dọn atom):
 *   • Leaf `Icon` đổi call-site từ `icon={<CameraIcon />}` (node) sang `icon={CameraIcon}`
 *     (component) — atom tự ép size (`size-8`), và vì `size-8 ≥ size-5` (§5.0a) nên
 *     KHÔNG truyền `weight`, glyph giữ nét `regular` mặc định (khác Chip vốn `size-3`
 *     phải ép `bold`).
 *   • Leaf MỚI `DragActive` — trước đây viền đặc + nền tint + icon/label đổi màu khi kéo
 *     file qua là STATE NỘI BỘ của `useDropzone`, không leaf nào ép vào được. Atom giờ
 *     nhận `isDragActive?: boolean` để ghim từ ngoài (không truyền ⇒ hành vi cũ không đổi).
 */

/** Hướng dẫn hiện đầu trang autodocs. Chữ trên UI viết TIẾNG ANH (thầy chốt 2026-07-26). */
const IMAGE_DROPZONE_DOC = `
## What it takes

One required prop carries the whole call to action: \`label\`. Everything else is optional
polish — a \`hint\` line for format or size rules the reader might not guess, and an
\`icon\` override when the default photo glyph doesn't fit the context.

## Hint

Add a \`hint\` whenever the accepted formats or the size limit aren't obvious from the
label alone. Skip it when the label already says enough — a second line the reader has to
parse just adds friction for no reason.

## Icon

The default glyph is a plain image icon. Swap it in when the surrounding feature has a
more specific idea of what's being uploaded — a camera for a profile photo, say. Pass it
as a **component** (\`icon={CameraIcon}\`), not JSX — the atom owns the size and picks the
stroke weight itself.

## Drag and drop

Dragging a file over the box turns the border solid, tints the background, and recolors
the icon and label. That's normally a live browser interaction you can't force in a
story, but \`isDragActive\` lets you pin it so the state has somewhere to live here.
`

const meta: Meta<typeof ImageDropzone.Base> = {
    title: "Atoms/Forms/ImageDropzone/ImageDropzone.Base",
    component: ImageDropzone.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: IMAGE_DROPZONE_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof ImageDropzone.Base>

/** Leaf TRẦN — chỉ prop bắt buộc `label`, không `hint`, glyph mặc định, không kéo-thả. */
export const Default: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ImageDropzone.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Bare dropzone"
                reason="This is the one dropzone shape in the system, and every leaf below it differs by exactly one prop, so this is the baseline to compare against."
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "hint unset, icon unset, isDragActive unset",
                        why: "The box falls back to the plain image glyph with no hint line, just the icon and the CTA label stacked inside the dashed border. Dropping a file or clicking anywhere in the box picks one, so the bare shape already carries the whole call to action.",
                        code: "<ImageDropzone.Base onFile={handleFile} label=\"Drag and drop a photo here, or click to browse\" />",
                        render: (
                            <ImageDropzone.Base
                                showAnatomy
                                onFile={() => {}}
                                label="Drag and drop a photo here, or click to browse"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `hint` — dòng gợi ý định dạng/kích thước, chỉ hiện khi được truyền. */
export const Hint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ImageDropzone.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `hint`"
                reason="A hint earns its line whenever the accepted formats or the size limit aren't obvious from the label alone, spelling out the rule instead of letting the reader find out by failing an upload."
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "hint unset",
                        why: "No hint line appears under the label, since there is no boolean to switch it on: an empty hint would just be a blank line. This is the shape a caller reaches for when the label alone already says enough.",
                        code: "<ImageDropzone.Base onFile={handleFile} label=\"Click to choose an image\" />",
                        render: <ImageDropzone.Base showAnatomy onFile={() => {}} label="Click to choose an image" />,
                    },
                    {
                        name: "hint = \"PNG, JPG, WEBP, GIF · up to 5 MB\"",
                        why: "The hint sits directly under the label as a smaller, muted line, and the atom shows it only because content was passed in. This is the shape a caller reaches for when the accepted formats or the size limit aren't obvious from the label on its own.",
                        code: `<ImageDropzone.Base
    onFile={handleFile}
    label="Drag and drop a photo here, or click to browse"
    hint="PNG, JPG, WEBP, GIF · up to 5 MB"
/>`,
                        render: (
                            <ImageDropzone.Base
                                showAnatomy
                                onFile={() => {}}
                                label="Drag and drop a photo here, or click to browse"
                                hint="PNG, JPG, WEBP, GIF · up to 5 MB"
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/** Leaf prop `icon` — glyph GIỮA, nhận COMPONENT chứ không phải node đã render. */
export const Icon: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ImageDropzone.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `icon`"
                reason="Swap the glyph in when the surrounding feature has a more specific idea of what's being uploaded than an image in general, a camera for a profile photo, say."
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "icon unset (default image glyph)",
                        why: "The box shows the plain image glyph the atom falls back to when no override is passed. It is the same recolor-on-drag glyph slot that `icon` replaces in the next state, just holding its default value.",
                        code: "<ImageDropzone.Base onFile={handleFile} label=\"Drag and drop a photo here, or click to browse\" />",
                        render: (
                            <ImageDropzone.Base
                                showAnatomy
                                onFile={() => {}}
                                label="Drag and drop a photo here, or click to browse"
                            />
                        ),
                    },
                    {
                        name: "icon = CameraIcon",
                        why: "The override sits in the exact same glyph slot as the default icon and inherits the same drag-over recolor. Passing a component reference rather than JSX lets the atom keep owning the size (`size-8`) and, being at or above `size-5`, leave the stroke weight at its default regular (§5.0a).",
                        code: `<ImageDropzone.Base
    onFile={handleFile}
    label="Add a profile photo"
    hint="Square images look best"
    icon={CameraIcon}
/>`,
                        render: (
                            <ImageDropzone.Base
                                showAnatomy
                                onFile={() => {}}
                                label="Add a profile photo"
                                hint="Square images look best"
                                icon={CameraIcon}
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}

/**
 * Leaf prop `isDragActive` — ghim state kéo-thả từ ngoài. Trước đây (chặng 1) không có
 * cách nào ép hình này vào story vì nó chỉ sống trong `useDropzone`; giờ atom nhận prop
 * để đè lên, nên hình viền đặc + nền tint + icon/label đổi màu có mặt được ở đây.
 */
export const DragActive: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ImageDropzone.Base"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDragActive`"
                reason="This is what the reader sees mid-drag, right before they let go of the file; pinning it here is the only way to review that moment without actually dragging a file over the canvas."
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "isDragActive unset",
                        why: "The box sits at rest with a dashed border and no tint, the resting counterpart to the pinned drag state in the next tab. In real use this is what a visitor sees before their cursor ever crosses the box.",
                        code: "<ImageDropzone.Base onFile={handleFile} label=\"Drag and drop a photo here, or click to browse\" />",
                        render: (
                            <ImageDropzone.Base
                                showAnatomy
                                onFile={() => {}}
                                label="Drag and drop a photo here, or click to browse"
                            />
                        ),
                    },
                    {
                        name: "isDragActive = true",
                        why: "The border turns solid accent, a soft accent tint fills the background, and the icon plus label recolor together as one state moving three parts at once. Leave the prop unset in real use and the atom drives this itself from react-dropzone; the prop only exists so this moment can be pinned for review.",
                        code: `<ImageDropzone.Base
    onFile={handleFile}
    label="Drag and drop a photo here, or click to browse"
    isDragActive
/>`,
                        render: (
                            <ImageDropzone.Base
                                showAnatomy
                                onFile={() => {}}
                                label="Drag and drop a photo here, or click to browse"
                                isDragActive
                            />
                        ),
                    },
                ]}
            />
        </div>
    ),
}
