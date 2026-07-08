/**
 * Objective (non-AI) recall grading helpers for the flashcard quick quiz.
 *
 * Confidence note: the "Từ khoá ăn điểm" (key terms) section of every seeded
 * flashcard answer is authored as a `:::chip` markdown directive — confirmed
 * from the seed content. So parsing the chip block out of the raw answer gives
 * us the exact set of terms an ideal recall should mention, WITHOUT any AI. This
 * mirrors the app's own directive parser (`applyChipDirective` in
 * `components/reuseable/MarkdownContent/index.tsx`): the block body is split on
 * newlines / middots, trimmed, and empties dropped.
 */

/**
 * Matches every `:::chip … :::` container directive block in a markdown string.
 * Non-greedy across lines so multiple chip blocks are captured independently.
 * Group 1 = the inner body (the raw keyword lines) of one chip block.
 */
const CHIP_BLOCK_REGEX = /^:::+chip[^\n]*\n([\s\S]*?)\n:::+\s*$/gm

/**
 * Extracts the "key terms" a good recall should mention from a flashcard answer,
 * by unioning the items of every `:::chip` block in the answer markdown. Items
 * are split on newlines / middots (matching the app's chip directive parser),
 * trimmed, de-duplicated, and returned in first-seen order.
 * @param answer - Raw answer markdown of a flashcard card.
 * @returns The unique key terms; empty when the answer has no `:::chip` block.
 */
export const parseAnswerKeywords = (answer: string): Array<string> => {
    if (!answer) {
        return []
    }
    const seen = new Set<string>()
    const keywords: Array<string> = []
    // reset defensively — the regex is module-scoped + global
    CHIP_BLOCK_REGEX.lastIndex = 0
    for (
        let match = CHIP_BLOCK_REGEX.exec(answer);
        match;
        match = CHIP_BLOCK_REGEX.exec(answer)
    ) {
        const body = match[1] ?? ""
        for (const raw of body.split(/[\n·]+/)) {
            const term = raw.trim()
            if (term.length === 0) {
                continue
            }
            const key = term.toLowerCase()
            if (!seen.has(key)) {
                seen.add(key)
                keywords.push(term)
            }
        }
    }
    return keywords
}

/** Result of scoring a typed recall against a card's key terms. */
export interface CoverageResult {
    /** How many key terms the recall mentioned. */
    covered: number
    /** Total key terms for the card. */
    total: number
    /** The subset of key terms found in the recall (case-insensitive). */
    hits: Set<string>
}

/**
 * Scores a learner's typed recall against a card's key terms with plain
 * case-insensitive substring matching — a term counts as covered when the recall
 * text contains it. Fully objective (no AI, no fuzzy matching).
 * @param recall - The learner's typed answer.
 * @param keywords - The card's key terms (from {@link parseAnswerKeywords}).
 * @returns The covered / total counts and the set of matched terms.
 */
export const coverageOf = (recall: string, keywords: Array<string>): CoverageResult => {
    const normalizedRecall = recall.toLowerCase()
    const hits = new Set<string>()
    for (const keyword of keywords) {
        if (keyword.length > 0 && normalizedRecall.includes(keyword.toLowerCase())) {
            hits.add(keyword)
        }
    }
    return { covered: hits.size, total: keywords.length, hits }
}
