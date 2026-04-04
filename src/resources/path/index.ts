import { Locale } from "next-intl"

// represent as a function to ensure optional loading or logic processing
export const pathConfig = () => {
    const locale = (locale: Locale) => {
        const localePath = `/${locale}`
        const build = () => {
            return `${localePath}`
        }
        const course = (displayId?: string) => {
            const coursePath = displayId ? `${localePath}/courses/${displayId}` : `${localePath}/courses`
            const build = () => {
                return coursePath
            }
            const learn = () => {
                const learnPath = `${coursePath}/learn`
                const build = () => {
                    return learnPath
                }
                const module = (displayId?: string) => {
                    const modulePath = displayId ? `${learnPath}/modules/${displayId}` : `${learnPath}/modules`
                    const build = () => {
                        return modulePath
                    }
                    return {
                        build,
                    }
                }
                return {
                    build,
                    module,
                }
            }
            return {
                build,
                learn,
            }
        }
        return {
            build,
            course,
        }
    }
    return {
        locale,
    }
}