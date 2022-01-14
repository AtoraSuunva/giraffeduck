import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'
import { AppModule } from './app.module'
import * as hbs from 'hbs'
import { HELPERS, registerHelpers } from './handlebars'

function dir(...directories: string[]): string {
  return join(__dirname, '..', ...directories)
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.useStaticAssets(dir('public'))
  app.setBaseViewsDir(dir('views'))
  hbs.registerPartials(dir('views', 'partials'))
  registerHelpers(hbs.handlebars, HELPERS)
  app.setViewEngine('hbs')

  await app.listen(3000)
}

void bootstrap()
