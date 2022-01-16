import { Injectable } from '@nestjs/common'
import fs from 'fs/promises'
import { TextQuery } from './validation/TextQuery.js'

@Injectable()
export class BeeService {
  private movie: string

  constructor() {
    fs.readFile('./public/beemovie.txt', { encoding: 'utf8' })
      .then((txt) => (this.movie = txt))
      .catch((err) => console.log('Failed to load bee movie', err))
  }

  getMovieLines(query: TextQuery): string {
    let lines = this.movie.split('\n')

    // I don't get this reference anymore
    if (query.line === 3054) {
      lines = ["It's hip!"]
    }

    if (query.line !== undefined) {
      lines = [lines[query.line] || 'That line does not exist']
    }

    if (query.word) {
      lines = lines.filter((line) => line.includes(query.word))
    }

    if (query.count) {
      return (lines.join('\n').split(query.count).length - 1).toString()
    }

    if (query.split) {
      return lines.join(query.split)
    }

    return lines.join('\n')
  }
}
