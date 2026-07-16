"use client"

import React from "react"
import { cn } from "@heroui/react"
import { useTranslations } from "next-intl"
import {
    SiGoogledrive,
    SiYoutube,
    SiVimeo,
    SiCloudflare,
} from "@icons-pack/react-simple-icons"
import { VideoHostPlatform } from "@/modules/types/enums/video-host-platform"
import { EnumChip } from "@/components/blocks/chips/EnumChip"
import type { EnumChipEntry } from "@/components/blocks/chips/EnumChip"
import type { WithClassNames } from "@/modules/types/base/class-name"

/**
 * The props for the HostPlatformChip component.
 * @param hostPlatform - The host platform of the lesson video.
 */
export interface HostPlatformChipProps extends WithClassNames<undefined> {
    /** Host platform of the lesson video. */
    hostPlatform: VideoHostPlatform
}

/**
 * A chip that displays the host platform of a lesson video (accent, brand icon +
 * label). Thin domain map over the shared {@link EnumChip} primitive.
 * @param hostPlatform - The host platform of the lesson video.
 */
export const HostPlatformChip = ({ hostPlatform, className }: HostPlatformChipProps) => {
    const t = useTranslations()
    // `Other` is intentionally unhandled — EnumChip throws on it, matching the
    // original switch `default` throw. Hence Partial rather than a full Record.
    const map: Partial<Record<VideoHostPlatform, EnumChipEntry>> = {
        [VideoHostPlatform.Youtube]: { color: "accent", icon: <SiYoutube size={16} />, label: t("videoHostPlatform.youtube") },
        [VideoHostPlatform.GoogleDrive]: { color: "accent", icon: <SiGoogledrive size={16} />, label: t("videoHostPlatform.googleDrive") },
        [VideoHostPlatform.Vimeo]: { color: "accent", icon: <SiVimeo size={16} />, label: t("videoHostPlatform.vimeo") },
        [VideoHostPlatform.CloudflareStream]: { color: "accent", icon: <SiCloudflare size={16} />, label: t("videoHostPlatform.cloudflareStream") },
    }
    return <EnumChip value={hostPlatform} map={map} className={cn(className)} />
}
