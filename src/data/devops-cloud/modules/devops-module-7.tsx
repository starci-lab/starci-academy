import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule7: Module = {
    id: "devops-module-7",
    name: "GCP Quick Overview: Core Services & Architecture",
    description: "Giới thiệu nhanh hệ sinh thái GCP và các services quan trọng để bạn hiểu cách GCP map với AWS và dùng khi nào hợp lý.",
    video: "",
    duration: "~2 hours",
    order: 7,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn nắm GCP ở mức “đủ dùng để đi làm”: hiểu các dịch vụ cốt lõi,
                    cách tổ chức project/account, và đối chiếu nhanh với AWS để không bị bỡ ngỡ khi gặp hệ thống multi-cloud.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>GCP basics: Project, Billing, IAM, Service Accounts (overview)</li>
                    <li>Networking: VPC, subnets, firewall rules, Cloud NAT (map tương đương AWS)</li>
                    <li>Compute: Compute Engine, Instance templates, Managed Instance Groups (overview)</li>
                    <li>Storage: Cloud Storage buckets, IAM/policies, lifecycle (overview)</li>
                    <li>Database: Cloud SQL (overview) + khi nào dùng managed DB</li>
                    <li>Observability: Cloud Logging, Cloud Monitoring (overview)</li>
                    <li>So sánh nhanh AWS ↔ GCP: naming, mental model, dịch vụ tương đương</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu cách GCP tổ chức account/project và permission ở mức cơ bản</li>
                    <li>Nắm các dịch vụ GCP hay gặp và map được sang AWS tương đương</li>
                    <li>Không bị “ngợp” khi chuyển môi trường hoặc đọc infra trên GCP</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau module này, bạn có thể đọc hiểu hệ thống cơ bản trên GCP và đối chiếu nhanh với AWS,
                    đủ nền tảng để làm việc với các dự án multi-cloud hoặc migrate đơn giản.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
