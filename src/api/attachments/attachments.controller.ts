import { Controller, Get, Param, Req, Res } from '@nestjs/common'
import env from 'env-var'
import { Request, Response } from 'express'
import { AttachmentService } from './attachments.service.js'

const ATTACHMENTS_TOKEN = env.get('ATTACHMENTS_TOKEN').required().asString()

@Controller('api/attachments')
export class AttachmentsController {
  constructor(private attachmentsService: AttachmentService) {}

  @Get(':channelId/:attachmentId/:fileName')
  async getLog(
    @Param('channelId') channelId: string,
    @Param('attachmentId') attachmentId: string,
    @Param('fileName') fileName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (req.headers.authorization !== `Bearer ${ATTACHMENTS_TOKEN}`) {
      return res.status(401).send('Unauthorized')
    }

    try {
      const response = await this.attachmentsService.getDiscordLog(
        channelId,
        attachmentId,
        fileName,
      )

      console.log('Response:', response.status, response.headers)

      // Copy the response from discord back into our response
      res.status(response.status)
      res.setHeader('Content-Type', response.headers.get('content-type') ?? '')
      return res.send(Buffer.from(await response.arrayBuffer()))
    } catch (error: unknown) {
      return res
        .status(500)
        .send(error instanceof Error ? error.message : String(error))
    }
  }
}
