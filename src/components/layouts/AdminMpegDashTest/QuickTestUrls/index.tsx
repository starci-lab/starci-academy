"use client"

import React from "react"
import { Card, CardContent } from "@heroui/react"
import { QUICK_TEST_URLS } from "../constants"
import { QuickTestUrlButton } from "./QuickTestUrlButton"
import type { QuickTestUrl } from "../types"

export interface QuickTestUrlsProps {
    /** Loads a preset's URL + renderer type into the tool. */
    onSelect: (item: QuickTestUrl) => void
}

/**
 * Quick test URLs card: preset buttons that load a URL + renderer type.
 * @param props.onSelect - Called with the chosen preset.
 */
export const QuickTestUrls = ({ onSelect }: QuickTestUrlsProps) => (
    <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
        <CardContent className="space-y-3 p-6">
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
        </CardContent>
    </Card>
)
