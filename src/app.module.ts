import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { BotsController } from './bots/bots.controller';
import { BotsService } from './bots/bots.service';

@Module({
  imports: [],
  controllers: [AppController, BotsController],
  providers: [BotsService],
})
export class AppModule {}
