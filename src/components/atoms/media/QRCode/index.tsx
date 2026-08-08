import React from "react"
import { Skeleton as HeroSkeleton } from "@heroui/react"

/**
 * Storybook-local port of `src/components/blocks/media/QRCode`. Does not
 * import from `@/components`.
 *
 * The QR bitmap is served by the external `api.qrserver.com` CDN — the frame
 * and center-icon render offline, but the QR image itself needs network access.
 */

/** Props for the {@link QRCode} block. */
export interface QRCodeProps {
    /** Rendered width/height of the square QR, in px. */
    size: number
    /** Payload encoded into the QR (URL/text). */
    data: string
    /** Optional node centered over the QR (logo/avatar). */
    icon?: React.ReactNode
    /**
     * `true` → shimmer the SAME `size`×`size` box (same radius), no `<img>`/`icon`
     * mounted. No `skeletonWidth` here — the QR is a fixed square whose side is
     * already the `size` prop, not a width that varies with content.
     */
    isSkeleton?: boolean
}

/**
 * `QRCode` — the (currently only) shape of the QR block: image frame +
 * optional centered icon.
 * @param props - {@link QRCodeProps}
 */
const QRCodeBase = ({ size, data, icon, isSkeleton = false }: QRCodeProps) => {
    if (isSkeleton) {
        // The shimmer is the whole root — same size and radius as the real
        // `<img>` below, no `icon` overlay while unresolved.
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="QRCode"
                className="shrink-0 rounded-lg"
                style={{ width: size, height: size }}
            />
        )
    }

    const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`
    return (
        <div data-tier="atom" data-component="QRCode" className="relative inline-flex shrink-0" style={{ width: size, height: size }}>
            <img alt="" width={size} height={size} src={src} className="rounded-lg" />
            {icon ? (
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-background p-1 shadow-sm">
                    {icon}
                </div>
            ) : null}
        </div>
    )
}

/** `QRCode.*` — QR-code atom namespace; one shape today, grouped under `Base`. */
export { QRCodeBase as QRCode }

/** Tier metadata for `QRCode`, used by the component registry/Storybook lookup. */
export const meta = { tier: "atom", name: "QRCode" } as const
