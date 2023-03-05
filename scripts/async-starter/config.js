module.exports = {
  starterGitUrl: 'http://das-git.chn-das.com/das-fe/starter.git',
  ignore: [
    '.gitignore',
    '.prettierignore',
    '.husky',
    'README.md',
    'src/views',
    'src/das-fe',
    // 'src/app.vue',
    'src/App.vue',
    'src/main-app.vue',
    'src/micro-app.vue',
    'src/render-app.vue',
  ],
  rootGlob: ['**/**', '!.git', '!node_modules', '!.vscode', '!src', '!public', '!build'],
  srcGlob: ['src/*'],
  gitignoreList: [
    '# stater',
    '.husky',
    '.vscode',
    'src/*',
    '!src/views',
    '.prettierignore',
    '.prettierrc',
    'index.html',
    'tsconfig.json',
    'tsconfig.node.json',
    'vite.config.ts',
    'vite-config',
    'src/utils/micro-app/apps',
  ],
}
