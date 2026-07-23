import React from "react"
import { cn } from "@heroui/react"
import { EnumChip } from "../EnumChip/EnumChip"
import type { EnumChipEntry } from "../EnumChip/EnumChip"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — the target `HostPlatformChip`. Authored in
 * Storybook (not `src`); synced to `src` later. NO `@/components` imports.
 * A thin domain map over the shared local `EnumChip` primitive; labels are
 * hardcoded so the port stays self-contained.
 */

/** Where the lesson video is hosted (mirrors the `src` `VideoHostPlatform` enum). */
export enum VideoHostPlatform {
    Youtube = "youtube",
    GoogleDrive = "googleDrive",
    Vimeo = "vimeo",
    CloudflareStream = "cloudflareStream",
    Other = "other",
}

/** Props for {@link HostPlatformChip}. */
export interface HostPlatformChipProps {
    /** Host platform of the lesson video. */
    hostPlatform: VideoHostPlatform
    /** Extra classes on the chip. */
    className?: string
    /** Renders the loading skeleton mirror instead of the real chip. */
    isSkeleton?: boolean
}

/**
 * A chip that displays the host platform of a lesson video (accent, text-only
 * label). Thin domain map over the shared `EnumChip` primitive.
 *
 * @param hostPlatform - The host platform of the lesson video.
 */
export const HostPlatformChip = ({ hostPlatform, className, isSkeleton }: HostPlatformChipProps) => {
    if (isSkeleton) {
        return <Skeleton.Chip className={className} />
    }
    // `Other` is intentionally unhandled — EnumChip throws on it, matching the
    // original switch `default` throw. Hence Partial rather than a full Record.
    const map: Partial<Record<VideoHostPlatform, EnumChipEntry>> = {
        [VideoHostPlatform.Youtube]: { color: "accent", label: "YouTube" },
        [VideoHostPlatform.GoogleDrive]: { color: "accent", label: "Google Drive" },
        [VideoHostPlatform.Vimeo]: { color: "accent", label: "Vimeo" },
        [VideoHostPlatform.CloudflareStream]: { color: "accent", label: "Cloudflare Stream" },
    }
    return <EnumChip value={hostPlatform} map={map} className={cn(className)} />
}
