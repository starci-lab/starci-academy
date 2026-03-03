import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule4: Module = {
    id: "sd-module-4",
    name: "Data & Consistency Patterns",
    description: "Các pattern dữ liệu và consistency khi hệ thống có nhiều services",
    video: "",
    duration: "~2 hours",
    order: 4,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này bao gồm:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Database per Service: mỗi service quản lý dữ liệu của mình</li>
                    <li>Consistency là gì? Strong vs Eventual (hiểu ở mức đơn giản)</li>
                    <li>Vì sao distributed transaction khó và không nên “join DB” giữa services</li>
                    <li>Saga Pattern: xử lý nhiều bước (đặt hàng → thanh toán → trừ kho)</li>
                    <li>CQRS: tách read và write để dễ scale và tối ưu</li>
                    <li>Cache Aside: tăng tốc đọc dữ liệu với cache</li>
                    <li>Idempotency: xử lý retry mà không bị double charge / double create</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu cách tổ chức dữ liệu khi có nhiều services</li>
                    <li>Biết vì sao hệ thống phân tán thường chấp nhận eventual consistency</li>
                    <li>Biết áp dụng Saga để tránh lỗi “lỗi giữa chừng” trong flow nhiều bước</li>
                    <li>Nắm được tư duy CQRS và cache để tối ưu hiệu năng ở mức cơ bản</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Kết thúc module này, bạn hiểu được cách các hệ thống microservices xử lý dữ liệu
                    và consistency trong thực tế, đủ nền tảng để tiếp tục sang phần scale/performance
                    và reliability ở các module tiếp theo.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
