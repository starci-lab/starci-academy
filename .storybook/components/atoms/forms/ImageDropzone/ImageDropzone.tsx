"use client"

import React from "react"
import type { ComponentType, ReactNode, SVGProps } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { ImageIcon } from "@phosphor-icons/react"
import { useDropzone } from "react-dropzone"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `ImageDropzone` — single-image drop target (react-dropzone): dashed-border
 * box with an icon, CTA label, and format hint.
 */

/**
 * Icon passed as a component reference (e.g. `CameraIcon`); the atom renders it
 * at the dropzone's own size.
 *
 * The type stays generic (`SVGProps` + optional `weight`) rather than importing
 * Phosphor's `Icon` type, so this atom isn't locked to one icon library.
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
    /** Primary CTA (e.g. "Drag and drop an image, or click to browse"). */
    label: ReactNode
    /** Format/size hint below the CTA (e.g. "PNG, JPG, WEBP, GIF · max 5 MB"). */
    hint?: ReactNode
    /** Override the default {@link ImageIcon} — component reference, not JSX. */
    icon?: IconComponent
    /**
     * Pins the drag-active visual state from outside — real drag-and-drop can't
     * be triggered programmatically, so Storybook has no other way to show this
     * state. Unset, the atom tracks it internally via `useDropzone`; set, it
     * overrides the internal state (same pattern as `Button`'s `isPending`).
     */
    isDragActive?: boolean
    /**
     * `true` renders the skeleton mirror instead of the live drop target: same
     * dashed frame, radius, and padding as the live box. The icon slot becomes a
     * circular dot, `label` a text bar, and `hint` a second bar only when a
     * `hint` was passed — gated on the same prop the live branch below gates its
     * line on.
     */
    isSkeleton?: boolean
    /**
     * When `true`, each composed part emits `data-anat-part="<name>"` so a
     * BlockAnatomy panel can badge it on-render. Off by default (production).
     */
    showAnatomy?: boolean
    /** @deprecated pass `classNames` instead — a free string cannot be constrained. */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
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
    isSkeleton = false,
    className,
    classNames,
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
    // The external pin wins over internal state (see {@link ImageDropzoneProps.isDragActive}).
    const isDragActive = isDragActiveProp ?? isDragActiveInternal

    if (isSkeleton) {
        // Same frame as the live box below (border-dashed + rounded-2xl + px-6 py-8 +
        // flex-col items-center gap-2) minus the interactive bits — nothing here is
        // clickable. Icon becomes a circular dot at the icon's own size-8 footprint;
        // `label`/`hint` delegate to `Typography isSkeleton` so this box is never
        // taller or shorter than the live one that follows it.
        return (
            <div
                className={cn(
                    "flex flex-col items-center gap-2 rounded-2xl border border-dashed border-separator px-6 py-8 text-center",
                    className,
                    classNames,
                )}
            >
                <HeroSkeleton
                    className="size-8 rounded-full"
                    data-anat-part={showAnatomy ? "Skeleton" : undefined}
                />
                <Typography size="sm" isSkeleton classNames={["w-1/2"]} anatPart={showAnatomy ? "Typography" : undefined} />
                {hint ? (
                    <Typography size="xs" isSkeleton classNames={["w-1/3"]} anatPart={showAnatomy ? "Typography" : undefined} />
                ) : null}
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-separator px-6 py-8 text-center transition-colors hover:border-accent",
                isDragActive && "border-solid border-accent bg-accent-soft",
                className,
                classNames,
            )}
        >
            <input {...getInputProps()} />
            <span
                aria-hidden
                className={cn("text-muted [&_svg]:size-8", isDragActive && "text-accent-soft-foreground")}
            >
                {/* size-8 is above the size-5 threshold, so no `weight` is passed — the glyph stays regular. */}
                {Icon ? <Icon /> : <ImageIcon focusable="false" />}
            </span>
            {/* `anatPart` pinned explicitly — the REAL component rendered here is `Typography`
                itself; left unset it would fall back to Typography's own generic default
                name ("Text"), which describes a slot, not the component's real identity. */}
            <Typography size="sm"
                text={label}
                weight="medium"
                align="center"
                color={isDragActive ? "accent-soft" : "default"}
                showAnatomy={showAnatomy}
                anatPart={showAnatomy ? "Typography" : undefined}
            />
            {hint ? (
                <Typography
                    size="xs"
                    text={hint}
                    color="muted"
                    align="center"
                    showAnatomy={showAnatomy}
                    anatPart={showAnatomy ? "Typography" : undefined}
                />
            ) : null}
        </div>
    )
}

/** `ImageDropzone.*` — single-image dropzone namespace. */
export { ImageDropzoneBase as ImageDropzone }
