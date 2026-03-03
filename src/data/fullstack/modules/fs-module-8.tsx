import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const fsModule8: Module = {
    id: "fs-module-8",
    name: "Docker & Deployment to Digital Ocean VPS",
    description: "Xây dựng Docker image cho backend NestJS, thiết lập docker-compose, và triển khai ứng dụng lên VPS Digital Ocean một cách đơn giản và hiệu quả.",
    video: "",
    duration: "~2 hours",
    order: 8,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn containerize backend và triển khai lên VPS thực tế,
                    thay vì chỉ chạy trên localhost.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Hiểu Docker cơ bản: image, container, Dockerfile và docker-compose</li>
                    <li>Xây dựng Dockerfile cho NestJS application: multi-stage build, tối ưu image size</li>
                    <li>Thiết lập docker-compose để chạy backend + database + Redis cùng lúc</li>
                    <li>Triển khai lên Digital Ocean VPS: tạo droplet, cấu hình SSH, cài đặt Docker</li>
                    <li>Thiết lập domain, reverse proxy với Nginx và cấu hình SSL cơ bản</li>
                    <li>Quản lý environment variables và secrets trên production</li>
                </ul>
            </div>
            <div>
                <div>
                    Sau module này, bạn sẽ:
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Biết cách đóng gói ứng dụng backend thành Docker image</li>
                    <li>Tự triển khai được backend lên VPS và truy cập từ internet</li>
                    <li>Hiểu cách quản lý nhiều service (app, database, cache) với docker-compose</li>
                    <li>Tự tin deploy backend production-ready lên server thực tế</li>
                </ul>
            </div>
            <div>
                <div>
                    Cam kết:
                </div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể containerize và triển khai backend
                    lên VPS một cách đơn giản, sẵn sàng cho môi trường production thực tế.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
