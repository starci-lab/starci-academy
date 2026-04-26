"use client"

import { useKeycloakZustand } from "@/hooks/zustand"
import {
    mutateGetCVPresignedUrl,
    mutateProcessCV,
} from "@/modules/api/graphql/mutations"
import { Button, Card, ProgressBar, Spinner } from "@heroui/react"
import { Form, Formik } from "formik"
import React, { useState } from "react"
import * as Yup from "yup"

interface CVSubmissionFormProps {
    onSuccess?: (jobId: string) => void
    onError?: (error: string) => void
}

const validationSchema = Yup.object().shape({
    cv: Yup.mixed()
        .required("CV file is required")
        .test("fileType", "Only PDF files are allowed", (value) => {
            if (!value) return false
            const file = value as File
            return file.type === "application/pdf"
        })
        .test("fileSize", "File size must be less than 10MB", (value) => {
            if (!value) return false
            const file = value as File
            return file.size <= 10 * 1024 * 1024
        }),
})

export const CVSubmissionForm: React.FC<CVSubmissionFormProps> = ({
    onSuccess,
    onError,
}) => {
    const keycloak = useKeycloakZustand()
    const [isUploading, setIsUploading] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadedFileName, setUploadedFileName] = useState<string | null>(null)
    const [uploadedS3Key, setUploadedS3Key] = useState<string | null>(null)

    const handleSubmit = async (
        values: { cv: File | null },
        { resetForm }: { resetForm: () => void }
    ) => {
        const token = keycloak.token
        if (!token) {
            onError?.("Authentication token not found")
            return
        }

        if (!values.cv) {
            onError?.("CV file is required")
            return
        }

        try {
            setIsUploading(true)
            setUploadProgress(0)
            setUploadedFileName(null)
            setUploadedS3Key(null)

            // Step 1: Get presigned URL from backend
            setUploadProgress(20)
            const presignedUrlResponse = await mutateGetCVPresignedUrl({
                variables: {
                    request: {
                        fileName: values.cv.name,
                        fileType: values.cv.type,
                    },
                },
                token,
            })

            if (!presignedUrlResponse.data?.getCVPresignedUrl?.data) {
                throw new Error(
                    presignedUrlResponse.data?.getCVPresignedUrl?.message ||
                        "Failed to get presigned URL"
                )
            }

            const { url: presignedUrl, key: s3Key } =
                presignedUrlResponse.data.getCVPresignedUrl.data

            // Step 2: Upload file to S3 using PUT
            setUploadProgress(40)
            const uploadResponse = await fetch(presignedUrl, {
                method: "PUT",
                body: values.cv,
                headers: {
                    "Content-Type": values.cv.type,
                },
            })

            if (!uploadResponse.ok) {
                throw new Error(
                    `Failed to upload file to S3: ${uploadResponse.statusText}`
                )
            }

            setUploadProgress(100)
            setUploadedFileName(values.cv.name)
            setUploadedS3Key(s3Key)
            resetForm()
        } catch (error) {
            console.error("CV upload error:", error)
            const errorMessage =
                error instanceof Error ? error.message : "An error occurred"
            onError?.(errorMessage)
        } finally {
            setIsUploading(false)
        }
    }

    const handleProcess = async () => {
        const token = keycloak.token
        if (!token) {
            onError?.("Authentication token not found")
            return
        }

        if (!uploadedS3Key || !uploadedFileName) {
            onError?.("Please upload CV first")
            return
        }

        try {
            setIsProcessing(true)
            const processResponse = await mutateProcessCV({
                variables: {
                    request: {
                        s3Key: uploadedS3Key,
                        fileName: uploadedFileName,
                    },
                },
                token,
            })

            if (!processResponse.data?.processCV?.data) {
                throw new Error(
                    processResponse.data?.processCV?.message ||
                        "Failed to process CV"
                )
            }

            const { jobId } = processResponse.data.processCV.data
            onSuccess?.(jobId)
        } catch (error) {
            console.error("CV process error:", error)
            const errorMessage =
                error instanceof Error ? error.message : "An error occurred"
            onError?.(errorMessage)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <Card className="p-6">
            <Formik
                initialValues={{ cv: null as File | null }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ errors, touched, setFieldValue, values, isSubmitting }) => (
                    <Form className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium">
                                Upload CV (PDF)
                            </label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                        const file = e.currentTarget.files?.[0]
                                        if (file) {
                                            setFieldValue("cv", file)
                                        }
                                    }}
                                    disabled={isUploading || isProcessing}
                                    className="hidden"
                                    id="cv-input"
                                />
                                <label
                                    htmlFor="cv-input"
                                    className="cursor-pointer block"
                                >
                                    <div className="text-gray-600">
                                        {values.cv ? (
                                            <div>
                                                <p className="font-semibold text-blue-600">
                                                    {(values.cv as File).name}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {(
                                                        (values.cv as File).size /
                                                        1024
                                                    ).toFixed(2)}{" "}
                                                    KB
                                                </p>
                                            </div>
                                        ) : (
                                            <div>
                                                <p>
                                                    Drag and drop your CV or
                                                    click to select
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    PDF files only, max 10MB
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                            {errors.cv && touched.cv && (
                                <p className="text-sm text-red-500">
                                    {errors.cv as string}
                                </p>
                            )}

                            {uploadedFileName && uploadedS3Key && (
                                <p className="text-sm text-emerald-600">
                                    Upload successful. Click Process CV to trigger backend processing.
                                </p>
                            )}
                        </div>

                        {isUploading && (
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        Uploading...
                                    </span>
                                    <span className="text-sm text-gray-500">
                                        {uploadProgress}%
                                    </span>
                                </div>
                                <ProgressBar
                                    className="w-full"
                                    maxValue={100}
                                    minValue={0}
                                    value={uploadProgress}
                                >
                                    <ProgressBar.Track>
                                        <ProgressBar.Fill />
                                    </ProgressBar.Track>
                                </ProgressBar>
                            </div>
                        )}

                        <Button
                            type="submit"
                            isDisabled={isUploading || isProcessing || isSubmitting}
                            className="w-full"
                            variant="primary"
                        >
                            {isUploading ? (
                                <>
                                    <Spinner size="sm" />
                                    Uploading to S3...
                                </>
                            ) : (
                                "Upload CV"
                            )}
                        </Button>

                        <Button
                            type="button"
                            isDisabled={
                                !uploadedFileName ||
                                !uploadedS3Key ||
                                isUploading ||
                                isProcessing
                            }
                            className="w-full"
                            variant="secondary"
                            onPress={handleProcess}
                        >
                            {isProcessing ? (
                                <>
                                    <Spinner size="sm" />
                                    Processing CV...
                                </>
                            ) : (
                                "Process CV"
                            )}
                        </Button>
                    </Form>
                )}
            </Formik>
        </Card>
    )
}
