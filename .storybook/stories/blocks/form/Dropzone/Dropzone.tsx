import { UploadSimpleIcon as CloudArrowUpIcon } from "@phosphor-icons/react"
import React, { useCallback } from "react"
import { cn } from "@heroui/react"
import { useDropzone } from "react-dropzone"

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

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div
                {...getRootProps()}
                className={cn(
                    "cursor-pointer rounded-large border border-dashed  bg-surface border-2 rounded-3xl p-2 transition-colors",
                    isDragActive ? "border-accent bg-accent-soft" : "",
                    errorMessage ? "border-danger" : "",
                )}
            >
                <input {...getInputProps({ onBlur })} />
                <div className="flex flex-col items-center gap-2 text-center">
                    <CloudArrowUpIcon className="size-6 text-muted" />
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
