const concurrently = require('concurrently')
const path = require('path')
const cwd = path.resolve(__dirname, '../../')
const argvString = ''

concurrently(
  [
    { command: `node scripts/auto-generate-index watch`, name: 'auto-generate-index' },
    {
      command: `node scripts/vite ${argvString}`,
      name: 'vite-dev',
    },
  ],
  {
    cwd,
  },
)
