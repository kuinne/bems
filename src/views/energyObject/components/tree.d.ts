export interface ObjectT {
  [key: string]: any
}
export interface TreeProps {
    id: string,
    name: string,
    current?: any
    parentId: string | number,
    parentName: string ,
    level: stirng,
    isLeaf?: boolean,
    children:TreeProps[] | null
}