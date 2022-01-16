import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { AppController } from './app.controller.js'
import { BotsController } from './bots/bots.controller.js'
import { BotsService } from './bots/bots.service.js'
import { ApiModule } from './api/api.module.js'
import { HttpLoggerMiddleware } from './middleware/HttpLoggerMiddleware.js'
import { DocsModule } from './docs/docs.module.js'

@Module({
  imports: [ApiModule, DocsModule],
  controllers: [AppController, BotsController],
  providers: [BotsService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*')
  }
}
