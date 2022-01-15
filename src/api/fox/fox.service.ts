import { Injectable } from '@nestjs/common'
import { getAllFiles } from '../../utils/files.js'
import { getRandomFromArray } from '../../utils/random.js'
import { FoxImage } from './interfaces/foxImage.js'
import { join, resolve } from 'path'

const PUBLIC_DIR = join(resolve('.'), 'public')
const PUBLIC_DIR_REGEX = new RegExp(`^${PUBLIC_DIR}/`)

function tweet(handle: string, id: string): string {
  return `https://twitter.com/${handle}/status/${id}`
}

function makeFox(base: string, path: string): FoxImage {
  const file = path.replace(PUBLIC_DIR_REGEX, '/')
  const split = file.split('/')
  const handle = split[4]
  const id = split[5].split('.')[0]
  const src = handle.startsWith('@') ? tweet(handle, id) : null

  return {
    url: `${base}${file}`,
    src,
  }
}

@Injectable()
export class FoxService {
  private files: string[] = []

  constructor() {
    getAllFiles(resolve('./public/api/fox/img'))
      .then((f) => (this.files = f))
      .catch((err) => console.error('Failed to fetch fox files', err))
  }

  getRandomFox(base: string): FoxImage {
    const fox = getRandomFromArray(this.files)
    return makeFox(base, fox)
  }

  getFox(base: string, id: number): FoxImage {
    const fox = this.files[id % this.files.length]
    return makeFox(base, fox)
  }
}
