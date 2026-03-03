import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule9: Module = {
    id: "devops-module-9",
    name: "DigitalOcean Quick Overview: Deploy & Operate for Small Teams",
    description: "Giới thiệu nhanh DigitalOcean: lựa chọn tối ưu cho team nhỏ/startup cần triển khai nhanh với chi phí dễ kiểm soát.",
    video: "",
    duration: "~1.5 hours",
    order: 9,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn hiểu DigitalOcean theo hướng thực dụng: khi nào DO phù hợp,
                    các dịch vụ quan trọng (Droplet, DOKS, Managed DB, Spaces) và cách triển khai nhanh một hệ thống nhỏ.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>DigitalOcean overview: pricing mindset, use case phù hợp (startup/SMB)</li>
                    <li>Compute: Droplets, snapshots, basic firewall (overview)</li>
                    <li>Kubernetes: DOKS overview, node pools, load balancer integration</li>
                    <li>Managed DB: PostgreSQL/Redis basics (overview) + backup concept</li>
                    <li>Storage: Spaces (S3-compatible), CDN concept</li>
                    <li>Networking basics: VPC, floating IP, load balancers (overview)</li>
                    <li>So sánh nhanh: DO vs AWS (đơn giản hóa vs độ linh hoạt)</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Biết khi nào nên chọn DigitalOcean thay vì AWS/GCP</li>
                    <li>Hiểu các dịch vụ DO thường dùng để deploy nhanh hệ thống nhỏ</li>
                    <li>Đủ nền tảng để đọc hiểu infra và vận hành cơ bản trên DO</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể triển khai và vận hành cơ bản trên DigitalOcean,
                    hiểu rõ trade-off về chi phí, độ đơn giản và khả năng mở rộng khi so với AWS/GCP.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
