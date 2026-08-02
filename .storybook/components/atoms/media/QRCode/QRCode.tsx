import React from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * ATOM — `QRCode`: an image frame rendering a QR bitmap, with an optional centered icon.
 * 
 * 1 PROP = 1 LEAF. Every prop with a visual effect gets its own leaf rendering the full set
 * of that prop's values: `size` · `icon` · `isSkeleton`.
 * 
 * `data` gets no leaf — it is the content the atom renders, not a state to enumerate, so it
 * stays constant across every leaf and only its value in the code snippet changes.
 * `classNames` gets no leaf either: it only places the atom inside its parent, never changing
 * how the atom looks.
 * 
 * This atom does not yet tag any element with `data-anat-part` (no `showAnatomy` prop on
 * {@link QRCode}), so the Structure tab stays empty for every leaf — expected, not a bug.
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
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
}

/**
 * `QRCode` — the (currently only) shape of the QR block: image frame +
 * optional centered icon.
 * @param props - {@link QRCodeProps}
 */
const QRCodeBase = ({ size, data, icon, isSkeleton = false, classNames }: QRCodeProps) => {
    if (isSkeleton) {
        // The shimmer is the whole root — same size and radius as the real
        // `<img>` below, no `icon` overlay while unresolved.
        return (
            <HeroSkeleton
                data-tier="atom"
                data-component="QRCode"
                className={cn("shrink-0 rounded-lg", classNames)}
                style={{ width: size, height: size }}
            />
        )
    }

    const src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`
    return (
        <div data-tier="atom" data-component="QRCode" className={cn("relative inline-flex shrink-0", classNames)} style={{ width: size, height: size }}>
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

export const meta = { tier: "atom", name: "QRCode" } as const
