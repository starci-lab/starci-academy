import type { ComponentType, SVGProps } from "react"
import { cn } from "@heroui/react"
import { ImageIcon } from "@phosphor-icons/react"
import { useDropzone } from "react-dropzone"
import { Typography } from "@/components/atoms/text/Typography"

/**
 * Icon stroke weight accepted by {@link IconComponent}. Kept generic so the
 * composite is not locked to one icon library.
 */
export type IconWeight = "regular" | "bold"

/**
 * Icon passed as a component reference (e.g. `CameraIcon`). The composite
 * renders it at the dropzone's own size.
 */
export type IconComponent = ComponentType<SVGProps<SVGSVGElement> & { weight?: IconWeight }>

/** Max image size in bytes (5 MB). */
const MAX_SIZE = 5 * 1024 * 1024

/** Accepted image MIME types. */
const ACCEPT = {
    "image/png": [],
    "image/jpeg": [],
    "image/webp": [],
    "image/gif": [],
}

/** Props for {@link ImageDropzone}. */
export interface ImageDropzoneProps {
    /** Called with the dropped or picked image file after type and size filters. */
    onFile: (file: File) => void
    /** Primary call to action (e.g. "Drag and drop an image, or click to browse"). */
    label: string
    /** Format or size hint below the CTA. Hidden when unset. */
    hint?: string
    /** Override the default {@link ImageIcon}. Pass a component reference, not JSX. */
    icon?: IconComponent
    /**
     * Pins the drag-active visual state from outside. Real drag-and-drop cannot
     * be triggered programmatically, so Storybook has no other way to show this
     * state. Unset, the composite tracks it internally via `useDropzone`; set, it
     * overrides the internal state.
     */
    isDragActive?: boolean
    /**
     * When true, keeps the dashed frame real and shimmers `label` / `hint` via
     * `Typography` (COMPOSITE-10). Icon is hidden while loading. @default false
     */
    isSkeleton?: boolean
}

/**
 * ImageDropzone — single-image drop target. Accepts png/jpeg/webp/gif up to 5 MB
 * by drop or click. Owns drag-active chrome and the icon / label / hint column.
 * Presentational: the caller handles the file.
 *
 * @param props - {@link ImageDropzoneProps}
 */
export const ImageDropzone = ({
    onFile,
    label,
    hint,
    icon: Icon,
    isDragActive: isDragActiveProp,
    isSkeleton = false,
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
    const isDragActive = isDragActiveProp ?? isDragActiveInternal

    return (
        <div
            {...(isSkeleton ? {} : getRootProps())}
            data-tier="composite"
            data-component="ImageDropzone"
            className={cn(
                "flex flex-col items-center gap-2 rounded-2xl border border-dashed border-separator px-6 py-8 text-center",
                !isSkeleton && "cursor-pointer transition-colors hover:border-accent",
                !isSkeleton && isDragActive && "border-solid border-accent bg-accent-soft",
            )}
        >
            {isSkeleton ? null : <input {...getInputProps()} />}
            {isSkeleton ? null : (
                <span
                    aria-hidden
                    className={cn("text-muted [&_svg]:size-8", isDragActive && "text-accent-soft-foreground")}
                >
                    {Icon ? <Icon /> : <ImageIcon focusable="false" />}
                </span>
            )}
            <Typography
                size="sm"
                weight="medium"
                align="center"
                color={!isSkeleton && isDragActive ? "accent-soft" : "default"}
                isSkeleton={isSkeleton}
                text={label}
            />
            {hint != null && hint !== "" ? (
                <Typography
                    size="xs"
                    align="center"
                    color="muted"
                    isSkeleton={isSkeleton}
                    text={hint}
                />
            ) : null}
        </div>
    )
}

/** Source-level tier metadata. */
export const meta = { tier: "composite", name: "ImageDropzone" } as const
