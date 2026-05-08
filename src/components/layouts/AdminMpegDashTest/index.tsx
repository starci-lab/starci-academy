"use client"

import React, { useState } from "react"
import { Button, Card, CardContent, Input, cn } from "@heroui/react"
import { VideoRenderer } from "@/components/reuseable"
import { VideoRendererType } from "@/modules/types"
import { ArrowLeft, Play, Radio } from "lucide-react"
import { useRouter } from "next/navigation"

/**
 * Admin tool page for testing the VideoRenderer with all 3 renderer types.
 * Enter a URL and pick Standard / MpegDash / Youtube to preview.
 */
export const AdminMpegDashTest = () => {
    const router = useRouter()

    const [url, setUrl] = useState("")
    const [activeType, setActiveType] = useState<VideoRendererType>(
        VideoRendererType.MpegDash,
    )

    const types: Array<{
        type: VideoRendererType
        label: string
        description: string
        color: string
        icon: React.ReactNode
    }> = [
        {
            type: VideoRendererType.MpegDash,
            label: "MPEG-DASH",
            description: "dashjs adaptive streaming (.mpd)",
            color: "from-emerald-600 to-teal-600",
            icon: <Radio className="h-4 w-4" />,
        },
        {
            type: VideoRendererType.Standard,
            label: "Standard",
            description: "Native <video> (mp4, webm)",
            color: "from-indigo-600 to-purple-600",
            icon: <Play className="h-4 w-4" />,
        },
        {
            type: VideoRendererType.Youtube,
            label: "YouTube",
            description: "Iframe embed",
            color: "from-red-600 to-rose-600",
            icon: <Play className="h-4 w-4" />,
        },
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
            <div className="mx-auto max-w-4xl space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Button
                        id="admin-mpegdash-back"
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                        onPress={() => router.push("/admin")}
                    >
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-white">
                            Video Renderer Test
                        </h1>
                        <p className="text-sm text-slate-400">
                            Enter a URL and select a renderer type to preview
                        </p>
                    </div>
                </div>

                {/* Config Card */}
                <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
                    <CardContent className="space-y-4 p-6">
                        <h2 className="text-lg font-semibold text-white">
                            Configuration
                        </h2>

                        {/* URL input */}
                        <Input
                            id="mpegdash-url-input"
                            placeholder="https://example.com/stream/manifest.mpd"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            className="text-white"
                        />

                        {/* Type selector buttons */}
                        <div className="flex flex-wrap gap-2">
                            {types.map((t) => (
                                <button
                                    key={t.type}
                                    onClick={() => setActiveType(t.type)}
                                    className={cn(
                                        "flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all",
                                        activeType === t.type
                                            ? `bg-gradient-to-r ${t.color} text-white shadow-lg`
                                            : "bg-slate-700/50 text-slate-300 hover:bg-slate-700",
                                    )}
                                >
                                    {t.icon}
                                    <div className="text-left">
                                        <div>{t.label}</div>
                                        <div className="text-[10px] opacity-70">
                                            {t.description}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Player Card */}
                <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
                    <CardContent className="space-y-3 p-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            Preview
                            <span className="text-xs font-normal text-slate-400">
                                ({types.find((t) => t.type === activeType)?.label})
                            </span>
                        </h2>

                        {url.trim() ? (
                            <VideoRenderer
                                url={url}
                                rendererType={activeType}
                                title="Test video"
                            />
                        ) : (
                            <div className="flex aspect-video items-center justify-center rounded-large border border-dashed border-slate-600 text-sm text-slate-500">
                                Enter a URL above to preview
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Quick test URLs */}
                <Card className="border-slate-700/50 bg-slate-800/50 backdrop-blur-xl">
                    <CardContent className="space-y-3 p-6">
                        <h2 className="text-sm font-medium text-slate-400">
                            Quick Test URLs
                        </h2>
                        <div className="space-y-2">
                            {[
                                {
                                    label: "DASH — Akamai test stream",
                                    url: "https://dash.akamaized.net/akamai/bbb_30fps/bbb_30fps.mpd",
                                    type: VideoRendererType.MpegDash,
                                },
                                {
                                    label: "MP4 — Big Buck Bunny",
                                    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
                                    type: VideoRendererType.Standard,
                                },
                                {
                                    label: "YouTube — Never Gonna Give You Up",
                                    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                                    type: VideoRendererType.Youtube,
                                },
                            ].map((item) => (
                                <button
                                    key={item.url}
                                    onClick={() => {
                                        setUrl(item.url)
                                        setActiveType(item.type)
                                    }}
                                    className="w-full rounded-lg bg-slate-700/30 px-3 py-2 text-left text-xs text-slate-300 transition-colors hover:bg-slate-700/60"
                                >
                                    <span className="font-medium text-white">
                                        {item.label}
                                    </span>
                                    <br />
                                    <span className="text-slate-500 break-all">
                                        {item.url}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
