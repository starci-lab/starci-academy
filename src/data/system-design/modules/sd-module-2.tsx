import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule2: Module = {
    id: "sd-module-2",
    name: "Microservices & Kubernetes Fundamentals",
    description: "Giới thiệu Microservices và Kubernetes ở mức nền tảng",
    video: "",
    duration: "~2 hours",
    order: 2,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này bao gồm:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Microservices là gì? So sánh với kiến trúc Monolith</li>
                    <li>Tại sao hệ thống lớn lại cần chia nhỏ thành nhiều service</li>
                    <li>Ưu và nhược điểm của kiến trúc Microservices</li>
                    <li>Kubernetes là gì và giải quyết vấn đề gì trong vận hành</li>
                    <li>Các khái niệm cơ bản trong k8s: Pod, Deployment, Service</li>
                    <li>Cách Microservices và Kubernetes phối hợp với nhau trong thực tế</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu rõ tư duy thiết kế hệ thống theo hướng chia nhỏ service</li>
                    <li>Biết khi nào nên dùng Microservices thay vì Monolith</li>
                    <li>Nắm được vai trò của Kubernetes trong việc quản lý và scale hệ thống</li>
                    <li>Có nền tảng để triển khai các hệ thống phân tán ở mức cơ bản</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn hiểu được cách các hệ thống hiện đại
                    được chia nhỏ và vận hành trong production, sẵn sàng bước vào các
                    bài thiết kế và triển khai thực tế ở các module tiếp theo.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
