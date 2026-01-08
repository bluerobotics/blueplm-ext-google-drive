/**
 * Package Script
 * 
 * Creates a .bpx (BluePLM Extension) package from the built extension.
 * The .bpx format is a ZIP archive containing all extension files.
 */

import { createWriteStream, existsSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import archiver from 'archiver'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')

async function createPackage() {
  // Read extension manifest
  const manifestPath = join(rootDir, 'extension.json')
  if (!existsSync(manifestPath)) {
    console.error('Error: extension.json not found')
    process.exit(1)
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const { id, version } = manifest

  // Check that dist folder exists
  const distPath = join(rootDir, 'dist')
  if (!existsSync(distPath)) {
    console.error('Error: dist/ folder not found. Run "npm run build" first.')
    process.exit(1)
  }

  // Create output filename
  const outputName = `${id.replace(/\./g, '-')}-${version}.bpx`
  const outputPath = join(rootDir, outputName)

  console.log(`Creating package: ${outputName}`)

  // Create ZIP archive
  const output = createWriteStream(outputPath)
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression
  })

  // Handle errors
  archive.on('error', (err) => {
    console.error('Archive error:', err)
    process.exit(1)
  })

  // Log completion
  output.on('close', () => {
    const sizeKB = (archive.pointer() / 1024).toFixed(2)
    console.log(`✓ Created ${outputName} (${sizeKB} KB)`)
  })

  // Pipe archive to output
  archive.pipe(output)

  // Add extension.json
  archive.file(manifestPath, { name: 'extension.json' })

  // Add built files
  archive.directory(distPath, 'dist')

  // Add icon if exists
  const iconPath = join(rootDir, 'icon.png')
  if (existsSync(iconPath)) {
    archive.file(iconPath, { name: 'icon.png' })
  }

  // Add README
  const readmePath = join(rootDir, 'README.md')
  if (existsSync(readmePath)) {
    archive.file(readmePath, { name: 'README.md' })
  }

  // Add LICENSE
  const licensePath = join(rootDir, 'LICENSE')
  if (existsSync(licensePath)) {
    archive.file(licensePath, { name: 'LICENSE' })
  }

  // Finalize archive
  await archive.finalize()
}

createPackage().catch((err) => {
  console.error('Package creation failed:', err)
  process.exit(1)
})
