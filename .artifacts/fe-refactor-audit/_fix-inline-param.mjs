/**
 * Extract named types for destructured params with inline object types.
 * Only touches files listed in the eligible JSON for no-inline-parameter-type.
 */
import fs from "node:fs"
import path from "node:path"
import ts from "typescript"

const ROOT = process.cwd()
const { byRule } = JSON.parse(
    fs.readFileSync(".artifacts/fe-refactor-audit/_safe-authoring-eligible.json", "utf8"),
)

const hits = byRule["starci-fe/no-inline-parameter-type"] || []
const files = [...new Set(hits.map((h) => h.file))]
const changed = []
const skipped = []

const pascal = (s) => s.replace(/(^|[-_\s]+)([a-zA-Z])/g, (_, __, c) => c.toUpperCase()).replace(/[^A-Za-z0-9]/g, "")

const uniqueName = (base, used) => {
    let name = base
    let n = 2
    while (used.has(name)) {
        name = `${base}${n}`
        n++
    }
    used.add(name)
    return name
}

const typeNameFor = (param, fnHint, used) => {
    // Prefer component/const name + Props, or keys-based name
    const keys = param.elements
        .map((el) => (ts.isBindingElement(el) && ts.isIdentifier(el.name) ? el.name.text : null))
        .filter(Boolean)
    if (fnHint) {
        const base = `${pascal(fnHint)}Props`
        if (!used.has(base) || keys.join("") === "") return uniqueName(base, used)
    }
    if (keys.length === 1) return uniqueName(`${pascal(keys[0])}Prop`, used)
    if (keys.length <= 3) return uniqueName(`${keys.map(pascal).join("")}Props`, used)
    return uniqueName("InlineParamProps", used)
}

const enclosingName = (node) => {
    let cur = node.parent
    while (cur) {
        if (ts.isVariableDeclaration(cur) && ts.isIdentifier(cur.name)) return cur.name.text
        if (ts.isFunctionDeclaration(cur) && cur.name) return cur.name.text
        if (ts.isPropertyAssignment(cur) && ts.isIdentifier(cur.name)) return cur.name.text
        cur = cur.parent
    }
    return null
}

