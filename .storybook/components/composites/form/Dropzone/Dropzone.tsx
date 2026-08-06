import { FolderIcon, FolderOpenIcon } from "@phosphor-icons/react"
import { useCallback } from "react"
import { cn } from "@heroui/react"
import { useDropzone } from "react-dropzone"
import { Typography } from "@sb-components/atoms/text/Typography/Typography"
import { StackV } from "@sb-components/frames/Stack/Stack"

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
     * When true, keeps the dashed drop box real and shimmers the hint/filename
     * via `Typography` (COMPOSITE-10). @default false
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

    return (
        <div data-tier="composite" data-component="Dropzone">
            <StackV
                gap={3}
                principle="sibling-stack"
                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                items={[
                    () => (
                        <div
                            {...(isSkeleton ? {} : getRootProps())}
                            className={cn(
                                "border-2 border-dashed rounded-3xl bg-surface p-2 transition-colors",
                                !isSkeleton && "cursor-pointer",
                                !isSkeleton && isDragActive ? "border-accent" : "",
                                !isSkeleton && errorMessage ? "border-danger" : "",
                            )}
                        >
                            {isSkeleton ? null : <input {...getInputProps({ onBlur })} />}
                            <StackV
                                gap={3}
                                principle="sibling-stack"
                                explain="Same-kind peer stack — not group-boundary, because these items are repeating siblings rather than section groups."
                                align="center"
                                classNames={["w-full"]}
                                items={[
                                    ...(isSkeleton
                                        ? []
                                        : [
                                            () =>
                                                isDragActive ? (
                                                    <FolderOpenIcon className="size-6 text-accent" />
                                                ) : (
                                                    <FolderIcon className="size-6 text-muted" />
                                                ),
                                        ]),
                                    () => (
                                        <Typography
                                            size="sm"
                                            isSkeleton={isSkeleton}
                                            text={isSkeleton ? undefined : (file?.name ?? hint)}
                                        />
                                    ),
                                ]}
                            />
                        </div>
                    ),
                    ...(!isSkeleton && errorMessage
                        ? [() => <div className="text-sm text-danger-soft-foreground">{errorMessage}</div>]
                        : []),
                ]}
            />
        </div>
    )
}

/** Source-level tier metadata. */
export const meta = { tier: "composite", name: "Dropzone" } as const
