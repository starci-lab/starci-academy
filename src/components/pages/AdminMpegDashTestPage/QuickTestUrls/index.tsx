"use client"

import React from "react"
import { Card, CardContent, cn } from "@heroui/react"
import { QUICK_TEST_URLS } from "../constants"
import { QuickTestUrlButton } from "./QuickTestUrlButton"
import type { QuickTestUrl } from "../types"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { Box } from "@/components/frames/Box"

/** Props for {@link QuickTestUrls}. */
export interface QuickTestUrlsProps extends WithClassNames<undefined> {
    /** Loads a preset's URL + renderer type into the tool. */
    onSelect: (item: QuickTestUrl) => void
}

/**
 * Quick test URLs card: preset buttons that load a URL + renderer type.
 * @param props.onSelect - Called with the chosen preset.
 */
export const QuickTestUrls = ({ onSelect, className }: QuickTestUrlsProps) => (
    <Card className={cn("border-slate-700/50 bg-slate-800/50 backdrop-blur-xl", className)}>
        <CardContent>
            <Box principle="page-pad" className="space-y-3 p-6"
                explain="Page chrome inset — not card-padding, because this pads the whole page rather than a nested card surface.">
                <h2 className="text-sm font-medium text-slate-400">
                    Quick Test URLs
                </h2>
                <div className="space-y-2">
                    {QUICK_TEST_URLS.map((item) => (
                        <QuickTestUrlButton
                            key={item.url}
                            item={item}
                            onSelect={onSelect}
                        />
                    ))}
                </div>
            </Box>
        </CardContent>
    </Card>
)
