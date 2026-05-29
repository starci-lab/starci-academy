import type { GraphQLResponse } from "../../types"

/** Difficulty tier of a coding problem (mirrors backend `CodingDifficulty`). */
export enum CodingDifficulty {
    Easy = "easy",
    Medium = "medium",
    Hard = "hard",
}

/** Submission language (mirrors backend `CodingLanguage`). */
export enum CodingLanguage {
    Python = "python",
    JavaScript = "javascript",
    TypeScript = "typescript",
    Java = "java",
    Cpp = "cpp",
}

/** Judging verdict (mirrors backend `CodingVerdict`). */
export enum CodingVerdict {
    Pending = "pending",
    Judging = "judging",
    Accepted = "accepted",
    WrongAnswer = "wrongAnswer",
    TimeLimitExceeded = "timeLimitExceeded",
    MemoryLimitExceeded = "memoryLimitExceeded",
    RuntimeError = "runtimeError",
    CompileError = "compileError",
    InternalError = "internalError",
}

/** One testcase exposed to the client (samples only on the detail query). */
export interface CodingProblemTestcase {
    /** Testcase id. */
    id: string
    /** Stdin shown for sample cases. */
    input: string
    /** Expected stdout shown for sample cases. */
    expectedOutput: string
    /** Whether this is a public sample. */
    isSample: boolean
    /** Evaluation order. */
    orderIndex: number
}

/** Per-language starter code for a problem. */
export interface CodingProblemStarterCode {
    /** Starter code id. */
    id: string
    /** Language the starter code targets. */
    language: CodingLanguage
    /** The starter source. */
    code: string
}

/** A coding problem row (list view uses a subset of these fields). */
export interface CodingProblem {
    /** Problem id. */
    id: string
    /** Stable URL slug. */
    slug: string
    /** Title (localized). */
    title: string
    /** Statement Markdown (localized; present on detail). */
    statement?: string
    /** Difficulty tier. */
    difficulty: CodingDifficulty
    /** Topic tags. */
    tags: Array<string>
    /** Per-run CPU time limit (ms) — present on detail. */
    timeLimitMs?: number
    /** Per-run memory limit (kb) — present on detail. */
    memoryLimitKb?: number
    /** Display order. */
    orderIndex: number
    /** Sample testcases — present on detail. */
    testcases?: Array<CodingProblemTestcase>
    /** Starter code per language — present on detail. */
    starterCodes?: Array<CodingProblemStarterCode>
}

/** A user's submission row. */
export interface CodingSubmission {
    /** Submission id. */
    id: string
    /** Language submitted. */
    language: CodingLanguage
    /** Submitted source code. */
    sourceCode: string
    /** Current/terminal verdict. */
    verdict: CodingVerdict
    /** Number of testcases passed. */
    passedCount: number
    /** Total testcases evaluated. */
    totalCount: number
    /** Max run time (ms), or null until judged. */
    runtimeMs: number | null
    /** Max memory (kb), or null until judged. */
    memoryKb: number | null
    /** Compiler output when the verdict is CompileError. */
    compileOutput: string | null
    /** Serialized JSON array of per-case results (sample IO only). */
    perCaseResults: string | null
    /** Creation timestamp. */
    createdAt: string
}

/** One ranked leaderboard entry. */
export interface CodingLeaderboardEntry {
    /** User id. */
    userId: string
    /** Display username. */
    username: string
    /** Distinct solved problem count. */
    solvedCount: number
}

/* ───────────────────────── codingProblems (list) ───────────────────────── */

/** Variables for `codingProblems(request)`. */
export interface CodingProblemsRequest {
    /** Filter by difficulty. */
    difficulty?: CodingDifficulty
    /** Filter by tag. */
    tag?: string
    /** 1-based page number. */
    page?: number
    /** Page size. */
    limit?: number
}

/** Payload inside `codingProblems.data`. */
export interface QueryCodingProblemsPayload {
    /** The page of problems. */
    problems: Array<CodingProblem>
    /** Total matching the filters. */
    total: number
    /** Ids the user has solved. */
    solvedProblemIds: Array<string>
}

/** Response for the `codingProblems` query. */
export interface QueryCodingProblemsResponse {
    /** Top-level `codingProblems` field. */
    codingProblems: GraphQLResponse<QueryCodingProblemsPayload>
}

/* ───────────────────────── codingProblem (detail) ──────────────────────── */

/** Variables for `codingProblem(request)`. */
export interface CodingProblemRequest {
    /** Slug of the problem to load. */
    slug: string
}

/** Response for the `codingProblem` query. */
export interface QueryCodingProblemResponse {
    /** Top-level `codingProblem` field. */
    codingProblem: GraphQLResponse<CodingProblem>
}

/* ────────────────────── myCodingSubmissions (history) ───────────────────── */

/** Variables for `myCodingSubmissions(request)`. */
export interface MyCodingSubmissionsRequest {
    /** Slug of the problem. */
    slug: string
    /** 1-based page number. */
    page?: number
    /** Page size. */
    limit?: number
}

/** Payload inside `myCodingSubmissions.data`. */
export interface QueryMyCodingSubmissionsPayload {
    /** The page of submissions (newest first). */
    submissions: Array<CodingSubmission>
    /** Total submissions for the problem. */
    total: number
}

/** Response for the `myCodingSubmissions` query. */
export interface QueryMyCodingSubmissionsResponse {
    /** Top-level `myCodingSubmissions` field. */
    myCodingSubmissions: GraphQLResponse<QueryMyCodingSubmissionsPayload>
}

/* ───────────────────────── codingLeaderboard ───────────────────────────── */

/** Variables for `codingLeaderboard(request)`. */
export interface CodingLeaderboardRequest {
    /** Max ranked users to return. */
    limit?: number
}

/** Response for the `codingLeaderboard` query. */
export interface QueryCodingLeaderboardResponse {
    /** Top-level `codingLeaderboard` field. */
    codingLeaderboard: GraphQLResponse<Array<CodingLeaderboardEntry>>
}
