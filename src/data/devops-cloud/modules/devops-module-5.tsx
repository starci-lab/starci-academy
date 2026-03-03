import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule5: Module = {
    id: "devops-module-5",
    name: "CI Pipeline with Jenkins & Kaniko + GitOps Introduction (ArgoCD)",
    description: "Xây dựng CI pipeline chuẩn production với Jenkins + Kaniko để build Docker image trong Kubernetes, và giới thiệu GitOps workflow với ArgoCD để deploy lên EKS.",
    video: "",
    duration: "~4.5 hours",
    order: 5,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này tập trung vào CI thực chiến: build, test, push image một cách an toàn
                    trong Kubernetes bằng Jenkins + Kaniko (không dùng Docker daemon).
                    Phần CD sẽ giới thiệu GitOps với ArgoCD, tận dụng Terraform đã setup từ trước.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>CI mindset: build → test → package → publish artifact</li>
                    <li>Triển khai Jenkins trên Kubernetes (hoặc EC2) và cấu trúc Jenkinsfile</li>
                    <li>Declarative pipeline: stages, agents, environment variables</li>
                    <li>Kaniko là gì? Vì sao không dùng Docker-in-Docker?</li>
                    <li>Build Docker image bằng Kaniko trong Kubernetes</li>
                    <li>Tagging strategy: commit SHA, version, latest</li>
                    <li>Push image lên Amazon ECR (auth bằng IAM role / IRSA)</li>
                    <li>Quản lý secrets trong Jenkins (credentials binding)</li>
                    <li>Security mindset: không hardcode credentials</li>
                </ul>
            </div>
            <div>
                <div>
                    GitOps Introduction với ArgoCD:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>GitOps concept: Git là single source of truth</li>
                    <li>ArgoCD architecture overview</li>
                    <li>Tạo Application và sync từ Git repository</li>
                    <li>Manual sync vs auto-sync</li>
                    <li>Rollback bằng cách revert Git commit</li>
                    <li>Kết nối pipeline: Jenkins update image tag → ArgoCD sync</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Tự xây dựng được CI pipeline với Jenkins + Kaniko</li>
                    <li>Build và push image an toàn lên ECR không cần Docker daemon</li>
                    <li>Hiểu GitOps workflow và vai trò của ArgoCD trong CD</li>
                    <li>Kết nối hoàn chỉnh flow: Code → Image → Git → ArgoCD → Kubernetes</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể tự động hóa quy trình build và publish image
                    theo chuẩn production bằng Jenkins + Kaniko, và triển khai ứng dụng lên EKS theo GitOps workflow.
                    Đây là bước hoàn thiện vòng đời DevOps từ code đến production.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
