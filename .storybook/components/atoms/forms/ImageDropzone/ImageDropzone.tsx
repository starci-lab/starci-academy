"use client"

import React from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { cn } from "@heroui/react"
import { ImageIcon } from "@phosphor-icons/react"
import { useDropzone } from "react-dropzone"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"

/**
 * STORYBOOK-LOCAL DESIGN SPEC — ported faithfully from
 * `@/components/blocks/identity/ImageDropzone`. Authored in Storybook (not
 * `src`); synced to `src` later.
 *
 * Sửa 2026-07-26 (dọn nhóm A/B/F):
 *   • A — bỏ `WithClassNames` local + `classNames` chết (kiểu `undefined`, không gán
 *     được gì); chỉ còn `className?: string` khai thẳng.
 *   • B — `icon` đổi từ `ReactNode` sang `IconComponent`: atom nhận COMPONENT rồi tự
 *     ép size (`size-8`, khớp `[&_svg]:size-8` cũ) + weight (§5.0a: từ `size-5` trở
 *     lên KHÔNG truyền `weight`, để glyph giữ nét `regular` mặc định).
 *   • F — `isDragActive` vốn chỉ sống trong state nội bộ của `useDropzone`, nên viền
 *     đặc + nền tint khi kéo file qua là một HÌNH THẬT không story nào ép được. Mở
 *     `isDragActive?: boolean` để GHIM: không truyền ⇒ atom tự quản như cũ (hành vi
 *     không đổi); truyền ⇒ đè state nội bộ, cùng lối `isPending` của `Button.Base`.
 */

/**
 * Icon truyền vào dạng COMPONENT (vd `CameraIcon`), atom tự render ở cỡ dropzone.
 *
 * Kiểu để MỞ (`SVGProps` + `weight` tuỳ chọn), KHÔNG khai `Icon` của Phosphor — khai
 * chặt theo một thư viện là khoá cả cây vào một nhà cung cấp (§5.0).
 */
export type IconWeight = "regular" | "bold"
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/** Max image size in bytes (5 MB — mirrors the BE avatar limit). */
const MAX_SIZE = 5 * 1024 * 1024

/** Accepted image MIME types. */
const ACCEPT = {
    "image/png": [],
    "image/jpeg": [],
    "image/webp": [],
    "image/gif": [],
}

/** Props for the {@link ImageDropzone} block. */
export interface ImageDropzoneProps {
    /** Called with the dropped / picked image file (type + size filtered). */
    onFile: (file: File) => void
    /** Primary CTA (e.g. "Kéo thả ảnh vào đây, hoặc bấm để chọn"). */
    label: ReactNode
    /** Format/size hint below the CTA (e.g. "PNG, JPG, WEBP, GIF · tối đa 5 MB"). */
    hint?: ReactNode
    /** Override the default {@link ImageIcon} — component reference, not JSX. */
    icon?: IconComponent
    /**
     * Ghim state kéo-thả từ NGOÀI (Storybook không ép được `useDropzone`
     * kéo file thật). Không truyền ⇒ atom tự lấy từ `useDropzone` như cũ; truyền ⇒
     * đè state nội bộ. Cùng lối `isPending` của `Button.Base`.
     */
    isDragActive?: boolean
    /**
     * When `true`, each composed part emits `data-anat-part="<name>"` so a
     * BlockAnatomy panel can badge it on-render. Off by default (production).
     */
    showAnatomy?: boolean
    className?: string
}

/**
 * Standard file dropzone (react-dropzone) for a single image: a dashed-border area
 * with a centered column — an icon, the CTA label, and a format hint. Accepts one
 * image (png/jpeg/webp/gif, ≤5 MB) by drop OR click; on drag-over the border turns
 * solid accent with a soft tint and the icon/label highlight (clear "drop here"
 * state). Pure/props-only — owns its look; the feature handles the file.
 *
 * @param props - {@link ImageDropzoneProps}
 */
const ImageDropzoneBase = ({
    onFile,
    label,
    hint,
    icon: Icon,
    isDragActive: isDragActiveProp,
    className,
    showAnatomy = false,
}: ImageDropzoneProps) => {
    const { getRootProps, getInputProps, isDragActive: isDragActiveInternal } = useDropzone({
        accept: ACCEPT,
        maxSize: MAX_SIZE,
        multiple: false,
        onDrop: (accepted) => {
            const next = accepted[0]
            if (next) {
                onFile(next)
            }
        },
    })
    // Ghim từ ngoài thắng state nội bộ (xem {@link ImageDropzoneProps.isDragActive}).
    const isDragActive = isDragActiveProp ?? isDragActiveInternal

    return (
        <div
            {...getRootProps()}
            className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-separator px-6 py-8 text-center transition-colors hover:border-accent",
                isDragActive && "border-solid border-accent bg-accent-soft",
                className,
            )}
        >
            <input {...getInputProps()} />
            <span
                aria-hidden
                data-anat-part={showAnatomy ? "Icon" : undefined}
                className={cn("text-muted [&_svg]:size-8", isDragActive && "text-accent-soft-foreground")}
            >
                {/* `size-8` >= `size-5` ⇒ KHÔNG truyền `weight` (§5.0a), glyph giữ nét `regular`. */}
                {Icon ? <Icon /> : <ImageIcon focusable="false" />}
            </span>
            {/* `anatPart` pinned explicitly — the REAL component rendered here is `Typography.Base`
                itself; left unset it would fall back to Typography.Base's own generic default
                name ("Text"), which describes a slot, not the component's real identity. */}
            <Typography.Base size="sm"
                text={label}
                weight="medium"
                align="center"
                className={cn(isDragActive && "text-accent-soft-foreground")}
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "Typography.Base" : undefined}
            />
            {hint ? (
                <Typography.Base
                    size="xs"
                    text={hint}
                    color="muted"
                    align="center"
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "Typography.Base" : undefined}
                />
            ) : null}
        </div>
    )
}

/** `ImageDropzone.*` — single-image dropzone namespace. */
export const ImageDropzone = Object.assign(ImageDropzoneBase, {
    Base: ImageDropzoneBase,
})
