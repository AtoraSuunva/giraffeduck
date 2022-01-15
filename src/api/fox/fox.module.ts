import { Module } from '@nestjs/common'
import { FoxService } from './fox.service.js'
import { FoxController } from './fox.controller.js'

@Module({
  providers: [FoxService],
  controllers: [FoxController],
})
export class FoxModule {}
