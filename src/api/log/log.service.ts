import { Injectable } from '@nestjs/common'
import got, { RequestError } from 'got'

const DISCORD_URL = 'https://cdn.discordapp.com/attachments/'
const FILE = 'archive.dlog.txt'

const discordCache = new Map<string, string>()

@Injectable()
export class LogService {
  getDiscordLogUrl(channelId: string, attachmentId: string): string {
    return `${DISCORD_URL}${channelId}/${attachmentId}/${FILE}`
  }

  async getDiscordLog(
    channelId: string,
    attachmentId: string,
  ): Promise<string> {
    const url = this.getDiscordLogUrl(channelId, attachmentId)

    let response: string
    try {
      response = await got(url, { cache: discordCache }).text()
    } catch (error: unknown) {
      if (error instanceof RequestError) {
        const status = error.response?.statusCode
        if (status === 404 || status === 403) {
          throw new Error('Archive not found')
        }
      }
      throw new Error('Failed to download archive')
    }

    return response
  }
}
