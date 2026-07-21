export const TS_SAMPLE = `interface Student {
    id: string
    fullName: string
    averageScore: number
}

const classify = (student: Student): string => {
    if (student.averageScore >= 8) return "Excellent"
    return "Good"
}`

export const JS_SAMPLE = `function calculateOrderTotal(cart) {
    return cart.reduce((total, product) => total + product.price * product.quantity, 0)
}`

export const BASH_SAMPLE = `npm install
npm run build
npm run start:prod`
