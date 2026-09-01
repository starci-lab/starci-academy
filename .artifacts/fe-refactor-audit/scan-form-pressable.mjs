import fs from "node:fs"
import path from "node:path"

function walk(d, a = []) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
        const f = path.join(d, e.name)
        if (e.isDirectory() && e.name !== "node_modules" && e.name !== ".git") walk(f, a)
        else if (/\.(tsx|ts)$/.test(e.name)) a.push(f)
    }
    return a
}

console.log("=== FormActions ===")
for (const file of [...walk(".storybook"), ...walk("src")]) {
    const src = fs.readFileSync(file, "utf8")
    if (!src.includes("FormActions")) continue
    const re = /<FormActions\b([\s\S]*?)>/g
    let m
    while ((m = re.exec(src))) {
        const t = m[1]
        if (t.includes("</")) continue
        const align = (t.match(/align\s*=\s*"([^"]+)"/) || [])[1]
        const prin = (t.match(/principle\s*=\s*"([^"]+)"/) || [])[1]
        console.log(`${path.relative(".", file)}\talign=${align ?? "-"}\tprinciple=${prin ?? "-"}`)
    }
}

console.log("=== PressableGroup ===")
for (const file of [...walk(".storybook"), ...walk("src")]) {
    const src = fs.readFileSync(file, "utf8")
    if (!src.includes("SurfaceCardPressableGroup")) continue
    const re = /<SurfaceCardPressableGroup\b([\s\S]*?)>/g
    let m
    while ((m = re.exec(src))) {
        const t = m[1]
        if (t.includes("</")) continue
        const gap = (t.match(/gap\s*=\s*\{([^}]+)\}/) || [])[1]
        const prin = (t.match(/principle\s*=\s*"([^"]+)"/) || [])[1]
        console.log(`${path.relative(".", file)}\tgap=${gap ?? "-"}\tprinciple=${prin ?? "-"}`)
    }
}
