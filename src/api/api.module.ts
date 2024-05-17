import { Module } from '@nestjs/common'
import { ApiController } from './api.controller.js'
import { AttachmentsModule } from './attachments/attachments.module.js'
import { BeeModule } from './bee/bee.module.js'
import { FoxModule } from './fox/fox.module.js'
import { LogModule } from './log/log.module.js'

@Module({
  controllers: [ApiController],
  imports: [LogModule, FoxModule, BeeModule, AttachmentsModule],
  providers: [],
})
export class ApiModule {}
