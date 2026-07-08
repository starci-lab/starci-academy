import { useCallback, useEffect, useRef, useState } from "react"

/** Options for {@link useSpeechSynthesis}. */
export interface UseSpeechSynthesisOptions {
    /** BCP-47 language tag to speak in (e.g. "vi-VN", "en-US"). */
    lang: string
    /** localStorage key the on/off preference is persisted under. */
    storageKey?: string
}

/** Return value of {@link useSpeechSynthesis}. */
export interface UseSpeechSynthesisResult {
    /** Whether the browser exposes the Web Speech synthesis API at all. */
    supported: boolean
    /** Whether spoken output is currently enabled (persisted preference). */
    enabled: boolean
    /** Toggle spoken output on/off (persists + cancels any in-flight speech when turned off). */
    setEnabled: (value: boolean) => void
    /** Speak the given text (no-op when disabled, unsupported, or empty). Cancels any prior utterance first. */
    speak: (text: string) => void
    /** Stop any in-flight speech immediately. */
    cancel: () => void
    /**
     * Whether the browser's voice list has finished loading at least once (Chrome
     * fires this asynchronously via `voiceschanged`, sometimes AFTER the first
     * `getVoices()` call returns empty) — {@link hasLocaleVoice} is only meaningful
     * once this is `true`; before that it would false-positive "no voice" during
     * the brief window the list hasn't populated yet.
     */
    voicesLoaded: boolean
    /**
     * Whether the browser currently exposes AT LEAST ONE installed voice matching
     * {@link UseSpeechSynthesisOptions.lang} (exact match, or same base language,
     * e.g. any "vi-*" voice for "vi-VN"). `false` (once {@link voicesLoaded}) means
     * `speak()` will fall back to whatever default voice the OS has — usually
     * English — mispronouncing the requested language's text.
     */
    hasLocaleVoice: boolean
    /** Re-read the browser's current voice list (e.g. after the user installs an OS voice pack) and recompute {@link hasLocaleVoice}. */
    recheckVoices: () => void
}

/** Strip common Markdown syntax so the interviewer reads naturally (no "hash", "asterisk", backticks). */
const stripMarkdown = (markdown: string): string =>
    markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
        .replace(/[*_~]/g, "")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^\s*[-+*]\s+/gm, "")
        .replace(/^\s*\d+\.\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim()

/**
 * Thin React wrapper over the browser Web Speech synthesis API
 * (`speechSynthesis`) for text-to-speech — used to let the AI interviewer SPEAK
 * its question aloud. Fully client-side (no network, no cost). The on/off
 * preference persists across sessions; a graceful no-op when the API is missing.
 *
 * @param options - The language to speak in + the persistence key.
 * @returns Support + on/off state + speak/cancel controls.
 */
export const useSpeechSynthesis = (
    { lang, storageKey = "starci.mockInterview.tts" }: UseSpeechSynthesisOptions,
): UseSpeechSynthesisResult => {
    const [supported, setSupported] = useState(false)
    // default ON; hydrated from localStorage after mount (SSR-safe start)
    const [enabled, setEnabledState] = useState(true)
    const langRef = useRef(lang)
    langRef.current = lang

    // the browser's own voice list — read once on mount, re-read whenever the
    // engine fires `voiceschanged` (Chrome populates this ASYNCHRONOUSLY, often
    // after the component mounts) or the caller explicitly asks (recheckVoices,
    // after guiding the user to install an OS voice pack)
    const [voices, setVoices] = useState<Array<SpeechSynthesisVoice>>([])
    const [voicesLoaded, setVoicesLoaded] = useState(false)

    const readVoices = useCallback(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            return
        }
        const list = window.speechSynthesis.getVoices()
        if (list.length > 0) {
            setVoices(list)
            setVoicesLoaded(true)
        }
    }, [])

    // detect support + hydrate the persisted preference once on mount
    useEffect(() => {
        if (typeof window === "undefined" || !("speechSynthesis" in window)) {
            return
        }
        setSupported(true)
        const stored = window.localStorage.getItem(storageKey)
        if (stored === "off") {
            setEnabledState(false)
        }
        readVoices()
        window.speechSynthesis.onvoiceschanged = readVoices
        return () => {
            window.speechSynthesis.onvoiceschanged = null
        }
    }, [storageKey, readVoices])

    /**
     * Whether ANY installed voice matches the requested lang — exact tag match,
     * or same base language (e.g. any "vi-*" voice satisfies "vi-VN"). Only
     * trustworthy once {@link voicesLoaded} — an empty pre-load list must not
     * read as "no Vietnamese voice on this machine".
     */
    const hasLocaleVoice = voices.some((voice) => voice.lang === lang)
        || voices.some((voice) => voice.lang?.startsWith(lang.split("-")[0] ?? ""))

    // stop any in-flight speech when the component unmounts
    useEffect(() => {
        return () => {
            if (typeof window !== "undefined" && "speechSynthesis" in window) {
                window.speechSynthesis.cancel()
            }
        }
    }, [])

    const cancel = useCallback(() => {
        if (typeof window !== "undefined" && "speechSynthesis" in window) {
            window.speechSynthesis.cancel()
        }
    }, [])

    const setEnabled = useCallback((value: boolean) => {
        setEnabledState(value)
        if (typeof window !== "undefined") {
            window.localStorage.setItem(storageKey, value ? "on" : "off")
            // turning it off should silence whatever is currently being read
            if (!value && "speechSynthesis" in window) {
                window.speechSynthesis.cancel()
            }
        }
    }, [storageKey])

    const speak = useCallback((text: string) => {
        if (typeof window === "undefined" || !("speechSynthesis" in window) || !enabled) {
            return
        }
        const spoken = stripMarkdown(text)
        if (spoken.length === 0) {
            return
        }
        // cancel any prior utterance so questions never overlap
        window.speechSynthesis.cancel()
        const utterance = new window.SpeechSynthesisUtterance(spoken)
        utterance.lang = langRef.current
        // prefer a voice matching the locale, if the browser exposes any (re-reads
        // live rather than trusting the `voices` state, in case a voice was just
        // installed and `voiceschanged` hasn't fired/re-rendered yet)
        const liveVoices = window.speechSynthesis.getVoices()
        const match = liveVoices.find((voice) => voice.lang === langRef.current)
            ?? liveVoices.find((voice) => voice.lang?.startsWith(langRef.current.split("-")[0] ?? ""))
        if (match) {
            utterance.voice = match
        }
        window.speechSynthesis.speak(utterance)
    }, [enabled])

    return {
        supported, enabled, setEnabled, speak, cancel, voicesLoaded, hasLocaleVoice, recheckVoices: readVoices,
    }
}
