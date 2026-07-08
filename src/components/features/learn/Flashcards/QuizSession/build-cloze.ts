/**
 * Cloze (fill-in-the-blank) builder for the flashcard quick quiz — fully
 * offline, no AI. The blanks are read DIRECTLY from Anki-style `{{cN::…}}`
 * markers that the content author (via the mechanical marking pass) placed in
 * the answer prose, so there is NO fragile string-matching of a separate key-
 * term list against the text: the marker IS the blank, exactly where it sits.
 * Distractors are drawn from SIBLING cards' key terms (same session / tag),
 * mirroring how Duolingo builds its word bank from the session's own vocabulary.
 */

/** One piece of a cloze sentence: literal text, a lightweight inline markdown
 *  span (`` `code` ``/`**bold**`/`*italic*`), or a numbered blank slot. */
export type ClozeSegment =
    | { kind: "text", text: string }
    | { kind: "code", text: string }
    | { kind: "bold", text: string }
    | { kind: "italic", text: string }
    | { kind: "blank", index: number }

/** A generated cloze question for one card. */
export interface ClozeQuestion {
    /** The sentence split into literal text + blank slots, in reading order. */
    segments: Array<ClozeSegment>
    /** The correct term for each blank, in blank order. */
    blanks: Array<string>
    /** Shuffled option chips: the correct terms plus sibling distractors. */
    bank: Array<string>
}

/** Options for {@link buildCloze}. */
export interface BuildClozeParams {
    /** Raw answer markdown (carrying `{{cN::…}}` markers). */
    answer: string
    /** Key terms of OTHER cards in the session — the distractor pool. */
    distractorPool: Array<string>
    /** Max blanks to open (extra markers are revealed as plain text). Default 3. */
    maxBlanks?: number
    /** How many wrong options to add beyond the correct terms. Default 2. */
    distractorCount?: number
}

/** Global cloze-marker matcher: `{{c1::inner}}`. Group 1 = inner text. */
const MARKER = /\{\{c\d+::([\s\S]*?)\}\}/g

/** A parsed marker with its span in the raw answer. */
interface Marker { start: number, end: number, inner: string }

/** Clean a term/segment for DISPLAY + matching: drop backticks, collapse whitespace, trim. */
const clean = (value: string): string => value.replace(/`/g, "").replace(/\s+/g, " ").trim()

/** Sentence-start offsets (after `. ` / newline / `:::` directive fence). */
const sentenceStarts = (source: string): Array<number> => {
    const starts = [0]
    const re = /(?:[.!?]\s+|\n+|:::+[^\n]*\n?)/g
    for (let m = re.exec(source); m; m = re.exec(source)) {
        starts.push(m.index + m[0].length)
    }
    return starts
}

/** Fisher–Yates shuffle (new array). */
const shuffle = <T,>(input: Array<T>): Array<T> => {
    const array = [...input]
    for (let i = array.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

/**
 * Builds a cloze question from a card's marked answer, or returns null when the
 * answer has no `{{cN::…}}` markers (the caller then falls back to a plain flip
 * + self-grade for that card).
 * @param params - See {@link BuildClozeParams}.
 */
export const buildCloze = (
    {
        answer,
        distractorPool,
        maxBlanks = 3,
        distractorCount = 2,
    }: BuildClozeParams,
): ClozeQuestion | null => {
    if (!answer) {
        return null
    }
    // collect every marker with its span
    const markers: Array<Marker> = []
    MARKER.lastIndex = 0
    for (let m = MARKER.exec(answer); m; m = MARKER.exec(answer)) {
        markers.push({ start: m.index, end: m.index + m[0].length, inner: m[1] })
    }
    if (markers.length === 0) {
        return null
    }
    // which markers become BLANKS (cap) — the rest are revealed as plain text
    const blankSet = new Set(markers.slice(0, maxBlanks))

    // tight sentence window covering the markers we use (keeps the cloze short)
    const usedMarkers = [...blankSet]
    const firstStart = usedMarkers[0].start
    const lastEnd = usedMarkers[usedMarkers.length - 1].end
    const starts = sentenceStarts(answer)
    const winStart = [...starts].reverse().find((s) => s <= firstStart) ?? 0
    const winEnd = starts.find((s) => s > lastEnd) ?? answer.length

    // walk the window, splitting at each marker into text + blank/revealed segments
    const inWindow = markers
        .filter((marker) => marker.start >= winStart && marker.end <= winEnd)
        .sort((a, b) => a.start - b.start)
    const segments: Array<ClozeSegment> = []
    const blanks: Array<string> = []
    let cursor = winStart
    // splits on lightweight inline markdown spans instead of leaving them as raw
    // `*`/`` ` `` characters, so the rendered cloze sentence matches the same
    // emphasis the answer prose carries (thầy 2026-07-09: "text có markdown ở
    // phần điền vào"). Checked in priority order per match position: code
    // (`` `x` ``) > bold (`**x**`) > italic (`*x*`) — `**` must be tried before
    // `*` or the italic branch would eat one asterisk of a bold pair.
    const inlineSpan = /`([^`]+)`|\*\*([^*]+)\*\*|\*([^*]+)\*/g
    const pushText = (raw: string) => {
        let cursor2 = 0
        inlineSpan.lastIndex = 0
        for (let m = inlineSpan.exec(raw); m; m = inlineSpan.exec(raw)) {
            const before = raw.slice(cursor2, m.index)
            if (before.length > 0) {
                segments.push({ kind: "text", text: before })
            }
            if (m[1] !== undefined) {
                segments.push({ kind: "code", text: m[1] })
            } else if (m[2] !== undefined) {
                segments.push({ kind: "bold", text: m[2] })
            } else {
                segments.push({ kind: "italic", text: m[3] })
            }
            cursor2 = m.index + m[0].length
        }
        const rest = raw.slice(cursor2)
        if (rest.length > 0) {
            segments.push({ kind: "text", text: rest })
        }
    }
    for (const marker of inWindow) {
        pushText(answer.slice(cursor, marker.start))
        if (blankSet.has(marker)) {
            segments.push({ kind: "blank", index: blanks.length })
            blanks.push(clean(marker.inner))
        } else {
            // an extra marker beyond the cap → reveal it as plain text
            pushText(marker.inner)
        }
        cursor = marker.end
    }
    pushText(answer.slice(cursor, winEnd))

    if (blanks.length === 0) {
        return null
    }

    // word bank: correct terms + plausible sibling distractors (drop dups / ones
    // already visible in the sentence)
    const windowText = answer.slice(winStart, winEnd).toLowerCase()
    const seen = new Set(blanks.map((term) => term.toLowerCase()))
    const distractors: Array<string> = []
    for (const candidate of shuffle(distractorPool)) {
        if (distractors.length >= distractorCount) {
            break
        }
        const term = clean(candidate)
        const key = term.toLowerCase()
        if (!term || seen.has(key) || windowText.includes(key)) {
            continue
        }
        seen.add(key)
        distractors.push(term)
    }

    return {
        segments,
        blanks,
        bank: shuffle([...blanks, ...distractors]),
    }
}
