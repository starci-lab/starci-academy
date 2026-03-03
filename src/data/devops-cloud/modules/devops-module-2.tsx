import { Link, Spacer } from "@heroui/react"
import React from "react"
import { Module } from "@/types"

export const devopsModule2: Module = {
    id: "devops-module-2",
    name: "AWS Core Infrastructure: VPC, IAM & EC2 with Terraform",
    description: "Xây nền tảng AWS trước khi lên Kubernetes: thiết kế VPC (public/private), IAM policy cơ bản, và triển khai EC2 theo chuẩn production tối thiểu — tất cả đều bằng Terraform.",
    video: "",
    duration: "~3 hours",
    order: 2,
    content: (
        <div className="text-sm flex flex-col gap-4 ml-4">
            <div>
                <div>
                    Module này giúp bạn nắm "xương sống" của AWS để dựng hạ tầng chuẩn bài:
                    mạng (VPC) + quyền (IAM) + compute (EC2). Bạn sẽ viết Terraform end-to-end
                    để tạo một bộ infrastructure AWS cơ bản, sẵn sàng nối sang CI/CD và EKS ở module sau.
                </div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Thiết kế VPC: public/private subnets, route tables, Internet Gateway (IGW), NAT Gateway</li>
                    <li>Network security: Security Group, NACL (đủ hiểu và áp dụng đúng use case)</li>
                    <li>IAM basics: users/roles/policies, least privilege, instance profile</li>
                    <li>EC2 fundamentals: AMI, instance types, key pair, User Data bootstrap</li>
                    <li>Operational access: SSM Session Manager (hạn chế SSH, chuẩn production)</li>
                    <li>Storage cho EC2: EBS cơ bản (size/type, attach, persistence)</li>
                    <li>EC2 scaling: Launch Template + Auto Scaling Group (mức cơ bản)</li>
                    <li>S3 basics: dùng cho Terraform remote state backend + artifact storage</li>
                    <li>CloudWatch cơ bản: logs/metrics để quan sát instance và debug khi có sự cố</li>
                    <li>Thực hành viết Terraform full stack: VPC + IAM + SG + EC2 (production-ready tối thiểu)</li>
                </ul>
            </div>
            <div>
                <div>Sau module này, bạn sẽ:</div>
                <Spacer y={2} />
                <ul className="list-disc list-inside ml-4 text-foreground-500 space-y-1">
                    <li>Tự thiết kế được network AWS chuẩn: public/private subnets, routing, NAT/IGW</li>
                    <li>Biết set IAM role/policy đúng nguyên tắc least privilege cho EC2 workload</li>
                    <li>Triển khai EC2 theo chuẩn vận hành: bootstrap bằng user-data, truy cập qua SSM</li>
                    <li>Biết cách setup remote state backend trên S3 để làm việc team/prod an toàn</li>
                    <li>Có thể dựng "AWS core stack" bằng Terraform để làm nền cho EKS/CI-CD</li>
                </ul>
            </div>
            <div>
                <div>Cam kết:</div>
                <Spacer y={2} />
                <div className="text-foreground-500">
                    Sau khi hoàn tất module này, bạn có thể dựng được "hạ tầng AWS cơ bản" bằng Terraform
                    (VPC + IAM + Security Group + EC2), có remote state và monitoring cơ bản — đủ tiêu chuẩn
                    để triển khai ứng dụng thật và sẵn sàng bước sang Kubernetes (EKS) ở module tiếp theo.
                </div>
                <Spacer y={2} />
                <Link size="sm" color="primary" underline="always">
                    Đọc thêm
                </Link>
            </div>
        </div>
    ),
}
