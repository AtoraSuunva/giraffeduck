import { Injectable } from '@nestjs/common'
import 'dotenv/config'
import env from 'env-var'
import { SizedMap } from './SizedMap.js'

const DISCORD_URL = 'https://cdn.discordapp.com/attachments/'
const discordCache = new SizedMap<string, Response>(100)

@Injectable()
export class AttachmentService {
  getDiscordLogUrl(
    channelId: string,
    attachmentId: string,
    fileName: string,
  ): string {
    return `${DISCORD_URL}${channelId}/${attachmentId}/${fileName}`
  }

  async getDiscordLog(
    channelId: string,
    attachmentId: string,
    fileName: string,
  ): Promise<Response> {
    const url = this.getDiscordLogUrl(channelId, attachmentId, fileName)

    if (discordCache.has(url)) {
      return discordCache.get(url)
    }

    const { refreshed } = (await refreshUrls([url]))[0]

    const response = await fetch(refreshed)

    discordCache.set(url, response)

    return response
  }
}

const REFRESH_URLS = 'https://discord.com/api/v10/attachments/refresh-urls'

interface RefreshUrlsPayload {
  attachment_urls: string[]
}

interface RefreshUrlsResponse {
  refreshed_urls: {
    original: string
    refreshed: string
  }[]
}

type RefreshResponse<T extends string[]> = {
  [K in keyof T]: {
    original: T[K]
    refreshed: string
  }
}

const BOT_TOKEN = env.get('BOT_TOKEN').required().asString()
const BOT_AUTH = `Bot ${BOT_TOKEN}`

async function refreshUrls<const T extends string[]>(
  urls: T,
): Promise<RefreshResponse<T>> {
  const response = await fetch(REFRESH_URLS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: BOT_AUTH,
    },
    body: JSON.stringify({
      attachment_urls: urls,
    } as RefreshUrlsPayload),
  })

  if (!response.ok) {
    console.error('Failed to refresh urls', response)
    throw new Error('Failed to refresh urls')
  }

  const data = (await response.json()) as RefreshUrlsResponse

  return data.refreshed_urls as RefreshResponse<T>
}
