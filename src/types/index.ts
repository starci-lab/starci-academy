import { ReactNode } from "react"
export interface Module {
    id: string
    name: string
    description: ReactNode
    content: ReactNode
    video: string
    duration: string
    order: number
}

export interface Course {
    id: string
    name: string
    description: string
    image: string
    commitmentTexts: Array<string>
    price: number
    location: string
    date: string
    time: string
    duration: string
    modules: Array<Module>
    pricing: Array<Pricing>
    currentPhase: PricingPhase
    originalPrice: number
    prerequisites?: Array<string>
}

export enum PricingPhase {
    Pioneer = "pioneer",
    EarlyBird = "early_bird",
    Regular = "regular",
}

export interface Pricing {
    phase: PricingPhase
    name: string
    price: number
    startDate: string
    slotAvailable: number
    slotSold: number
    endDate: string
}