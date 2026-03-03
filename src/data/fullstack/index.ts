import { fsModule1 } from "./modules/fs-module-1"
import { fsModule2 } from "./modules/fs-module-2"
import { fsModule3 } from "./modules/fs-module-3"
import { fsModule4 } from "./modules/fs-module-4"
import { fsModule5 } from "./modules/fs-module-5"
import { fsModule6 } from "./modules/fs-module-6"
import { fsModule7 } from "./modules/fs-module-7"
import { fsModule8 } from "./modules/fs-module-8"
import { fsModule9 } from "./modules/fs-module-9"
import { fsModule10 } from "./modules/fs-module-10"
import { fsModule11 } from "./modules/fs-module-11"
import { fsModule12 } from "./modules/fs-module-12"
import { fsModule13 } from "./modules/fs-module-13"
import { Course, PricingPhase } from "@/types"

export const fullstackCourse: Course = {
    id: "fullstack",
    name: "Fullstack Mastery",
    description: "Khóa học dành cho học sinh và sinh viên muốn tích lũy tư duy, kiến thức và kỹ năng cần thiết để có thể đi thực tập hoặc làm việc ở vị trí Fresher/Junior Developer. Chương trình bao quát đầy đủ kiến thức Fullstack với tất cả các khái niệm cơ bản từ frontend đến backend, giúp bạn hiểu nền tảng và có thể bắt đầu làm việc thực tế.",
    image: "/fullstack-mastery.png",
    commitmentTexts: [
        "Chương trình 2 tháng, tập trung vào nền tảng và tư duy tự học.",
        "Sở hữu capstone fullstack hoàn chỉnh để đưa vào portfolio.",
        "Được hỗ trợ trong trong quá trình học và làm project."
    ],
    price: 100,
    location: "Location 1",
    originalPrice: 1499000,
    pricing: [
        {
            phase: PricingPhase.Pioneer,
            price: 999000,
            name: "Pioneer",
            startDate: "2021-01-01",
            endDate: "2021-01-01",
            slotAvailable: 20,
            slotSold: 0,
        },
        {
            phase: PricingPhase.EarlyBird,
            price: 1249000,
            name: "Early Bird",
            startDate: "2021-01-01",
            endDate: "2021-01-01",
            slotAvailable: 50,
            slotSold: 0,
        },
        {
            phase: PricingPhase.Regular,
            price: 1499000,
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
        "Cần nắm được JavaScript cơ bản.",
        "Hiểu về tư duy lập trình."
    ],
    modules: [
        fsModule1,
        fsModule2,
        fsModule3,
        fsModule4,
        fsModule5,
        fsModule6,
        fsModule7,
        fsModule8,
        fsModule9,
        fsModule10,
        fsModule11,
        fsModule12,
        fsModule13
    ],
    registrationUrl: "https://forms.gle/3eT3qNsHo8Zx8DeF6",
}
