import * as fs from 'fs/promises'
import { join } from 'path'

export async function getAllFiles(path: string): Promise<string[]> {
  const files: string[] = []
  const dirFiles = await fs.readdir(path, { withFileTypes: true })

  for (const dirFile of dirFiles) {
    if (dirFile.isDirectory()) {
      const moreFiles = await getAllFiles(join(path, dirFile.name))
      files.push(...moreFiles)
    } else {
      files.push(join(path, dirFile.name))
    }
  }

  return files
}
