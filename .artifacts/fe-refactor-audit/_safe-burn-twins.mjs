import fs from "node:fs"

const d = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/_safe-burn-explain-only.json", "utf8"),
)
const files = [...new Set(d.unlockedExplain.map((e) => e.file))]
let withTwin = 0
let without = 0
let twinHasExplain = 0
const twinMap = []

for (const f of files) {
  const candidates = []
  if (f.startsWith("src/components/composites/")) {
    const rest = f
      .replace("src/components/composites/", "")
      .replace(/\/index\.tsx$/, "")
      .replace(/\.tsx$/, "")
    const parts = rest.split("/")
    const name = parts[parts.length - 1]
    candidates.push(
      `.storybook/components/composites/${parts.slice(0, -1).join("/")}/${name}/${name}.tsx`,
    )
  } else if (f.startsWith("src/components/frames/")) {
    const rest = f
      .replace("src/components/frames/", "")
      .replace(/\/index\.tsx$/, "")
      .replace(/\.tsx$/, "")
    candidates.push(`.storybook/components/frames/${rest}/${rest.split("/").pop()}.tsx`)
  } else if (f.startsWith("src/components/atoms/")) {
    const rest = f
      .replace("src/components/atoms/", "")
      .replace(/\/index\.tsx$/, "")
      .replace(/\.tsx$/, "")
    const parts = rest.split("/")
    const name = parts[parts.length - 1]
    candidates.push(
      `.storybook/components/atoms/${parts.slice(0, -1).join("/")}/${name}/${name}.tsx`,
    )
  } else if (f.startsWith("src/components/blocks/")) {
    const rest = f
      .replace("src/components/blocks/", "")
      .replace(/\/index\.tsx$/, "")
      .replace(/\.tsx$/, "")
    const parts = rest.split("/")
    const name = parts[parts.length - 1]
    const dir = parts.slice(0, -1).join("/")
    candidates.push(`.storybook/components/starci/blocks/${dir}/${name}/${name}.tsx`)
    candidates.push(`.storybook/components/blocks/${dir}/${name}/${name}.tsx`)
  }
  const existing = candidates.filter((c) => fs.existsSync(c))
  if (existing.length) {
    withTwin++
    const twin = existing[0]
    const txt = fs.readFileSync(twin, "utf8")
    const has = /\bexplain=/.test(txt)
    if (has) {
      twinHasExplain++
      const re = /explain=\{?["'`]([^"'`]+)["'`]/?/g
      const explains = []
      let m
      while ((m = re.exec(txt)) && explains.length < 5) explains.push(m[1])
      twinMap.push({ f, twin, explains })
    }
  } else without++
}

console.log(JSON.stringify({ files: files.length, withTwin, without, twinHasExplain }, null, 2))
console.log("sample", twinMap.slice(0, 10))
