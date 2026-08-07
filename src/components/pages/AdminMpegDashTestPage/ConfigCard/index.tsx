"use client"

import React from "react"
import { Card, CardContent, Input } from "@heroui/react"
import { RENDERER_TYPE_OPTIONS } from "../map"
import { RendererTypeButton } from "./RendererTypeButton"
import type { VideoRendererType } from "@/modules/types/enums/video-renderer-type"
import { Box } from "@/components/frames/Box"

/** Props for {@link ConfigCard}. */
export interface ConfigCardProps {
    /** Current URL value. */
    url: string
    /** Currently selected renderer type. */
    activeType: VideoRendererType
    /** Updates the URL value. */
    onChangeUrl: (value: string) => void
    /** Selects a renderer type. */
    onSelectType: (type: VideoRendererType) => void
}

/**
 * Configuration card: URL input + renderer-type selector buttons.
 * @param props.url - Current URL value.
 * @param props.activeType - Currently selected renderer type.
 * @param props.onChangeUrl - Updates the URL value.
 * @param props.onSelectType - Selects a renderer type.
 */
export const ConfigCard = ({
    url,
    activeType,
    onChangeUrl,
    onSelectType}: ConfigCardProps) => (
    <Card className={"border-slate-700/50 bg-slate-800/50 backdrop-blur-xl"}>
        <CardContent>
            <Box principle="page-pad" className="space-y-3 p-6"
                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                <h2 className="text-lg font-semibold text-white">
                    Configuration
                </h2>

                <Input
                    id="mpegdash-url-input"
                    placeholder="https://example.com/stream/manifest.mpd"
                    value={url}
                    onChange={(e) => onChangeUrl(e.target.value)}
                    className="text-white"
                />

                <Box principle="chip-row" className="flex flex-wrap gap-2"
                    explain="Lets chips share one wrapping row so related tags stay together without stacking as a column.">
                    {RENDERER_TYPE_OPTIONS.map((option) => (
                        <RendererTypeButton
                            key={option.type}
                            option={option}
                            isActive={activeType === option.type}
                            onSelect={onSelectType}
                        />
                    ))}
                </Box>
            </Box>
        </CardContent>
    </Card>
)
