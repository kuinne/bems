export interface ObjectT {
  [key: string]: any
}
export interface TreeProps {
    "id": string,
    "name": string,
    "parentId": string | number,
    "parentName": string ,
    "level": stirng,
    "isLeaf"?: boolean,
    "children":TreeProps[] | null
}