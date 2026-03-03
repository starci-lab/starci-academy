import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const sdModule6: Module = {
    id: "sd-module-6",
    name: "Reliability & Resilience Patterns",
    description: "Các pattern giúp hệ thống chịu lỗi tốt và không sập dây chuyền.",
    video: "",
    duration: "~2 hours",
    order: 6,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>Module này bao gồm:</div>
                    <Spacer y={2} />
                    <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                        <li>Failure là bình thường trong distributed system</li>
                        <li>Timeout: tránh “đợi vô hạn” làm nghẽn hệ thống</li>
                        <li>Retry + backoff: retry đúng cách để không làm tình hình tệ hơn</li>
                        <li>Circuit Breaker: ngăn lỗi lan dây chuyền</li>
                        <li>Bulkhead: cô lập tài nguyên để tránh sập toàn hệ</li>
                        <li>Health checks: liveness/readiness để tự hồi phục</li>
                        <li>Graceful degradation: giảm tính năng nhưng vẫn sống</li>
                    </ul>
                </div>
                <div>
                    <div>Sau module này, bạn sẽ:</div>
                        <Spacer y={2} />
                        <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                            <li>Biết thiết kế hệ thống “chịu lỗi” thay vì chỉ “chạy được”</li>
                            <li>Biết dùng timeout/retry/circuit breaker đúng tình huống</li>
                            <li>Hiểu cách tránh lỗi cascade làm sập hệ thống</li>
                            <li>Biết các nguyên tắc vận hành để hệ thống ổn định hơn</li>
                        </ul>
                    </div>
                    <div>
                        <div>Cam kết:</div>
                            <Spacer y={2} />
                            <div className="text-foreground-500">
                                Kết thúc module, bạn có tư duy và toolkit cơ bản để thiết kế hệ thống ổn định,
                                chịu lỗi tốt trong môi trường production.
                            </div>
                            <Spacer y={2} />
                            <Link size="sm" color="primary" underline="always">
                                Đọc thêm
                            </Link>
                        </div>
                    </div>
    ),
}
