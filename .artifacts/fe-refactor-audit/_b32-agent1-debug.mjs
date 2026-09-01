import fs from "fs"

const s = fs.readFileSync(".storybook/components/atoms/display/Spinner/Spinner.tsx", "utf8")
const idx = s.indexOf("classNames?:")
console.log(JSON.stringify(s.slice(idx - 200, idx + 80)))

const re = /\n\s*\/\*\*[\s\S]*?\*\/\s*\n\s*classNames\?: Array<AllowedClassName>\n/g
console.log("jsdoc match", re.test(s))

const re2 = /classNames\?: Array<AllowedClassName>/g
console.log("bare match", (s.match(re2) || []).length)
