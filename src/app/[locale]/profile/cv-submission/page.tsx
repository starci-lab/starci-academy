"use client"

import React, { useState } from "react"
import { Card, Alert, Button } from "@heroui/react"
import { CVSubmissionForm } from "@/components/reuseable"
import Link from "next/link"

const CVSubmissionPage = () => {
    // const t = useTranslations()
    const [successMessage, setSuccessMessage] = useState<string | null>(null)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [jobId, setJobId] = useState<string | null>(null)

    const handleSuccess = (jobId: string) => {
        setJobId(jobId)
        setSuccessMessage(
            `CV submitted successfully! Processing job ID: ${jobId}`
        )
        setErrorMessage(null)
    }

    const handleError = (error: string) => {
        setErrorMessage(`Failed to submit CV: ${error}`)
        setSuccessMessage(null)
        setJobId(null)
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">
                        Submit Your CV
                    </h1>
                    <p className="text-gray-600">
                        Upload your CV for AI-powered analysis and processing.
                        Our system will extract key information and provide
                        insights.
                    </p>
                </div>

                {successMessage && (
                    <Alert className="mb-6" status="success">
                        <Alert.Indicator />
                        <Alert.Content className="flex w-full flex-row items-start justify-between gap-2">
                            <Alert.Description>{successMessage}</Alert.Description>
                            <Button
                                aria-label="Dismiss"
                                size="sm"
                                variant="ghost"
                                onPress={() => setSuccessMessage(null)}
                            >
                                ×
                            </Button>
                        </Alert.Content>
                    </Alert>
                )}

                {errorMessage && (
                    <Alert className="mb-6" status="danger">
                        <Alert.Indicator />
                        <Alert.Content className="flex w-full flex-row items-start justify-between gap-2">
                            <Alert.Description>{errorMessage}</Alert.Description>
                            <Button
                                aria-label="Dismiss"
                                size="sm"
                                variant="ghost"
                                onPress={() => setErrorMessage(null)}
                            >
                                ×
                            </Button>
                        </Alert.Content>
                    </Alert>
                )}

                <div className="space-y-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h3 className="font-semibold text-blue-900 mb-2">
                            Requirements
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• File format: PDF only</li>
                            <li>• Maximum file size: 10MB</li>
                            <li>
                                • Your CV will be processed and analyzed for key
                                information
                            </li>
                            <li>• Processing usually takes 1-2 minutes</li>
                        </ul>
                    </div>

                    <CVSubmissionForm
                        onSuccess={handleSuccess}
                        onError={handleError}
                    />

                    {jobId && (
                        <Card className="p-6 bg-gray-50">
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-semibold mb-2">
                                        Processing Details
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Your CV is being processed. You can
                                        track the status using the job ID below:
                                    </p>
                                    <div className="bg-white p-3 rounded border border-gray-200 font-mono text-sm break-all">
                                        {jobId}
                                    </div>
                                </div>
                                <Link href="/profile/cv-status">
                                    <Button
                                        className="w-full"
                                        variant="secondary"
                                    >
                                        View Processing Status
                                    </Button>
                                </Link>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default CVSubmissionPage
