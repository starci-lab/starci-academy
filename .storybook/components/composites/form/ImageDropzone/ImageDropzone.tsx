import type { ComponentType, ReactNode, SVGProps } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { ImageIcon } from "@phosphor-icons/react"
import { useDropzone } from "react-dropzone"

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
    label: ReactNode
    /** Format or size hint below the CTA. Hidden when unset. */
    hint?: ReactNode
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
     * When true, renders the skeleton mirror instead of the live drop target:
     * same dashed frame, radius, and padding. The icon slot becomes a circular
     * shimmer, `label` a text bar, and `hint` a second bar only when `hint` was
     * passed. @default false
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

    if (isSkeleton) {
        return (
            <div
                data-tier="composite"
                data-component="ImageDropzone"
                className="flex flex-col items-center gap-2 rounded-2xl border border-dashed border-separator px-6 py-8 text-center"
            >
                <HeroSkeleton className="size-8 rounded-full" />
                <HeroSkeleton className="inline-block h-[14px] w-1/2 rounded" />
                {hint ? (
                    <HeroSkeleton className="inline-block h-3 w-1/3 rounded" />
                ) : null}
            </div>
        )
    }

    return (
        <div
            {...getRootProps()}
            data-tier="composite"
            data-component="ImageDropzone"
            className={cn(
                "flex cursor-pointer flex-col items-center gap-2 rounded-2xl border border-dashed border-separator px-6 py-8 text-center transition-colors hover:border-accent",
                isDragActive && "border-solid border-accent bg-accent-soft",
            )}
        >
            <input {...getInputProps()} />
            <span
                aria-hidden
                className={cn("text-muted [&_svg]:size-8", isDragActive && "text-accent-soft-foreground")}
            >
                {Icon ? <Icon /> : <ImageIcon focusable="false" />}
            </span>
            <span
                className={cn(
                    "text-sm font-medium text-center",
                    isDragActive ? "text-accent-soft-foreground" : "text-foreground",
                )}
            >
                {label}
            </span>
            {hint ? (
                <span className="text-xs font-normal text-muted text-center">
                    {hint}
                </span>
            ) : null}
        </div>
    )
}

/** Source-level tier metadata. */
export const meta = { tier: "composite", name: "ImageDropzone" } as const
