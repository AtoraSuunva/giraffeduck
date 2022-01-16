import { Module } from '@nestjs/common'
import { BeeController } from './bee.controller.js'
import { BeeService } from './bee.service.js'

@Module({
  controllers: [BeeController],
  providers: [BeeService],
})
export class BeeModule {}
