/**
 * CV Upload Related Types
 */

export interface CVPresignedUrlRequest {
  fileName: string;
  fileType: string;
}

export interface CVPresignedUrlResponse {
  url: string;
  key: string;
}

export interface ProcessCVRequest {
  s3Key: string;
  fileName: string;
}

export interface ProcessCVResponse {
  jobId: string;
  status: string;
}

/** Mirrors `CvUrlViewData` from the `cvUrl` GraphQL query. */
export interface CvUrlPayload {
  id: string
  status: string
  cvUrl: string
  cvUrlExpiresInSeconds: number
    /** Full AI review (markdown) on latest attempt after analyze. */
    detailFeedback?: string | null
    /** Holistic score 0–100 on latest attempt when analyze returned `score`. */
    score?: number | null
    /** ISO timestamp from API (latest attempt or submission created time). */
  submittedAt?: string | null
}

export interface CVUploadJob {
  jobId: string;
  status: "processing" | "completed" | "failed" | "pending";
  fileName: string;
  s3Key: string;
  uploadedAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface CVData {
  jobId: string;
  fullName?: string;
  email?: string;
  phone?: string;
  summary?: string;
  experience?: CVExperience[];
  education?: CVEducation[];
  skills?: string[];
  certifications?: CVCertification[];
}

export interface CVExperience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description?: string;
  isCurrently?: boolean;
}

export interface CVEducation {
  institution: string;
  degree: string;
  field: string;
  graduationDate?: string;
  gpa?: number;
}

export interface CVCertification {
  name: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
}
