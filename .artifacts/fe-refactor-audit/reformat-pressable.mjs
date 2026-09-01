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

const files = [
    ...walk(".storybook/components"),
    ...walk("src/components"),
].filter((f) => fs.readFileSync(f, "utf8").includes("SurfaceCardPressableGroup"))

for (const file of files) {
    let s = fs.readFileSync(file, "utf8")
    // Collapse mangled multiline tags into clean ones via regex on each opening→close
    s = s.replace(
        /<SurfaceCardPressableGroup\b([\s\S]*?)\/?\s*>/g,
        (full, body) => {
            if (body.includes("</")) return full
            // Extract attrs
            let attrs = body
            const prin = (attrs.match(/principle\s*=\s*"([^"]+)"/) || [])[1] || "content-row"
            attrs = attrs
                .replace(/\s*principle\s*=\s*"[^"]+"/g, "")
                .replace(/\s*gap\s*=\s*\{[^}]+\}/g, "")
                .replace(/\s+/g, " ")
                .trim()
            // Remove trailing / if present
            attrs = attrs.replace(/\/\s*$/, "").trim()
            return `<SurfaceCardPressableGroup ${attrs} principle="${prin}" />`.replace(
                /<SurfaceCardPressableGroup\s+principle=/,
                "<SurfaceCardPressableGroup principle=",
            )
        },
    )
    fs.writeFileSync(file, s)
    console.log("rewrote", path.relative(".", file))
}
