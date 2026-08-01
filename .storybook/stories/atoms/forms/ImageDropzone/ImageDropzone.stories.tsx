import type { Meta, StoryObj } from "@storybook/nextjs"
import { CameraIcon } from "@phosphor-icons/react"
import { ImageDropzone } from "@sb-components/atoms/forms/ImageDropzone/ImageDropzone"
import { BlockAnatomy, type AnatomyAnnotation } from "@sb-utils/BlockAnatomy/BlockAnatomy"

/**
 * `Typography` — OUR OWN atom, with its own story to jump to (the label and,
 * when set, the `hint` line both mount one each — see `ImageDropzone.tsx` passing
 * `` explicitly, § two-law pass, 2026-07-28).
 */
const ANNOTATE: Record<string, AnatomyAnnotation> = {
    "Typography": { tier: "atom", role: "label / hint text", storyId: "atoms-text-typography-typography--plain" },
}

/**
 * ATOM — `ImageDropzone`: the system's drop/pick zone for a SINGLE image.
 *
 * 📐 **1 PROP = 1 LEAF** (§12g — the ATOM-tier rule). Props that produce a shape:
 * `hint` (format/size guidance line), `icon` (swaps the center glyph), and
 * `isDragActive` (pins the drag state from outside). `label` is always present,
 * already shown in `Default`. `onFile`, `className`, `showAnatomy` don't produce
 * a shape, so they have no leaf.
 *
 * Fixed 2026-07-26 (part of the first atom-cleanup pass):
 *   • Leaf `Icon` changed its call site from `icon={<CameraIcon />}` (a node) to
 *     `icon={CameraIcon}` (a component) — the atom forces its own size (`size-8`),
 *     and since `size-8 ≥ size-5` (§5.0a) it does NOT pass `weight`, leaving the
 *     glyph at its default `regular` stroke (unlike Chip, whose `size-3` forces
 *     `bold`).
 *   • NEW leaf `DragActive` — previously the solid border + background tint + the
 *     icon/label color change while dragging a file over the box was INTERNAL
 *     state of `useDropzone`, with no leaf able to force it. The atom now accepts
 *     `isDragActive?: boolean` to pin it from outside (leaving it unset keeps the
 *     old behavior unchanged).
 */

/** Copy shown at the top of the autodocs page. On-screen text is written in ENGLISH (teacher finalized 2026-07-26). */
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

const meta: Meta<typeof ImageDropzone> = {
    title: "Atoms/Forms/ImageDropzone/ImageDropzone",
    component: ImageDropzone,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
        docs: { description: { component: IMAGE_DROPZONE_DOC } },
    },
}

export default meta

type Story = StoryObj<typeof ImageDropzone>

/** Bare leaf — only the required `label` prop, no `hint`, default glyph, no drag active. */
export const Default: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ImageDropzone"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Bare dropzone"
                reason="This is the one dropzone shape in the system, and every leaf below it differs by exactly one prop, so this is the baseline to compare against."
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "hint unset, icon unset, isDragActive unset",
                        why: "The box falls back to the plain image glyph with no hint line, just the icon and the CTA label stacked inside the dashed border. Dropping a file or clicking anywhere in the box picks one, so the bare shape already carries the whole call to action.",
                        code: "<ImageDropzone onFile={handleFile} label=\"Drag and drop a photo here, or click to browse\" />",
                        render: (
                            <ImageDropzone
                               
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

/** Leaf prop `hint` — format/size guidance line, shown only when passed. */
export const Hint: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ImageDropzone"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `hint`"
                reason="A hint earns its line whenever the accepted formats or the size limit aren't obvious from the label alone, spelling out the rule instead of letting the reader find out by failing an upload."
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "hint unset",
                        why: "No hint line appears under the label, since there is no boolean to switch it on: an empty hint would just be a blank line. This is the shape a caller reaches for when the label alone already says enough.",
                        code: "<ImageDropzone onFile={handleFile} label=\"Click to choose an image\" />",
                        render: <ImageDropzone onFile={() => {}} label="Click to choose an image" />,
                    },
                    {
                        name: "hint = \"PNG, JPG, WEBP, GIF · up to 5 MB\"",
                        why: "The hint sits directly under the label as a smaller, muted line, and the atom shows it only because content was passed in. This is the shape a caller reaches for when the accepted formats or the size limit aren't obvious from the label on its own.",
                        code: `<ImageDropzone
    onFile={handleFile}
    label="Drag and drop a photo here, or click to browse"
    hint="PNG, JPG, WEBP, GIF · up to 5 MB"
/>`,
                        render: (
                            <ImageDropzone
                               
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

/** Leaf prop `icon` — the CENTER glyph, takes a COMPONENT rather than a rendered node. */
export const Icon: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ImageDropzone"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `icon`"
                reason="Swap the glyph in when the surrounding feature has a more specific idea of what's being uploaded than an image in general, a camera for a profile photo, say."
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "icon unset (default image glyph)",
                        why: "The box shows the plain image glyph the atom falls back to when no override is passed. It is the same recolor-on-drag glyph slot that `icon` replaces in the next state, just holding its default value.",
                        code: "<ImageDropzone onFile={handleFile} label=\"Drag and drop a photo here, or click to browse\" />",
                        render: (
                            <ImageDropzone
                               
                                onFile={() => {}}
                                label="Drag and drop a photo here, or click to browse"
                            />
                        ),
                    },
                    {
                        name: "icon = CameraIcon",
                        why: "The override sits in the exact same glyph slot as the default icon and inherits the same drag-over recolor. Passing a component reference rather than JSX lets the atom keep owning the size (`size-8`) and, being at or above `size-5`, leave the stroke weight at its default regular (§5.0a).",
                        code: `<ImageDropzone
    onFile={handleFile}
    label="Add a profile photo"
    hint="Square images look best"
    icon={CameraIcon}
/>`,
                        render: (
                            <ImageDropzone
                               
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
 * Leaf prop `isDragActive` — pins the drag state from outside. Previously (first
 * pass) there was no way to force this shape into a story since it only lived
 * inside `useDropzone`; now the atom accepts a prop to override it, so the solid
 * border + background tint + icon/label color change can show up here.
 */
export const DragActive: Story = {
    render: () => (
        <div data-tier="fixture" className="p-8">
            <BlockAnatomy
                name="ImageDropzone"
                tier="atom"
                annotate={ANNOTATE}
                leaf="Prop `isDragActive`"
                reason="This is what the reader sees mid-drag, right before they let go of the file; pinning it here is the only way to review that moment without actually dragging a file over the canvas."
                renderClassName="max-w-sm"
                states={[
                    {
                        name: "isDragActive unset",
                        why: "The box sits at rest with a dashed border and no tint, the resting counterpart to the pinned drag state in the next tab. In real use this is what a visitor sees before their cursor ever crosses the box.",
                        code: "<ImageDropzone onFile={handleFile} label=\"Drag and drop a photo here, or click to browse\" />",
                        render: (
                            <ImageDropzone
                               
                                onFile={() => {}}
                                label="Drag and drop a photo here, or click to browse"
                            />
                        ),
                    },
                    {
                        name: "isDragActive = true",
                        why: "The border turns solid accent, a soft accent tint fills the background, and the icon plus label recolor together as one state moving three parts at once. Leave the prop unset in real use and the atom drives this itself from react-dropzone; the prop only exists so this moment can be pinned for review.",
                        code: `<ImageDropzone
    onFile={handleFile}
    label="Drag and drop a photo here, or click to browse"
    isDragActive
/>`,
                        render: (
                            <ImageDropzone
                               
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
