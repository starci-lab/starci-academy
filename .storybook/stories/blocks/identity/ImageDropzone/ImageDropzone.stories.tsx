import type { Meta, StoryObj } from "@storybook/nextjs"
import { ImageDropzone } from "@sb-components/atoms/forms/ImageDropzone/ImageDropzone"
import { BlockAnatomy, type AnatomyNode } from "@sb-utils/BlockAnatomy/BlockAnatomy"

const meta: Meta<typeof ImageDropzone.Base> = {
    title: "Atoms/Forms/ImageDropzone",
    component: ImageDropzone.Base,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ImageDropzone.Base>

// Icon (centered, default or custom) · Label (CTA) · optional Hint (format/size).
const WITH_HINT_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "biểu tượng giữa (mặc định ImageIcon, hoặc icon custom)" },
    { name: "Label", tier: "primitive", role: "dòng CTA chính (kéo-thả hoặc bấm để chọn)" },
    { name: "Hint", tier: "primitive", role: "dòng gợi ý định dạng/kích thước, muted" },
]
const NO_HINT_PARTS: Array<AnatomyNode> = [
    { name: "Icon", tier: "primitive", role: "biểu tượng giữa (mặc định ImageIcon)" },
    { name: "Label", tier: "primitive", role: "dòng CTA chính" },
]

export const WithHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy name="ImageDropzone" tier="primitive" leaf="WithHint" parts={WITH_HINT_PARTS}>
                <div className="max-w-md">
                    <ImageDropzone.Base
                        showAnatomy
                        onFile={() => {}}
                        label="Drag and drop an image here, or click to choose"
                        hint="PNG, JPG, WEBP, GIF · up to 5 MB"
                    />
                </div>
            </BlockAnatomy>
        </div>
    ),
}

export const NoHint: Story = {
    render: () => (
        <div className="p-8">
            <BlockAnatomy
                name="ImageDropzone"
                tier="primitive"
                leaf="NoHint"
                parts={NO_HINT_PARTS}
                note="Không truyền `hint` — chỉ còn Icon + Label."
            >
                <div className="max-w-md">
                    <ImageDropzone.Base showAnatomy onFile={() => {}} label="Click to choose an image" />
                </div>
            </BlockAnatomy>
        </div>
    ),
}
