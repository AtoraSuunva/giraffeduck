import { Module } from '@nestjs/common'
import { ApiController } from './api.controller.js'
import { LogModule } from './log/log.module.js'

@Module({
  controllers: [ApiController],
  imports: [LogModule],
})
export class ApiModule {}
