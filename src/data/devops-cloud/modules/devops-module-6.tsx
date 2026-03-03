import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule6: Module = {
    id: "devops-module-6",
    name: "AWS Production Services: KMS, Secrets, SQS, RDS & More",
    description: "Mở rộng hệ thống trên AWS với các services hay gặp trong production: mã hóa (KMS), quản lý secrets, messaging queue, database managed và các mảnh ghép vận hành thực tế khi chạy trên EKS.",
    video: "",
    duration: "~4.5 hours",
    order: 6,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn &quot;ghép các mảnh production&quot; trên AWS thay vì chỉ có compute + Kubernetes.
                    Bạn sẽ hiểu khi nào dùng từng service, cách tích hợp với EKS, và các best practices tối thiểu
                    để hệ thống an toàn, dễ vận hành và scale được.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li><strong>KMS (Key Management Service):</strong> encryption at rest, customer-managed keys (CMK), key policy cơ bản</li>
                    <li><strong>Secrets Manager / SSM Parameter Store:</strong> lưu secrets đúng chuẩn, rotation (overview), phân quyền truy cập</li>
                    <li><strong>S3 nâng cao:</strong> bucket policy, encryption, versioning, lifecycle, presigned URL</li>
                    <li><strong>SQS / SNS:</strong> queue vs pub/sub, retry & DLQ, khi nào nên tách async processing</li>
                    <li><strong>RDS / Aurora (overview):</strong> managed database, backups, multi-AZ, connection strategy</li>
                    <li><strong>ElastiCache Redis (overview):</strong> caching vs session vs rate-limit, persistence & failover concept</li>
                    <li><strong>CloudWatch nâng cao:</strong> log groups, metrics, alarms, basic dashboarding</li>
                    <li><strong>ALB/NLB basics:</strong> load balancer types, when to use, mapping với Ingress/EKS</li>
                    <li><strong>Security baseline:</strong> IAM least privilege, security groups pattern, audit mindset</li>
                    <li><strong>Integration patterns:</strong> EKS workload dùng IRSA để access S3/SQS/Secrets an toàn</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu &quot;bộ services AWS&quot; phổ biến cho production và cách chọn đúng theo use case</li>
                    <li>Biết dùng KMS/Secrets Manager để bảo vệ secrets &amp; dữ liệu đúng chuẩn</li>
                    <li>Thiết kế được luồng async bằng SQS/SNS (retry, DLQ) để hệ thống ổn định hơn</li>
                    <li>Biết cách tích hợp EKS với AWS services bằng IRSA theo least privilege</li>
                    <li>Nâng tư duy từ &quot;deploy chạy được&quot; sang &quot;deploy có security &amp; vận hành được&quot;</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể lựa chọn và tích hợp các AWS services quan trọng
                    (KMS, Secrets, SQS, RDS, S3, CloudWatch...) để xây dựng hệ thống production-ready,
                    an toàn và dễ mở rộng khi chạy trên Kubernetes (EKS).
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
