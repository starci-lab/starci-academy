"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { VideoHostPlatform } from "@/modules/types/enums/video-host-platform"
import { _HostPlatformChip, type HostPlatformChipProps } from "./component"

/** Props the connected {@link HostPlatformChip} takes from its caller. */
export type HostPlatformChipConnectedProps = Omit<HostPlatformChipProps, "labels">

/**
 * A chip that displays the host platform of a lesson video — the CONNECTED
 * half: resolves each platform's label via `t()`. See `design/storybook/architecture/split.md`.
 *
 * @param props - {@link HostPlatformChipConnectedProps}
 */
export const HostPlatformChip = ({ hostPlatform }: HostPlatformChipConnectedProps) => {
    const t = useTranslations()
    const labels: Partial<Record<VideoHostPlatform, string>> = {
        [VideoHostPlatform.Youtube]: t("videoHostPlatform.youtube"),
        [VideoHostPlatform.GoogleDrive]: t("videoHostPlatform.googleDrive"),
        [VideoHostPlatform.Vimeo]: t("videoHostPlatform.vimeo"),
        [VideoHostPlatform.CloudflareStream]: t("videoHostPlatform.cloudflareStream"),
    }
    return <_HostPlatformChip hostPlatform={hostPlatform} labels={labels} />
}
