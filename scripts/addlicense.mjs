import process from 'node:process'
import { addLicense } from 'addlicense-ts'

const check = process.argv.includes('-c')

/** @type {import('addlicense-ts').AddLicenseOptions} */
const options = {
  patterns: [
    'apps/www/app',
    'apps/www/components',
    'apps/www/lib',
    'packages/create-fumandocs/src',
    'packages/create-fumandocs/tsdown.config.ts',
    'packages/fumandocs-ui/src',
    'packages/fumandocs-ui/tsdown.config.ts',
  ],
  holder: 'Xiao Hanyu (https://xiaohanyu.me)',
  license: 'mit',
  year: '2026',
  verbose: false,
  check,
  spdx: 0, // SpdxMode.Off
  ignore: ['apps/www/app/global.css', '**/versions.json'],
  skip: [],
  licenseFile: 'LICENSE',
}

try {
  await addLicense(options)
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message)
  }
  process.exit(1)
}
