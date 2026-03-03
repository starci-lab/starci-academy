import { devopsModule1 } from "./modules/devops-module-1"
import { devopsModule2 } from "./modules/devops-module-2"
import { devopsModule3 } from "./modules/devops-module-3"
import { devopsModule4 } from "./modules/devops-module-4"
import { devopsModule5 } from "./modules/devops-module-5"
import { devopsModule6 } from "./modules/devops-module-6"
import { devopsModule7 } from "./modules/devops-module-7"
import { devopsModule8 } from "./modules/devops-module-8"
import { devopsModule9 } from "./modules/devops-module-9"
import { Course, PricingPhase } from "@/types"

export const devopsCloudCourse: Course = {
    id: "devops-cloud",
    name: "DevOps & Cloud Mastery",
    description: "Khóa học dành cho developers muốn làm chủ DevOps và Cloud infrastructure. Học cách sử dụng Terraform để quản lý infrastructure as code, triển khai trên các cloud provider phổ biến (AWS, Digital Ocean, GCP), và xây dựng CI/CD pipeline với Jenkins, GitHub Actions và ArgoCD. Chương trình giúp bạn tự tin quản lý và vận hành hệ thống production trên cloud.",
    image: "/devops-cloud-mastery.png",
    commitmentTexts: [
        "Chương trình thực hành với các công cụ DevOps phổ biến trong thực tế.",
        "Thực hành triển khai infrastructure trên AWS, Digital Ocean và GCP.",
        "Xây dựng CI/CD pipeline hoàn chỉnh từ code đến production."
    ],
    price: 100,
    location: "Location 1",
    originalPrice: 2999000,
    pricing: [
        {
            phase: PricingPhase.Pioneer,
            price: 1499000,
            name: "Pioneer",
            startDate: "2021-01-01",
            endDate: "2021-01-01",
            slotAvailable: 15,
            slotSold: 0,
        },
        {
            phase: PricingPhase.EarlyBird,
            price: 2249000,
            name: "Early Bird",
            startDate: "2021-01-01",
            endDate: "2021-01-01",
            slotAvailable: 30,
            slotSold: 0,
        },
        {
            phase: PricingPhase.Regular,
            price: 2999000,
            name: "Regular",
            startDate: "2021-01-01",
            endDate: "2021-01-01",
            slotAvailable: Infinity,
            slotSold: 0,
        },
    ],
    currentPhase: PricingPhase.Pioneer,
    date: "2021-01-01",
    time: "10:00",
    duration: "1 hour",
    modules: [
        devopsModule1,
        devopsModule2,
        devopsModule3,
        devopsModule4,
        devopsModule5,
        devopsModule6,
        devopsModule7,
        devopsModule8,
        devopsModule9
    ],
}
