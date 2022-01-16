import { Module } from '@nestjs/common'
import { ApiController } from './api.controller.js'
import { LogModule } from './log/log.module.js'
import { FoxModule } from './fox/fox.module.js'
import { BeeModule } from './bee/bee.module.js'

@Module({
  controllers: [ApiController],
  imports: [LogModule, FoxModule, BeeModule],
  providers: [],
})
export class ApiModule {}
