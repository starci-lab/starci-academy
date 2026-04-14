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
