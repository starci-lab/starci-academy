"use client"

import React from "react"
import {
    SiGoogledrive,
    SiYoutube,
    SiVimeo,
    SiCloudflare,
} from "@icons-pack/react-simple-icons"
import { VideoHostPlatform } from "@/modules/types/enums/video-host-platform"
import { EnumChip } from "@/components/blocks/chips/EnumChip"
import type { EnumChipEntry } from "@/components/blocks/chips/EnumChip"

/**
 * The props for the _HostPlatformChip component — presentational; labels already resolved.
 * @param hostPlatform - The host platform of the lesson video.
 * @param labels - Already-localized label per host platform.
 */
export interface HostPlatformChipProps {
    /** Host platform of the lesson video. */
    hostPlatform: VideoHostPlatform
    /** Already-localized label per host platform, keyed by {@link VideoHostPlatform}. */
    labels: Partial<Record<VideoHostPlatform, string>>
}

/**
 * A chip that displays the host platform of a lesson video (accent, brand icon +
 * label). Thin domain map over the shared {@link EnumChip} primitive.
 * @param props - {@link HostPlatformChipProps}
 */
export const _HostPlatformChip = ({ hostPlatform, labels }: HostPlatformChipProps) => {
    // `Other` is intentionally unhandled — EnumChip throws on it, matching the
    // original switch `default` throw. Hence Partial rather than a full Record.
    const map: Partial<Record<VideoHostPlatform, EnumChipEntry>> = {
        [VideoHostPlatform.Youtube]: { color: "accent", icon: <SiYoutube size={16} />, label: labels[VideoHostPlatform.Youtube] ?? "" },
        [VideoHostPlatform.GoogleDrive]: { color: "accent", icon: <SiGoogledrive size={16} />, label: labels[VideoHostPlatform.GoogleDrive] ?? "" },
        [VideoHostPlatform.Vimeo]: { color: "accent", icon: <SiVimeo size={16} />, label: labels[VideoHostPlatform.Vimeo] ?? "" },
        [VideoHostPlatform.CloudflareStream]: { color: "accent", icon: <SiCloudflare size={16} />, label: labels[VideoHostPlatform.CloudflareStream] ?? "" },
    }
    return <EnumChip value={hostPlatform} map={map} />
}
