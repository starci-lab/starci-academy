
export interface Module {
    id: string
    name: string
    description: string
    video: string
    duration: string
    order: number
}

export interface Course {
    id: string
    name: string
    description: string
    image: string
    price: number
    location: string
    date: string
    time: string
    duration: string
    modules: Array<Module>
}