const fixFile = (rel) => {
    const abs = path.join(ROOT, rel)
    const original = fs.readFileSync(abs, "utf8")
    const kind = rel.endsWith(".tsx")
        ? ts.ScriptKind.TSX
        : rel.endsWith(".ts")
            ? ts.ScriptKind.TS
            : ts.ScriptKind.TSX

    const sf = ts.createSourceFile(rel, original, ts.ScriptTarget.Latest, true, kind)
    const usedNames = new Set()
    // Collect existing type/interface names
    const visitNames = (node) => {
        if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) {
            usedNames.add(node.name.text)
        }
        ts.forEachChild(node, visitNames)
    }
    visitNames(sf)

    /** @type {Array<{ insertPos: number, typeText: string, typeName: string, param: ts.ParameterDeclaration }>} */
    const edits = []

    const checkParams = (params, hint) => {
        for (const param of params) {
            if (!ts.isObjectBindingPattern(param.name)) continue
            if (!param.type || !ts.isTypeLiteralNode(param.type)) continue
            const typeName = typeNameFor(param.name, hint, usedNames)
            const typeText = original.slice(param.type.getStart(sf), param.type.getEnd())
            edits.push({
                // replace the type annotation on the param
                typeStart: param.type.getStart(sf),
                typeEnd: param.type.getEnd(),
                typeName,
                typeText,
                // insert type alias just before the enclosing statement
                insertBefore: param.parent,
            })
        }
    }

    const visit = (node) => {
        if (
            ts.isArrowFunction(node) ||
      ts.isFunctionExpression(node) ||
      ts.isFunctionDeclaration(node)
        ) {
            checkParams(node.parameters, enclosingName(node))
        }
        ts.forEachChild(node, visit)
    }
    visit(sf)

    if (edits.length === 0) {
        skipped.push({ file: rel, reason: "no editable inline types found" })
        return
    }

    // Deduplicate identical type texts → reuse same type name when shapes match
    const shapeToName = new Map()
    for (const e of edits) {
        const key = e.typeText.replace(/\s+/g, " ").trim()
        if (shapeToName.has(key)) {
            // free the unique name we reserved; reuse shared
            // (usedNames already has e.typeName — leave it; assign shared)
            e.typeName = shapeToName.get(key)
            e.shared = true
        } else {
            shapeToName.set(key, e.typeName)
            e.shared = false
        }
    }

    // Build type alias insertions: one per unique shape, placed before first use's statement
    const aliasInserts = []
    const insertedShapes = new Set()
    for (const e of edits) {
        const key = e.typeText.replace(/\s+/g, " ").trim()
        if (insertedShapes.has(key)) continue
        insertedShapes.add(key)
        // Find statement to insert before
        let stmt = e.insertBefore
        while (stmt.parent && !ts.isSourceFile(stmt.parent) && !ts.isBlock(stmt.parent) && !ts.isModuleBlock(stmt.parent)) {
            stmt = stmt.parent
        }
        // Prefer inserting before VariableStatement / FunctionDeclaration at module or block level
        while (
            stmt.parent &&
      !ts.isSourceFile(stmt.parent) &&
      !(ts.isBlock(stmt.parent) || ts.isModuleBlock(stmt.parent)) &&
      !ts.isVariableStatement(stmt) &&
      !ts.isFunctionDeclaration(stmt)
        ) {
            stmt = stmt.parent
        }
        // Walk up to VariableStatement if we're on VariableDeclaration
        while (
            stmt.parent &&
      (ts.isVariableDeclaration(stmt) ||
        ts.isVariableDeclarationList(stmt) ||
        ts.isVariableStatement(stmt.parent) === false && ts.isVariableDeclarationList(stmt.parent))
        ) {
            if (ts.isVariableStatement(stmt)) break
            stmt = stmt.parent
        }
        const insertPos = stmt.getStart(sf)
        aliasInserts.push({
            pos: insertPos,
            text: `type ${e.typeName} = ${e.typeText}\n\n`,
            name: e.typeName,
        })
    }

    // Apply from end to start: first replace type annotations, then insert aliases
    let src = original
    const replacements = edits
        .map((e) => ({ start: e.typeStart, end: e.typeEnd, text: e.typeName }))
        .sort((a, b) => b.start - a.start)

    for (const r of replacements) {
        src = src.slice(0, r.start) + r.text + src.slice(r.end)
    }

    // Recompute insert positions is hard after edits — instead insert aliases using
    // original positions adjusted by cumulative delta from replacements before them.
    const applyDelta = (pos) => {
        let d = 0
        // replacements were applied from end; compute net length change before pos
        for (const e of edits) {
            const oldLen = e.typeEnd - e.typeStart
            const newLen = e.typeName.length
            if (e.typeEnd <= pos) d += newLen - oldLen
        }
        return pos + d
    }

    const inserts = aliasInserts
        .map((a) => ({ pos: applyDelta(a.pos), text: a.text }))
        .sort((a, b) => b.pos - a.pos)

    for (const ins of inserts) {
        src = src.slice(0, ins.pos) + ins.text + src.slice(ins.pos)
    }

    if (src !== original) {
        fs.writeFileSync(abs, src)
        changed.push({ file: rel, edits: edits.length, aliases: aliasInserts.length })
    }
}

for (const f of files) {
    try {
        fixFile(f)
    } catch (err) {
        skipped.push({ file: f, reason: String(err && err.message ? err.message : err) })
    }
}

fs.writeFileSync(
    ".artifacts/fe-refactor-audit/_fix-inline-param-result.json",
    JSON.stringify({ changed, skipped }, null, 2),
)
console.log("changed", changed.length, "skipped", skipped.length)
console.log(JSON.stringify({ changed: changed.slice(0, 20), skipped }, null, 2))
