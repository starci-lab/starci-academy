import React from "react"
import type { ReactNode } from "react"
import { cn } from "@heroui/react"
import type { WithClassNames } from "@/modules/types/base/class-name"

/** Visual tone of the tile (drives the tinted background + icon colour). */
export type IconTileTone = "accent" | "success" | "warning" | "danger" | "neutral"

/** Size of the tile. */
export type IconTileSize = "sm" | "md" | "lg"

/** Props for the {@link IconTile} block. */
export interface IconTileProps extends WithClassNames<undefined> {
    /** The icon (phosphor `*Icon`) — rendered centered and auto-sized. */
    icon: ReactNode
    /** Tinted background + icon colour. Defaults to "accent". */
    tone?: IconTileTone
    /** Tile size. Defaults to "md" (64px). */
    size?: IconTileSize
}

/** tone → tinted background + icon colour. */
const TONE: Record<IconTileTone, string> = {
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    danger: "bg-danger/10 text-danger",
    neutral: "bg-default text-muted",
}

/** size → tile box + auto icon size + radius. */
const SIZE: Record<IconTileSize, string> = {
    sm: "size-12 rounded-xl [&_svg]:size-6",
    md: "size-16 rounded-2xl [&_svg]:size-8",
    lg: "size-20 rounded-2xl [&_svg]:size-10",
}

/**
 * A framed icon tile — a soft tinted square (`bg-{tone}/20`) with the icon
 * centered inside, used as the avatar of a *thing* (course, project, section…)
 * to give it breathing room and a consistent identity. The icon auto-sizes and
 * inherits the tone colour; pass it bare. Pure/props-only; owns its look.
 *
 * @param props - {@link IconTileProps}
 */
export const IconTile = ({
    icon,
    tone = "accent",
    size = "md",
    className,
}: IconTileProps) => {
    return (
        <div
            aria-hidden
            className={cn(
                "flex shrink-0 items-center justify-center",
                SIZE[size],
                TONE[tone],
                className,
            )}
        >
            {icon}
        </div>
    )
}
