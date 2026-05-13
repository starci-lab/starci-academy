import { useFormik } from "formik"
import * as Yup from "yup"
import { sleep } from "@/modules/utils"
import axios from "axios"
import { runGraphQLWithToast } from "@/modules/toast"
import {
    useMutateGenerateSubmitCvPresignUrlSwr,
    useMutateVerifySubmitCvPresignUrlSwr,
} from "@/hooks"

/**
 * Form values for CV apply form in learn/cv page.
 */
export interface CvApplyFormikValues {
    cvFile: File | null
}

/**
 * Singleton Formik core for CV apply flow.
 */
export const useCvApplyFormikCore = () => {
    const { trigger: triggerGenerateSubmitCvPresignUrl } = useMutateGenerateSubmitCvPresignUrlSwr()
    const { trigger: triggerVerifySubmitCvPresignUrl } = useMutateVerifySubmitCvPresignUrlSwr()
    return useFormik<CvApplyFormikValues>({
        initialValues: {
            cvFile: null,
        },
        validationSchema: Yup.object({
            cvFile: Yup.mixed<File>()
                .required("cv.form.errors.fileRequired")
                .test("fileType", "cv.form.errors.fileTypeInvalid", (value) => {
                    if (!value) return false
                    return value.type === "application/pdf"
                })
                .test("fileSize", "cv.form.errors.fileSizeInvalid", (value) => {
                    if (!value) return false
                    return value.size <= 10 * 1024 * 1024
                }),
        }),
        onSubmit: async (values) => {
            if (!values.cvFile) {
                throw new Error("CV file is required")
            }
            await runGraphQLWithToast(
                async () => {
                    if (!values.cvFile) {
                        throw new Error("CV file is required")
                    }
                    const generateResponse = await triggerGenerateSubmitCvPresignUrl({
                        request: {
                            fileName: values.cvFile.name,
                        },
                    })
                    const generatePayload = generateResponse.data?.generateSubmitCvPresignUrl?.data
                    if (!generatePayload?.url) {
                        throw new Error("Failed to get pre-signed URL")
                    }
                    const contentType = values.cvFile.type || "application/pdf"
                    const uploadResponse = await axios.put(
                        generatePayload.url,
                        values.cvFile,
                        {
                            headers: {
                                "Content-Type": contentType,
                            },
                        },
                    )
                    if (uploadResponse.status !== 200) {
                        throw new Error(`Upload failed with status ${uploadResponse.status}`)
                    }
                    // Wait 1 second for MinIO to propagate before verification
                    await sleep(1000)         
                    const verifyResponse = await triggerVerifySubmitCvPresignUrl({
                        request: {
                            cvSubmissionId: generatePayload.cvSubmissionId,
                        },
                        signal: new AbortController().signal,
                    })
                    if (!verifyResponse.data?.verifySubmitCvPresignUrl) {
                        throw new Error("CV file was not found in storage. Please try again.")
                    } 
                    return verifyResponse.data.verifySubmitCvPresignUrl
                }, {
                    showErrorToast: true,
                    showSuccessToast: true
                }
            )
        }     
    }
    )
}
