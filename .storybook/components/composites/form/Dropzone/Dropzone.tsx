import { FolderIcon, FolderOpenIcon } from "@phosphor-icons/react"
import { useCallback } from "react"
import { cn, Skeleton as HeroSkeleton } from "@heroui/react"
import { useDropzone } from "react-dropzone"

/**
 * Props for {@link Dropzone}.
 */
export interface DropzoneProps {
    /** Helper text shown inside the drop box until a file is chosen. */
    hint: string
    /** Current selected file, or `null` when empty. */
    file: File | null
    /** Validation error text rendered below the box. Hidden when unset. */
    errorMessage?: string
    /** Accepted MIME types for the uploaded file. */
    acceptedMimeTypes: Array<string>
    /** Maximum file size in bytes. */
    maxSizeInBytes: number
    /** Fires when the selected file changes, including a clear back to `null`. */
    onValueChange: (file: File | null) => void
    /** Fires when the dropzone input loses focus or the file dialog is cancelled. */
    onBlur?: () => void
    /**
     * When true, renders a skeleton mirroring the dashed drop box instead of the
     * live control. @default false
     */
    isSkeleton?: boolean
}

/**
 * Dropzone — single-file drag-and-drop input. Owns MIME and size validation via
 * react-dropzone, drag-active chrome, the hint or file-name region, and an optional
 * error line. Presentational: the caller holds `file` and `onValueChange`.
 *
 * @param props - {@link DropzoneProps}
 */
export const Dropzone = ({
    hint,
    file,
    errorMessage,
    acceptedMimeTypes,
    maxSizeInBytes,
    onValueChange,
    onBlur,
    isSkeleton = false,
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
            <div data-tier="composite" data-component="Dropzone" className="flex flex-col gap-2">
                <HeroSkeleton className="h-[68px] w-full rounded-3xl" />
            </div>
        )
    }

    return (
        <div data-tier="composite" data-component="Dropzone" className="flex flex-col gap-2">
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

/** Source-level tier metadata. */
export const meta = { tier: "composite", name: "Dropzone" } as const
