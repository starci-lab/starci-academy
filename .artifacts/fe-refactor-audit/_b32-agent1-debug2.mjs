import fs from "fs"

function strip(src) {
  let s = src
  s = s.replace(
    /\n\s*\/\*\*[\s\S]*?\*\/\s*\n\s*classNames\?: Array<AllowedClassName>\n/g,
    "\n",
  )
  console.log("after jsdoc", /classNames\?:/.test(s), "count", (s.match(/classNames\?:/g) || []).length)
  s = s.replace(/\n\s*classNames\?: Array<AllowedClassName>\n/g, "\n")
  console.log("after bare", /classNames\?:/.test(s), "count", (s.match(/classNames\?:/g) || []).length)
  if (/classNames\?:/.test(s)) {
    const idx = s.indexOf("classNames?:")
    console.log("remaining:", JSON.stringify(s.slice(idx - 80, idx + 60)))
  }
  return s
}

strip(fs.readFileSync(".storybook/components/atoms/display/Spinner/Spinner.tsx", "utf8"))
