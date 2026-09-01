import fs from "node:fs"
import { hasEmoji } from "../plugins/eslint/authoring.mjs"

const s = fs.readFileSync("src/components/blocks/learn/OnThisPage/LessonFlashcards/index.tsx", "utf8")
const lines = s.split(/\n/)
lines.forEach((l, i) => {
  if (hasEmoji(l)) console.log("line", i + 1, JSON.stringify(l))
})
for (const ch of s) {
  if (hasEmoji(ch)) console.log("char", ch, "U+" + ch.codePointAt(0).toString(16))
}
console.log("tests", { arrow: hasEmoji("↔"), dash: hasEmoji("—"), tri: hasEmoji("📐"), heart: hasEmoji("❤️") })
