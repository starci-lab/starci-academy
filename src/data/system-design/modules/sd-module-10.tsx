import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule10: Module = {
    id: "sd-module-10",
    name: "Advanced Topics",
    description: "Các chủ đề nâng cao thường gặp khi build hệ thống production",
    video: "",
    duration: "~3 hours",
    order: 10,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này bao gồm:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>SSO (Single Sign-On): đăng nhập 1 lần cho nhiều hệ thống/app</li>
                    <li>OAuth/OIDC (khái niệm): nền tảng phổ biến để triển khai SSO</li>
                    <li>Time-series DB là gì? Khi nào nên dùng (metrics, price, logs…)</li>
                    <li>So sánh nhanh TSDB vs relational DB trong use case thực tế</li>
                    <li>Service Discovery là gì? Tại sao microservices cần nó</li>
                    <li>Service Discovery trong k8s: Service name, DNS, load balancing nội bộ</li>
                    <li>Trade-offs & pitfalls phổ biến khi áp dụng các chủ đề nâng cao</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu SSO hoạt động ra sao và dùng khi nào</li>
                    <li>Biết nhận diện bài toán phù hợp cho time-series database</li>
                    <li>Hiểu service discovery giúp các service “tìm nhau” trong production</li>
                    <li>Biết các trade-offs cơ bản để chọn giải pháp phù hợp</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Kết thúc module này, bạn có thêm bộ “vũ khí nâng cao” để đọc kiến trúc production
                    dễ hơn và tự tin hơn khi gặp các bài toán hệ thống thực tế vượt khỏi mức cơ bản.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
