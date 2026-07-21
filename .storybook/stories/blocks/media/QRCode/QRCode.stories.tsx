import type { Meta, StoryObj } from "@storybook/nextjs"
import { QRCode } from "./QRCode"

const meta: Meta<typeof QRCode> = {
    title: "Primitives/Media/QRCode",
    component: QRCode,
    tags: ["autodocs"],
    parameters: {
        layout: "fullscreen",
    },
}

export default meta

type Story = StoryObj<typeof QRCode>

// Offline-safe inline avatar for the center-icon variant (no external host).
const ICON_SRC =
    "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2028%2028'%3E%3Crect%20width='28'%20height='28'%20fill='%236366f1'/%3E%3Ctext%20x='14'%20y='19'%20font-family='sans-serif'%20font-size='14'%20fill='white'%20text-anchor='middle'%3ES%3C/text%3E%3C/svg%3E"

export const Default: Story = {
    render: () => (
        <div className="p-8">
            <QRCode size={160} data="https://starci.vn/join/lop-fullstack-k12" />
        </div>
    ),
}

export const WithIcon: Story = {
    render: () => (
        <div className="p-8">
            <QRCode
                size={160}
                data="https://starci.vn/certificate/cert-2026-0721"
                icon={
                    <img
                        alt=""
                        width={28}
                        height={28}
                        src={ICON_SRC}
                        className="rounded-full"
                    />
                }
            />
        </div>
    ),
}

export const Small: Story = {
    render: () => (
        <div className="p-8">
            <QRCode size={96} data="https://starci.vn/payment/inv-88213" />
        </div>
    ),
}

export const Large: Story = {
    render: () => (
        <div className="p-8">
            <QRCode size={240} data="https://starci.vn/event/offline-meetup-2026" />
        </div>
    ),
}
