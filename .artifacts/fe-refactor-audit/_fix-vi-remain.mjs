import fs from "node:fs"

const reps = [
    [".storybook/story-kit.tsx", "tạp nham", "messy mix"],
    [
        "src/app/[locale]/courses/[courseId]/learn/content/modules/layout.tsx",
        "bài học",
        "lesson",
    ],
    [
        "src/app/[locale]/courses/[courseId]/learn/flashcards/review/sessions/[sessionId]/page.tsx",
        "session đã persist hết rồi",
        "session already persisted everything",
    ],
    [
        "src/app/[locale]/courses/[courseId]/learn/playground/[slug]/layout.tsx",
        "Bắt đầu",
        "Start",
    ],
    ["src/hooks/effects/useDefaultRedirect.ts", "Tiếp tục", "Continue"],
    [
        "src/hooks/swr/api/graphql/mutations/useMutateRewriteCvBlockSwr.ts",
        "giúp\"",
        "help\"",
    ],
    [
        "src/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardDueReviewSessionProgressSwr.ts",
        "fe không nuốt lỗi, dùng runGraphQL đi",
        "FE must not swallow errors; use runGraphQL",
    ],
    [
        "src/hooks/swr/api/graphql/queries/useQueryContentAiSessionsInfiniteSwr.ts",
        "Đã lưu trữ",
        "Archived",
    ],
    [
        "src/hooks/swr/api/graphql/queries/useQueryMyVouchersSwr.ts",
        "Ví của tôi",
        "My wallet",
    ],
    [
        "src/modules/api/graphql/mutations/types/start-flashcard-review-session.ts",
        "modal chọn mode",
        "mode-picker modal",
    ],
    [
        "src/modules/api/graphql/mutations/types/start-mock-interview-session.ts",
        "4 câu",
        "4 questions",
    ],
]

for (const [f, a, b] of reps) {
    let s = fs.readFileSync(f, "utf8")
    if (!s.includes(a)) {
        console.log("MISS", f, a)
        continue
    }
    fs.writeFileSync(f, s.split(a).join(b))
    console.log("fixed", f)
}

// Multiline teacher quotes — normalize per file
const multi = [
    [
        "src/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardQuizSessionProgressSwr.ts",
        /fe không nuốt lỗi,\r?\n \* dùng runGraphQL đi/g,
        "FE must not swallow errors; use runGraphQL",
    ],
    [
        "src/hooks/swr/api/graphql/mutations/useMutateSyncFlashcardReviewSessionProgressSwr.ts",
        /fe không nuốt\r?\n \* lỗi, dùng runGraphQL đi/g,
        "FE must not swallow errors; use runGraphQL",
    ],
    [
        "src/hooks/swr/api/graphql/mutations/useMutateSyncMockInterviewSessionTurnsSwr.ts",
        /fe không\r?\n \* nuốt lỗi, dùng runGraphQL đi/g,
        "FE must not swallow errors; use runGraphQL",
    ],
    [
        "src/modules/api/graphql/queries/query-my-flashcard-review-session-by-session-id.ts",
        /bỏ deck đi, only\r?\n \* session thôi/g,
        "drop the deck route; session only",
    ],
]

for (const [f, re, b] of multi) {
    let s = fs.readFileSync(f, "utf8")
    if (!re.test(s)) {
    // reset lastIndex
        re.lastIndex = 0
        console.log("MISS multi", f)
        continue
    }
    re.lastIndex = 0
    fs.writeFileSync(f, s.replace(re, b))
    console.log("fixed multi", f)
}
