import { FolderIcon, FolderOpenIcon } from "@phosphor-icons/react"
import React, { useCallback } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { useDropzone } from "react-dropzone"
import type { AllowedClassName } from "@sb-components/atoms/_allowed-class-name"

/**
 * `Dropzone` — drag-and-drop single-file input built on `react-dropzone`.
 */

/**
 * Props for Dropzone component.
 */
export interface DropzoneProps {
    /** Helper text shown below dropzone area. */
    hint: string
    /** Current selected file. */
    file: File | null
    /** Validation error text to render below hint. */
    errorMessage?: string
    /** Accepted mime types for uploaded file. */
    acceptedMimeTypes: Array<string>
    /** Maximum file size in bytes. */
    maxSizeInBytes: number
    /** Callback fired when file changes. */
    onValueChange: (file: File | null) => void
    /** Callback fired when dropzone loses focus. */
    onBlur?: () => void
    /** When true, renders a skeleton mirroring the dashed drop box instead. */
    isSkeleton?: boolean
    /**
     * Extra classes on the outer wrapper.
     * @deprecated pass `classNames` instead — a free string cannot be constrained.
     */
    className?: string
    /**
     * Where this sits inside its parent. Appearance is not passable — it is already a prop.
     * Prefer this over `className`; the string form is going away.
     */
    classNames?: Array<AllowedClassName>
    /**
     * When true, the loading `Skeleton` emits a `data-anat-part` so the anatomy
     * panel can anchor its badge. The drag box and the error line stay unbadged —
     * they're plain hand-rolled `<div>`s, not a real component.
     */
    showAnatomy?: boolean
}

/**
 * Dropzone file input with drag and drop interaction.
 * @param {DropzoneProps} props Dropzone display and validation props.
 */
const DropzoneBase = ({
    hint,
    file,
    errorMessage,
    acceptedMimeTypes,
    maxSizeInBytes,
    onValueChange,
    onBlur,
    isSkeleton = false,
    className,
    classNames,
    showAnatomy = false,
}: DropzoneProps) => {
    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        onValueChange(acceptedFiles[0] ?? null)
    }, [onValueChange])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onFileDialogCancel: () => onBlur?.(),
        accept: acceptedMimeTypes.reduce<Record<string, Array<string>>>((result, type) => {
            result[type] = []
            return result
        }, {}),
        maxSize: maxSizeInBytes,
        multiple: false,
    })

    if (isSkeleton) {
        return (
            <div className={cn("flex flex-col gap-2", className, classNames)}>
                <HeroSkeleton
                    className="h-[68px] w-full rounded-3xl"
                    data-anat-part={showAnatomy ? "Skeleton" : undefined}
                />
            </div>
        )
    }

    // `hint` renders as placeholder text inside the dashed box, replaced by the
    // file name once one is selected. The error line's classes match FieldShell's
    // error line styling (text-sm text-danger-soft-foreground).
    return (
        <div className={cn("flex flex-col gap-2", className, classNames)}>
            <div
                {...getRootProps()}
                className={cn(
                    "cursor-pointer border-2 border-dashed rounded-3xl bg-surface p-2 transition-colors",
                    isDragActive ? "border-accent" : "",
                    errorMessage ? "border-danger" : "",
                )}
            >
                <input {...getInputProps({ onBlur })} />
                <div className="flex flex-col items-center gap-2 text-center">
                    {isDragActive ? (
                        <FolderOpenIcon className="size-6 text-accent" />
                    ) : (
                        <FolderIcon className="size-6 text-muted" />
                    )}
                    <div className="text-sm">
                        {file?.name ?? hint}
                    </div>
                </div>
            </div>
            {errorMessage ? (
                <div className="text-sm text-danger-soft-foreground">{errorMessage}</div>
            ) : null}
        </div>
    )
}

/**
 * `Dropzone` — drag-and-drop file namespace; the root itself is `DropzoneBase`,
 * callable directly as `<Dropzone .../>`.
 */
export { DropzoneBase as Dropzone }
