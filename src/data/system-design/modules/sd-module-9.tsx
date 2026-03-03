import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule9: Module = {
    id: "sd-module-9",
    name: "System Design Case Study",
    description: "Áp dụng toàn bộ kiến thức để thiết kế một hệ thống production hoàn chỉnh",
    video: "",
    duration: "~3 hours",
    order: 9,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này bao gồm:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Phân tích requirements: functional vs non-functional</li>
                    <li>Thiết kế high-level architecture (microservices + gateway)</li>
                    <li>Thiết kế communication flow (sync vs async)</li>
                    <li>Thiết kế database & consistency strategy</li>
                    <li>Áp dụng caching, read replica, scaling strategy</li>
                    <li>Xử lý failure: retry, circuit breaker, graceful degradation</li>
                    <li>Monitoring & alerting cho production</li>
                    <li>Security: auth, key management, network isolation</li>
                </ul>
            </div>
            <div>
                <div>
                    Case study thực hành:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Design E-commerce System</li>
                    <li>Design Chat Application</li>
                    <li>Design Payment System</li>
                    <li>Design Real-time Notification System</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Biết cách bắt đầu một bài System Design từ con số 0</li>
                    <li>Biết trình bày kiến trúc logic và có cấu trúc</li>
                    <li>Biết chọn trade-off phù hợp với requirement</li>
                    <li>Có template tư duy để tự luyện các bài design khác</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Kết thúc module này, bạn có khả năng thiết kế và giải thích một hệ thống
                    production hoàn chỉnh, từ architecture đến scale, reliability,
                    monitoring và security — đủ nền tảng cho project thực tế hoặc interview.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
