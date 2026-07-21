import type { Meta, StoryObj } from "@storybook/nextjs"
import { LanguageDonut } from "./LanguageDonut"

const meta: Meta<typeof LanguageDonut> = {
    title: "Primitives/Stats/LanguageDonut",
    component: LanguageDonut,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof LanguageDonut>

/** Default size for many languages — ring split by brand colour, total at the centre, legend with count + %. */
export const MultiLanguage: Story = {
    render: () => (
        <div className="p-8">
            <LanguageDonut
                ariaLabel="Phân bố bài giải theo ngôn ngữ"
                unitLabel="bài giải"
                items={[
                    { key: "typescript", value: 128 },
                    { key: "python", value: 64 },
                    { key: "java", value: 31 },
                    { key: "go", value: 18 },
                    { key: "csharp", value: 9 },
                ]}
            />
        </div>
    ),
}

/** Compact (smaller size/thickness) — for a narrow block; total + legend stay readable. */
export const Compact: Story = {
    render: () => (
        <div className="p-8">
            <LanguageDonut
                size={96}
                thickness={6}
                ariaLabel="Phân bố bài giải theo ngôn ngữ (compact)"
                unitLabel="bài giải"
                items={[
                    { key: "typescript", value: 42 },
                    { key: "go", value: 15 },
                ]}
            />
        </div>
    ),
}
