import type { Meta, StoryObj } from "@storybook/nextjs"
import { ImageDropzone } from "./ImageDropzone"

const meta: Meta<typeof ImageDropzone> = {
    title: "Primitives/Identity/ImageDropzone",
    component: ImageDropzone,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof ImageDropzone>

export const WithHint: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <ImageDropzone
                    onFile={() => {}}
                    label="Drag and drop an image here, or click to choose"
                    hint="PNG, JPG, WEBP, GIF · up to 5 MB"
                />
            </div>
        </div>
    ),
}

export const NoHint: Story = {
    render: () => (
        <div className="p-8">
            <div className="max-w-md">
                <ImageDropzone onFile={() => {}} label="Click to choose an image" />
            </div>
        </div>
    ),
}
