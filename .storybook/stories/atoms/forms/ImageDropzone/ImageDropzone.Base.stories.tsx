import type { Meta, StoryObj } from "@storybook/nextjs"
import { CameraIcon } from "@phosphor-icons/react"
import { ImageDropzone } from "@sb-components/atoms/forms/ImageDropzone/ImageDropzone"
import { BlockAnatomy } from "@sb-utils/BlockAnatomy/BlockAnatomy"

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
                leaf="Bare dropzone"
                reason="The one dropzone shape in the system. Every leaf below it differs by exactly one prop, so this is the baseline you compare against."
                note="Defaults to the plain image glyph with no hint line — just the icon and the CTA label stacked in a dashed box. Drop a file or click anywhere in the box to pick one."
                code={"<ImageDropzone.Base onFile={handleFile} label=\"Drag and drop a photo here, or click to browse\" />"}
            >
                <div className="max-w-sm">
                    <ImageDropzone.Base
                        showAnatomy
                        onFile={() => {}}
                        label="Drag and drop a photo here, or click to browse"
                    />
                </div>
            </BlockAnatomy>
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
                leaf="Prop `hint`"
                reason="A hint earns its line when the accepted formats or the size limit aren't obvious from the label alone — spell out the rule instead of letting the reader find out by failing an upload."
                note="The hint sits directly under the label as a smaller, muted line. There's no boolean to turn it on — an empty hint would just be a blank line, so the atom shows it only when you pass content."
                code={`<ImageDropzone.Base onFile={handleFile} label="Click to choose an image" />
<ImageDropzone.Base
    onFile={handleFile}
    label="Drag and drop a photo here, or click to browse"
    hint="PNG, JPG, WEBP, GIF · up to 5 MB"
/>`}
            >
                <div className="flex flex-wrap items-start gap-4">
                    <div className="max-w-sm">
                        <ImageDropzone.Base showAnatomy onFile={() => {}} label="Click to choose an image" />
                    </div>
                    <div className="max-w-sm">
                        <ImageDropzone.Base
                            onFile={() => {}}
                            label="Drag and drop a photo here, or click to browse"
                            hint="PNG, JPG, WEBP, GIF · up to 5 MB"
                        />
                    </div>
                </div>
            </BlockAnatomy>
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
                leaf="Prop `icon`"
                reason="Swap the glyph in when the surrounding feature has a more specific idea of what's being uploaded than 'an image' — a camera for a profile photo, say."
                note="Pass a component reference (icon={CameraIcon}), not JSX — the atom owns the size (size-8) and, being ≥ size-5, leaves the weight at the default regular (§5.0a). The override sits in the same slot and inherits the same drag-over recolor as the default glyph."
                code={`<ImageDropzone.Base onFile={handleFile} label="Drag and drop a photo here, or click to browse" />
<ImageDropzone.Base
    onFile={handleFile}
    label="Add a profile photo"
    hint="Square images look best"
    icon={CameraIcon}
/>`}
            >
                <div className="flex flex-wrap items-start gap-4">
                    <div className="max-w-sm">
                        <ImageDropzone.Base
                            showAnatomy
                            onFile={() => {}}
                            label="Drag and drop a photo here, or click to browse"
                        />
                    </div>
                    <div className="max-w-sm">
                        <ImageDropzone.Base
                            onFile={() => {}}
                            label="Add a profile photo"
                            hint="Square images look best"
                            icon={CameraIcon}
                        />
                    </div>
                </div>
            </BlockAnatomy>
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
                leaf="Prop `isDragActive`"
                reason="This is what the reader sees mid-drag, right before they let go of the file. Pinning it here is the only way to review that moment without actually dragging a file over the canvas."
                note="Solid accent border, soft accent tint behind it, and the icon plus label recolor together — one state, three parts moving at once. Leave the prop unset in real use and the atom drives this itself from react-dropzone."
                code={`<ImageDropzone.Base onFile={handleFile} label="Drag and drop a photo here, or click to browse" />
<ImageDropzone.Base
    onFile={handleFile}
    label="Drag and drop a photo here, or click to browse"
    isDragActive
/>`}
            >
                <div className="flex flex-wrap items-start gap-4">
                    <div className="max-w-sm">
                        <ImageDropzone.Base
                            showAnatomy
                            onFile={() => {}}
                            label="Drag and drop a photo here, or click to browse"
                        />
                    </div>
                    <div className="max-w-sm">
                        <ImageDropzone.Base
                            onFile={() => {}}
                            label="Drag and drop a photo here, or click to browse"
                            isDragActive
                        />
                    </div>
                </div>
            </BlockAnatomy>
        </div>
    ),
}
