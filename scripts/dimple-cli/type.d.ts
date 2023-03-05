export type DimpleCli = {
  currentPath: string
  json2type: JsonCompileFun
  json2snippets: JsonCompileFun
  json2export: JsonCompileFun
}

type JsonCompileFun = (data: object | array, options?: { fileName?: string; filePath?: string }) => any
