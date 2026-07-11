/**
 * Cloze (fill-in-the-blank) builder for the flashcard quick quiz — fully
 * offline, no AI. The blanks are read DIRECTLY from Anki-style `{{cN::…}}`
 * markers that the content author (via the mechanical marking pass) placed in
 * the answer prose, so there is NO fragile string-matching of a separate key-
 * term list against the text: the marker IS the blank, exactly where it sits.
 * A marker's own term IS that card's "keywords" now too (see
 * {@link extractMarkerTerms}) — the separate `:::chip` list was retired
 * 2026-07-12 (thầy: "xóa từ khóa ăn điểm đi") once every card had ≥1 marker,
 * so there was no longer a card left that needed it as a fallback source.
 * Distractors come from two
 * tiers: a marker's own curated near-synonyms when authored inline
 * (`{{c1::docker::k8s,vps}}`) are preferred, topped up with sibling cards' key
 * terms (same tag, then same deck) — mirroring how Duolingo builds its word
 * bank from the session's own vocabulary.
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

/** Global cloze-marker matcher: `{{c1::term}}` or `{{c1::term::distractorA,distractorB}}`.
 *  Group 1 = the correct term. Group 2 (optional) = curated near-synonym
 *  distractors, comma-separated — an author-supplied confuser set for THIS
 *  blank specifically (thầy 2026-07-11: "docker" → "k8s, vps"), preferred over
 *  the generic sibling-card pool when present. */
const MARKER = /\{\{c\d+::([\s\S]*?)(?:::([\s\S]*?))?\}\}/g

/** A parsed marker with its span in the raw answer. */
interface Marker { start: number, end: number, inner: string, curatedDistractors: Array<string> }

/** Clean a term/segment for DISPLAY + matching: drop backticks, collapse whitespace, trim. */
const clean = (value: string): string => value.replace(/`/g, "").replace(/\s+/g, " ").trim()

/** Parses the optional `::distractorA,distractorB` group into cleaned, non-empty terms. */
const parseCuratedDistractors = (raw: string | undefined): Array<string> =>
    (raw ?? "")
        .split(",")
        .map((term) => clean(term))
        .filter((term) => term.length > 0)

/**
 * Extracts just the correct-answer terms of every `{{cN::term}}` marker in an
 * answer — used to seed a card's "keywords" (self-grading coverage + the
 * distractor pool offered to SIBLING cards) directly from the markers, so a
 * term never needs typing twice (once as a marker, once in `:::chip`).
 * @param answer - Raw answer markdown (may be empty/undefined).
 */
export const extractMarkerTerms = (answer: string | null | undefined): Array<string> => {
    if (!answer) {
        return []
    }
    const terms: Array<string> = []
    MARKER.lastIndex = 0
    for (let m = MARKER.exec(answer); m; m = MARKER.exec(answer)) {
        terms.push(clean(m[1]))
    }
    return terms
}

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
        markers.push({
            start: m.index,
            end: m.index + m[0].length,
            inner: m[1],
            curatedDistractors: parseCuratedDistractors(m[2]),
        })
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
    // A code span in the source can straddle a `{{cN::…}}` marker (the marker
    // sits INSIDE the backtick pair) — since markers are cut out into their own
    // fragment before this scanner sees the surrounding text, each side only
    // ever has an ORPHAN backtick, which used to fall through as a literal `
    // character (thầy 2026-07-11 bug report). `openCode` carries "we're still
    // inside an unclosed code span" across fragment/marker boundaries so the
    // orphan backticks are consumed (never rendered) and both sides stay `code`.
    let openCode = false
    const pushText = (raw: string) => {
        let cursor2 = 0
        if (openCode) {
            const closeIndex = raw.indexOf("`")
            if (closeIndex === -1) {
                if (raw.length > 0) {
                    segments.push({ kind: "code", text: raw })
                }
                return
            }
            if (closeIndex > 0) {
                segments.push({ kind: "code", text: raw.slice(0, closeIndex) })
            }
            openCode = false
            cursor2 = closeIndex + 1
        }
        inlineSpan.lastIndex = cursor2
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
        const openIndex = rest.indexOf("`")
        if (openIndex === -1) {
            if (rest.length > 0) {
                segments.push({ kind: "text", text: rest })
            }
            return
        }
        // unmatched backtick — a code span opens here and continues past this fragment
        if (openIndex > 0) {
            segments.push({ kind: "text", text: rest.slice(0, openIndex) })
        }
        const codeContent = rest.slice(openIndex + 1)
        if (codeContent.length > 0) {
            segments.push({ kind: "code", text: codeContent })
        }
        openCode = true
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

    // word bank: correct terms + plausible distractors (drop dups / ones already
    // visible in the sentence). Curated per-marker distractors (author-supplied
    // near-synonyms, e.g. "docker" → "k8s, vps") are PREFERRED — they're a much
    // sharper confuser than a random sibling-card term — and only top up with
    // the generic sibling `distractorPool` when a blank has none / too few.
    const windowText = answer.slice(winStart, winEnd).toLowerCase()
    const seen = new Set(blanks.map((term) => term.toLowerCase()))
    const distractors: Array<string> = []
    const curatedPool = shuffle(usedMarkers.flatMap((marker) => marker.curatedDistractors))
    for (const pool of [curatedPool, shuffle(distractorPool)]) {
        for (const candidate of pool) {
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
    }

    return {
        segments,
        blanks,
        bank: shuffle([...blanks, ...distractors]),
    }
}
