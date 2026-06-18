import { Locale } from "next-intl"

// represent as a function to ensure optional loading or logic processing
export const pathConfig = () => {
    const locale = (locale?: Locale) => {
        const localePath = locale ? `/${locale}` : ""
        const build = () => {
            return `${localePath}`
        }
        const profile = (username?: string) => {
            // when a username is given, point at that user's public profile
            // (`/profile/<username>`, GitHub-style); otherwise the viewer's own hub.
            const profilePath = username
                ? `${localePath}/profile/${username}`
                : `${localePath}/profile`
            const build = () => {
                return profilePath
            }
            const bookmarks = () => {
                const bookmarksPath = `${profilePath}/bookmarks`
                const build = () => {
                    return bookmarksPath
                }
                return {
                    build,
                }
            }
            const aiUsage = () => {
                const aiUsagePath = `${profilePath}/ai-usage`
                const build = () => {
                    return aiUsagePath
                }
                return {
                    build,
                }
            }
            const edit = () => {
                const editPath = `${profilePath}/edit`
                const build = () => {
                    return editPath
                }
                return {
                    build,
                }
            }
            const sessions = () => {
                const sessionsPath = `${profilePath}/sessions`
                const build = () => {
                    return sessionsPath
                }
                return {
                    build,
                }
            }
            const security = () => {
                const securityPath = `${profilePath}/security`
                const build = () => {
                    return securityPath
                }
                return {
                    build,
                }
            }
            const aiSettings = () => {
                const aiSettingsPath = `${profilePath}/ai-settings`
                const build = () => {
                    return aiSettingsPath
                }
                return {
                    build,
                }
            }
            const aiSubscription = () => {
                const aiSubscriptionPath = `${profilePath}/ai-subscription`
                const build = () => {
                    return aiSubscriptionPath
                }
                return {
                    build,
                }
            }
            const membership = () => {
                const membershipPath = `${profilePath}/membership`
                const build = () => {
                    return membershipPath
                }
                return {
                    build,
                }
            }
            const settings = () => {
                const settingsPath = `${profilePath}/settings`
                const build = () => {
                    return settingsPath
                }
                return {
                    build,
                }
            }
            const learning = () => {
                const learningPath = `${profilePath}/learning`
                const build = () => {
                    return learningPath
                }
                return {
                    build,
                }
            }
            const submissions = () => {
                const submissionsPath = `${profilePath}/submissions`
                const build = () => {
                    return submissionsPath
                }
                return {
                    build,
                }
            }
            const attempts = () => {
                const attemptsPath = `${profilePath}/attempts`
                const build = () => {
                    return attemptsPath
                }
                return {
                    build,
                }
            }
            const feedback = () => {
                const feedbackPath = `${profilePath}/feedback`
                const build = () => {
                    return feedbackPath
                }
                return {
                    build,
                }
            }
            const cv = () => {
                const cvPath = `${profilePath}/cv`
                const build = () => {
                    return cvPath
                }
                return {
                    build,
                }
            }
            return {
                build,
                bookmarks,
                aiUsage,
                aiSettings,
                aiSubscription,
                membership,
                settings,
                edit,
                sessions,
                security,
                learning,
                submissions,
                attempts,
                feedback,
                cv,
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
                const personalProject = (taskId?: string) => {
                    const personalProjectPath = taskId
                        ? `${learnPath}/personal-project/tasks/${taskId}`
                        : `${learnPath}/personal-project`
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
                const headhuntings = () => {
                    const headhuntingsPath = `${learnPath}/headhuntings`
                    const build = () => {
                        return headhuntingsPath
                    }
                    return {
                        build,
                    }
                }
                const flashcards = () => {
                    const flashcardsPath = `${learnPath}/flashcards`
                    const build = () => {
                        return flashcardsPath
                    }
                    return {
                        build,
                    }
                }
                const practice = () => {
                    const practicePath = `${learnPath}/practice`
                    const build = () => {
                        return practicePath
                    }
                    return {
                        build,
                    }
                }
                const foundations = (categoryId?: string) => {
                    const foundationsPath = categoryId
                        ? `${learnPath}/foundations/${categoryId}`
                        : `${learnPath}/foundations`
                    const build = () => {
                        return foundationsPath
                    }
                    const item = (foundationId?: string) => {
                        const itemPath = foundationId
                            ? `${foundationsPath}/${foundationId}`
                            : foundationsPath
                        const buildItem = () => {
                            return itemPath
                        }
                        return {
                            build: buildItem,
                        }
                    }
                    return {
                        build,
                        item,
                    }
                }
                const module = (moduleId?: string) => {
                    const modulePath = moduleId ? `${learnPath}/modules/${moduleId}` : `${learnPath}/modules`
                    const build = () => {
                        return modulePath
                    }
                    const content = (contentId?: string) => {
                        const contentPath = contentId ? `${modulePath}/contents/${contentId}` : `${modulePath}/contents`
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
                    headhuntings,
                    flashcards,
                    practice,
                    foundations,
                    module,
                }
            }
            const headhuntingCompanies = (companyId?: string) => {
                const headhuntingCompaniesPath = companyId
                    ? `${coursePath}/headhunting-companies/${companyId}`
                    : `${coursePath}/headhunting-companies`
                const build = () => {
                    return headhuntingCompaniesPath
                }
                return {
                    build,
                }
            }

            return {
                build,
                learn,
                headhuntingCompanies,
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
        const dashboard = () => {
            const dashboardPath = `${localePath}/dashboard`
            const build = () => {
                return dashboardPath
            }
            return {
                build,
            }
        }
        const talents = () => {
            // talent directory: users who opted into "open to work"
            const talentsPath = `${localePath}/talents`
            const build = () => {
                return talentsPath
            }
            return {
                build,
            }
        }
        const blog = () => {
            // editorial blog index (deep-dive / build-in-public / career / …)
            const blogPath = `${localePath}/blog`
            const build = () => {
                return blogPath
            }
            return {
                build,
            }
        }
        const practice = () => {
            const practicePath = `${localePath}/practice`
            const build = () => {
                return practicePath
            }
            return {
                build,
            }
        }
        const review = () => {
            // flashcard review session (SM-2): all due cards across courses
            const reviewPath = `${localePath}/review`
            const build = () => {
                return reviewPath
            }
            return {
                build,
            }
        }
        const rewards = () => {
            // reward points store: spend reward points earned from learning on gifts
            const rewardsPath = `${localePath}/rewards`
            const build = () => {
                return rewardsPath
            }
            return {
                build,
            }
        }
        const league = () => {
            // weekly league + global leaderboard (full board behind the dashboard card)
            const leaguePath = `${localePath}/league`
            const build = () => {
                return leaguePath
            }
            return {
                build,
            }
        }
        const kpi = () => {
            // weekly KPI editor (set per-metric targets behind the dashboard summary)
            const kpiPath = `${localePath}/kpi`
            const build = () => {
                return kpiPath
            }
            return {
                build,
            }
        }
        const publicContent = (contentId?: string) => {
            const publicContentPath = contentId ? `${localePath}/contents/${contentId}` : `${localePath}/content`
            const build = () => {
                return publicContentPath
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
            publicContent,
            dashboard,
            practice,
            review,
            talents,
            blog,
            rewards,
            league,
            kpi,
        }
    }
    return {
        locale,
    }
}