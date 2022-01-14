import { Module } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { BotsController } from './bots/bots.controller.js'
import { BotsService } from './bots/bots.service.js'
import { ApiModule } from './api/api.module.js'

@Module({
  imports: [ApiModule],
  controllers: [AppController, BotsController],
  providers: [BotsService],
})
export class AppModule {}
