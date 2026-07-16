"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import type { CvSubmissionFormValues } from "@/types"

/** Max CV upload size in bytes (10MB), mirrored in the drop-zone hint copy. */
export const MAX_CV_FILE_SIZE_BYTES = 10 * 1024 * 1024

const schema = z.object({
    cv: z
        .instanceof(File)
        .nullable()
        .refine((file) => file !== null, "CV file is required")
        .refine((file) => file?.type === "application/pdf", "Only PDF files are allowed")
        .refine((file) => (file?.size ?? 0) <= MAX_CV_FILE_SIZE_BYTES, "File size must be less than 10MB"),
})

/** Parameters for {@link useCvSubmissionForm}. */
export interface UseCvSubmissionFormParams {
    /** Fired with the selected CV file; the parent container owns the async upload logic. */
    onSubmit: (values: CvSubmissionFormValues) => void | Promise<void>
}

/**
 * react-hook-form for the CV submission's single `cv` file field. Validates the
 * file is present, is a PDF, and is under the 10MB cap. The actual S3 upload stays
 * entirely with the `onSubmit` callback supplied by the container (`CvSubmission`);
 * this hook only owns field state + validation + wrapping `handleSubmit`.
 *
 * @param params - {@link UseCvSubmissionFormParams}
 * @returns the RHF methods + `onSubmit`.
 */
export const useCvSubmissionForm = ({ onSubmit }: UseCvSubmissionFormParams) => {
    const form = useForm<CvSubmissionFormValues>({
        resolver: zodResolver(schema),
        defaultValues: { cv: null },
    })

    const handleSubmit = form.handleSubmit(async (value) => {
        await onSubmit(value)
    })

    return {
        ...form,
        onSubmit: handleSubmit,
    }
}
