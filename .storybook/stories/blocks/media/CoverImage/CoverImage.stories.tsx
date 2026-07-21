import type { Meta, StoryObj } from "@storybook/nextjs"
import { CoverImage } from "./CoverImage"

const meta: Meta<typeof CoverImage> = {
    title: "Primitives/Media/CoverImage",
    component: CoverImage,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof CoverImage>

// Offline-safe inline cover (16:9). No external host so it renders under CSP.
const COVER_SRC =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20800%20450'%3E%3Cdefs%3E%3ClinearGradient%20id='g'%20x1='0'%20y1='0'%20x2='1'%20y2='1'%3E%3Cstop%20offset='0'%20stop-color='%236366f1'/%3E%3Cstop%20offset='1'%20stop-color='%23ec4899'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect%20width='800'%20height='450'%20fill='url(%23g)'/%3E%3Ctext%20x='400'%20y='240'%20font-family='sans-serif'%20font-size='44'%20fill='white'%20text-anchor='middle'%3ECourse%20cover%2016:9%3C/text%3E%3C/svg%3E"

export const WithImage: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <CoverImage src={COVER_SRC} alt="Course cover image" />
            </div>
        </div>
    ),
}

export const NoImage: Story = {
    render: () => (
        <div className="p-8">
            <div className="w-96">
                <CoverImage src={null} alt="No cover image yet" />
            </div>
        </div>
    ),
}
