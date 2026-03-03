import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule8: Module = {
    id: "devops-module-8",
    name: "GKE Quick Start: Kubernetes on GCP (Compare with EKS)",
    description: "Giới thiệu nhanh Kubernetes trên GCP với GKE: cách tạo cluster, networking cơ bản và cách GKE khác EKS để bạn nắm được “điểm rơi” khi làm thực tế.",
    video: "",
    duration: "~2 hours",
    order: 8,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này là “tour nhanh” về GKE để bạn hiểu Kubernetes managed trên GCP vận hành thế nào,
                    và so sánh trực tiếp với EKS: IAM/RBAC, networking, ingress/load balancer, và cách debug cơ bản.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>GKE overview: control plane, node pools, autopilot vs standard (overview)</li>
                    <li>Tạo cluster nhanh, cấu hình node pool và autoscaling cơ bản</li>
                    <li>Networking: VPC-native cluster, services exposure, firewall/LB concept</li>
                    <li>Ingress trên GKE (overview): load balancer integration</li>
                    <li>Identity & access (overview): IAM, service accounts, workload identity (so sánh với IRSA)</li>
                    <li>Observability: Cloud Logging/Monitoring cho GKE (overview)</li>
                    <li>So sánh thực chiến: EKS vs GKE (khi nào chọn cái nào)</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu cách GKE hoạt động và những khác biệt chính so với EKS</li>
                    <li>Nắm được các khái niệm cần thiết để deploy/operate Kubernetes trên GCP</li>
                    <li>Biết cách map workload identity trên GCP với IRSA trên AWS ở mức concept</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể đọc hiểu và triển khai Kubernetes cơ bản trên GKE,
                    đồng thời so sánh được EKS vs GKE để chọn nền tảng phù hợp cho từng bài toán.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
