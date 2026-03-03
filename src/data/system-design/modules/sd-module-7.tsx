import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule7: Module = {
    id: "sd-module-7",
    name: "Monitoring & Observability",
    description: "Theo dõi hệ thống để phát hiện lỗi sớm và debug nhanh trong production",
    video: "",
    duration: "~2 hours",
    order: 7,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này bao gồm:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Monitoring vs Observability: khác nhau ở mức ý tưởng</li>
                    <li>3 trụ cột: Logs, Metrics, Traces (hiểu đơn giản và dễ áp dụng)</li>
                    <li>Các metrics quan trọng: latency, throughput, error rate</li>
                    <li>Golden Signals (SRE): 4 tín hiệu để biết hệ thống “đang ổn hay không”</li>
                    <li>Centralized logging: gom log về một chỗ để dễ tìm và debug</li>
                    <li>Distributed tracing: theo dõi một request đi qua nhiều services</li>
                    <li>Health check & alerting: báo động khi có vấn đề trước khi user than</li>
                    <li>Dashboard cơ bản: nhìn là biết service nào đang “đỏ”</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Biết theo dõi hệ thống bằng logs/metrics ở mức cơ bản</li>
                    <li>Biết chọn metrics quan trọng để đo “sức khỏe” của service</li>
                    <li>Hiểu tracing giúp debug hệ microservices nhanh hơn như thế nào</li>
                    <li>Biết cách thiết kế alerting để phát hiện lỗi sớm</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Kết thúc module này, bạn có thể tự xây một “bộ quan sát” cơ bản cho hệ thống:
                    biết đo, biết theo dõi, biết cảnh báo và biết debug — đủ để vận hành các hệ
                    microservices một cách tự tin hơn trong production.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
