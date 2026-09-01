import { createRequire } from "node:module"
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { join, relative } from "node:path"

const require = createRequire(import.meta.url)
const root = process.cwd()

console.log("eslint", require("eslint/package.json").version)
console.log("RuleTester", typeof require("eslint").RuleTester)
try {
    console.log("ts-parser", require("@typescript-eslint/parser/package.json").version)
} catch (e) {
    console.log("ts-parser missing", e.message)
}

const VN = /[À-ÃÈ-ÊÌÍÒ-ÕÙÚÝà-ãè-êìíò-õùúýĂăĐđĨĩŨũƠơƯưẠ-ỿ]/
function walk(dir, out = []) {
    if (!existsSync(dir)) return out
    for (const name of readdirSync(dir)) {
        const p = join(dir, name)
        if (statSync(p).isDirectory()) {
            if (name === "node_modules" || name === ".next" || name === ".git") continue
            walk(p, out)
        } else if (/\.(mjs|js|cjs|ts|tsx)$/.test(name)) out.push(p)
    }
    return out
}

const plugin = readFileSync(join(root, "plugins/eslint/index.mjs"), "utf8")
const viLines = plugin.split("\n").filter((l) => VN.test(l)).length
console.log("plugin Vietnamese lines", viLines)

const messages = [...plugin.matchAll(/messages:\s*\{([\s\S]*?)\n\s*\}/g)]
console.log("message blocks", messages.length)
for (const m of messages) {
    const hasVi = VN.test(m[1])
    if (hasVi) console.log("VI msg:", m[1].trim().slice(0, 100).replace(/\s+/g, " "))
}
