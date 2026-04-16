"use client"

import React, { useMemo } from "react"
import { Chip } from "@heroui/react"
import { VideoHostPlatform } from "@/modules/types"
import { useTranslations } from "next-intl"
import { 
    SiGoogledrive, 
    SiYoutube, 
    SiVimeo, 
    SiCloudflare 
} from "@icons-pack/react-simple-icons"

/**
 * The props for the HostPlatformChip component.
 * @param hostPlatform - The host platform of the lesson video.
 */
export interface HostPlatformChipProps {
    hostPlatform: VideoHostPlatform
}

/**
 * A chip that displays the host platform of a lesson video.
 * @param hostPlatform - The host platform of the lesson video.
 * @returns A chip that displays the host platform of a lesson video.
 */
export const HostPlatformChip = ({ hostPlatform }: HostPlatformChipProps) => {
    const t = useTranslations()
    // switch case to return the icon and label
    const renderHostPlatform = () => {
        switch (hostPlatform) {
        case VideoHostPlatform.Youtube:
            return {
                icon: <SiYoutube size={16} />,
                label: "videoHostPlatform.youtube",
            }
        case VideoHostPlatform.GoogleDrive:
            return {
                icon: <SiGoogledrive size={16} />,
                label: "videoHostPlatform.googleDrive",
            }
        case VideoHostPlatform.Vimeo:
            return {
                icon: <SiVimeo size={16} />,
                label: "videoHostPlatform.vimeo",
            }
        case VideoHostPlatform.CloudflareStream:
            return {
                icon: <SiCloudflare size={16} />,
                label: "videoHostPlatform.cloudflareStream",
            }
        default:
            throw new Error(`Invalid host platform: ${hostPlatform}`)
        }
    }
    const { icon, label } = useMemo(() => renderHostPlatform(), [hostPlatform])
    return (
        <Chip color="accent" size="sm" variant="soft">
            {icon}
            <Chip.Label>{t(label)}</Chip.Label>
        </Chip>
    )
}