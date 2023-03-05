export type BuildOptions = {
  /** 主应用仓库 */
  mainAppRepository?: string

  /** 子应用应用仓库，多个仓库用,隔开 */
  microsRepository?: string
}