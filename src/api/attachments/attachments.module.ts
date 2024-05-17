import { Module } from '@nestjs/common'
import { AttachmentsController } from './attachments.controller.js'
import { AttachmentService } from './attachments.service.js'

@Module({
  controllers: [AttachmentsController],
  providers: [AttachmentService],
})
export class AttachmentsModule {}
