/**
 * Converts JPG/PNG under src/assets to WebP at high quality, then removes originals.
 * Run: node scripts/convert-to-webp.mjs
 */
import sharp from 'sharp'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const assetsRoot = path.join(__dirname, '..', 'src', 'assets')

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      await walk(full)
    } else if (/\.(jpg|jpeg|png)$/i.test(e.name)) {
      const webpPath = full.replace(/\.(jpg|jpeg|png)$/i, '.webp')
      await sharp(full)
        .webp({ quality: 94, effort: 6, smartSubsample: true })
        .toFile(webpPath)
      try {
        await fs.unlink(full)
      } catch (err) {
        if (err.code === 'EBUSY' || err.code === 'EPERM') {
          console.warn('Remove manually (locked):', path.relative(assetsRoot, full))
        } else {
          throw err
        }
      }
      console.log('Converted:', path.relative(assetsRoot, full))
    }
  }
}

await walk(assetsRoot)
console.log('Done.')