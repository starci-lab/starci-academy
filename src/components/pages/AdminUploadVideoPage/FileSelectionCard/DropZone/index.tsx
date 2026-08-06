"use client"

import { UploadSimpleIcon as UploadIcon, VideoCameraIcon as VideoIcon } from "@phosphor-icons/react"
import React from "react"
import {
    Chip,
} from "@heroui/react"
import {
    formatSize,
} from "../../utils"
import type { WithClassNames } from "@/modules/types/base/class-name"
import { StackV } from "@/components/frames/Stack"
import { Box } from "@/components/frames/Box"

/** Props for {@link DropZone}. */
export interface DropZoneProps extends WithClassNames<undefined> {
    /** Currently selected file, or null when none is chosen. */
    file: File | null
    /** Ref to the hidden file input, used to open the native picker. */
    fileInputRef: React.RefObject<HTMLInputElement | null>
    /** Fired when the drop zone is clicked (opens the native file picker). */
    onClickZone: () => void
    /** Fired on dragover to allow dropping. */
    onDragOver: (event: React.DragEvent) => void
    /** Fired when a file is dropped onto the zone. */
    onDrop: (event: React.DragEvent) => void
    /** Fired when a file is chosen via the native picker. */
    onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * Click/drag-and-drop zone for selecting the video file to upload.
 *
 * Presentational: shows either the chosen file's metadata or an empty prompt,
 * and forwards user gestures via the on* callbacks. "use client" for the DOM
 * drag/drop + click handlers.
 * @param props - selected file, input ref, and gesture callbacks
 */
export const DropZone = ({
    file,
    fileInputRef,
    onClickZone,
    onDragOver,
    onDrop,
    onFileChange,
}: DropZoneProps) => {
    return (
        <div
            id="admin-video-dropzone"
            role="button"
            tabIndex={0}
            onClick={onClickZone}
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    onClickZone()
                }
            }}
            onDragOver={onDragOver}
            onDrop={onDrop}
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/10 bg-white/[0.02] p-8 transition-all hover:border-indigo-400/40 hover:bg-indigo-500/5" data-principle="ps-admin-2"
        >
            {file ? (
                <StackV gap={3} principle="sibling-stack" align="center" items={[
                    () => (
                        <Box principle="cell-pad" className="rounded-full bg-emerald-500/10 p-3">
                            <VideoIcon className="h-8 w-8 text-emerald-400" />
                        </Box>
                    ),
                    () => (
                        <p className="text-sm font-medium text-white">
                            {file.name}
                        </p>
                    ),
                    () => (
                        <Box principle="chip-row" className="flex items-center gap-2">
                            <Chip
                                size="sm"
                                variant="secondary"
                                className="bg-white/5 text-slate-300"
                            >
                                {file.type || "unknown"}
                            </Chip>
                            <span className="text-xs text-slate-400">
                                {formatSize(file.size)}
                            </span>
                        </Box>
                    ),
                    () => (
                        <p className="text-xs text-slate-500">
                            Click or drag to replace
                        </p>
                    ),
                ]} />
            ) : (
                <StackV gap={4} principle="card-caption" align="center" items={[
                    () => (
                        <Box principle="cell-pad" className="rounded-full bg-indigo-500/10 p-3">
                            <UploadIcon className="h-8 w-8 text-indigo-400" />
                        </Box>
                    ),
                    () => (
                        <div className="text-center">
                            <p className="text-sm font-medium text-white">
                                Click to select or drag & drop
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                                MP4, MOV, WebM, AVI — any size
                            </p>
                        </div>
                    ),
                ]} />
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={onFileChange}
                id="admin-video-file-input"
            />
        </div>
    )
}
