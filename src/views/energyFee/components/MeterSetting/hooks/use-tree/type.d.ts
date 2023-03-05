export type Props = {
  treeData: any[]
}

export type Emits = {
  ($event: 'nodeClick', node: any): void
  ($event: 'search', keys: string[]): void
}

export type UseTreeOptions = {
  onSearch?: (keys: string[]) => void
}
