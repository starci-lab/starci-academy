import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule4: Module = {
    id: "devops-module-4",
    name: "Kubernetes RBAC & AWS IAM Deep Dive",
    description: "Hiểu và thiết kế hệ thống phân quyền chuẩn production cho Kubernetes trên AWS: RBAC trong cluster, IAM ngoài AWS và IRSA để kết nối bảo mật giữa hai thế giới.",
    video: "",
    duration: "~4.5 hours",
    order: 4,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn làm chủ security layer của hệ thống.
                    Sau khi đã deploy được EKS, bước tiếp theo là kiểm soát quyền truy cập đúng chuẩn:
                    ai được làm gì trong cluster, pod được phép truy cập tài nguyên AWS nào,
                    và làm sao để thiết kế least privilege thực sự.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li><strong>Kubernetes RBAC:</strong> Role vs ClusterRole</li>
                    <li>RoleBinding vs ClusterRoleBinding</li>
                    <li>Namespace isolation & thiết kế boundary giữa dev / staging / prod</li>
                    <li>ServiceAccount và cách Kubernetes gán identity cho workload</li>
                    <li>Principle of least privilege trong cluster</li>
                    <li>Multi-tenant cluster basics (cách tránh “dev chạm prod”)</li>
                    <li><strong>Thực hành:</strong> Dev chỉ được deploy trong namespace dev</li>
                    <li>Không được xem Secret namespace prod</li>
                    <li>CI chỉ được apply manifest, không được delete cluster resource</li>
                </ul>
            </div>
            <div>
                <div>
                    AWS IAM cho EKS:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>IAM Users vs IAM Roles (khi nào dùng cái nào)</li>
                    <li>aws-auth ConfigMap và cách map IAM ↔ Kubernetes RBAC</li>
                    <li>IAM Role cho node group (instance profile)</li>
                    <li>Thiết kế IAM Policy cơ bản (least privilege)</li>
                    <li>Phân tách quyền giữa admin, dev và CI trong AWS</li>
                </ul>
            </div>
            <div>
                <div>
                    IRSA (IAM Roles for Service Accounts) – phần quan trọng nhất:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Vì sao không nhét AWS credentials vào container?</li>
                    <li>Pod cần access S3 thì làm thế nào đúng chuẩn?</li>
                    <li>Map ServiceAccount ↔ IAM Role bằng OIDC provider</li>
                    <li>Thiết kế trust policy giữa EKS và AWS IAM</li>
                    <li>Security boundary giữa Kubernetes và AWS</li>
                    <li>Thực hành: tạo IAM Role cho workload truy cập S3 theo nguyên tắc least privilege</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Thiết kế được RBAC chuẩn production cho multi-namespace</li>
                    <li>Hiểu cách IAM và Kubernetes RBAC phối hợp trong EKS</li>
                    <li>Triển khai IRSA đúng chuẩn để workload truy cập tài nguyên AWS an toàn</li>
                    <li>Tránh các lỗi bảo mật phổ biến khi triển khai EKS</li>
                    <li>Nâng cấp tư duy từ “deploy được” lên “deploy an toàn & kiểm soát được”</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể thiết kế và triển khai hệ thống phân quyền
                    Kubernetes + AWS IAM đúng chuẩn production, áp dụng least privilege cho cả cluster
                    và workload. Đây là bước chuyển từ DevOps triển khai sang DevOps hiểu security thực sự.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
