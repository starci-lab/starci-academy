import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule1: Module = {
    id: "devops-module-1",
    name: "Terraform Fundamentals & Infrastructure as Code",
    description: "Làm quen với Terraform, hiểu Infrastructure as Code (IaC), viết Terraform configuration để quản lý infrastructure một cách tự động và có thể tái sử dụng.",
    video: "",
    duration: "~3 hours",
    order: 1,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn làm chủ Terraform để quản lý infrastructure như code,
                    thay vì tạo tài nguyên thủ công trên cloud console.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu Infrastructure as Code (IaC) và lợi ích của việc quản lý infrastructure bằng code</li>
                    <li>Cài đặt và cấu hình Terraform, hiểu cấu trúc file .tf</li>
                    <li>Viết Terraform configuration: providers, resources, variables, outputs</li>
                    <li>Sử dụng Terraform state để quản lý trạng thái infrastructure</li>
                    <li>Áp dụng best practices: modules, workspaces, remote state</li>
                    <li>Xử lý dependencies và lifecycle management trong Terraform</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Biết cách viết Terraform configuration để tạo và quản lý infrastructure</li>
                    <li>Hiểu cách tổ chức Terraform code theo module để tái sử dụng</li>
                    <li>Tự tin quản lý infrastructure bằng code thay vì click trên console</li>
                    <li>Sẵn sàng áp dụng Terraform cho các cloud provider khác nhau</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể viết Terraform configuration
                    để quản lý infrastructure một cách tự động và có tổ chức, sẵn sàng
                    triển khai trên các cloud provider.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
