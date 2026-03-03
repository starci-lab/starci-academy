import { sdModule1 } from "./modules/sd-module-1"
import { sdModule2 } from "./modules/sd-module-2"
import { sdModule3 } from "./modules/sd-module-3"
import { sdModule4 } from "./modules/sd-module-4"
import { sdModule5 } from "./modules/sd-module-5"
import { sdModule6 } from "./modules/sd-module-6"
import { sdModule7 } from "./modules/sd-module-7"
import { sdModule8 } from "./modules/sd-module-8"
import { sdModule9 } from "./modules/sd-module-9"
import { sdModule10 } from "./modules/sd-module-10"
import { Course, PricingPhase } from "@/types"

export const systemDesignCourse: Course = {
    id: "system-design",
    name: "System Design Mastery",
    description: "Khóa học dành cho developers muốn nâng cao kỹ năng thiết kế hệ thống, hiểu sâu về kiến trúc phân tán, scalability, và các pattern phổ biến trong thực tế. Chương trình giúp bạn tự tin tham gia các cuộc phỏng vấn System Design và có khả năng thiết kế hệ thống production-ready.",
    image: "/system-design-mastery.png",
    commitmentTexts: [
        "Chương trình tập trung vào tư duy và kỹ năng thiết kế hệ thống thực tế.",
        "Thực hành thiết kế các hệ thống phổ biến: social network, video streaming, e-commerce...",
        "Được hỗ trợ review design và nhận feedback từ mentor có kinh nghiệm."
    ],
    price: 100,
    location: "Location 1",
    originalPrice: 2499000,
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
    prerequisites: [
        "Nắm vững kiến thức nền tảng về Backend, Frontend và Database.",
        "Hiểu các khái niệm Backend cơ bản: Authentication, Authorization, JWT, REST API.",
        "Hiểu cơ chế caching (Redis hoặc tương đương) và mục đích tối ưu performance."
    ],
    modules: [
        sdModule1,
        sdModule2,
        sdModule3,
        sdModule4,
        sdModule5,
        sdModule6,
        sdModule7,
        sdModule8,
        sdModule9,
        sdModule10
    ],
}
