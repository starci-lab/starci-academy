import { Locale } from "next-intl"

// represent as a function to ensure optional loading or logic processing
export const pathConfig = () => {
    const locale = (locale?: Locale) => {
        const localePath = locale ? `/${locale}` : ""
        const build = () => {
            // With no locale supplied, the bare root is "" — which is an empty href the router
            // won't navigate to. Fall back to "/" so "go home" links (breadcrumbs) navigate to
            // the locale root. NOTE: the root `/` is GitHub-style gated by the proxy (logged-in
            // visitors are bounced to the dashboard); use `home()` below to reach the landing
            // page on purpose without being gated.
            return localePath || "/"
        }
        /** The marketing landing at an explicit, UNGATED url (`/home`) — proxy never bounces it,
         *  so the logo / "Trang chủ" reach the landing even while signed in. */
        const home = () => {
            const homePath = `${localePath}/home`
            const build = () => homePath
            return {
                build,
            }
        }
        /** The auth-guard redirect target (`/login`), optionally carrying `?redirect=<path>`
         *  back to the originally-requested protected route. */
        const login = (redirectTo?: string) => {
            const loginPath = `${localePath}/login`
            const build = () => {
                return redirectTo
                    ? `${loginPath}?redirect=${encodeURIComponent(redirectTo)}`
                    : loginPath
            }
            return {
                build,
            }
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
            // settings hub root — all account-management pages nest under it
            // (`/profile/settings/<page>`); the hub itself is `/profile/settings`.
            const settingsPath = `${profilePath}/settings`
            const bookmarks = () => {
                const bookmarksPath = `${settingsPath}/bookmarks`
                const build = () => {
                    return bookmarksPath
                }
                return {
                    build,
                }
            }
            const aiUsage = () => {
                const aiUsagePath = `${settingsPath}/ai-usage`
                const build = () => {
                    return aiUsagePath
                }
                return {
                    build,
                }
            }
            const edit = () => {
                const editPath = `${settingsPath}/edit`
                const build = () => {
                    return editPath
                }
                return {
                    build,
                }
            }
            const sessions = () => {
                const sessionsPath = `${settingsPath}/sessions`
                const build = () => {
                    return sessionsPath
                }
                return {
                    build,
                }
            }
            const security = () => {
                const securityPath = `${settingsPath}/security`
                const build = () => {
                    return securityPath
                }
                return {
                    build,
                }
            }
            const aiSettings = () => {
                const aiSettingsPath = `${settingsPath}/ai-settings`
                const build = () => {
                    return aiSettingsPath
                }
                return {
                    build,
                }
            }
            const aiSubscription = () => {
                const aiSubscriptionPath = `${settingsPath}/ai-subscription`
                const build = () => {
                    return aiSubscriptionPath
                }
                return {
                    build,
                }
            }
            const membership = () => {
                const membershipPath = `${settingsPath}/membership`
                const build = () => {
                    return membershipPath
                }
                return {
                    build,
                }
            }
            const installments = () => {
                const installmentsPath = `${settingsPath}/installments`
                const build = () => {
                    return installmentsPath
                }
                return {
                    build,
                }
            }
            const settings = () => {
                const build = () => {
                    return settingsPath
                }
                return {
                    build,
                }
            }
            const learning = () => {
                const learningPath = `${settingsPath}/learning`
                const build = () => {
                    return learningPath
                }
                return {
                    build,
                }
            }
            const submissions = () => {
                const submissionsPath = `${settingsPath}/submissions`
                const build = () => {
                    return submissionsPath
                }
                return {
                    build,
                }
            }
            const attempts = () => {
                const attemptsPath = `${settingsPath}/attempts`
                const build = () => {
                    return attemptsPath
                }
                return {
                    build,
                }
            }
            const feedback = () => {
                const feedbackPath = `${settingsPath}/feedback`
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
                // `/profile/cv` is the CV GALLERY (list of the user's CVs). Editing
                // one is a DEDICATED route `/profile/cv/<id>` (the roomy block
                // editor), not a query-param mode — the gallery just renders + opens.
                const document = (id: string) => {
                    const documentPath = `${cvPath}/${id}`
                    const documentBuild = () => {
                        return documentPath
                    }
                    return {
                        build: documentBuild,
                    }
                }
                return {
                    build,
                    document,
                }
            }
            const appearance = () => {
                const appearancePath = `${settingsPath}/appearance`
                const build = () => {
                    return appearancePath
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
                installments,
                settings,
                edit,
                sessions,
                security,
                learning,
                submissions,
                attempts,
                feedback,
                cv,
                appearance,
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
                const content = () => {
                    // course-contents home ("Học phần"): the docs-style chỉ-mục landing
                    const contentPath = `${learnPath}/content`
                    const build = () => {
                        return contentPath
                    }
                    return {
                        build,
                    }
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
                const qa = () => {
                    const qaPath = `${learnPath}/qa`
                    const build = () => {
                        return qaPath
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
                    // the dedicated, resumable URL for an in-progress "Hỏi nhanh" quiz run —
                    // mirrors `mockInterview().interview(sessionId)`: the setup screen's resume
                    // card deep-links here so a session started earlier (24h TTL) rehydrates
                    // straight into the active phase instead of starting fresh.
                    const quiz = (sessionId: string) => {
                        const quizPath = `${flashcardsPath}/quiz/sessions/${sessionId}`
                        const build = () => {
                            return quizPath
                        }
                        // the dedicated RESULT URL for a FINISHED "Hỏi nhanh" run — a
                        // separate route segment (not just a `phase`/status inferred at
                        // the live URL) so "is this session done" is answered by the URL
                        // itself, never by re-deriving `status` client-side (2026-07-12,
                        // root-caused a class of F5-shows-stale-state bugs today: a session
                        // that finished but whose `status` write never landed server-side
                        // had no way to distinguish "about to answer the last card" from
                        // "just answered it" — both read the same at the live URL).
                        const result = () => {
                            const resultPath = `${quizPath}/result`
                            const build = () => {
                                return resultPath
                            }
                            return {
                                build,
                            }
                        }
                        return {
                            build,
                            result,
                        }
                    }
                    // deep-link into "Học thẻ" (SM-2 review) for ONE deck: the resolve-or-start
                    // SHIM entry (`?deckId=`) — no `decks/<id>` route segment anymore (thầy
                    // 2026-07-11: "bỏ deck đi, only session thôi" — deck-review and due-review
                    // now share ONE live shape, `due(sessionId)` above; `deckId` travels as a
                    // query hint both here (pre-session) and on the live URL (so a direct
                    // link/refresh still knows which BE session-kind to resume). `useFlashcardNav`
                    // parses `deckId` back out of this same query key — keep in sync.
                    const review = (deckId: string) => {
                        const reviewPath = `${flashcardsPath}/review?${new URLSearchParams({ deckId }).toString()}`
                        const build = () => {
                            return reviewPath
                        }
                        return {
                            build,
                        }
                    }
                    // resumable cross-deck "Đến hạn hôm nay" (due) session URL — mirrors
                    // `review(deckId)`/`quiz(sessionId)` above: the session rides as its own
                    // route segment instead of the old `?session=due` query marker, so it's
                    // traceable/shareable/resumable-by-URL the same way (thầy 2026-07-11
                    // đính chính: "due review cũng tạo session mới nhé" — parity with the
                    // deck reviewer's own 2026-07-11 correction). `useFlashcardNav`/`DueReview`
                    // still land on the bare `review?session=due` marker first (no id known
                    // yet); that shim resolves-or-starts a session then redirects here.
                    const due = (sessionId: string) => {
                        const duePath = `${flashcardsPath}/review/sessions/${sessionId}`
                        const build = () => {
                            return duePath
                        }
                        // dedicated RESULT URL — shared by BOTH kinds this route serves
                        // (single-deck review AND cross-deck due), same reasoning as
                        // `quiz(sessionId).result()` above.
                        const result = () => {
                            const resultPath = `${duePath}/result`
                            const build = () => {
                                return resultPath
                            }
                            return {
                                build,
                            }
                        }
                        return {
                            build,
                            result,
                        }
                    }
                    return {
                        build,
                        quiz,
                        review,
                        due,
                    }
                }
                const mockInterview = () => {
                    const mockInterviewPath = `${learnPath}/mock-interview`
                    const build = () => {
                        return mockInterviewPath
                    }
                    // the dedicated, resumable URL for a LIVE session (full-bleed work
                    // surface) — `startMockInterviewSession` navigates here right after
                    // drawing a session, and it's how a resumable in-progress session (24h
                    // TTL) is deep-linked back into from the setup screen's resume card.
                    const interview = (sessionId: string) => {
                        const interviewPath = `${mockInterviewPath}/interview/${sessionId}`
                        const build = () => {
                            return interviewPath
                        }
                        // the dedicated RESULT URL for a GRADED run — same reasoning as
                        // `flashcards().quiz(sessionId).result()`: "is this session done" is
                        // answered by the URL segment itself (2026-07-13), not by a `?phase=`
                        // query mirror re-derived client-side. `finishAndGrade` navigates here
                        // right after grading succeeds; resuming a session that turns out to
                        // already be graded also redirects here instead of rendering the
                        // scorecard inline at the live URL.
                        const result = () => {
                            const resultPath = `${interviewPath}/result`
                            const build = () => {
                                return resultPath
                            }
                            return {
                                build,
                            }
                        }
                        return {
                            build,
                            result,
                        }
                    }
                    return {
                        build,
                        interview,
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
                const playground = (slug?: string) => {
                    // in-course hands-on Docker/K8s exercises: a hub list (`/playground`)
                    // and one exercise's live work surface (`/playground/<slug>`), the
                    // browser end of a local CLI agent relayed over Socket.IO.
                    const playgroundPath = slug
                        ? `${learnPath}/playground/${slug}`
                        : `${learnPath}/playground`
                    const build = () => {
                        return playgroundPath
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
                    // lessons live UNDER the content home: `/learn/content/modules/...`
                    const modulesBase = `${learnPath}/content/modules`
                    const modulePath = moduleId ? `${modulesBase}/${moduleId}` : modulesBase
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
                    content,
                    mindMap,
                    cv,
                    personalProject,
                    leaderboard,
                    qa,
                    headhuntings,
                    flashcards,
                    mockInterview,
                    practice,
                    playground,
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
        const cart = () => {
            // shopping cart: review chosen courses + multi-course checkout
            const cartPath = `${localePath}/cart`
            const build = () => {
                return cartPath
            }
            return {
                build,
            }
        }
        const terms = () => {
            // terms of service (stub page, linked from the footer)
            const termsPath = `${localePath}/terms`
            const build = () => {
                return termsPath
            }
            return {
                build,
            }
        }
        const privacy = () => {
            // privacy policy (stub page, linked from the footer)
            const privacyPath = `${localePath}/privacy`
            const build = () => {
                return privacyPath
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
        const jobs = (displayId?: string) => {
            // IT job board: browse (`/jobs`) or one posting's detail (`/jobs/[displayId]`).
            // Global, non-course-scoped — mirrors `talents()`.
            const jobsPath = displayId ? `${localePath}/jobs/${displayId}` : `${localePath}/jobs`
            const build = () => {
                return jobsPath
            }
            // public submission form: any signed-in user can post a job opening
            const post = () => {
                const postPath = `${localePath}/jobs/post`
                const build = () => {
                    return postPath
                }
                return {
                    build,
                }
            }
            return {
                build,
                post,
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
        const architecture = () => {
            // public "System Atlas": live 3D map + per-component health + curl playground
            const architecturePath = `${localePath}/architecture`
            const build = () => {
                return architecturePath
            }
            return {
                build,
            }
        }
        const community = () => {
            // community feed (posts + comments + reactions) + founder Q&A
            const communityPath = `${localePath}/community`
            const build = () => {
                return communityPath
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
        const ragPlayground = () => {
            // public marketing demo: import code, ask questions, answered by the
            // local self-hosted model — no login required
            const ragPlaygroundPath = `${localePath}/rag-playground`
            const build = () => {
                return ragPlaygroundPath
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
            home,
            login,
            course,
            profile,
            authentication,
            contact,
            publicContent,
            dashboard,
            cart,
            practice,
            ragPlayground,
            review,
            talents,
            jobs,
            blog,
            architecture,
            community,
            rewards,
            league,
            kpi,
            terms,
            privacy,
        }
    }
    return {
        locale,
    }
}