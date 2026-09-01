/**
 * Fix handleXxx → onXxx renames that shadowed existing onXxx props.
 * Locals become submitComposer / cancelComposer / askQuestion (no handle prefix).
 */
import fs from "node:fs"

const files = [
    "src/components/blocks/learn/ContentCommentComposer/index.tsx",
    ".storybook/components/starci/blocks/learn/ContentCommentComposer/ContentCommentComposer.tsx",
    "src/components/blocks/learn/CourseQaComposer/index.tsx",
    ".storybook/components/starci/blocks/learn/CourseQaComposer/CourseQaComposer.tsx",
    "src/components/blocks/community/Discussion/CommentComposer.tsx",
    ".storybook/components/starci/pages/CourseQaPage/CourseQaPage.tsx",
]

for (const file of files) {
    if (!fs.existsSync(file)) continue
    let src = fs.readFileSync(file, "utf8")
    const before = src

    // Local const onSubmit = () => { ... onSubmit( } pattern — rename local only
    // Safer targeted replacements used in these composers:

    // Pattern A: const onSubmit = () => { ... onSubmit(trimmed)
    if (/const onSubmit = \(\) => \{/.test(src) && /onSubmit,/.test(src)) {
        src = src.replace(/const onSubmit = \(\) => \{/g, "const submitComposer = () => {")
        // Fix recursive call inside: onSubmit(trimmed) should stay as prop call —
        // after rename, body still says onSubmit(trimmed) which correctly hits the prop.
        // But onPress={onSubmit} must become onPress={submitComposer}
        src = src.replace(/onPress=\{onSubmit\}/g, "onPress={submitComposer}")
    // Also bare references in JSX that were the local
    }

    if (/const onCancel = \(\) => \{/.test(src) && /onCancel,/.test(src)) {
        src = src.replace(/const onCancel = \(\) => \{/g, "const cancelComposer = () => {")
        src = src.replace(/onPress=\{onCancel\}/g, "onPress={cancelComposer}")
    // Inside cancelComposer body, onCancel?.() still refers to prop — good
    }

    if (/const onAskQuestion = \(\) => \{/.test(src) && /onAskQuestion,/.test(src)) {
        src = src.replace(/const onAskQuestion = \(\) => \{/g, "const askQuestion = () => {")
        src = src.replace(/onPress=\{onAskQuestion\}/g, "onPress={askQuestion}")
        src = src.replace(/onAskQuestion=\{onAskQuestion\}/g, "onAskQuestion={askQuestion}")
    }

    if (src !== before) {
        fs.writeFileSync(file, src)
        console.log("fixed", file)
    } else {
        console.log("skip", file)
    }
}
