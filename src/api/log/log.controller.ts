import { Controller, Get, Param, Render } from '@nestjs/common'
import { LogService } from './log.service.js'

@Controller('api/log')
export class LogController {
  constructor(private logService: LogService) {}

  @Get(':channelId-:attachmentId')
  @Render('api/log/viewer')
  async getLog(
    @Param('channelId') channelId: string,
    @Param('attachmentId') attachmentId: string,
  ) {
    try {
      const archive = await this.logService.getDiscordLog(
        channelId,
        attachmentId,
      )
      return { archive }
    } catch (error: unknown) {
      console.error(error)

      return { error: error instanceof Error ? error.message : String(error) }
    }
  }
}
