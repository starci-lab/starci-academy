import fs from "node:fs"

const j = JSON.parse(
  fs.readFileSync(".artifacts/fe-refactor-audit/2026-08-09-b26-actionable.json", "utf8"),
)
const real = []
const phantom = []
for (const item of j.fullyDeadList) {
  const t = fs.readFileSync(item.file, "utf8")
  const hasWith = /WithClassNames/.test(t)
  const hasClassNamesProp = /\bclassNames\??\s*:/.test(t)
  const hasClassNameProp = /\bclassName\??\s*:/.test(t)
  const m = t.match(
    new RegExp(String.raw`export\s+const\s+${item.component}\s*=\s*(?:\w+\s*)?\(\s*\{([^}]{0,800})\}`),
  )
  const dest = m ? m[1] : ""
  const destHas = /\bclassNames?\b/.test(dest)
  const row = {
    file: item.file,
    component: item.component,
    hasWith,
    hasClassNamesProp,
    hasClassNameProp,
    destHas,
    dest: dest.replace(/\s+/g, " ").slice(0, 100),
  }
  if ((hasWith || hasClassNamesProp || hasClassNameProp) && !destHas) real.push(row)
  else phantom.push(row)
}

// half-dead zero consumers: verify className still in dest and WithClassNames
const halfReal = []
for (const item of j.classNamesHalfDeadList.filter((x) => x.classNameConsumers === 0)) {
  const t = fs.readFileSync(item.file, "utf8")
  const m = t.match(
    new RegExp(String.raw`export\s+const\s+${item.component}\s*=\s*(?:\w+\s*)?\(\s*\{([^}]{0,1500})\}`),
  )
  const dest = m ? m[1] : ""
  if (!/\bclassName\b/.test(dest)) continue
  if (!/WithClassNames/.test(t) && !/\bclassName\??\s*:/.test(t)) continue
  halfReal.push({ file: item.file, component: item.component, twin: item.twin })
}

fs.writeFileSync(
  ".artifacts/fe-refactor-audit/2026-08-09-b26-verified-burns.json",
  JSON.stringify({ realFullyDead: real, phantomFullyDead: phantom, halfRealCount: halfReal.length, halfReal }, null, 2),
)
console.log(
  JSON.stringify(
    {
      realFullyDead: real.length,
      phantomFullyDead: phantom.length,
      halfReal: halfReal.length,
      real,
    },
    null,
    2,
  ),
)
