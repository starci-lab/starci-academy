import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule3: Module = {
    id: "devops-module-3",
    name: "AWS Kubernetes: EKS, Networking & Deployment with Terraform",
    description: "Triển khai Kubernetes trên AWS với EKS theo chuẩn production: dựng cluster + node group, cấu hình networking, add-ons cơ bản và deploy ứng dụng — tất cả bằng Terraform.",
    video: "",
    duration: "~2 hours",
    order: 3,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này đưa bạn từ “AWS core stack” (VPC/IAM/EC2) lên Kubernetes thật sự với EKS.
                    Bạn sẽ dựng EKS bằng Terraform, hiểu cách EKS ăn vào VPC/subnet/security group,
                    cài các thành phần cần thiết để deploy app và vận hành cơ bản.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>EKS overview: control plane vs worker nodes, managed node group vs self-managed</li>
                    <li>Dựng EKS bằng Terraform: cluster, node groups, scaling cơ bản</li>
                    <li>Networking cho EKS: subnet tagging, security group pattern, endpoint access (public/private)</li>
                    <li>IAM cho Kubernetes: roles cho node group, giới thiệu IRSA (IAM Roles for Service Accounts)</li>
                    <li>Cluster access: kubeconfig, aws-auth config map (hiểu đúng quyền và cách truy cập)</li>
                    <li>Add-ons tối thiểu: metrics-server, CoreDNS, VPC CNI (hiểu vai trò & cấu hình cơ bản)</li>
                    <li>Ingress fundamentals: chọn hướng ALB Ingress Controller hoặc Nginx Ingress (tùy use case)</li>
                    <li>Deploy ứng dụng demo: Deployment, Service, Ingress, rolling update</li>
                    <li>Autoscaling: HPA cơ bản + hiểu metrics nguồn vào</li>
                    <li>Observability cơ bản: CloudWatch Container Insights (overview) / logs để debug</li>
                    <li>Tách Terraform modules: vpc / iam / eks / addons (structure chuẩn để scale team)</li>
                </ul>
            </div>
            <div>
                <div>Sau module này, bạn sẽ:</div>
                    <Spacer y={2} />
                    <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                        <li>Tự dựng được EKS cluster + node group bằng Terraform theo chuẩn production tối thiểu</li>
                        <li>Hiểu EKS networking (subnets, security groups, endpoint access) để tránh lỗi “mù mạng”</li>
                        <li>Deploy được ứng dụng lên EKS: service exposure, ingress, rolling update</li>
                        <li>Biết setup autoscaling cơ bản và nắm luồng vận hành/debug bằng logs/metrics</li>
                        <li>Có nền tảng sẵn sàng để nối CI/CD (ArgoCD/GitOps) và triển khai dự án thật</li>
                    </ul>
                </div>
                <div>
                    <div>Cam kết:</div>
                        <Spacer y={2} />
                        <div className="text-foreground-500">
                            Sau khi hoàn tất module này, bạn có thể tự triển khai Kubernetes trên AWS (EKS) bằng Terraform,
                            cấu hình networking đúng chuẩn, cài add-ons cần thiết và deploy một ứng dụng end-to-end.
                            Đây là nền tảng để đi tiếp sang GitOps/CI-CD và vận hành production.
                        </div>
                        <Spacer y={2} />
                        <Link size="sm" color="primary" underline="always">
                            Đọc thêm
                        </Link>
                    </div>
                </div>
    ),
}
