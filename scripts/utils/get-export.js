const fs = require('fs')

const getExportByAst = (filePath) => {
  const ts = require('typescript')
  const { Project } = require('ts-morph')
  const project = new Project({ skipFileDependencyResolution: true, compilerOptions: { target: ts.ScriptTarget.ESNext } })
  const sourceCode = fs.readFileSync(filePath).toString()
  const sourceFile = project.createSourceFile('test.ts', sourceCode, { overwrite: true })
  for (const [name, declarations] of sourceFile.getExportedDeclarations()) {
    const values = declarations.map((d) => {
      if (d.getInitializer) return d.getInitializer().getText()
      return d.getText()
    })
    output[name] = values.join(',')
  }
  return output
}

const getExportKeysByMatch = (filePath) => {
  const sourceCode = fs.readFileSync(filePath).toString()

  const output = []

  const regex = /export\s+(default\s+)?\{([^}]*)\}/g

  let match

  while ((match = regex.exec(sourceCode)) !== null) {
    const [_, isDefault, exportContent] = match
    if (isDefault) {
      output.push('default')
    } else {
      output.push(...exportContent.trim().split(','))
    }
  }
  return output
}

module.exports = { getExportByAst, getExportKeysByMatch }
