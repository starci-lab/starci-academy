import { FolderIcon, FolderOpenIcon } from "@phosphor-icons/react"
import React, { useCallback } from "react"
import { cn } from "@heroui/react"
import { useDropzone } from "react-dropzone"
import { Skeleton } from "../../skeleton/Skeleton/Skeleton"

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * STORYBOOK-LOCAL DESIGN SPEC — full port of `@/components/blocks/form/Dropzone`.
 * Authored in Storybook (not `src`); synced to `src` later. Faithful port of the
 * whole prop API + every legacy state; no `@/components` import. Uses the real
 * `react-dropzone` dep the src uses.
 * ─────────────────────────────────────────────────────────────────────────────
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
    onChange: (file: File | null) => void
    /** Callback fired when dropzone loses focus. */
    onBlur?: () => void
    /** When true, renders a skeleton mirroring the dashed drop box instead. */
    isSkeleton?: boolean
    /** Extra classes on the outer wrapper. */
    className?: string
}

/**
 * Dropzone file input with drag and drop interaction.
 * @param {DropzoneProps} props Dropzone display and validation props.
 */
export const Dropzone = ({
    hint,
    file,
    errorMessage,
    acceptedMimeTypes,
    maxSizeInBytes,
    onChange,
    onBlur,
    isSkeleton = false,
    className,
}: DropzoneProps) => {
    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        onChange(acceptedFiles[0] ?? null)
    }, [onChange])

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
            <div className={cn("flex flex-col gap-2", className)}>
                <Skeleton className="h-[68px] w-full rounded-3xl" />
            </div>
        )
    }

    // NOTE: FieldShell not composed here (intentional): Dropzone is a drag-box,
    // not a labeled field — `hint` renders as PLACEHOLDER TEXT INSIDE the dashed
    // box (replaced by the file name once selected), not a description sitting
    // below a label the way FieldShell's `description` does. Forcing FieldShell
    // would only fit the error line and would split this shell's ownership of
    // the box for no real gain. Kept hand-rolled; errorMessage line already
    // matches FieldShell's error line styling (text-sm text-danger-soft-foreground).
    return (
        <div className={cn("flex flex-col gap-2", className)}>
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
