import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule8: Module = {
    id: "sd-module-8",
    name: "System Security & Infrastructure Protection",
    description: "Bảo vệ hệ thống ở mức production: network, key management và access control",
    video: "",
    duration: "~2 hours",
    order: 8,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này bao gồm:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Security trong distributed system: vì sao production luôn phải assume “zero trust”</li>
                    <li>Key Management: API keys, JWT secrets, encryption keys</li>
                    <li>Secrets management: env vs K8s Secret vs Vault (ở mức khái niệm)</li>
                    <li>Firewall & Network isolation: chặn traffic không cần thiết</li>
                    <li>VPC & private network (hiểu cách cô lập service nội bộ)</li>
                    <li>Service-to-service authentication (mTLS ở mức tư duy)</li>
                    <li>Role-Based Access Control (RBAC) trong hệ thống</li>
                    <li>Nguyên tắc least privilege và separation of concerns</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu vì sao security phải thiết kế từ đầu, không phải vá sau</li>
                    <li>Biết cách quản lý secrets và keys an toàn hơn</li>
                    <li>Hiểu network isolation giúp giảm rủi ro ra sao</li>
                    <li>Có tư duy production-level security khi thiết kế hệ thống</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Kết thúc module này, bạn có nền tảng bảo vệ hệ thống ở mức infrastructure —
                    hiểu cách quản lý key, cô lập network và kiểm soát quyền truy cập để hệ
                    thống không chỉ “chạy được” mà còn “chạy an toàn” trong production.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
