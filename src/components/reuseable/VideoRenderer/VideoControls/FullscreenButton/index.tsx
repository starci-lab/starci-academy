"use client"

import { SquareDashedText as ArrowsOutIcon } from "@gravity-ui/icons"
import React from "react"
import { Button } from "@heroui/react"


/** Props for {@link FullscreenButton}. */
export interface FullscreenButtonProps {
    /** Fired when the user requests fullscreen toggle. */
    onFullscreen: () => void
}

/**
 * Icon button that requests entering/exiting fullscreen.
 *
 * Presentational: forwards the press to {@link FullscreenButtonProps.onFullscreen}.
 * @param props - The fullscreen toggle callback.
 */
export const FullscreenButton = ({
    onFullscreen,
}: FullscreenButtonProps) => {
    return (
        <Button
            isIconOnly
            variant="ghost"
            aria-label="Fullscreen"
            onPress={onFullscreen}
            className="text-white hover:bg-white/20 border-none min-w-8 h-8"
        >
            <ArrowsOutIcon className="h-4 w-4" />
        </Button>
    )
}
