import { Locale } from "next-intl"

// represent as a function to ensure optional loading or logic processing
export const pathConfig = () => {
    const locale = (locale?: Locale) => {
        const localePath = locale ? `/${locale}` : ""
        const build = () => {
            return `${localePath}`
        }
        const profile = () => {
            const profilePath = `${localePath}/profile`
            const build = () => {
                return profilePath
            }
            return {
                build,
            }
        }
        const authentication = () => {
            const authenticationPath = `${localePath}/authentication`
            const build = () => {
                return authenticationPath
            }
            const google = () => {
                const googlePath = `${authenticationPath}/google`
                const build = () => {
                    return googlePath
                }
                const login = () => {
                    const loginPath = `${googlePath}/login`
                    const build = () => {
                        return loginPath
                    }
                    return {
                        build,
                    }
                }
                const logout = () => {
                    const logoutPath = `${googlePath}/logout`
                    const build = () => {
                        return logoutPath
                    }
                    return {
                        build,
                    }
                }
                return {
                    build, login, logout,
                }
            }
            const github = () => {
                const githubPath = `${authenticationPath}/github`
                const build = () => {
                    return githubPath
                }
                const login = () => {
                    const loginPath = `${githubPath}/login`
                    const build = () => {
                        return loginPath
                    }
                    return {
                        build,
                    }
                }
                const logout = () => {
                    const logoutPath = `${githubPath}/logout`
                    const build = () => {
                        return logoutPath
                    }
                    return {
                        build,
                    }
                }
                return {
                    build, login, logout,
                }
            }
            return {
                build, google, github,
            }
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
                const mindMap = () => {
                    const mindMapPath = `${learnPath}/mind-map`
                    const build = () => {
                        return mindMapPath
                    }
                    return {
                        build,
                    }
                }
                const cv = () => {
                    const cvPath = `${learnPath}/cv`
                    const build = () => {
                        return cvPath
                    }
                    return {
                        build,
                    }
                }
                const personalProject = () => {
                    const personalProjectPath = `${learnPath}/personal-project`
                    const build = () => {
                        return personalProjectPath
                    }
                    return {
                        build,
                    }
                }
                const leaderboard = () => {
                    const leaderboardPath = `${learnPath}/leaderboard`
                    const build = () => {
                        return leaderboardPath
                    }
                    return {
                        build,
                    }
                }
                const starciAi = () => {
                    const starciAiPath = `${learnPath}/starci-ai`
                    const build = () => {
                        return starciAiPath
                    }
                    return {
                        build,
                    }
                }
                const module = (displayId?: string) => {
                    const modulePath = displayId ? `${learnPath}/modules/${displayId}` : `${learnPath}/modules`
                    const build = () => {
                        return modulePath
                    }
                    const content = (displayId?: string) => {
                        const contentPath = displayId ? `${modulePath}/contents/${displayId}` : `${modulePath}/contents`
                        const build = () => {
                            return contentPath
                        }
                        return {
                            build,
                        }
                    }
                    return {
                        build,
                        content,
                    }
                }
                return {
                    build,
                    mindMap,
                    cv,
                    personalProject,
                    leaderboard,
                    starciAi,
                    module,
                }
            }
            
            return {
                build,
                learn,
            }
        }
        const contact = () => {
            const contactPath = `${localePath}/contact`
            const build = () => {
                return contactPath
            }
            return {
                build,
            }
        }
        return {
            build,
            course,
            profile,
            authentication,
            contact,
        }
    }
    return {
        locale,
    }
}