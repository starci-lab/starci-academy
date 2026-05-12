"use client"
import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    Button,
    Card,
    CardContent,
    Chip,
    FieldError,
    Input,
    Label,
    ProgressBar,
    Spinner,
    TextField,
} from "@heroui/react"
import { toast } from "@heroui/react"
import {
    Upload,
    Video,
    CheckCircle2,
    XCircle,
    Copy,
    Link2,
    FileVideo2,
    ArrowLeft,
    Cog,
} from "lucide-react"
import { usePostAdminPresignedUrlSwr, usePostAdminProcessVideoSwr } from "@/hooks/singleton/swr"
import { useAppSelector } from "@/redux"
import { useRouter } from "next/navigation"
import type { AdminPresignedUrlItem } from "@/modules/api"

/** Status of each provider upload */
interface ProviderUploadStatus {
    provider: string
    url: string
    status: "idle" | "uploading" | "success" | "error"
    progress: number
    error?: string
}

export const AdminUploadVideo = () => {
    const apiKey = useAppSelector((state) => state.admin.apiKey)
    const router = useRouter()

    /** Redirect to admin page if no API key is set */
    useEffect(() => {
        if (!apiKey) {
            router.replace("../../admin")
        }
    }, [apiKey, router])

    /** Selected file to upload */
    const [file, setFile] = useState<File | null>(null)
    /** Custom S3 key (path) */
    const [objectKey, setObjectKey] = useState("")
    /** Per-provider upload status */
    const [uploads, setUploads] = useState<ProviderUploadStatus[]>([])
    /** Is the presigned URL request in flight */
    const [isRequesting, setIsRequesting] = useState(false)
    /** Track whether upload has been performed */
    const [uploadDone, setUploadDone] = useState(false)
    /** Track whether process-video is in flight */
    const [isProcessing, setIsProcessing] = useState(false)
    /** The uploaded video URL (first provider) to pass to process-video */
    const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null)
    /** Result from the process-video API */
    const [processResult, setProcessResult] = useState<{ jobId: string; message: string } | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const { trigger: triggerPresignedUrl } = usePostAdminPresignedUrlSwr()
    const { trigger: triggerProcessVideo } = usePostAdminProcessVideoSwr()

    /** Handle file selection */
    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selected = e.target.files?.[0]
            if (!selected) return
            setFile(selected)
            setUploads([])
            setUploadDone(false)
            if (!objectKey) {
                const ts = Date.now()
                const safeName = selected.name.replace(/\s+/g, "-")
                setObjectKey(`videos/${ts}-${safeName}`)
            }
        },
        [objectKey],
    )

    /** Handle file drop */
    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            const dropped = e.dataTransfer.files?.[0]
            if (dropped) {
                setFile(dropped)
                setUploads([])
                setUploadDone(false)
                if (!objectKey) {
                    const ts = Date.now()
                    const safeName = dropped.name.replace(/\s+/g, "-")
                    setObjectKey(`videos/${ts}-${safeName}`)
                }
            }
        },
        [objectKey],
    )

    /** Upload file to a single presigned URL */
    const uploadToProvider = useCallback(
        async (
            presigned: AdminPresignedUrlItem,
            fileToUpload: File,
            idx: number,
        ) => {
            return new Promise<void>((resolve) => {
                const xhr = new XMLHttpRequest()

                xhr.upload.addEventListener("progress", (e) => {
                    if (e.lengthComputable) {
                        const pct = Math.round((e.loaded / e.total) * 100)
                        setUploads((prev) =>
                            prev.map((u, i) =>
                                i === idx ? { ...u, progress: pct } : u,
                            ),
                        )
                    }
                })

                xhr.addEventListener("load", () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        setUploads((prev) =>
                            prev.map((u, i) =>
                                i === idx
                                    ? { ...u, status: "success", progress: 100 }
                                    : u,
                            ),
                        )
                    } else {
                        setUploads((prev) =>
                            prev.map((u, i) =>
                                i === idx
                                    ? {
                                        ...u,
                                        status: "error",
                                        error: `HTTP ${xhr.status}`,
                                    }
                                    : u,
                            ),
                        )
                    }
                    resolve()
                })

                xhr.addEventListener("error", () => {
                    setUploads((prev) =>
                        prev.map((u, i) =>
                            i === idx
                                ? {
                                    ...u,
                                    status: "error",
                                    error: "Network error",
                                }
                                : u,
                        ),
                    )
                    resolve()
                })

                xhr.open("PUT", presigned.url)
                xhr.setRequestHeader(
                    "Content-Type",
                    fileToUpload.type || "application/octet-stream",
                )
                setUploads((prev) =>
                    prev.map((u, i) =>
                        i === idx ? { ...u, status: "uploading" } : u,
                    ),
                )
                xhr.send(fileToUpload)
            })
        },
        [],
    )

    /** Full upload flow: get presigned URLs → upload to each provider */
    const handleUpload = useCallback(async () => {
        if (!file || !objectKey) {
            toast.warning("Missing fields", {
                description: "Please select a file and set an object key.",
            })
            return
        }

        setIsRequesting(true)
        setUploadDone(false)
        try {
            const result = await triggerPresignedUrl({
                request: {
                    key: objectKey,
                    contentType: file.type || "video/mp4",
                },
                apiKey,
            })

            const items: AdminPresignedUrlItem[] = result.data ?? []
            if (items.length === 0) {
                toast.danger("No presigned URLs", {
                    description: "The server returned an empty list.",
                })
                setIsRequesting(false)
                return
            }

            // Initialize per-provider statuses
            const initial: ProviderUploadStatus[] = items.map((item) => ({
                provider: item.provider,
                url: item.url,
                status: "idle" as const,
                progress: 0,
            }))
            setUploads(initial)
            setIsRequesting(false)

            // Upload to all providers concurrently
            await Promise.all(
                items.map((item, idx) => uploadToProvider(item, file, idx)),
            )

            setUploadDone(true)
            // Save first provider URL for process-video
            setUploadedVideoUrl(items[0].url.split("?")[0])
            toast.success("Upload complete", {
                description: "Video has been uploaded to all providers.",
            })
        } catch (err: unknown) {
            setIsRequesting(false)
            toast.danger("Failed to get presigned URLs", {
                description:
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred.",
            })
        }
    }, [file, objectKey, apiKey, triggerPresignedUrl, uploadToProvider])

    /** Trigger video processing (FFmpeg encode + MPEG-DASH) on the backend */
    const handleProcess = useCallback(async () => {
        if (!uploadedVideoUrl) {
            toast.warning("No video URL", {
                description: "Please upload a video first.",
            })
            return
        }
        setIsProcessing(true)
        setProcessResult(null)
        try {
            const result = await triggerProcessVideo({
                request: { url: uploadedVideoUrl },
                apiKey,
            })
            setProcessResult({ jobId: result.jobId, message: result.message })
            toast.success("Processing started", {
                description: `Job ${result.jobId} enqueued.`,
            })
        } catch (err: unknown) {
            toast.danger("Failed to process video", {
                description:
                    err instanceof Error
                        ? err.message
                        : "Unknown error occurred.",
            })
        } finally {
            setIsProcessing(false)
        }
    }, [uploadedVideoUrl, apiKey, triggerProcessVideo])

    /** Copy URL to clipboard */
    const copyUrl = useCallback((url: string) => {
        navigator.clipboard.writeText(url)
        toast.success("Copied!", {
            description: "Presigned URL copied to clipboard.",
        })
    }, [])

    /** Human-readable file size */
    const formatSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
        if (bytes < 1024 * 1024 * 1024)
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
    }

    const isUploading = uploads.some((u) => u.status === "uploading")

    if (!apiKey) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-4 md:p-8">
            <div className="mx-auto max-w-3xl space-y-6">
                {/* Top Bar */}
                <div className="flex items-center gap-3 pt-4">
                    <Button
                        id="admin-back-button"
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-white"
                        onPress={() => router.push("../../admin")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </div>

                {/* Header */}
                <div className="text-center space-y-2 pb-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-indigo-300 uppercase">
                        <Video className="h-3.5 w-3.5" />
                        Admin Tools
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-300 bg-clip-text text-transparent">
                        Video Upload
                    </h1>
                    <p className="text-sm text-slate-400 max-w-md mx-auto">
                        Upload videos via S3 presigned URLs. Files are sent directly to storage providers.
                    </p>
                </div>

                {/* File Selection Card */}
                <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-indigo-500/5">
                    <CardContent className="space-y-4 p-6">
                        {/* Section header */}
                        <div className="flex items-center gap-3 pb-2">
                            <div className="rounded-lg bg-indigo-500/10 p-2">
                                <FileVideo2 className="h-5 w-5 text-indigo-400" />
                            </div>
                            <div>
                                <h2 className="text-base font-semibold text-white">
                                    Video File
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Select and configure the file to upload
                                </p>
                            </div>
                        </div>

                        {/* Drop Zone */}
                        <div
                            id="admin-video-dropzone"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            onDrop={handleDrop}
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 transition-all hover:border-indigo-400/40 hover:bg-indigo-500/5"
                        >
                            {file ? (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="rounded-full bg-emerald-500/10 p-3">
                                        <Video className="h-8 w-8 text-emerald-400" />
                                    </div>
                                    <p className="text-sm font-medium text-white">
                                        {file.name}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <Chip
                                            size="sm"
                                            variant="secondary"
                                            className="bg-white/5 text-slate-300"
                                        >
                                            {file.type || "unknown"}
                                        </Chip>
                                        <Chip
                                            size="sm"
                                            variant="secondary"
                                            className="bg-white/5 text-slate-300"
                                        >
                                            {formatSize(file.size)}
                                        </Chip>
                                    </div>
                                    <p className="text-xs text-slate-500">
                                        Click or drag to replace
                                    </p>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="rounded-full bg-indigo-500/10 p-3">
                                        <Upload className="h-8 w-8 text-indigo-400" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-medium text-white">
                                            Click to select or drag & drop
                                        </p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            MP4, MOV, WebM, AVI — any size
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/*"
                                className="hidden"
                                onChange={handleFileChange}
                                id="admin-video-file-input"
                            />
                        </div>

                        {/* Object Key Input */}
                        <TextField>
                            <Label htmlFor="admin-object-key-input" className="text-sm text-slate-300">
                                Object Key (S3 Path)
                            </Label>
                            <div className="relative">
                                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                                <Input
                                    id="admin-object-key-input"
                                    placeholder="videos/my-lecture.mp4"
                                    className="pl-9 bg-white/5 border-white/10 hover:border-indigo-400/40 text-white placeholder:text-slate-500"
                                    value={objectKey}
                                    onChange={(e) => setObjectKey(e.target.value)}
                                />
                            </div>
                        </TextField>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <Button
                                id="admin-upload-button"
                                variant="primary"
                                size="lg"
                                className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 font-semibold shadow-lg shadow-indigo-500/25 transition-all hover:shadow-indigo-500/40 hover:scale-[1.01]"
                                onPress={handleUpload}
                                isDisabled={
                                    !file || !objectKey || isUploading
                                }
                                isPending={isRequesting}
                            >
                                {({isPending}) => (
                                    <>
                                        {!isPending && <Upload className="h-4 w-4" />}
                                        {isPending
                                            ? "Getting URLs…"
                                            : isUploading
                                                ? "Uploading…"
                                                : "Upload"}
                                    </>
                                )}
                            </Button>
                            <Button
                                id="admin-process-button"
                                variant="primary"
                                size="lg"
                                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 font-semibold shadow-lg shadow-emerald-500/25 transition-all hover:shadow-emerald-500/40 hover:scale-[1.01]"
                                onPress={handleProcess}
                                isDisabled={!uploadDone || isProcessing}
                                isPending={isProcessing}
                            >
                                {({isPending}) => (
                                    <>
                                        {!isPending && <Cog className="h-4 w-4" />}
                                        {isPending
                                            ? "Processing…"
                                            : processResult
                                                ? "Re-process"
                                                : "Process Video"}
                                    </>
                                )}
                            </Button>
                        </div>

                        {/* Process result */}
                        {processResult && (
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-1">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                    <span className="text-sm font-medium text-emerald-300">
                                        {processResult.message}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-400 font-mono">
                                    Job ID: {processResult.jobId}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Upload Progress Card */}
                {uploads.length > 0 && (
                    <Card className="bg-white/5 border border-white/10 backdrop-blur-xl shadow-2xl shadow-indigo-500/5">
                        <CardContent className="space-y-4 p-6">
                            {/* Section header */}
                            <div className="flex items-center gap-3 pb-2">
                                <div className="rounded-lg bg-purple-500/10 p-2">
                                    <Upload className="h-5 w-5 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                    <h2 className="text-base font-semibold text-white">
                                        Upload Progress
                                    </h2>
                                    <p className="text-xs text-slate-400">
                                        {uploadDone
                                            ? "All uploads completed"
                                            : "Uploading to storage providers…"}
                                    </p>
                                </div>
                                {uploadDone && (
                                    <Chip
                                        size="sm"
                                        color="success"
                                        variant="secondary"
                                    >
                                        <CheckCircle2 className="h-3 w-3" />
                                        <Chip.Label>Done</Chip.Label>
                                    </Chip>
                                )}
                            </div>

                            {uploads.map((u, idx) => (
                                <div
                                    key={u.provider}
                                    className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Chip
                                                size="sm"
                                                variant="secondary"
                                                className="bg-indigo-500/10 text-indigo-300 capitalize"
                                            >
                                                {u.provider}
                                            </Chip>
                                            {u.status === "uploading" && (
                                                <Spinner size="sm" />
                                            )}
                                            {u.status === "success" && (
                                                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                            )}
                                            {u.status === "error" && (
                                                <XCircle className="h-4 w-4 text-red-400" />
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-mono text-slate-400">
                                                {u.progress}%
                                            </span>
                                            <Button
                                                id={`admin-copy-url-${idx}`}
                                                size="sm"
                                                variant="ghost"
                                                isIconOnly
                                                onPress={() => copyUrl(u.url)}
                                                className="text-slate-400 hover:text-white"
                                            >
                                                <Copy className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                    <ProgressBar
                                        aria-label={`${u.provider} upload progress`}
                                        className="w-full"
                                        maxValue={100}
                                        minValue={0}
                                        value={u.progress}
                                    >
                                        <ProgressBar.Track
                                            className={
                                                u.status === "error"
                                                    ? "bg-red-500/10"
                                                    : u.status === "success"
                                                        ? "bg-emerald-500/10"
                                                        : "bg-white/5"
                                            }
                                        >
                                            <ProgressBar.Fill
                                                className={
                                                    u.status === "error"
                                                        ? "bg-red-500"
                                                        : u.status === "success"
                                                            ? "bg-emerald-500"
                                                            : "bg-gradient-to-r from-indigo-500 to-purple-500"
                                                }
                                            />
                                        </ProgressBar.Track>
                                    </ProgressBar>
                                    {u.error && (
                                        <p className="text-xs text-red-400">
                                            Error: {u.error}
                                        </p>
                                    )}
                                    <p className="text-[10px] text-slate-600 font-mono break-all">
                                        {u.url.substring(0, 120)}…
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}
