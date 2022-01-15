import { Module } from '@nestjs/common'
import { ApiController } from './api.controller.js'
import { LogModule } from './log/log.module.js'
import { FoxService } from './fox/fox.service.js'
import { FoxModule } from './fox/fox.module.js'

@Module({
  controllers: [ApiController],
  imports: [LogModule, FoxModule],
  providers: [FoxService],
})
export class ApiModule {}
