import { Module } from '@nestjs/common'
import { LogController } from './log.controller.js'
import { LogService } from './log.service.js'

@Module({
  controllers: [LogController],
  providers: [LogService],
})
export class LogModule {}
