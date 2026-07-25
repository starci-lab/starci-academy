import React from "react"
import { cn } from "@heroui/react"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — a faithful port of
 * `src/components/blocks/media/QRCode`, authored in Storybook (NOT `src`) and
 * synced back to `src` later. No `@/components` imports.
 *
 * NOTE: the QR bitmap is served by the external `api.qrserver.com` CDN (same as
 * `src`) — the frame + center-icon anatomy render offline, but the QR image
 * itself only loads with network access.
 */

/** Props for the {@link QRCode} block. */
export interface QRCodeProps {
    /** Rendered width/height of the square QR, in px. */
    size: number
    /** Payload encoded into the QR (URL/text). */
    data: string
    /** Optional node centered over the QR (logo/avatar). */
    icon?: React.ReactNode
    /** Extra classes on the frame. */
    className?: string
}

export const QRCode = ({ size, data, icon, className }: QRCodeProps) => {
    const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`
    return (
        <div className={cn("relative inline-flex shrink-0", className)} style={{ width: size, height: size }}>
            <img alt="" width={size} height={size} src={src} className="rounded-lg" />
            {icon ? (
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background p-1 shadow-sm">
                    {icon}
                </div>
            ) : null}
        </div>
    )
}
