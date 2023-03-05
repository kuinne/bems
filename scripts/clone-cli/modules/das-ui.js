module.exports = {
  // 仓库地址
  baseURL: 'http://das-git.chn-das.com/das-fe/ui.git',
  // 保留部分文件，为空数组时全部保留
  needDir: ['src/das-fe/ui'],
  // 导入路径
  filePath: '../../src/das-fe',
  // 导入名称
  fileName: 'ui',
  // 忽略的文件
  ignoreFile: ['**/router.{js,ts}'],
  // 是否忽略clone
  ignore: false,
}
